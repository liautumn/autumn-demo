const { chromium } = require('/Users/autumn/.npm/_npx/9833c18b2d85bc59/node_modules/playwright-core')
;(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true })
  const out = []
  for (const viewport of [[1440, 900], [390, 844], [1440, 1000], [1920, 1080]]) {
    const page = await browser.newPage({ viewport: { width: viewport[0], height: viewport[1] } })
    await page.goto('http://localhost:4173', { waitUntil: 'networkidle' })
    await page.waitForTimeout(1000)
    const info = await page.evaluate(() => {
      const y = (el) => Math.round(el.getBoundingClientRect().top + window.scrollY)
      const h = (el) => Math.round(el.getBoundingClientRect().height)
      const pick = (sel) => [...document.querySelectorAll(sel)].map((el) => ({ sel, tag: el.tagName, cls: String(el.className).slice(0, 60), top: y(el), height: h(el), text: (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 30) }))
      return {
        vh: window.innerHeight,
        maxScroll: document.documentElement.scrollHeight - window.innerHeight,
        docHeight: document.documentElement.scrollHeight,
        sections: pick('#main > section'),
        aboutChildren: [...document.querySelector('#about').children].map((el) => ({ tag: el.tagName, cls: String(el.className).slice(0, 80), top: y(el), height: h(el) })),
        aboutShells: [...document.querySelectorAll('#about .shell')].map((el) => ({ top: y(el), height: h(el) })),
        reveal: pick('#about div[class*="h-[140vh]"]'),
        revealSticky: [...document.querySelectorAll('#about .sticky')].map((el) => ({ top: y(el), height: h(el) })),
        workCards: [...document.querySelectorAll('#work article')].map((el) => ({ top: y(el), height: h(el), text: (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 24) })),
        workGridChildren: [...document.querySelector('#work .grid').children].map((el) => ({ top: y(el), height: h(el), cls: String(el.className).slice(0, 70), text: (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 24) })),
        marquee: pick('#work + section'),
        capabilities: pick('#capabilities'),
        statsChildren: [...document.querySelector('#stats').children].map((el) => ({ top: y(el), height: h(el), cls: String(el.className).slice(0, 70) })),
        stats: pick('#stats'),
        philosophy: pick('#philosophy'),
        contact: pick('#contact'),
        footer: pick('body > footer'),
        main: pick('#main'),
      }
    })
    out.push({ width: viewport[0], height: viewport[1], info })
    await page.close()
  }
  console.log(JSON.stringify(out, null, 2))
  await browser.close()
})().catch((e) => { console.error(e); process.exit(1) })
