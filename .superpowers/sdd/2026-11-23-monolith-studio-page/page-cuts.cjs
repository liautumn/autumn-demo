const path = require('node:path')
const { chromium } = require('/Users/autumn/.npm/_npx/9833c18b2d85bc59/node_modules/playwright-core')
const OUT = path.dirname(__filename)
;(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true })
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  await page.goto('http://localhost:4173', { waitUntil: 'networkidle' })
  await page.waitForTimeout(1200)
  const positions = [0, 900, 1800, 2700, 3600, 4500, 5400, 6300, 7200, 8100, 9000]
  for (const y of positions) {
    await page.evaluate((v) => window.scrollTo(0, v), y)
    await page.waitForTimeout(280)
    await page.screenshot({ path: path.join(OUT, `pagecut-${String(y).padStart(4, '0')}.png`) })
  }
  console.log('done', positions)
  await browser.close()
})().catch((e) => { console.error(e); process.exit(1) })
