const path = require('node:path')
const { chromium } = require('/Users/autumn/.npm/_npx/9833c18b2d85bc59/node_modules/playwright-core')
const OUT = path.dirname(__filename)

;(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true })
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } })
  const messages = []
  page.on('console', (m) => {
    if (m.type() === 'error' || m.type() === 'warning') messages.push(`${m.type()}: ${m.text()}`)
  })

  await page.goto('http://localhost:4173', { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(80)
  await page.screenshot({ path: path.join(OUT, 'hero-liquid-early-1440.png') })
  await page.waitForTimeout(320)
  await page.screenshot({ path: path.join(OUT, 'hero-liquid-mid-1440.png') })
  await page.waitForTimeout(1400)
  await page.screenshot({ path: path.join(OUT, 'hero-liquid-late-1440.png') })

  const info = await page.evaluate(() => {
    const root = document.querySelector('#hero-title[data-liquid-type]')
    const measure = document.querySelector('[data-liquid-measure]')
    const surface = document.querySelector('[data-liquid-surface]')
    const h1s = [...document.querySelectorAll('#hero-title h1, [data-liquid-measure] h1')]
    const rect = (el) => (el ? el.getBoundingClientRect().toJSON() : null)
    return {
      kind: root?.getAttribute('data-liquid-type'),
      rootRect: rect(root),
      measureRect: rect(measure),
      surfaceRect: rect(surface),
      h1s: h1s.map((h1) => ({
        id: h1.id,
        inMeasure: !!h1.closest('[data-liquid-measure]'),
        rect: rect(h1),
        fontSize: getComputedStyle(h1).fontSize,
        opacity: getComputedStyle(h1).opacity,
        text: h1.textContent.replace(/\s+/g, ' ').trim(),
      })),
      canvases: [...document.querySelectorAll('[data-liquid-surface] canvas')].map((c) => ({
        width: c.width,
        height: c.height,
        opacity: getComputedStyle(c).opacity,
      })),
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
    }
  })

  let aria = ''
  try {
    aria = await page.locator('#hero').ariaSnapshot()
  } catch (error) {
    aria = String(error)
  }

  const h1Box = await page.locator('#hero [data-liquid-surface]').boundingBox()
  for (let i = 0; i < 12; i++) {
    await page.mouse.move(h1Box.x + 80 + i * 80, h1Box.y + h1Box.height * 0.5, { steps: 3 })
    await page.waitForTimeout(50)
  }
  await page.waitForTimeout(150)
  await page.screenshot({ path: path.join(OUT, 'hero-liquid-ripple-1440.png') })

  const reduced = await browser.newPage({
    viewport: { width: 1440, height: 1100 },
    reducedMotion: 'reduce',
  })
  await reduced.goto('http://localhost:4173', { waitUntil: 'networkidle' })
  await reduced.waitForTimeout(600)
  const reducedInfo = await reduced.evaluate(() => {
    const root = document.querySelector('#hero-title')
    return {
      kind: root?.getAttribute('data-liquid-type'),
      tag: root?.tagName,
      canvases: document.querySelectorAll('[data-liquid-surface] canvas').length,
      h1Count: document.querySelectorAll('#hero h1').length,
      h1Id: document.querySelector('#hero h1')?.id,
      text: root?.textContent?.replace(/\s+/g, ' ').trim(),
    }
  })
  await reduced.screenshot({ path: path.join(OUT, 'hero-liquid-reduced-1440.png') })

  console.log(JSON.stringify({ info, aria, messages, reducedInfo }, null, 2))
  await browser.close()
})().catch((error) => {
  console.error(error)
  process.exit(1)
})
