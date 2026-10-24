// Verify and capture the color/route result fixes through the owner's Chrome.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { homedir } from "node:os";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
const exec = promisify(execFile),
  args = process.argv.slice(2),
  profile = args[args.indexOf("--profile") + 1],
  name = args[args.indexOf("--game") + 1];
if (!args.includes("--profile") || !["colordle", "travle"].includes(name))
  throw Error("Pass --profile and --game colordle|travle");
const root = path
    .join(fileURLToPath(new URL("../../../game-sites/", import.meta.url)), name)
    .replaceAll("\\", "/"),
  port = name === "colordle" ? 4313 : 4315,
  session = "gamehub-reveal-" + name + "-" + process.pid,
  cli =
    process.env.OPENCLI_ENTRY ||
    path.join(
      homedir(),
      ".opencli/node_modules/@jackwener/opencli/dist/src/main.js",
    );
async function call(...cmd) {
  let r;
  try {
    r = await exec(
      process.execPath,
      [cli, "--profile", profile, "browser", session, ...cmd],
      { timeout: 45000, maxBuffer: 3 * 1024 * 1024 },
    );
  } catch (e) {
    throw Error(
      name + " " + cmd[0] + ": " + (e.stderr || e.stdout || e.signal || e.code),
    );
  }
  const out = r.stdout.split(/\n\s*Update available:/)[0].trim();
  try {
    return JSON.parse(out);
  } catch {
    return out;
  }
}
let original;
try {
  const page = (
    await call(
      "open",
      "http://127.0.0.1:" + port + "/?qa-review=" + Date.now(),
      "--window",
      "foreground",
    )
  ).page;
  original = await call("eval", `localStorage.getItem('${name}:v1')`);
  await call(
    "eval",
    `(async()=>{[...document.querySelectorAll('button')].find(b=>b.textContent.trim()==='Unlimited practice').click();await new Promise(r=>setTimeout(r,100));[...document.querySelectorAll('button')].find(b=>b.textContent.trim()===${JSON.stringify(name === "colordle" ? "Next color" : "Next journey")})?.click();await new Promise(r=>setTimeout(r,100));return true})()`,
  );
  const round = await call(
    "eval",
    `JSON.parse(localStorage.getItem('${name}:v1')).practice`,
  );
  let choice;
  if (name === "colordle") {
    const colors = JSON.parse(
      fs.readFileSync(root + "/apps/web/src/data/colors.json"),
    );
    choice = colors.find((c) => c.hex !== round.target).name;
  } else {
    const countries = JSON.parse(
      fs.readFileSync(root + "/apps/web/src/data/countries.json"),
    );
    const start = countries.find((c) => c.id === round.start);
    choice = countries.find((c) => c.id === start.neighbors[0]).name;
  }
  const choose = `(async()=>{const input=document.querySelector('[cmdk-input]');Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(input,${JSON.stringify(choice)});input.dispatchEvent(new Event('input',{bubbles:true}));await new Promise(r=>setTimeout(r,120));const item=[...document.querySelectorAll('[cmdk-item]')].find(i=>i.textContent.startsWith(${JSON.stringify(choice)}));if(!item)throw Error('Search result missing');item.click();await new Promise(r=>setTimeout(r,120));[...document.querySelectorAll('button')].find(b=>b.textContent.trim()===${JSON.stringify(name === "colordle" ? "Reveal the color" : "Show shortest route")}).click();await new Promise(r=>setTimeout(r,120));window.scrollTo(0,0);return true})()`;
  await call("eval", choose);
  const evidence = await call(
    "eval",
    name === "colordle"
      ? `({swatches:document.querySelectorAll('.result-comparison .comparison-swatch').length,labels:document.querySelector('.result-comparison')?.textContent,comparisonVisible:!!document.querySelector('.result-comparison')})`
      : `({aria:document.querySelector('.map-board').getAttribute('aria-label'),legend:document.querySelector('.legend').textContent,highlighted:document.querySelectorAll('.map-board path.visited').length,solution:[...document.querySelectorAll('.game-aside .route-list li')].map(e=>e.textContent)})`,
  );
  if (name === "colordle" && evidence.swatches !== 2)
    throw Error("Adjacent color comparison missing");
  if (
    name === "travle" &&
    (!evidence.aria.includes("Shortest route") ||
      !evidence.legend.includes("Shortest route") ||
      !evidence.solution.every((n) => evidence.aria.includes(n)))
  )
    throw Error("Solution labels do not match map");
  for (const [file, width, height] of [
    ["revealed-desktop", 1440, 1000],
    ["revealed-mobile", 390, 844],
    ["revealed-user-1266", 1266, 717],
  ]) {
    await call(
      "screenshot",
      root + "/.impeccable/review/" + file + ".png",
      "--width",
      String(width),
      "--height",
      String(height),
      "--full-page",
      "--tab",
      page,
    );
    console.log(name + ": captured " + file);
    await new Promise((r) => setTimeout(r, 400));
  }
  fs.writeFileSync(
    root + "/.rankup/evidence/review-fixes.json",
    JSON.stringify(
      { game: name, date: "2026-10-24", pass: true, evidence },
      null,
      2,
    ),
  );
  console.log(name + ": reveal-state checks passed");
} finally {
  if (original)
    try {
      await call(
        "eval",
        `localStorage.setItem('${name}:v1',${JSON.stringify(typeof original === "string" ? original : JSON.stringify(original))});true`,
      );
    } catch {}
  try {
    await call("close");
  } catch {}
}
