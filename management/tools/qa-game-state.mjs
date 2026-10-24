// Additional real-Chrome checks: keyboard, invalid saved state, UTC rollover and unavailable storage.
// Usage: node management/tools/qa-game-state.mjs --profile <profile> [--game <slug>]
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { homedir } from "node:os";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
const exec = promisify(execFile),
  args = process.argv.slice(2),
  profile = args[args.indexOf("--profile") + 1],
  only = args.includes("--game") ? args[args.indexOf("--game") + 1] : null;
if (!args.includes("--profile")) throw Error("Pass --profile");
const cli =
    process.env.OPENCLI_ENTRY ||
    path.join(
      homedir(),
      ".opencli/node_modules/@jackwener/opencli/dist/src/main.js",
    ),
  projectsRoot = fileURLToPath(
    new URL("../../../game-sites/", import.meta.url),
  );
const games = ["cutle", "poople", "colordle", "metazooa", "travle"]
  .map((name, i) => ({
    name,
    port: 4311 + i,
    root: path.join(projectsRoot, name),
    session: "gamehub-state-" + name + "-" + process.pid,
  }))
  .filter((g) => !only || g.name === only);
async function call(g, ...cmd) {
  let r;
  try {
    r = await exec(
      process.execPath,
      [cli, "--profile", profile, "browser", g.session, ...cmd],
      { timeout: 45000, maxBuffer: 4 * 1024 * 1024 },
    );
  } catch (e) {
    throw Error(
      g.name +
        " " +
        cmd[0] +
        ": " +
        (e.stderr || e.stdout || e.signal || e.code),
    );
  }
  const out = r.stdout.split(/\n\s*Update available:/)[0].trim();
  try {
    return JSON.parse(out);
  } catch {
    return out;
  }
}
const read = (g) => `JSON.parse(localStorage.getItem('${g.name}:v1'))`;
const originals = new Map();
try {
  for (const g of games)
    await call(
      g,
      "open",
      "http://127.0.0.1:" + g.port + "/?qa-state=" + Date.now(),
      "--window",
      "background",
    );
  for (const g of games) {
    const report = { game: g.name, date: "2026-10-24" };
    await call(
      g,
      "open",
      "http://127.0.0.1:" + g.port + "/?qa-state=" + Date.now(),
      "--window",
      "foreground",
    );
    const original = await call(
      g,
      "eval",
      `localStorage.getItem('${g.name}:v1')`,
    );
    originals.set(g.name, original);
    const timeOrigin = await call(g, "eval", "performance.timeOrigin");
    await call(
      g,
      "open",
      "http://127.0.0.1:" + g.port + "/?qa-refresh=" + Date.now(),
      "--window",
      "foreground",
    );
    const restored = await call(
      g,
      "eval",
      `(async()=>{await new Promise(r=>setTimeout(r,100));return {timeOrigin:performance.timeOrigin,saved:localStorage.getItem('${g.name}:v1')}})()`,
    );
    report.refresh = {
      newDocument: restored.timeOrigin !== timeOrigin,
      sameProgress:
        JSON.stringify(JSON.parse(restored.saved)) ===
        JSON.stringify(
          typeof original === "string" ? JSON.parse(original) : original,
        ),
    };
    if (!report.refresh.newDocument || !report.refresh.sameProgress)
      throw Error(g.name + ": full document refresh failed");
    await call(
      g,
      "eval",
      `localStorage.setItem('${g.name}:v1','{invalid json');true`,
    );
    await call(
      g,
      "open",
      "http://127.0.0.1:" + g.port + "/?qa-state=" + Date.now(),
      "--window",
      "foreground",
    );
    report.corruptStorage = await call(
      g,
      "eval",
      `(async()=>{await new Promise(r=>setTimeout(r,100));return {warning:document.body.textContent.includes('Saved progress could not be read'),playable:![...document.querySelectorAll('button')].find(b=>b.textContent.trim()==='Unlimited practice').disabled,validJSON:!!${read(g)}}})()`,
    );
    if (!report.corruptStorage.warning || !report.corruptStorage.playable)
      throw Error(g.name + ": corrupt state recovery failed");
    await call(
      g,
      "eval",
      `(()=>{const s=${read(g)};s.mode='daily';s.daily.day='2000-01-01';s.daily.id='daily:2000-01-01';localStorage.setItem('${g.name}:v1',JSON.stringify(s));return true})()`,
    );
    await call(
      g,
      "open",
      "http://127.0.0.1:" + g.port + "/?qa-state=" + Date.now(),
      "--window",
      "foreground",
    );
    report.utcRollover = await call(
      g,
      "eval",
      `(async()=>{await new Promise(r=>setTimeout(r,100));const s=${read(g)};return {day:s.daily.day,expected:new Date().toISOString().slice(0,10),reset:s.daily.attempts===0}})()`,
    );
    if (
      report.utcRollover.day !== report.utcRollover.expected ||
      !report.utcRollover.reset
    )
      throw Error(g.name + ": UTC rollover failed");
    report.unavailableStorage = await call(
      g,
      "eval",
      `(async()=>{const save=Storage.prototype.setItem;Storage.prototype.setItem=function(){throw new DOMException('QA unavailable','QuotaExceededError')};[...document.querySelectorAll('button')].find(b=>b.textContent.trim()==='Unlimited practice').click();await new Promise(r=>setTimeout(r,150));const warning=document.body.textContent.includes('Progress cannot be saved');const playable=![...document.querySelectorAll('button')].find(b=>b.textContent.trim()==='Unlimited practice').disabled;Storage.prototype.setItem=save;return {warning,playable}})()`,
    );
    if (
      !report.unavailableStorage.warning ||
      !report.unavailableStorage.playable
    )
      throw Error(g.name + ": unavailable storage blocked play");
    await call(
      g,
      "open",
      "http://127.0.0.1:" + g.port + "/?qa-state=" + Date.now(),
      "--window",
      "foreground",
    );
    await call(
      g,
      "eval",
      `(async()=>{[...document.querySelectorAll('button')].find(b=>b.textContent.trim()==='Unlimited practice').click();await new Promise(r=>setTimeout(r,100));return true})()`,
    );
    if (g.name === "cutle") {
      await call(g, "focus", "input[type=range]", "--nth", "0");
      await call(g, "keys", "ArrowRight");
      await call(g, "keys", "Tab");
      await call(g, "keys", "ArrowRight");
      await call(g, "click", "--role", "button", "--name", "Cut the shape");
      const state = await call(
        g,
        "eval",
        `(()=>{const s=${read(g)};return {angle:document.querySelectorAll('input[type=range]')[0].value,attempts:s.practice.attempts}})()`,
      );
      report.keyboard = {
        pass: state.angle === "1" && state.attempts === 1,
        ...state,
      };
    } else if (g.name === "poople") {
      const state = await call(
        g,
        "eval",
        `(()=>{const s=${read(g)};return {word:s.practice.chain.at(-1),attempts:s.practice.attempts}})()`,
      );
      const words = JSON.parse(
        fs.readFileSync(g.root + "/apps/web/src/data/words.json"),
      );
      const next = words.find(
        (w) => [...w].filter((c, i) => c !== state.word[i]).length === 1,
      );
      await call(g, "fill", "#word", next);
      await call(g, "focus", "#word");
      await call(g, "keys", "Enter");
      const after = await call(
        g,
        "eval",
        `(()=>{const s=${read(g)};return {last:s.practice.chain.at(-1),attempts:s.practice.attempts}})()`,
      );
      report.keyboard = {
        pass: after.last === next && after.attempts === state.attempts + 1,
        ...after,
      };
    } else {
      const label =
        g.name === "colordle"
          ? "Blue"
          : g.name === "metazooa"
            ? "Lion"
            : await call(
                g,
                "eval",
                `(()=>{const s=${read(g)};return s.practice.start})()`,
              );
      let query = label;
      if (g.name === "travle") {
        const countries = JSON.parse(
          fs.readFileSync(g.root + "/apps/web/src/data/countries.json"),
        );
        const first = countries.find((c) => c.id === label);
        query = countries.find((c) => c.id === first.neighbors[0]).name;
      }
      await call(g, "fill", "[cmdk-input]", query);
      await call(g, "focus", "[cmdk-input]");
      await call(g, "keys", "ArrowDown");
      await call(g, "keys", "ArrowUp");
      await call(g, "keys", "Enter");
      const state = await call(
        g,
        "eval",
        `(()=>{const s=${read(g)};return {attempts:s.practice.attempts}})()`,
      );
      report.keyboard = { pass: state.attempts === 1, ...state };
    }
    if (!report.keyboard.pass)
      throw Error(
        g.name + ": keyboard path failed: " + JSON.stringify(report.keyboard),
      );
    await call(
      g,
      "eval",
      `localStorage.setItem('${g.name}:v1',${JSON.stringify(typeof original === "string" ? original : JSON.stringify(original))});true`,
    );
    fs.writeFileSync(
      g.root + "/.rankup/evidence/state-acceptance.json",
      JSON.stringify(report, null, 2),
    );
    console.log(
      g.name + ": keyboard, corrupt/blocked storage and UTC rollover passed",
    );
  }
} finally {
  for (const g of games)
    try {
      if (originals.has(g.name)) {
        const saved = originals.get(g.name);
        await call(
          g,
          "eval",
          `localStorage.setItem('${g.name}:v1',${JSON.stringify(typeof saved === "string" ? saved : JSON.stringify(saved))});true`,
        );
      }
      await call(g, "close");
    } catch {}
}
