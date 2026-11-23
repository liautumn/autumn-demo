const path = require('node:path')
const { chromium } = require('/Users/autumn/.npm/_npx/9833c18b2d85bc59/node_modules/playwright-core')

const OUT = path.dirname(__filename)
const URL = 'http://localhost:4174'

async function tabTo(page, predicate, maxTabs) {
  for (let i = 0; i < maxTabs; i += 1) {
    await page.keyboard.press('Tab')
    const hit = await page.evaluate(predicate)
    if (hit) return { tabs: i + 1, hit }
  }
  return { tabs: maxTabs, hit: null }
}

;(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true })

  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
  await page.goto(URL, { waitUntil: 'networkidle' })
  await page.waitForTimeout(600)

  const heroFocus = await tabTo(
    page,
    () => {
      const el = document.activeElement
      if (!(el instanceof HTMLElement)) return null
      const heroCta = document.querySelector('#hero a[href="#work"]')
      if (el !== heroCta) return null
      const sectionBg = getComputedStyle(document.querySelector('#hero')).backgroundColor
      return { outlineColor: getComputedStyle(el).outlineColor, sectionBg }
    },
    15,
  )
  await page.screenshot({ path: path.join(OUT, 'final-focus-hero.png') })

  const contactFocus = await tabTo(
    page,
    () => {
      const el = document.activeElement
      if (!(el instanceof HTMLElement)) return null
      if (!el.closest('#contact') || !(el.textContent || '').includes('开始一个项目')) return null
      const sectionBg = getComputedStyle(document.querySelector('#contact')).backgroundColor
      return { outlineColor: getComputedStyle(el).outlineColor, sectionBg }
    },
    60,
  )
  await page.screenshot({ path: path.join(OUT, 'final-focus-contact.png') })

  const contactCta = page.locator('#contact a').filter({ hasText: '开始一个项目' }).last()
  await contactCta.scrollIntoViewIfNeeded()
  await page.waitForTimeout(600)
  const ctaBox = await contactCta.boundingBox()
  const badgeHit = await page.evaluate(
    ({ x, y }) => {
      const hit = document.elementFromPoint(x, y)
      const target = hit?.closest('a')
      return {
        hitTag: hit?.tagName,
        hitText: hit?.textContent?.trim().slice(0, 20),
        insideCta: !!target && (target.textContent || '').includes('开始一个项目'),
      }
    },
    { x: ctaBox.x + ctaBox.width / 2, y: ctaBox.y + ctaBox.height - 3 },
  )

  const reveal = await page.evaluate(async () => {
    const container = document.querySelector('#about .relative.z-0')
    const sticky = container?.querySelector('.sticky')
    if (!container || !sticky) return null
    const rect = container.getBoundingClientRect()
    const target = window.scrollY + rect.top + (rect.height - sticky.offsetHeight)
    window.scrollTo({ top: target, behavior: 'instant' })
    await new Promise((r) => setTimeout(r, 700))
    const tokens = [...container.querySelectorAll('[data-reveal-token]')]
    const foreground = tokens.map((token) => {
      const spans = token.querySelectorAll('span')
      const el = spans[spans.length - 1]
      return Number.parseFloat(getComputedStyle(el).opacity)
    })
    const stickyRect = sticky.getBoundingClientRect()
    return {
      maxOpacity: Math.max(...foreground),
      minOpacity: Math.min(...foreground),
      stickyCenterY: Math.round(stickyRect.top + stickyRect.height / 2),
      navHeight: document.querySelector('header').getBoundingClientRect().height,
      pinned: Math.abs(stickyRect.top) < 2,
    }
  })
  await page.screenshot({ path: path.join(OUT, 'final-manifesto.png') })

  const wide = await browser.newPage({ viewport: { width: 1920, height: 1080 } })
  await wide.goto(URL, { waitUntil: 'networkidle' })
  const layout = await wide.evaluate(() => {
    const widths = [...document.querySelectorAll('.shell')].map((el) => ({
      section: el.closest('section, footer, header')?.id || el.closest('footer')?.tagName || 'nav',
      width: Math.round(el.getBoundingClientRect().width),
      left: Math.round(el.getBoundingClientRect().left),
    }))
    return {
      maxShellWidth: Math.max(...widths.map((w) => w.width)),
      misaligned: widths.filter((w) => Math.abs(w.left - widths[0].left) > 1),
      shellCount: widths.length,
      widths: widths.slice(0, 12),
    }
  })
  await wide.screenshot({ path: path.join(OUT, 'final-wide.png') })

  console.log(
    JSON.stringify(
      { heroFocus, contactFocus, badgeHit, reveal, layout },
      null,
      2,
    ),
  )
  await browser.close()
})().catch((err) => {
  console.error(err)
  process.exit(1)
})
