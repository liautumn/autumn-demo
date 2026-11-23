const { chromium } = require('/Users/autumn/.npm/_npx/9833c18b2d85bc59/node_modules/playwright-core')
;(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true })
  for (const viewport of [[1440, 900], [1440, 1000], [390, 844], [1920, 1080]]) {
    const page = await browser.newPage({ viewport: { width: viewport[0], height: viewport[1] } })
    await page.goto('http://localhost:4173', { waitUntil: 'networkidle' })
    await page.waitForTimeout(1000)
    const info = await page.evaluate(() => {
      const rect = (el) => el ? ({ top: Math.round(el.getBoundingClientRect().top), bottom: Math.round(el.getBoundingClientRect().bottom), height: Math.round(el.getBoundingClientRect().height) }) : null
      const sel = (s) => rect(document.querySelector(s))
      return {
        vh: window.innerHeight,
        hero: sel('#hero'),
        title: sel('#hero-title'),
        subtitle: sel('#hero .max-w-xl'),
        actions: sel('#hero .mt-12'),
        cta: sel('#hero a[href="#work"]'),
        meta: sel('#hero > div:last-child'),
        nav: sel('header'),
        footer: sel('#app > footer, body > footer'),
        maxScroll: document.documentElement.scrollHeight - window.innerHeight,
      }
    })
    console.log(JSON.stringify({ viewport, info }, null, 2))
    await page.close()
  }
  await browser.close()
})().catch((e) => { console.error(e); process.exit(1) })
