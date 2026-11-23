const path = require('node:path')
const { chromium } = require('/Users/autumn/.npm/_npx/9833c18b2d85bc59/node_modules/playwright-core')
const OUT = path.dirname(__filename)

;(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true })
  const results = []

  for (const width of [390, 768, 1024, 1440, 1920]) {
    const page = await browser.newPage({ viewport: { width, height: 1000 } })
    const messages = []
    page.on('console', (m) => {
      if (m.type() === 'error' || m.type() === 'warning') messages.push(`${m.type()}: ${m.text()}`)
    })
    await page.goto('http://localhost:4173', { waitUntil: 'networkidle' })
    await page.waitForTimeout(1600)

    const info = await page.evaluate(() => {
      const root = document.querySelector('#hero-title[data-liquid-type]')
      const measure = root?.querySelector('[data-liquid-measure]')
      const surface = root?.querySelector('[data-liquid-surface]')
      const h1 = surface?.querySelector('h1')
      const rect = (el) => (el ? el.getBoundingClientRect().toJSON() : null)
      const rootRect = root?.getBoundingClientRect()
      const h1Rect = h1?.getBoundingClientRect()
      return {
        kind: root?.getAttribute('data-liquid-type'),
        rootRect: rect(root),
        measureRect: rect(measure),
        surfaceRect: rect(surface),
        h1Rect: rect(h1),
        h1Overflow: h1Rect
          ? {
              top: rootRect.top - h1Rect.top,
              bottom: h1Rect.bottom - rootRect.bottom,
            }
          : null,
        canvases: [...(surface?.querySelectorAll('canvas') ?? [])].map((c) => ({
          width: c.width,
          height: c.height,
          opacity: getComputedStyle(c).opacity,
        })),
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
        heroHeight: document.querySelector('#hero')?.getBoundingClientRect().height,
        titleText: h1?.textContent.replace(/\s+/g, ' ').trim(),
        contactKind: document.querySelector('#contact [data-liquid-type]')?.getAttribute('data-liquid-type'),
      }
    })

    let aria = ''
    try {
      aria = await page.locator('#hero').ariaSnapshot()
    } catch (error) {
      aria = String(error)
    }

    const surfaceBox = await page.locator('#hero [data-liquid-surface]').boundingBox()
    const beforeSpot = await page.evaluate(() => document.querySelector('#hero').style.getPropertyValue('--mx'))
    await page.mouse.move(surfaceBox.x + surfaceBox.width * 0.4, surfaceBox.y + surfaceBox.height * 0.4, { steps: 4 })
    await page.waitForTimeout(80)
    const afterSpot = await page.evaluate(() => {
      const hero = document.querySelector('#hero')
      return {
        mx: hero.style.getPropertyValue('--mx'),
        my: hero.style.getPropertyValue('--my'),
      }
    })
    await page.waitForTimeout(120)
    await page.screenshot({ path: path.join(OUT, `hero-liquid-${width}.png`) })

    const scrollBefore = await page.evaluate(() => window.scrollY)
    await page.mouse.wheel(0, 500)
    await page.waitForTimeout(400)
    const scrollAfter = await page.evaluate(() => window.scrollY)

    results.push({
      width,
      info,
      aria,
      messages,
      spotlight: { beforeSpot, afterSpot },
      scroll: { before: scrollBefore, after: scrollAfter },
    })
    await page.close()
  }

  console.log(JSON.stringify(results, null, 2))
  await browser.close()
})().catch((error) => {
  console.error(error)
  process.exit(1)
})
