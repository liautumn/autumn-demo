const path = require('node:path')
const { chromium } = require('/Users/autumn/.npm/_npx/9833c18b2d85bc59/node_modules/playwright-core')
const OUT = path.dirname(__filename)
const URL = 'http://localhost:4173'

async function inspect(page, width, name) {
  await page.goto(URL, { waitUntil: 'networkidle' })
  await page.waitForTimeout(800)
  await page.locator('#contact').scrollIntoViewIfNeeded()
  await page.waitForTimeout(600)
  const info = await page.evaluate(() => {
    const root = document.querySelector('[data-liquid-type]')
    const measure = document.querySelector('[data-liquid-measure]')
    const surface = document.querySelector('[data-liquid-surface]')
    const h = (el) => el ? Math.round(el.getBoundingClientRect().height * 100) / 100 : null
    return {
      kind: root?.getAttribute('data-liquid-type') || 'active',
      rootHeight: h(root),
      measureHeight: h(measure),
      surfaceHeight: h(surface),
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
      contactHeight: h(document.querySelector('#contact')),
      shellWidths: [...document.querySelectorAll('.shell')].map((el) => Math.round(el.getBoundingClientRect().width)),
      console: 0,
    }
  })
  await page.screenshot({ path: path.join(OUT, `html-liquid-${name}.png`) })
  return info
}

;(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true })
  const messages = []
  const results = {}
  for (const width of [1920, 1440, 1024, 768, 390]) {
    const page = await browser.newPage({ viewport: { width, height: width < 800 ? 900 : 1100 } })
    page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') messages.push(`${width}: ${m.type()}: ${m.text()}`) })
    results[width] = await inspect(page, width, String(width))
    await page.close()
  }
  const wide = results[1920]
  results.wideShells = { max: Math.max(...wide.shellWidths), min: Math.min(...wide.shellWidths), count: wide.shellWidths.length }
  console.log(JSON.stringify({ results, messages }, null, 2))
  await browser.close()
})().catch((e) => { console.error(e); process.exit(1) })
