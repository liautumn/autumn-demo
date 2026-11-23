const path = require('node:path')
const { chromium } = require('/Users/autumn/.npm/_npx/9833c18b2d85bc59/node_modules/playwright-core')
const OUT = path.dirname(__filename)
;(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true })
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
  await page.goto('http://localhost:4174', { waitUntil: 'networkidle' })
  await page.waitForTimeout(500)
  for (let i = 1; i <= 40; i++) {
    await page.keyboard.press('Tab')
    const hit = await page.evaluate(() => {
      const el = document.activeElement
      return el instanceof HTMLElement && !!el.closest('#contact')
    })
    if (hit) {
      const info = await page.evaluate(() => {
        const el = document.activeElement
        el.scrollIntoView({ block: 'center', behavior: 'instant' })
        return {
          text: (el.textContent || '').trim().slice(0, 24),
          outline: getComputedStyle(el).outlineColor,
          scrollY: Math.round(window.scrollY),
        }
      })
      await page.waitForTimeout(350)
      const after = await page.evaluate(() => ({
        scrollY: Math.round(window.scrollY),
        htmlSmooth: getComputedStyle(document.documentElement).scrollBehavior,
      }))
      console.log(JSON.stringify({ tabs: i, info, after }))
      await page.screenshot({ path: path.join(OUT, 'check-contact-focus.png') })
      break
    }
  }
  await browser.close()
})().catch((e) => { console.error(e); process.exit(1) })
