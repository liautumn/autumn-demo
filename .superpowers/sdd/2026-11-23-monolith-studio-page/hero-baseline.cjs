const path = require('node:path')
const { chromium } = require('/Users/autumn/.npm/_npx/9833c18b2d85bc59/node_modules/playwright-core')
const OUT = path.dirname(__filename)

;(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true })
  const results = []

  for (const width of [390, 768, 1024, 1440, 1920]) {
    const page = await browser.newPage({ viewport: { width, height: 1100 } })
    const messages = []
    page.on('console', (m) => {
      if (m.type() === 'error' || m.type() === 'warning') messages.push(`${m.type()}: ${m.text()}`)
    })
    await page.goto('http://localhost:4173', { waitUntil: 'networkidle' })
    await page.waitForTimeout(1600)
    const info = await page.evaluate(() => {
      const h1 = document.querySelector('#hero-title')
      const section = document.querySelector('#hero')
      const spans = h1 ? [...h1.children] : []
      const rect = (el) => (el ? el.getBoundingClientRect().toJSON() : null)
      const style = h1 ? getComputedStyle(h1) : null
      return {
        section: rect(section),
        h1: rect(h1),
        h1Style: style
          ? {
              fontSize: style.fontSize,
              lineHeight: style.lineHeight,
              letterSpacing: style.letterSpacing,
              paddingTop: style.paddingTop,
              paddingBottom: style.paddingBottom,
              marginTop: style.marginTop,
              marginBottom: style.marginBottom,
              overflow: style.overflow,
            }
          : null,
        spans: spans.map((el) => ({
          tag: el.tagName,
          text: el.textContent,
          rect: rect(el),
          opacity: getComputedStyle(el).opacity,
          transform: getComputedStyle(el).transform,
        })),
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
      }
    })
    await page.screenshot({ path: path.join(OUT, `hero-baseline-${width}.png`) })
    results.push({ width, messages, info })
    await page.close()
  }

  console.log(JSON.stringify(results, null, 2))
  await browser.close()
})().catch((e) => {
  console.error(e)
  process.exit(1)
})
