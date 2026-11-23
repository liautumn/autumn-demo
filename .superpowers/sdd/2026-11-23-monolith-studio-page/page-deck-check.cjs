const path = require('node:path')
const { chromium } = require('/Users/autumn/.npm/_npx/9833c18b2d85bc59/node_modules/playwright-core')

const OUT = path.dirname(__filename)
const URL = 'http://localhost:4173'

function near(a, b, tolerance = 3) {
  return Math.abs(a - b) <= tolerance
}

async function measure(page) {
  return page.evaluate(() => {
    const pages = [...document.querySelectorAll('[data-page-anchor]')].map((element) => {
      const bounds = element.getBoundingClientRect()
      const shell = element.querySelector('.shell')

      return {
        anchor: element.dataset.pageAnchor,
        id: element.id || null,
        tag: element.tagName.toLowerCase(),
        top: Math.round(bounds.top + window.scrollY),
        height: Math.round(bounds.height * 100) / 100,
        scrollHeight: element.scrollHeight,
        clientHeight: element.clientHeight,
        overflow: element.scrollHeight - element.clientHeight,
        shellOverflow: shell ? Math.round((shell.scrollHeight - shell.clientHeight) * 100) / 100 : null,
        pageSlide: element.classList.contains('page-slide'),
      }
    })

    return {
      innerHeight: window.innerHeight,
      innerWidth: window.innerWidth,
      scrollHeight: document.documentElement.scrollHeight,
      scrollWidth: document.documentElement.scrollWidth,
      pages,
    }
  })
}

async function wheel(page, deltaY) {
  return page.evaluate(
    (value) =>
      !window.dispatchEvent(
        new WheelEvent('wheel', { deltaY: value, cancelable: true }),
      ),
    deltaY,
  )
}

async function wait(page, ms) {
  await page.waitForTimeout(ms)
}

async function resetTop(page) {
  await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = 'auto'
    window.scrollTo(0, 0)
  })
  await wait(page, 260)
}

async function screenshots(page, width, height, label, indexes) {
  const data = await measure(page)
  for (const index of indexes) {
    const item = data.pages[index]
    if (!item) continue
    await page.evaluate((top) => {
      document.documentElement.style.scrollBehavior = 'auto'
      window.scrollTo(0, top)
    }, item.top)
    await wait(page, 450)
    await page.screenshot({
      path: path.join(OUT, `deck-${label}-${String(index).padStart(2, '0')}-${item.anchor}.png`),
    })
  }
  await resetTop(page)
}

;(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true })
  const report = { console: [], viewports: {}, pager: {}, reduced: {}, touch: {} }

  for (const viewport of [
    { width: 390, height: 844 },
    { width: 768, height: 900 },
    { width: 1024, height: 768 },
    { width: 1440, height: 900 },
    { width: 1920, height: 1080 },
  ]) {
    const page = await browser.newPage({ viewport })
    page.on('console', (message) => {
      if (message.type() === 'error' || message.type() === 'warning') {
        report.console.push(
          `${viewport.width}x${viewport.height} ${message.type()}: ${message.text()}`,
        )
      }
    })
    await page.goto(URL, { waitUntil: 'networkidle' })
    await wait(page, 1500)
    const data = await measure(page)
    report.viewports[`${viewport.width}x${viewport.height}`] = data

    if (viewport.width === 1024) {
      await screenshots(page, viewport.width, viewport.height, '1024x768', [0, 1, 2, 4, 7, 8, 9, 10, 11, 12])
    }
    if (viewport.width === 390) {
      await screenshots(page, viewport.width, viewport.height, '390x844', [0, 1, 2, 5, 7, 8, 9, 10, 11, 12])
    }
    await page.close()
  }

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  page.on('console', (message) => {
    if (message.type() === 'error' || message.type() === 'warning') {
      report.console.push(`1440 ${message.type()}: ${message.text()}`)
    }
  })
  await page.goto(URL, { waitUntil: 'networkidle' })
  await wait(page, 1500)

  const deck = await measure(page)
  const stops = deck.pages.map((item) => item.top)
  report.pager.stops = stops
  report.pager.pageCount = stops.length

  // Spring shape for one gesture.
  const spring = await page.evaluate(async () => {
    document.documentElement.style.scrollBehavior = 'auto'
    window.scrollTo(0, 0)
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))

    const samples = []
    const start = performance.now()
    window.dispatchEvent(new WheelEvent('wheel', { deltaY: 120, cancelable: true }))

    await new Promise((resolve) => {
      function tick(now) {
        samples.push({ t: Math.round(now - start), y: Math.round(window.scrollY) })
        if (now - start < 1600) requestAnimationFrame(tick)
        else resolve()
      }
      requestAnimationFrame(tick)
    })

    return { samples, final: window.scrollY }
  })
  const peak = Math.max(...spring.samples.map((point) => point.y))
  report.pager.spring = {
    final: spring.final,
    expected: stops[1],
    peak,
    overshoot: peak - spring.final,
    samples: spring.samples.filter((_, index) => index % 4 === 0),
  }

  // Continuous chain: second gesture lands mid-spring.
  const chain = await page.evaluate(async () => {
    document.documentElement.style.scrollBehavior = 'auto'
    window.scrollTo(0, 0)
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))

    const samples = []
    const start = performance.now()
    window.dispatchEvent(new WheelEvent('wheel', { deltaY: 120, cancelable: true }))

    await new Promise((resolve) => setTimeout(resolve, 130))
    window.dispatchEvent(new WheelEvent('wheel', { deltaY: 120, cancelable: true }))

    await new Promise((resolve) => {
      function tick(now) {
        samples.push({ t: Math.round(now - start), y: Math.round(window.scrollY) })
        if (now - start < 1800) requestAnimationFrame(tick)
        else resolve()
      }
      requestAnimationFrame(tick)
    })

    return { samples, final: window.scrollY }
  })
  report.pager.chain = {
    final: chain.final,
    expected: stops[2],
    samples: chain.samples.filter((_, index) => index % 6 === 0),
  }

  // Momentum within one gesture must not advance twice.
  await resetTop(page)
  await page.evaluate(async () => {
    window.dispatchEvent(new WheelEvent('wheel', { deltaY: 120, cancelable: true }))
    await new Promise((resolve) => setTimeout(resolve, 25))
    window.dispatchEvent(new WheelEvent('wheel', { deltaY: 120, cancelable: true }))
  })
  await wait(page, 1300)
  report.pager.momentum = {
    final: await page.evaluate(() => window.scrollY),
    expected: stops[1],
  }

  // One gesture, keyboard, and back.
  await resetTop(page)
  await wheel(page, 120)
  await wait(page, 1200)
  const afterWheel = await page.evaluate(() => window.scrollY)
  await page.keyboard.press('PageDown')
  await wait(page, 1200)
  const afterPageDown = await page.evaluate(() => window.scrollY)
  await wheel(page, -120)
  await wait(page, 1200)
  const afterUp = await page.evaluate(() => window.scrollY)
  report.pager.keys = { afterWheel, afterPageDown, afterUp }

  // Navigation click lands on the work slide.
  await page.keyboard.press('End')
  await wait(page, 1800)
  await page.locator('header a[href="#work"]').first().click()
  await wait(page, 1800)
  const afterWorkNav = await page.evaluate(() => window.scrollY)
  const workPage = deck.pages.find((item) => item.id === 'work')
  report.pager.nav = {
    afterWorkNav,
    workTop: workPage?.top ?? null,
    hash: await page.evaluate(() => location.hash),
  }

  // Placeholder work links stay inert.
  const beforeCard = await page.evaluate(() => window.scrollY)
  await page.evaluate(() => {
    document.querySelector('#work a[href="#"]')?.dispatchEvent(
      new MouseEvent('click', { bubbles: true, cancelable: true }),
    )
  })
  await wait(page, 350)
  report.pager.workCard = {
    before: beforeCard,
    after: await page.evaluate(() => window.scrollY),
  }

  // Skip link retains native behavior.
  report.pager.skip = await page.evaluate(() => {
    const link = document.querySelector('a[href="#main"]')
    if (!link) return { found: false }
    return {
      found: true,
      notPrevented: link.dispatchEvent(
        new MouseEvent('click', { bubbles: true, cancelable: true }),
      ),
    }
  })

  await page.screenshot({ path: path.join(OUT, 'deck-1440x900-work.png') })
  await page.close()

  // Reduced motion fallback.
  const reduced = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'reduce',
  })
  await reduced.goto(URL, { waitUntil: 'networkidle' })
  await wait(reduced, 1200)
  const reducedInitial = await reduced.evaluate(() => ({
    active: document.documentElement.classList.contains('page-pager-active'),
    scrollY: window.scrollY,
  }))
  await reduced.mouse.move(720, 450)
  await reduced.mouse.wheel(0, 200)
  await wait(reduced, 500)
  report.reduced = {
    initial: reducedInitial,
    afterWheel: await reduced.evaluate(() => window.scrollY),
  }
  await reduced.close()

  // Touch swipe on mobile.
  const touchPage = await browser.newPage({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  })
  await touchPage.goto(URL, { waitUntil: 'networkidle' })
  await wait(touchPage, 1500)
  const touchDeck = await measure(touchPage)
  const touchResult = await touchPage.evaluate(async () => {
    const makeTouch = (y) =>
      new Touch({
        identifier: 1,
        target: document.body,
        clientX: 195,
        clientY: y,
        pageX: 195,
        pageY: y,
        screenX: 195,
        screenY: y,
      })
    const start = makeTouch(640)
    window.dispatchEvent(
      new TouchEvent('touchstart', {
        bubbles: true,
        cancelable: true,
        touches: [start],
        targetTouches: [start],
        changedTouches: [start],
      }),
    )
    const move = makeTouch(360)
    const moveEvent = new TouchEvent('touchmove', {
      bubbles: true,
      cancelable: true,
      touches: [move],
      targetTouches: [move],
      changedTouches: [move],
    })
    window.dispatchEvent(moveEvent)
    const end = makeTouch(360)
    window.dispatchEvent(
      new TouchEvent('touchend', {
        bubbles: true,
        cancelable: true,
        touches: [],
        targetTouches: [],
        changedTouches: [end],
      }),
    )
    return { movePrevented: moveEvent.defaultPrevented }
  })
  await wait(touchPage, 1300)
  report.touch = {
    initialActive: await touchPage.evaluate(() =>
      document.documentElement.classList.contains('page-pager-active'),
    ),
    movePrevented: touchResult.movePrevented,
    final: await touchPage.evaluate(() => window.scrollY),
    expected: touchDeck.pages[1]?.top ?? null,
  }
  await touchPage.close()

  const pagesFlat = Object.values(report.viewports).flatMap((viewport) => viewport.pages)
  report.checks = {
    allPagesAreSlides: pagesFlat.every((item) => item.pageSlide),
    allPagesViewportHeight: Object.values(report.viewports).every((viewport) =>
      viewport.pages.every((item) => near(item.height, viewport.innerHeight, 1)),
    ),
    allPagesStackExactly: Object.values(report.viewports).every((viewport) =>
      viewport.pages.every((item, index) => near(item.top, index * viewport.innerHeight)),
    ),
    noPageContentOverflow: pagesFlat.every((item) => item.overflow <= 1),
    noHorizontalOverflow: Object.values(report.viewports).every(
      (viewport) => viewport.scrollWidth <= viewport.innerWidth,
    ),
    documentHeightMatches: Object.values(report.viewports).every((viewport) =>
      near(viewport.scrollHeight, viewport.pages.length * viewport.innerHeight, 2),
    ),
    springOvershoots: peak > stops[1] + 5,
    springLands: near(spring.final, stops[1]),
    chainLandsTwoPages: near(chain.final, stops[2]),
    momentumSinglePage: near(report.pager.momentum.final, stops[1]),
    wheelOnePage: near(afterWheel, stops[1]),
    keyboardOnePage: near(afterPageDown, stops[2]),
    wheelBackOnePage: near(afterUp, stops[1]),
    navLandsWork: workPage && near(afterWorkNav, workPage.top),
    workCardInert:
      near(report.pager.workCard.after, report.pager.workCard.before) &&
      report.pager.nav.hash === '#work',
    skipNative: report.pager.skip.found && report.pager.skip.notPrevented,
    reducedStatic: reducedInitial.active === false && report.reduced.afterWheel > 0,
    touchPages: touchResult.movePrevented && near(report.touch.final, touchDeck.pages[1]?.top),
    consoleClean: report.console.length === 0,
  }

  console.log(JSON.stringify(report, null, 2))
  await browser.close()
})().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
