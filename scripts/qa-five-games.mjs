// Browser acceptance on the owner's Chrome via OpenCLI. No Playwright/headless fallback.
// Usage: node scripts/qa-five-games.mjs --profile <connected-profile> [--game cutle]
// Requires production previews on ports 4311..4315. Uses separate session names and releases leases.
import fs from "node:fs";
import path from "node:path";
import { homedir } from "node:os";
import { fileURLToPath } from "node:url";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
const exec = promisify(execFile);
const args = process.argv.slice(2);
const profile = args[args.indexOf("--profile") + 1];
if (!args.includes("--profile") || !profile)
  throw Error("Pass an explicit connected profile");
const only = args.includes("--game") ? args[args.indexOf("--game") + 1] : null;
const mode = args.includes("--capture-only") ? "capture" : "full";
const cli =
  process.env.OPENCLI_ENTRY ||
  path.join(
    homedir(),
    ".opencli/node_modules/@jackwener/opencli/dist/src/main.js",
  );
const projectsRoot = args.includes("--projects-root")
  ? path.resolve(args[args.indexOf("--projects-root") + 1])
  : fileURLToPath(new URL("../../game-sites/", import.meta.url));
const games = ["cutle", "poople", "colordle", "metazooa", "travle"]
  .map((name, i) => ({
    name,
    port: 4311 + i,
    root: path.join(projectsRoot, name).replaceAll("\\", "/"),
    session: "gamehub-qa-" + name + "-" + process.pid,
  }))
  .filter((g) => !only || only === g.name);
const skipCapture = args.includes("--skip-capture");
async function call(g, ...cmd) {
  let r;
  try {
    r = await exec(
      process.execPath,
      [cli, "--profile", profile, "browser", g.session, ...cmd],
      { timeout: 60000, maxBuffer: 12 * 1024 * 1024 },
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
  const output = r.stdout.split(/\n\s*Update available:/)[0].trim();
  if (/(?:^Error|\[FAIL\]|isError)/.test(output)) throw Error(output);
  try {
    return JSON.parse(output);
  } catch {
    return output;
  }
}
const shared = String.raw`const pause=ms=>new Promise(r=>setTimeout(r,ms));const assert=(c,m)=>{if(!c)throw Error(m)};const button=t=>[...document.querySelectorAll('button')].find(b=>b.textContent.trim()===t);const read=()=>JSON.parse(localStorage.getItem(NAME+':v1'));const round=()=>{const s=read();return s[s.mode]};const setInput=(el,value)=>{Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(el,value);el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}))};const choose=async name=>{const input=document.querySelector('[cmdk-input]');assert(input,'search field missing');setInput(input,name);await pause(100);const item=[...document.querySelectorAll('[cmdk-item]')].find(i=>i.firstChild?.textContent===name||i.textContent.startsWith(name));assert(item,'No search result for '+name);item.click();await pause(100)};button('Unlimited practice').click();await pause(100);const results=[];`;
function gameplay(g) {
  let payload = "";
  if (g.name === "poople")
    payload =
      "const WORDS=" +
      fs.readFileSync(g.root + "/apps/web/src/data/words.json", "utf8") +
      ";";
  if (g.name === "colordle")
    payload =
      "const COLORS=" +
      fs.readFileSync(g.root + "/apps/web/src/data/colors.json", "utf8") +
      ";";
  if (g.name === "metazooa")
    payload =
      "const ANIMALS=" +
      JSON.stringify(
        JSON.parse(
          fs.readFileSync(g.root + "/apps/web/src/data/animals.json"),
        ).map(({ id, name }) => ({ id, name })),
      ) +
      ";";
  if (g.name === "travle")
    payload =
      "const COUNTRIES=" +
      JSON.stringify(
        JSON.parse(
          fs.readFileSync(g.root + "/apps/web/src/data/countries.json"),
        ).map(({ id, name, neighbors }) => ({ id, name, neighbors })),
      ) +
      ";";
  const play = {
    cutle: String.raw`for(let i=0;i<10;i++){if(round().finished){button('Next shape').click();await pause(100)}const r=round();const area=p=>Math.abs(p.reduce((s,a,i)=>{const b=p[(i+1)%p.length];return s+a[0]*b[1]-b[0]*a[1]},0))/2;const below=y=>{const out=[];for(let k=0;k<r.polygon.length;k++){const a=r.polygon[k],b=r.polygon[(k+1)%r.polygon.length],da=a[1]-y,db=b[1]-y;if(da<=0)out.push(a);if(da*db<0){const t=da/(da-db);out.push([a[0]+(b[0]-a[0])*t,y])}}return area(out)};let lo=0,hi=360;for(let k=0;k<40;k++){const y=(lo+hi)/2;if(below(y)<area(r.polygon)/2)lo=y;else hi=y}const sliders=document.querySelectorAll('input[type=range]');setInput(sliders[0],'0');setInput(sliders[1],String(Math.round((lo+hi)/2-180)));await pause(100);button('Cut the shape').click();await pause(100);const after=round();assert(after.finished,'Cut did not finish');assert(after.cuts.length,'No cut result');assert(Math.abs(after.first-50)<=2,'Computed balanced cut did not win: '+after.first);results.push({seed:after.seed,first:after.first,best:after.best,won:after.won})}`,
    poople: String.raw`const dict=new Set(WORDS);const route=start=>{const q=[start],prev=new Map([[start,null]]);for(let i=0;i<q.length;i++){const w=q[i];if(w==='poop'){const out=[];let p=w;while(p!==null){out.push(p);p=prev.get(p)}return out.reverse()}for(let j=0;j<4;j++)for(const c of 'abcdefghijklmnopqrstuvwxyz'){const n=w.slice(0,j)+c+w.slice(j+1);if(dict.has(n)&&!prev.has(n)){prev.set(n,w);q.push(n)}}}throw Error('No word route')};for(let i=0;i<10;i++){if(round().finished){button('Next puzzle').click();await pause(100)}const r=round();const p=route(r.chain.at(-1));if(i===0){const before=r.attempts;setInput(document.querySelector('#word'),'zzzz');button('Add word').click();await pause(100);assert(round().attempts===before,'Invalid word counted')}for(const w of p.slice(1)){setInput(document.querySelector('#word'),w);await pause(60);button('Add word').click();await pause(80)}const after=round();assert(after.won&&after.finished,'Ladder not solved');results.push({seed:after.seed,moves:after.attempts})}`,
    colordle: String.raw`for(let i=0;i<10;i++){if(round().finished){button('Next color').click();await pause(100)}const r=round();const target=COLORS.find(c=>c.hex===r.target);if(i===0){const wrong=COLORS.find(c=>c.hex!==r.target);await choose(wrong.name);const count=round().attempts;await choose(wrong.name);assert(round().attempts===count,'Duplicate color counted')}await choose(target.name);const after=round();assert(after.won&&after.finished,'Color not solved');results.push({seed:after.seed,guesses:after.attempts})}`,
    metazooa: String.raw`for(let i=0;i<10;i++){if(round().finished){button('Next animal').click();await pause(100)}const r=round();const target=ANIMALS.find(a=>a.id===r.target);if(i===0){const wrong=ANIMALS.find(a=>a.id!==r.target);await choose(wrong.name);const count=round().attempts;await choose(wrong.name);assert(round().attempts===count,'Duplicate animal counted');assert(document.querySelector('.taxonomy-tree'),'Classification tree missing')}await choose(target.name);const after=round();assert(after.won&&after.finished,'Animal not solved');results.push({seed:after.seed,guesses:after.attempts})}`,
    travle: String.raw`const byId=new Map(COUNTRIES.map(c=>[c.id,c]));const route=(start,goal)=>{const q=[start],prev=new Map([[start,null]]);for(let i=0;i<q.length;i++){const c=q[i];if(c===goal){const out=[];let p=c;while(p!==null){out.push(p);p=prev.get(p)}return out.reverse()}for(const n of byId.get(c).neighbors)if(!prev.has(n)){prev.set(n,c);q.push(n)}}throw Error('No country route')};for(let i=0;i<10;i++){if(round().finished){button('Next journey').click();await pause(100)}const r=round(),p=route(r.route.at(-1),r.goal);if(i===0){const bad=COUNTRIES.find(c=>c.id!==r.start&&!byId.get(r.start).neighbors.includes(c.id)&&c.id!=='ATA');await choose(bad.name);assert(round().attempts===0,'Invalid border counted')}for(const id of p.slice(1))await choose(byId.get(id).name);const after=round();assert(after.won&&after.finished,'Country route not solved');assert(document.querySelector('.map-board path.goal'),'Goal map highlight missing');results.push({seed:after.seed,crossings:after.attempts})}`,
  };
  return `(async()=>{const NAME=${JSON.stringify(g.name)};${payload}${shared}${play[g.name]}return {game:NAME,completed:results.length,results,overflow:document.documentElement.scrollWidth>innerWidth,consoleState:document.readyState,history:read().history.length}})()`;
}
try {
  // Acquire all owned tabs before driving any of them.
  for (const g of games) {
    fs.mkdirSync(g.root + "/.rankup/evidence", { recursive: true });
    fs.mkdirSync(g.root + "/.impeccable/review", { recursive: true });
    const opened = await call(
      g,
      "open",
      "http://127.0.0.1:" + g.port,
      "--window",
      "background",
    );
    g.page = opened.page;
    console.log(g.name + ": opened owned session");
  }
  for (const g of games) {
    await call(
      g,
      "open",
      "http://127.0.0.1:" + g.port,
      "--window",
      "foreground",
    );
    const report = {
      ...(mode === "capture" &&
      fs.existsSync(g.root + "/.rankup/evidence/browser-acceptance.json")
        ? JSON.parse(
            fs.readFileSync(
              g.root + "/.rankup/evidence/browser-acceptance.json",
            ),
          )
        : {}),
      game: g.name,
      profile,
      transport: "OpenCLI owner Chrome",
      date: "2026-10-24",
      viewport: "browser screenshot overrides; no physical touch-device claim",
    };
    if (mode === "full") {
      report.gameplay = await call(g, "eval", gameplay(g));
      if (report.gameplay.completed !== 10)
        throw Error(g.name + ": " + JSON.stringify(report.gameplay));
      console.log(g.name + ": 10 rounds completed");
      report.beforeReload = await call(
        g,
        "eval",
        `(()=>{const s=JSON.parse(localStorage.getItem('${g.name}:v1'));return {practice:s.practice,daily:s.daily,history:s.history.length}})()`,
      );
      await call(
        g,
        "open",
        "http://127.0.0.1:" + g.port,
        "--window",
        "background",
      );
      report.afterReload = await call(
        g,
        "eval",
        `(()=>{const s=JSON.parse(localStorage.getItem('${g.name}:v1'));return {practice:s.practice,daily:s.daily,history:s.history.length}})()`,
      );
      if (
        JSON.stringify(report.beforeReload) !==
        JSON.stringify(report.afterReload)
      )
        throw Error(g.name + ": refresh changed progress");
      report.daily = await call(
        g,
        "eval",
        `(async()=>{const b=[...document.querySelectorAll('button')].find(b=>b.textContent.trim()==='Daily puzzle');b.click();await new Promise(r=>setTimeout(r,150));const s=JSON.parse(localStorage.getItem('${g.name}:v1'));return {mode:s.mode,day:s.daily.day,utc:new Date().toISOString().slice(0,10),id:s.daily.id}})()`,
      );
      if (
        report.daily.mode !== "daily" ||
        report.daily.day !== report.daily.utc
      )
        throw Error(g.name + ": wrong UTC daily");
      await call(
        g,
        "eval",
        `(async()=>{[...document.querySelectorAll('button')].find(b=>b.textContent.trim()==='Unlimited practice').click();await new Promise(r=>setTimeout(r,100));const text=${JSON.stringify({ cutle: "Next shape", poople: "Next puzzle", colordle: "Next color", metazooa: "Next animal", travle: "Next journey" }[g.name])};[...document.querySelectorAll('button')].find(b=>b.textContent.trim()===text)?.click();await new Promise(r=>setTimeout(r,100));window.scrollTo(0,0);return true})()`,
      );
    }
    fs.writeFileSync(
      g.root + "/.rankup/evidence/browser-acceptance.json",
      JSON.stringify(report, null, 2),
    );
    if (!skipCapture) await call(g, "eval", "window.scrollTo(0,0);true");
    if (!skipCapture)
      for (const [file, width, height] of [
        ["desktop", 1440, 1000],
        ["mobile", 390, 844],
        ["user-1266", 1266, 717],
      ]) {
        await call(
          g,
          "screenshot",
          g.root + "/.impeccable/review/" + file + ".png",
          "--width",
          String(width),
          "--height",
          String(height),
          "--full-page",
          "--tab",
          g.page,
        );
        console.log(g.name + ": captured " + file);
        await new Promise((r) => setTimeout(r, 750));
      }
    report.dom = await call(
      g,
      "eval",
      `({h1:[...document.querySelectorAll('h1')].map(e=>e.textContent),robots:document.querySelector('meta[name=robots]')?.content,images:[...document.images].filter(i=>!i.complete||i.naturalWidth===0).map(i=>i.src),overflow:document.documentElement.scrollWidth>innerWidth,buttons:[...document.querySelectorAll('button')].filter(b=>b.getBoundingClientRect().height<44).map(b=>b.textContent)})`,
    );
    report.console = await call(g, "console");
    fs.writeFileSync(
      g.root + "/.rankup/evidence/browser-acceptance.json",
      JSON.stringify(report, null, 2),
    );
    console.log(g.name + ": acceptance report saved");
  }
} finally {
  for (const g of games) {
    try {
      await call(g, "close");
    } catch (e) {
      console.error("Session cleanup failed for " + g.name + ": " + e.message);
    }
  }
}
