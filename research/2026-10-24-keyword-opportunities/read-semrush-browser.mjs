/** Read rendered Semrush bulk rows. Use only after Google Trends validation; strips access query tokens. Run through the documented CUA browser runtime; no API calls or quota refresh. Verified 2026-10-24. */
export async function readSemrushBulk(tab) {
  const page = await tab.playwright.evaluate(() => ({
    text: document.body.innerText,
    rows: [...document.querySelectorAll('[role="row"]')].map(r => ({
      cells: [...r.querySelectorAll('[role="cell"],[role="columnheader"]')].map(c => c.innerText),
      links: [...r.querySelectorAll('a[href]')].map(a => ({ text: a.innerText, url: a.getAttribute('href') }))
    }))
  }));
  const u = new URL(await tab.url());
  if (u.searchParams.get('db') !== 'us') throw new Error('Expected an explicit US database');
  u.searchParams.delete('__gmitm');
  for (const row of page.rows) for (const a of row.links) {
    if (a.url?.startsWith('http')) {
      const target = new URL(a.url);
      target.searchParams.delete('__gmitm');
      a.url = target.href;
    }
  }
  return { collectedAt: new Date().toISOString(), url: u.href, market: 'US', ...page };
}
