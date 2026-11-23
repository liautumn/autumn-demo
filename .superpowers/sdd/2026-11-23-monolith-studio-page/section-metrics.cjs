const { chromium } = require('/Users/autumn/.npm/_npx/9833c18b2d85bc59/node_modules/playwright-core')
;(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true })
  const out = []
  for (const viewport of [[1440, 900], [390, 844]]) {
    const page = await browser.newPage({ viewport: { width: viewport[0], height: viewport[1] } })
    await page.goto('http://localhost:4173', { waitUntil: 'networkidle' })
    await page.waitForTimeout(1200)
    const info = await page.evaluate(() => {
      const els = [...document.querySelectorAll('#main > section, body > footer')]
      return {
        docHeight: document.documentElement.scrollHeight,
        innerHeight: window.innerHeight,
        sections: els.map((el) => ({
          id: el.id || el.tagName.toLowerCase(),
          top: Math.round(el.getBoundingClientRect().top + window.scrollY),
          height: Math.round(el.getBoundingClientRect().height),
        })),
      }
    })
    out.push({ width: viewport[0], height: viewport[1], ...info })
    await page.close()
  }
  console.log(JSON.stringify(out, null, 2))
  await browser.close()
})().catch((e) => { console.error(e); process.exit(1) })
