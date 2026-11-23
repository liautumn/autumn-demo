const path = require('node:path')
const { chromium } = require('/Users/autumn/.npm/_npx/9833c18b2d85bc59/node_modules/playwright-core')
const OUT = path.dirname(__filename)
;(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true })
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } })
  await page.goto('http://localhost:4173', { waitUntil: 'networkidle' })
  await page.waitForTimeout(700)
  await page.locator('#contact').scrollIntoViewIfNeeded()
  await page.waitForTimeout(400)
  await page.evaluate(() => {
    const badge = document.querySelector('[data-spinning-badge]')
    const panel = document.querySelector('[data-liquid-panel]')
    panel.style.position = 'relative'
    panel.style.zIndex = '10'
    badge.style.zIndex = '0'
    badge.style.right = 'calc(50% - 80px)'
    badge.style.bottom = '170px'
    badge.style.opacity = '0.7'
  })
  await page.waitForTimeout(900)
  await page.screenshot({ path: path.join(OUT, 'liquid-badge-behind.png') })

  await page.evaluate(() => {
    const effect = document.querySelector('[data-liquid-panel] .effect')
    effect.style.boxShadow = '0 0 0 1px rgba(10,10,9,.08), 0 24px 70px -28px rgba(10,10,9,.35)'
    effect.style.background = 'rgba(255,255,255,.16)'
  })
  await page.waitForTimeout(400)
  await page.screenshot({ path: path.join(OUT, 'liquid-badge-behind-2.png') })
  await browser.close()
})().catch((e) => { console.error(e); process.exit(1) })
