const { chromium } = require('/Users/autumn/.npm/_npx/9833c18b2d85bc59/node_modules/playwright-core')
;(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true })
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  await page.goto('http://localhost:4173', { waitUntil: 'networkidle' })
  await page.waitForTimeout(1000)
  const info = await page.evaluate(() => {
    const base = window.scrollY
    return {
      scrollY: base,
      cards: [...document.querySelectorAll('#work article, #work a')].map((el) => ({
        tag: el.tagName,
        text: (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 40),
        top: Math.round(el.getBoundingClientRect().top + base),
        height: Math.round(el.getBoundingClientRect().height),
        class: el.className.slice(0, 80),
      })),
      workChildren: [...document.querySelectorAll('#work > *')].map((el) => ({
        tag: el.tagName,
        class: String(el.className).slice(0, 80),
        top: Math.round(el.getBoundingClientRect().top + base),
        height: Math.round(el.getBoundingClientRect().height),
      })),
      marquee: (() => {
        const el = document.querySelector('#work + section')
        return el ? { top: Math.round(el.getBoundingClientRect().top + base), height: Math.round(el.getBoundingClientRect().height) } : null
      })(),
    }
  })
  console.log(JSON.stringify(info, null, 2))
  await browser.close()
})().catch((e) => { console.error(e); process.exit(1) })
