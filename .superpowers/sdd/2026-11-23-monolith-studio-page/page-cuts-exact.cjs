const path = require('node:path')
const { chromium } = require('/Users/autumn/.npm/_npx/9833c18b2d85bc59/node_modules/playwright-core')
const OUT = path.dirname(__filename)
;(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true })
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  await page.goto('http://localhost:4173', { waitUntil: 'networkidle' })
  await page.waitForTimeout(1200)
  await page.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto' })
  const positions = [0, 900, 1003, 1800, 1903, 2423, 2729, 2987, 3629, 4159, 4500, 4830, 4918, 5429, 5832, 5929, 6919, 7350, 8020, 8868]
  for (const y of positions) {
    await page.evaluate((v) => window.scrollTo(0, v), y)
    await page.waitForTimeout(250)
    const actual = await page.evaluate(() => Math.round(window.scrollY))
    await page.screenshot({ path: path.join(OUT, `exact-${String(y).padStart(4, '0')}.png`) })
    console.log(y, '->', actual)
  }
  await browser.close()
})().catch((e) => { console.error(e); process.exit(1) })
