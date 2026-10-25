// Owner-Chrome regression for the five-game optimization batch (2026-10-25).
// Usage: node scripts/qa-five-game-optimizations.mjs --profile <id> [--game <slug>]
// Needs existing static previews on 4311..4315. Only UI commands mutate the app;
// eval reads state. Uses a fresh owned tab and releases it in finally. Played
// QA rounds remain in the local record; no user storage is cleared or replaced.
// --capture-only adds full-page captures; --keyboard-only covers cutle/poople/colordle.
// Bridge v1.0.26 uses object-shaped batch args. Exact observed CSS paths avoid
// stale snapshot refs; screenshot viewport overrides are temporary. No paid/login
// service is accessed; --profile supplies the already connected owner Chrome.
import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import { homedir } from "node:os";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
const exec = promisify(execFile), args = process.argv.slice(2);
const option = key => args.includes(key) ? args[args.indexOf(key) + 1] : undefined;
const profile = option("--profile");
assert.ok(profile, "Pass --profile explicitly");
const projects = option("--projects-root") || path.resolve("../game-sites");
const cli = process.env.OPENCLI_ENTRY || path.join(homedir(), ".opencli/node_modules/@jackwener/opencli/dist/src/main.js");
const all = ["cutle", "poople", "colordle", "metazooa", "travle"];
const nextLabel = { cutle: "Next shape", poople: "Next puzzle", colordle: "Next color", metazooa: "Next animal", travle: "Next journey" };
async function raw(g, cmd, ...params) {
  const { stdout } = await exec(process.execPath, [cli, "--profile", profile, "browser", g.session, cmd, ...params], { timeout: 45000, maxBuffer: 4 * 1024 * 1024 });
  const output = stdout.split(/\n\s*Update available:/)[0].trim();
  if (/^Error|\[FAIL\]/.test(output)) throw Error(output);
  try { return JSON.parse(output); } catch { return output; }
}
const call = (g, cmd, ...params) => raw(g, cmd, ...params, "--tab", g.page);
const read = (g, code) => call(g, "eval", `(() => (${code}))()`);
const round = g => read(g, `JSON.parse(localStorage.getItem('${g.name}:v1')).practice`);
async function open(g, route = "/") {
  const opened = await raw(g, "open", `http://127.0.0.1:${g.port}${route}`, "--window", "background");
  assert.ok(opened.page, JSON.stringify(opened)); g.page = opened.page;
  await call(g, "state");
}
async function mutate(g, cmd, ...params) {
  let input;
  if (cmd === "keys") input = { key: params[0] };
  else {
    const semantic = params[0] === "--role";
    const nth = params.includes("--nth") ? Number(params[params.indexOf("--nth") + 1]) : 0;
    const selector = semantic ? "button" : params[0];
    const name = semantic ? params[params.indexOf("--name") + 1] : null;
    const target = await read(g, `(() => { const es=[...document.querySelectorAll(${JSON.stringify(selector)})].filter(e=>${name ? `(e.getAttribute('aria-label') || e.textContent).trim().includes(${JSON.stringify(name)})` : "true"}); let e=es[${nth}]; if(!e) return null; if(e.id) return '[id=' + JSON.stringify(e.id) + ']'; const parts=[]; while(e && e.nodeType===1){const siblings=e.parentElement ? [...e.parentElement.children].filter(n=>n.tagName===e.tagName):[e]; parts.unshift(e.tagName.toLowerCase()+':nth-of-type('+(siblings.indexOf(e)+1)+')');e=e.parentElement} return parts.join(' > ') })()`);
    assert.ok(target, `No observed target for ${cmd} ${params.join(" ")}`);
    input = { target };
    if (cmd === "fill") input.text = params[1];
    if (cmd === "select") input.option = params[1];
  }
  const result = await raw(g, "batch", "--tab", g.page, "--commands", JSON.stringify([
    { cmd, args: input }, { cmd: "state", args: {} },
  ]));
  if (Array.isArray(result)) for (const step of result) assert.notEqual(step.ok, false, JSON.stringify(step));
  else if (result?.error) throw Error(JSON.stringify(result));
  return result;
}
const button = (g, name) => mutate(g, "click", "--role", "button", "--name", name);
async function choose(g, name) {
  await mutate(g, "fill", "[cmdk-input]", name);
  const index = await read(g, `[...document.querySelectorAll('[cmdk-item]')].findIndex(e => e.textContent.startsWith(${JSON.stringify(name.trim())}))`);
  assert.ok(index >= 0, "No result for " + name);
  await mutate(g, "click", "[cmdk-item]", "--nth", String(index));
}
async function capture(g, label) {
  await call(g, "scroll", "up", "--amount", "10000");
  for (const [kind, width, height] of [["desktop", 1266, 717], ["mobile", 390, 844]]) {
    await call(g, "screenshot", path.join(g.out, `${label}-${kind}.png`), "--width", String(width), "--height", String(height));
    if (args.includes("--capture-only")) await call(g, "screenshot", path.join(g.out, `${label}-${kind}-full.png`), "--width", String(width), "--full-page");
  }
  await call(g, "state");
}
function bfs(data, start, goal, word = false) {
  const dict = new Set(data), byId = new Map(data.map(c => [c.id, c]));
  const queue = [start], previous = new Map([[start, null]]);
  for (let i = 0; i < queue.length; i++) {
    const cur = queue[i];
    if (cur === goal) { const result = []; let p = cur; while (p !== null) { result.push(p); p = previous.get(p); } return result.reverse(); }
    const neighbors = word ? data.filter(n => [...n].filter((c, j) => c !== cur[j]).length === 1) : byId.get(cur).neighbors;
    for (const n of neighbors) if (!previous.has(n) && (!word || dict.has(n))) { previous.set(n, cur); queue.push(n); }
  }
  return null;
}
async function searchContract(g) {
  const contract = await read(g, `(() => { const e = document.querySelector('[cmdk-input]'); return e ? {expanded:e.getAttribute('aria-expanded'), controls:!!document.getElementById(e.getAttribute('aria-controls')), described:(e.getAttribute('aria-describedby')||'').split(' ').every(id=>!!document.getElementById(id))} : null })()`);
  assert.deepEqual(contract, { expanded: "false", controls: true, described: true });
}
for (const name of all.filter(n => !option("--game") || n === option("--game"))) {
  const root = path.join(projects, name), out = path.join(root, ".impeccable/review/optimization");
  fs.mkdirSync(out, { recursive: true });
  const g = { name, root, out, port: 4311 + all.indexOf(name), session: `five-opt-${name}-${process.pid}` }, checks = [];
  try {
    await open(g); await button(g, "Unlimited practice");
    let r = await round(g);
    if (r.finished) { await button(g, nextLabel[name]); r = await round(g); }
    if (args.includes("--keyboard-only")) {
      if (name === "cutle") {
        await mutate(g, "click", ".cut-layout .learning-details summary");
        await mutate(g, "click", "input[type=range]", "--nth", "0");
        const angle = Number(await read(g, "document.querySelector('input[type=range]').value"));
        await mutate(g, "keys", "ArrowRight");
        assert.equal(Number(await read(g, "document.querySelector('input[type=range]').value")), Math.min(179, angle + 1));
        await button(g, "Cut the shape"); assert.equal((await round(g)).attempts, r.attempts + 1);
      } else if (name === "poople") {
        const words = JSON.parse(fs.readFileSync(path.join(root, "apps/web/src/data/words.json")));
        const next = bfs(words, r.chain.at(-1), "poop", true)[1];
        await mutate(g, "fill", "#word", next); await mutate(g, "keys", "Enter");
        assert.equal((await round(g)).attempts, r.attempts + 1);
      } else if (name === "colordle") {
        const colors = JSON.parse(fs.readFileSync(path.join(root, "apps/web/src/data/colors.json")));
        const target = colors.find(c => c.hex === r.target);
        await mutate(g, "fill", "[cmdk-input]", target.name);
        await mutate(g, "keys", "ArrowDown"); await mutate(g, "keys", "Home");
        assert.equal(await read(g, "document.querySelector('[cmdk-item][data-selected=true]')?.getAttribute('data-value')"), r.target);
        await mutate(g, "keys", "Enter");
        assert.ok((await round(g)).won);
      } else throw Error("Keyboard check covers the three distinct input mechanisms: cutle, poople, colordle");
      fs.writeFileSync(path.join(out, "keyboard-checks.json"), JSON.stringify({ date: new Date().toISOString(), passed: true, mechanism: name }, null, 2));
      console.log(name + ": keyboard input regression passed");
      continue;
    }
    await capture(g, "play");
    if (args.includes("--capture-only")) {
      const secondary = name === "poople" ? "solver" : name === "colordle" ? "color-guide" : name === "metazooa" ? "taxonomy-guide" : "strategy";
      await open(g, "/" + secondary); await capture(g, "tool");
      console.log(name + ": desktop/mobile viewport and full-page captures saved");
      continue;
    }
    if (["colordle", "metazooa", "travle"].includes(name)) { await searchContract(g); checks.push("closed search/list/help ARIA contract"); }
    const data = name === "poople" ? JSON.parse(fs.readFileSync(path.join(root, "apps/web/src/data/words.json"))) : name === "colordle" ? JSON.parse(fs.readFileSync(path.join(root, "apps/web/src/data/colors.json"))) : name === "metazooa" ? JSON.parse(fs.readFileSync(path.join(root, "apps/web/src/data/animals.json"))) : name === "travle" ? JSON.parse(fs.readFileSync(path.join(root, "apps/web/src/data/countries.json"))) : [];
    if (name === "cutle") {
      await button(g, "Cut the shape"); r = await round(g); assert.ok(r.cuts.length);
      await button(g, "Show a reference halfway line");
      assert.equal(await read(g, "!!document.querySelector('.reference-line')"), true);
      checks.push("valid cut/live ratio/optional reference hint");
    } else if (name === "poople") {
      await mutate(g, "fill", "#word", "zzzz"); await button(g, "Add word");
      assert.equal((await round(g)).attempts, r.attempts);
      assert.equal(String(await read(g, "document.querySelector('#word').getAttribute('aria-invalid')")), "true");
      const ladder = bfs(data, r.chain.at(-1), "poop", true); assert.ok(ladder);
      for (const word of ladder.slice(1)) { await mutate(g, "fill", "#word", word); await button(g, "Add word"); }
      assert.ok((await round(g)).won); checks.push("invalid input recovery and complete word ladder");
    } else {
      const target = name === "colordle" ? data.find(c => c.hex === r.target) : name === "metazooa" ? data.find(a => a.id === r.target) : null;
      const wrong = name === "colordle" ? data.find(c => c.hex !== r.target) : name === "metazooa" ? data.find(a => a.id !== r.target) : data.find(c => c.id !== r.start && !data.find(v => v.id === r.route.at(-1)).neighbors.includes(c.id));
      await choose(g, wrong.name);
      const count = (await round(g)).attempts;
      await choose(g, wrong.name);
      assert.equal((await round(g)).attempts, count);
      assert.equal(await read(g, "document.querySelector('[cmdk-input]').value"), wrong.name);
      checks.push("rejected search selection preserves query and progress");
      if (name === "colordle") {
        await button(g, "Show RGB direction hint");
        assert.match(await read(g, "document.querySelector('.game-aside').textContent"), /Red:.*Green:.*Blue:/);
        await choose(g, target.name);
      } else if (name === "metazooa") {
        assert.equal(await read(g, "!!document.querySelector('.branch-summary')"), true);
        await choose(g, target.name);
      } else {
        assert.equal(count, r.attempts);
        await mutate(g, "keys", "ESC");
        const route = bfs(data, r.route.at(-1), r.goal); assert.ok(route);
        await choose(g, data.find(c => c.id === route[1]).name);
        const before = await round(g), difficulty = before.difficulty === "hard" ? "easy" : "hard";
        await mutate(g, "select", ".game-controls select", difficulty);
        assert.equal((await round(g)).id, before.id); assert.equal((await round(g)).attempts, before.attempts);
        assert.match(await read(g, "document.querySelector('.difficulty-note').textContent"), /next puzzle/);
        checks.push("difficulty queues without replacing active route");
        for (const id of route.slice(2)) await choose(g, data.find(c => c.id === id).name);
      }
      assert.ok((await round(g)).won); checks.push("complete game with updated feedback");
    }
    const completed = await round(g);
    // Any started puzzle, including Cutle's further attempts, remains recoverable.
    await mutate(g, "select", ".game-controls select", completed.difficulty === "hard" ? "easy" : "hard");
    assert.equal((await round(g)).id, completed.id);
    assert.ok(await read(g, "!!document.querySelector('.history-challenge')?.textContent"));
    await mutate(g, "click", ".history li button", "--nth", "0");
    const replay = await round(g); assert.equal(replay.seed, completed.seed); assert.notEqual(replay.id, completed.id); assert.equal(replay.attempts, 0);
    checks.push("identified history and independent same-seed replay");
    const secondary = name === "poople" ? "solver" : name === "colordle" ? "color-guide" : name === "metazooa" ? "taxonomy-guide" : "strategy";
    await open(g, "/" + secondary); await capture(g, "tool");
    if (name === "cutle") {
      await mutate(g, "select", ".tool-surface select", "rectangle");
      await button(g, "Show reference halfway line");
      assert.match(await read(g, "document.querySelector('.tool-surface .cut-result').textContent"), /50.00%/);
      checks.push("interactive rectangle area lesson");
    } else if (name === "poople") {
      await mutate(g, "fill", "#solver-start", "zzzz"); await button(g, "Find shortest ladder");
      assert.match(await read(g, "document.querySelector('#solver-feedback').textContent"), /not in this practice dictionary/);
      await mutate(g, "fill", "#solver-start", "cold"); await button(g, "Find shortest ladder");
      assert.ok(await read(g, "document.querySelectorAll('.solver-steps li').length > 1"));
      checks.push("solver errors, successful route and changed-letter explanations");
    } else if (name === "colordle") {
      await mutate(g, "fill", "#guide-search", "#008080");
      assert.equal(await read(g, "document.querySelectorAll('.color-guide > div').length"), 1);
      assert.match(await read(g, "document.querySelector('.color-guide').textContent"), /Teal/);
      checks.push("HEX lookup and live color comparison");
    } else if (name === "metazooa") {
      await mutate(g, "select", ".tool-fields select", data[1].id, "--nth", "0");
      assert.match(await read(g, "document.querySelector('.branch-summary').textContent"), /Same animal/);
      await mutate(g, "fill", "#animal-search", data[0].name);
      assert.ok(await read(g, "document.querySelectorAll('.dictionary-list li').length > 0"));
      checks.push("same-animal classification comparison and animal lookup");
    } else {
      await mutate(g, "select", ".tool-fields select", "GBR", "--nth", "0");
      await mutate(g, "select", ".tool-fields select", "FRA", "--nth", "1");
      assert.match(await read(g, "document.querySelector('.tool-surface [role=status]').textContent"), /No route/);
      await mutate(g, "select", ".tool-fields select", "PRT", "--nth", "0");
      await mutate(g, "select", ".tool-fields select", "DEU", "--nth", "1");
      assert.match(await read(g, "document.querySelector('.tool-surface [role=status]').textContent"), /3 border crossings/);
      checks.push("route calculator, excluded sea crossing and border lookup");
    }
    const consoleResult = await call(g, "console");
    fs.writeFileSync(path.join(out, "checks.json"), JSON.stringify({ date: new Date().toISOString(), profile, checks, console: consoleResult }, null, 2));
    console.log(name + ": " + checks.join("; "));
  } finally { await raw(g, "close").catch(e => console.error("Close failed", g.session, e.message)); }
}
