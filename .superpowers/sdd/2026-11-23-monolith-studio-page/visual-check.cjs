const path = require('node:path')
const fs = require('node:fs')
const { chromium } = require('/Users/autumn/.npm/_npx/9833c18b2d85bc59/node_modules/playwright-core')

const OUT = path.dirname(__filename)
const URL = 'http://localhost:4174'

async function collect(page) {
  return page.evaluate(() => {
    const chromatic = []
    for (const el of document.querySelectorAll('*')) {
      const s = getComputedStyle(el)
      for (const prop of ['color', 'backgroundColor', 'borderTopColor', 'borderBottomColor']) {
        const m = s[prop].match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
        if (!m) continue
        const [r, g, b] = [Number(m[1]), Number(m[2]), Number(m[3])]
        const spread = Math.max(r, g, b) - Math.min(r, g, b)
        if (spread > 12) chromatic.push([el.tagName, prop, s[prop], spread])
      }
    }
    const smallTargets = []
    for (const el of document.querySelectorAll('a, button')) {
      const r = el.getBoundingClientRect()
      const hidden = el.closest('.sr-only') || getComputedStyle(el).visibility === 'hidden'
      if (!hidden && r.width > 0 && r.height > 0 && r.height < 44) {
        smallTargets.push([el.tagName, el.textContent.trim().slice(0, 24), Math.round(r.height)])
      }
    }
    return {
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
      noHorizontalScroll: document.documentElement.scrollWidth <= window.innerWidth,
      chromatic: chromatic.slice(0, 20),
      smallTargets: smallTargets.slice(0, 20),
      fontFamily: getComputedStyle(document.body).fontFamily,
      heroHeight: document.querySelector('#hero')?.getBoundingClientRect().height,
      sections: [...document.querySelectorAll('section, footer')].map((el) => el.id || el.tagName),
    }
  })
}

;(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true })
  const consoleMessages = []

  const desktop = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
  desktop.on('console', (msg) => consoleMessages.push({ page: 'desktop', type: msg.type(), text: msg.text() }))
  desktop.on('pageerror', (err) => consoleMessages.push({ page: 'desktop', type: 'pageerror', text: err.message }))
  await desktop.goto(URL, { waitUntil: 'networkidle' })
  await desktop.waitForTimeout(1200)
  await desktop.screenshot({ path: path.join(OUT, 'desktop-full.png'), fullPage: true })
  const desktopChecks = await collect(desktop)

  for (const [name, sel] of [
    ['hero', '#hero'],
    ['work', '#work'],
    ['capabilities', '#capabilities'],
    ['philosophy', '#philosophy'],
    ['contact', '#contact'],
  ]) {
    await desktop.locator(sel).scrollIntoViewIfNeeded()
    await desktop.waitForTimeout(700)
    await desktop.screenshot({ path: path.join(OUT, `desktop-${name}.png`) })
  }

  await desktop.evaluate(() => {
    const about = document.querySelector('#about')
    if (about) window.scrollTo(0, about.getBoundingClientRect().top + window.scrollY + window.innerHeight * 0.9)
  })
  await desktop.waitForTimeout(900)
  await desktop.screenshot({ path: path.join(OUT, 'desktop-about.png') })

  await desktop.locator('#stats').scrollIntoViewIfNeeded()
  await desktop.waitForTimeout(2200)
  await desktop.screenshot({ path: path.join(OUT, 'desktop-stats.png') })
  const statValues = await desktop.$$eval('#stats dd', (nodes) => nodes.map((n) => n.textContent.trim()))

  await desktop.locator('footer').scrollIntoViewIfNeeded()
  await desktop.waitForTimeout(600)
  await desktop.screenshot({ path: path.join(OUT, 'desktop-footer.png') })

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } })
  mobile.on('console', (msg) => consoleMessages.push({ page: 'mobile', type: msg.type(), text: msg.text() }))
  mobile.on('pageerror', (err) => consoleMessages.push({ page: 'mobile', type: 'pageerror', text: err.message }))
  await mobile.goto(URL, { waitUntil: 'networkidle' })
  await mobile.waitForTimeout(1200)
  await mobile.screenshot({ path: path.join(OUT, 'mobile-full.png'), fullPage: true })
  await mobile.screenshot({ path: path.join(OUT, 'mobile-hero.png') })
  const mobileChecks = await collect(mobile)

  const reduced = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' })
  await reduced.goto(URL, { waitUntil: 'networkidle' })
  await reduced.waitForTimeout(800)
  const reducedChecks = await reduced.evaluate(() => {
    const marquee = document.querySelector('.animate-marquee')
    const spotlight = document.querySelector('.hero-spotlight')
    return {
      marqueeAnimation: marquee ? getComputedStyle(marquee).animationName : 'none',
      badgeVisible: !!document.querySelector('[data-spinning-badge]'),
      spotlight: !!spotlight && getComputedStyle(spotlight).display !== 'none',
    }
  })
  await reduced.screenshot({ path: path.join(OUT, 'desktop-reduced.png') })

  await desktop.evaluate(() => window.scrollTo(0, 0))
  await desktop.waitForTimeout(300)
  const focusTrail = []
  for (let i = 0; i < 6; i += 1) {
    await desktop.keyboard.press('Tab')
    focusTrail.push(
      await desktop.evaluate(() => {
        const el = document.activeElement
        const r = el?.getBoundingClientRect()
        return {
          tag: el?.tagName,
          text: el?.textContent?.trim().slice(0, 24),
          href: el?.getAttribute?.('href'),
          outline: el ? getComputedStyle(el).outlineStyle : null,
          y: r ? Math.round(r.top) : null,
        }
      }),
    )
  }
  await desktop.screenshot({ path: path.join(OUT, 'desktop-focus.png') })

  const report = {
    desktop: desktopChecks,
    mobile: mobileChecks,
    reduced: reducedChecks,
    statValues,
    focusTrail,
    consoleMessages: consoleMessages.filter((m) => m.type === 'error' || m.type === 'warning' || m.type === 'pageerror'),
  }
  fs.writeFileSync(path.join(OUT, 'visual-report.json'), JSON.stringify(report, null, 2))
  console.log(JSON.stringify(report, null, 2))
  await browser.close()
})().catch((err) => {
  console.error(err)
  process.exit(1)
})
