const path = require('node:path')
const { chromium } = require('/Users/autumn/.npm/_npx/9833c18b2d85bc59/node_modules/playwright-core')
const OUT = path.dirname(__filename)
const URL = 'http://localhost:4173'
;(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true })
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } })
  const messages = []
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') messages.push(`${m.type()}: ${m.text()}`) })
  await page.goto(URL, { waitUntil: 'networkidle' })
  await page.waitForTimeout(800)
  await page.locator('#contact').scrollIntoViewIfNeeded()
  await page.waitForTimeout(600)
  const info = await page.evaluate(() => {
    const panel = document.querySelector('[data-liquid-panel]')
    const effect = panel?.querySelector('.effect')
    const slot = effect?.querySelector('.slot-container')
    const contact = document.querySelector('#contact')
    const rect = (el) => el ? el.getBoundingClientRect().toJSON() : null
    const style = (el) => el ? getComputedStyle(el) : null
    return {
      supported: CSS.supports('backdrop-filter', 'url(#probe)'),
      panelKind: panel?.getAttribute('data-liquid-panel'),
      panelRect: rect(panel),
      contactRect: rect(contact),
      effectPosition: style(effect)?.position,
      effectBackdrop: style(effect)?.backdropFilter || style(effect)?.webkitBackdropFilter,
      effectRadius: style(effect)?.borderRadius,
      slotOverflow: style(slot)?.overflow,
      background: style(effect)?.backgroundColor,
      panelText: panel?.textContent?.replace(/\s+/g, ' ').trim(),
      scrollY: window.scrollY,
      filterId: effect?.querySelector('filter')?.id,
    }
  })
  await page.screenshot({ path: path.join(OUT, 'liquid-contact-1440.png'), fullPage: false })
  const panel = page.locator('[data-liquid-panel]')
  await panel.screenshot({ path: path.join(OUT, 'liquid-panel-1440.png') })
  await page.locator('#contact a[href^="mailto:"]').first().focus()
  await page.waitForTimeout(200)
  await page.screenshot({ path: path.join(OUT, 'liquid-focus-1440.png') })
  console.log(JSON.stringify({ info, messages }, null, 2))
  await browser.close()
})().catch((e) => { console.error(e); process.exit(1) })
