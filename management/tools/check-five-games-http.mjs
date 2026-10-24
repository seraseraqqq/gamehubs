// Verify production previews, raw HTML SEO, assets, local-data licenses and real 404s.
import fs from "node:fs";
import assert from "node:assert/strict";
for (const [i, name] of [
  "cutle",
  "poople",
  "colordle",
  "metazooa",
  "travle",
].entries()) {
  const origin = "http://127.0.0.1:" + (4311 + i),
    root = "E:/Projects/game-sites/" + name;
  const secondary = {
    cutle: "strategy",
    poople: "solver",
    colordle: "color-guide",
    metazooa: "taxonomy-guide",
    travle: "strategy",
  }[name];
  const report = {
    game: name,
    date: "2026-10-24",
    pages: [],
    assets: [],
    notFound: null,
  };
  const titles = new Set();
  for (const route of [
    "/",
    "/how-to-play",
    "/" + secondary,
    "/about",
    "/privacy",
    "/credits",
  ]) {
    const response = await fetch(origin + route);
    assert.equal(response.status, 200, route);
    const html = await response.text();
    assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, route + " H1");
    const title = html.match(/<title>(.*?)<\/title>/s)?.[1];
    assert.ok(title && title.length > 10);
    assert.ok(!titles.has(title), "duplicate title");
    titles.add(title);
    assert.match(html, /<meta[^>]+name="description"[^>]+content="[^"]{50,}"/);
    assert.match(html, /<meta[^>]+name="robots"[^>]+content="noindex,follow"/);
    assert.match(html, /<html lang="en"/);
    assert.ok(
      !/href="#"|javascript:void|lorem ipsum|TanStack Start Starter|Project ready!/i.test(
        html,
      ),
    );
    assert.ok(
      !html.includes('rel="canonical"'),
      "Preview must not claim an unowned canonical",
    );
    if (route === "/") {
      const json = html.match(
        /<script type="application\/ld\+json">(.*?)<\/script>/s,
      )?.[1];
      assert.ok(json, "schema missing");
      const data = JSON.parse(json);
      assert.equal(data["@type"], "VideoGame");
      assert.equal(data.isAccessibleForFree, true);
      assert.ok(html.includes("How to play"), "static instructions missing");
    }
    report.pages.push({
      route,
      status: response.status,
      title,
      h1: 1,
      robots: "noindex,follow",
      bytes: Buffer.byteLength(html),
    });
  }
  for (const asset of [
    "/favicon.svg",
      "/favicon.ico",
      "/licenses/runtime-notices.txt",
    "/favicon-32.png",
    "/apple-touch-icon.png",
    "/icon-192.png",
    "/icon-512.png",
    "/site.webmanifest",
    "/og.png",
    "/og-how-to-play.png",
    "/og-" + secondary + ".png",
    "/robots.txt",
    "/sitemap.xml",
    ...(name === "poople"
      ? ["/licenses/english-words-Unlicense.txt"]
      : name === "colordle"
        ? ["/licenses/color-names-MIT.txt"]
        : []),
  ]) {
    const response = await fetch(origin + asset);
    assert.equal(response.status, 200, asset);
    const bytes = await response.arrayBuffer();
    assert.ok(bytes.byteLength > 10, asset);
    report.assets.push({
      path: asset,
      status: 200,
      bytes: bytes.byteLength,
      type: response.headers.get("content-type"),
    });
  }
  const missing = await fetch(origin + "/this-page-does-not-exist");
  assert.equal(missing.status, 404);
  report.notFound = 404;
  fs.mkdirSync(root + "/.rankup/evidence", { recursive: true });
  fs.writeFileSync(
    root + "/.rankup/evidence/http-seo.json",
    JSON.stringify(report, null, 2),
  );
  console.log(name + ": 6 HTML pages, metadata, schema, assets and 404 passed");
}
