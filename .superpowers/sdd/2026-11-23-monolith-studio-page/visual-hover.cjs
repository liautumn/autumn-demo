const path = require('node:path')
const { chromium } = require('/Users/autumn/.npm/_npx/9833c18b2d85bc59/node_modules/playwright-core')

const OUT = path.dirname(__filename)
const URL = 'http://localhost:4174'

;(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true })
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
  await page.goto(URL, { waitUntil: 'networkidle' })

  await page.evaluate(() => {
    const about = document.querySelector('#about')
    if (about) window.scrollTo(0, about.offsetTop + window.innerHeight * 0.5)
  })
  await page.waitForTimeout(900)
  await page.screenshot({ path: path.join(OUT, 'desktop-manifesto.png') })

  await page.evaluate(() => {
    const work = document.querySelector('#work')
    if (work) window.scrollTo(0, work.offsetTop - 80)
  })
  await page.waitForTimeout(700)
  const card = page.locator('#work article').first()
  await card.hover()
  await page.waitForTimeout(1200)
  await page.screenshot({ path: path.join(OUT, 'desktop-work-hover.png') })

  await page.evaluate(() => window.scrollTo(0, window.scrollY + 1400))
  await page.waitForTimeout(800)
  await page.screenshot({ path: path.join(OUT, 'desktop-work-hover-2.png') })

  const navScrolled = await page.evaluate(() => {
    const header = document.querySelector('header')
    return {
      dataScrolled: header?.getAttribute('data-scrolled'),
      borderBottom: header ? getComputedStyle(header).borderBottomColor : null,
    }
  })
  console.log(JSON.stringify({ navScrolled }, null, 2))
  await browser.close()
})().catch((err) => {
  console.error(err)
  process.exit(1)
})
