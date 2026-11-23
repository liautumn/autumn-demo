const path = require('node:path')
const { chromium } = require('/Users/autumn/.npm/_npx/9833c18b2d85bc59/node_modules/playwright-core')
const OUT = path.dirname(__filename)
;(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true })
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  await page.goto('http://localhost:4173', { waitUntil: 'networkidle' })
  await page.waitForTimeout(1000)
  await page.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto' })
  for (const y of [5752, 6652, 6919, 7350, 7940, 8868]) {
    await page.evaluate((v) => window.scrollTo(0, v), y)
    await page.waitForTimeout(250)
    await page.screenshot({ path: path.join(OUT, `exact2-${y}.png`) })
  }
  await browser.close()
})().catch((e) => { console.error(e); process.exit(1) })
