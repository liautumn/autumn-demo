const fs = require('node:fs')
const path = require('node:path')
const { chromium } = require('/Users/autumn/.npm/_npx/9833c18b2d85bc59/node_modules/playwright-core')
const OUT = path.dirname(__filename)

;(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true })
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } })
  await page.goto('http://localhost:4173', { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(2200)

  const extract = () =>
    page.evaluate(() => {
      const root = document.querySelector('#hero-title[data-liquid-type]')
      const source = root?.querySelector('canvas')
      const output = root?.querySelectorAll('canvas')[1]
      const h1 = root?.querySelector('[data-liquid-surface] h1')
      const spans = h1 ? [...h1.children] : []
      return {
        source: source ? source.toDataURL('image/png') : null,
        output: output ? output.toDataURL('image/png') : null,
        spans: spans.map((span) => ({
          text: span.textContent,
          rect: span.getBoundingClientRect().toJSON(),
          style: {
            opacity: getComputedStyle(span).opacity,
            transform: getComputedStyle(span).transform,
            filter: getComputedStyle(span).filter,
          },
        })),
        h1Rect: h1?.getBoundingClientRect().toJSON(),
        sourceRect: source?.getBoundingClientRect().toJSON(),
        outputRect: output?.getBoundingClientRect().toJSON(),
        canvasAttrs: source ? { width: source.width, height: source.height } : null,
        innerWidth: window.innerWidth,
      }
    })

  const before = await extract()
  if (before.source) fs.writeFileSync(path.join(OUT, 'hero-source-before.png'), Buffer.from(before.source.split(',')[1], 'base64'))
  if (before.output) fs.writeFileSync(path.join(OUT, 'hero-output-before.png'), Buffer.from(before.output.split(',')[1], 'base64'))
  await page.screenshot({ path: path.join(OUT, 'hero-probe-before.png') })

  const box = await page.locator('#hero [data-liquid-surface] h1').boundingBox()
  await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.5, { steps: 10 })
  await page.waitForTimeout(500)
  await page.mouse.move(box.x + box.width * 0.5 + 40, box.y + box.height * 0.5 + 10, { steps: 5 })
  await page.waitForTimeout(1800)
  const after = await extract()
  if (after.source) fs.writeFileSync(path.join(OUT, 'hero-source-after.png'), Buffer.from(after.source.split(',')[1], 'base64'))
  if (after.output) fs.writeFileSync(path.join(OUT, 'hero-output-after.png'), Buffer.from(after.output.split(',')[1], 'base64'))
  await page.screenshot({ path: path.join(OUT, 'hero-probe-after.png') })

  console.log(
    JSON.stringify(
      {
        before: { ...before, source: undefined, output: undefined },
        after: { ...after, source: undefined, output: undefined },
      },
      null,
      2,
    ),
  )
  await browser.close()
})().catch((error) => {
  console.error(error)
  process.exit(1)
})
