const path = require('node:path')
const { chromium } = require('/Users/autumn/.npm/_npx/9833c18b2d85bc59/node_modules/playwright-core')
const OUT = path.dirname(__filename)
;(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true })
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
  const messages = []
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') messages.push(`${m.type()}: ${m.text()}`) })
  await page.goto('http://localhost:4173', { waitUntil: 'networkidle' })
  await page.waitForTimeout(1400)

  const cta = page.locator('#hero a[href="#work"]')
  const ctaBox = await cta.boundingBox()
  const hit = await page.evaluate(({ x, y }) => {
    const el = document.elementFromPoint(x, y)
    return { tag: el?.tagName, text: el?.textContent?.replace(/\s+/g, ' ').trim().slice(0, 30), inside: !!el?.closest('a[href="#work"]') }
  }, { x: ctaBox.x + ctaBox.width / 2, y: ctaBox.y + ctaBox.height / 2 })

  await cta.click()
  await page.waitForTimeout(900)
  const afterClick = await page.evaluate(() => ({
    hash: location.hash,
    scrollY: Math.round(window.scrollY),
    workTop: Math.round(document.querySelector('#work').getBoundingClientRect().top),
  }))

  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(300)
  await page.evaluate(() => document.body.focus())
  const focusPath = []
  for (let i = 0; i < 10; i++) {
    await page.keyboard.press('Tab')
    await page.waitForTimeout(30)
    focusPath.push(await page.evaluate(() => {
      const el = document.activeElement
      if (!el) return null
      const s = getComputedStyle(el)
      return {
        tag: el.tagName,
        text: (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 24),
        outline: `${s.outlineStyle} ${s.outlineWidth} ${s.outlineColor}`,
      }
    }))
  }

  const reduced = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' })
  await reduced.goto('http://localhost:4173', { waitUntil: 'networkidle' })
  await reduced.waitForTimeout(600)
  const reducedInfo = await reduced.evaluate(() => ({
    kind: document.querySelector('#hero-title')?.getAttribute('data-liquid-type'),
    canvases: document.querySelectorAll('#hero canvas').length,
    title: document.querySelector('#hero h1')?.textContent.replace(/\s+/g, ' ').trim(),
    scrollWidth: document.documentElement.scrollWidth,
    innerWidth: window.innerWidth,
  }))
  await reduced.screenshot({ path: path.join(OUT, 'hero-liquid-reduced-390.png') })

  console.log(JSON.stringify({ hit, afterClick, focusPath, reducedInfo, messages }, null, 2))
  await browser.close()
})().catch((e) => { console.error(e); process.exit(1) })
