const path = require('node:path')
const { chromium } = require('/Users/autumn/.npm/_npx/9833c18b2d85bc59/node_modules/playwright-core')
const OUT = path.dirname(__filename)
;(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true })
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } })
  const messages = []
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') messages.push(`${m.type()}: ${m.text()}`) })
  await page.goto('http://localhost:4173', { waitUntil: 'networkidle' })
  await page.waitForTimeout(1000)
  await page.locator('#contact').scrollIntoViewIfNeeded()
  await page.waitForTimeout(800)
  const info = await page.evaluate(() => {
    const root = document.querySelector('[data-liquid-type]')
    const measure = document.querySelector('[data-liquid-measure]')
    const surface = document.querySelector('[data-liquid-surface]')
    const canvases = [...document.querySelectorAll('[data-liquid-surface] canvas')].map((c) => ({
      w: c.width, h: c.height,
    }))
    const rect = (el) => el ? el.getBoundingClientRect().toJSON() : null
    return {
      kind: root?.getAttribute('data-liquid-type'),
      rootRect: rect(root),
      measureRect: rect(measure),
      surfaceRect: rect(surface),
      canvasCount: canvases.length,
      canvases,
      text: root?.textContent?.replace(/\s+/g, ' ').trim().slice(0, 80),
    }
  })
  let aria = null
  try { aria = await page.locator('[data-liquid-type]').ariaSnapshot() } catch (e) { aria = String(e).slice(0, 120) }
  await page.screenshot({ path: path.join(OUT, 'html-liquid-contact-1440.png') })
  const surface = page.locator('[data-liquid-surface]')
  const box = await surface.boundingBox()
  for (let i = 0; i < 10; i++) {
    await page.mouse.move(box.x + 100 + i * 100, box.y + box.height * 0.5, { steps: 4 })
    await page.waitForTimeout(60)
  }
  await page.waitForTimeout(150)
  await page.screenshot({ path: path.join(OUT, 'html-liquid-ripple-1440.png') })

  const reduced = await browser.newPage({ viewport: { width: 1440, height: 1100 }, reducedMotion: 'reduce' })
  await reduced.goto('http://localhost:4173', { waitUntil: 'networkidle' })
  await reduced.waitForTimeout(600)
  await reduced.locator('#contact').scrollIntoViewIfNeeded()
  await reduced.waitForTimeout(300)
  const reducedInfo = await reduced.evaluate(() => {
    const root = document.querySelector('[data-liquid-type]')
    return {
      kind: root?.getAttribute('data-liquid-type'),
      canvases: document.querySelectorAll('[data-liquid-surface] canvas').length,
      text: root?.textContent?.replace(/\s+/g, ' ').trim().slice(0, 60),
    }
  })
  await reduced.screenshot({ path: path.join(OUT, 'html-liquid-reduced-1440.png') })

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } })
  await mobile.goto('http://localhost:4173', { waitUntil: 'networkidle' })
  await mobile.waitForTimeout(800)
  await mobile.locator('#contact').scrollIntoViewIfNeeded()
  await mobile.waitForTimeout(500)
  const mobileInfo = await mobile.evaluate(() => {
    const root = document.querySelector('[data-liquid-type]')
    const measure = document.querySelector('[data-liquid-measure]')
    return { kind: root?.getAttribute('data-liquid-type'), rootH: root?.getBoundingClientRect().height, measureH: measure?.getBoundingClientRect().height, scrollWidth: document.documentElement.scrollWidth, innerWidth: window.innerWidth }
  })
  await mobile.screenshot({ path: path.join(OUT, 'html-liquid-contact-390.png') })

  console.log(JSON.stringify({ info, aria, messages, reducedInfo, mobileInfo }, null, 2))
  await browser.close()
})().catch((e) => { console.error(e); process.exit(1) })
