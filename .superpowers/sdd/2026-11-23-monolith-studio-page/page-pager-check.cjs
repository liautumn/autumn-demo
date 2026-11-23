const path = require('node:path')
const { chromium } = require('/Users/autumn/.npm/_npx/9833c18b2d85bc59/node_modules/playwright-core')

const OUT = path.dirname(__filename)
const URL = 'http://localhost:4173'

function collectStopsScript() {
  const vh = window.innerHeight
  const max = Math.round(document.documentElement.scrollHeight - vh)
  const raw = [0, max]

  for (const element of document.querySelectorAll('[data-page-anchor]')) {
    const bounds = element.getBoundingClientRect()
    const offset = Number(element.dataset.pageOffset || 0)
    const target =
      element.dataset.pageAlign === 'end'
        ? bounds.bottom + window.scrollY + offset - vh
        : bounds.top + window.scrollY - offset
    raw.push(Math.round(target))
  }

  raw.sort((a, b) => a - b)
  const unique = []
  for (const value of raw) {
    const clamped = Math.max(0, Math.min(max, value))
    const last = unique[unique.length - 1]
    if (last === undefined || clamped - last > 2) unique.push(clamped)
    else if (clamped === max) unique[unique.length - 1] = max
  }

  const stops = []
  for (const value of unique) {
    const previous = stops[stops.length - 1]
    if (previous !== undefined && value - previous > vh * 1.4) {
      let candidate = previous + vh
      while (value - candidate >= vh * 0.35) {
        stops.push(Math.round(candidate))
        candidate += vh
      }
    }
    stops.push(value)
  }

  return {
    stops,
    docHeight: document.documentElement.scrollHeight,
    max,
    innerHeight: vh,
    scrollWidth: document.documentElement.scrollWidth,
    innerWidth: window.innerWidth,
  }
}

async function waitForSettled(page, ms = 1400) {
  await page.waitForTimeout(ms)
  return page.evaluate(() => window.scrollY)
}

function near(actual, expected, tolerance = 3) {
  return Math.abs(actual - expected) <= tolerance
}

;(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true })
  const report = { console: [], desktop: {}, reduced: {}, mobile: {} }

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  page.on('console', (message) => {
    if (message.type() === 'error' || message.type() === 'warning') {
      report.console.push(`${message.type()}: ${message.text()}`)
    }
  })

  await page.goto(URL, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1600)

  const initial = await page.evaluate(() => {
    const hero = document.querySelector('#hero')
    const heroRect = hero.getBoundingClientRect()
    const bar = hero.querySelector('.shell.relative.flex.items-center')
    return {
      scrollY: window.scrollY,
      heroHeight: heroRect.height,
      heroBottom: heroRect.bottom,
      barBottom: bar?.getBoundingClientRect().bottom ?? null,
      pagerActive: document.documentElement.classList.contains('page-pager-active'),
      hash: location.hash,
    }
  })

  const geometry = await page.evaluate(collectStopsScript)
  report.desktop.initial = initial
  report.desktop.geometry = geometry

  await page.screenshot({ path: path.join(OUT, 'pager-0-hero-1440.png') })

  // Synthetic wheel with frame sampling: verifies overshoot and the first stop.
  const spring = await page.evaluate(async () => {
    document.documentElement.style.scrollBehavior = 'auto'
    window.scrollTo(0, 0)
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))

    const samples = []
    const start = performance.now()
    const event = new WheelEvent('wheel', { deltaY: 120, cancelable: true })
    const defaultPrevented = !window.dispatchEvent(event)

    await new Promise((resolve) => {
      function tick(now) {
        samples.push({ t: Math.round(now - start), y: window.scrollY })
        if (now - start < 1600) requestAnimationFrame(tick)
        else resolve()
      }
      requestAnimationFrame(tick)
    })

    return { defaultPrevented, samples, final: window.scrollY }
  })

  const peak = Math.max(...spring.samples.map((sample) => sample.y))
  report.desktop.spring = {
    defaultPrevented: spring.defaultPrevented,
    final: spring.final,
    expected: geometry.stops[1],
    peak,
    overshoot: Math.round((peak - spring.final) * 100) / 100,
    sampleCount: spring.samples.length,
  }

  // Two wheel events in one gesture must advance only one page.
  await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = 'auto'
    window.scrollTo(0, 0)
  })
  await page.waitForTimeout(200)
  await page.evaluate(async () => {
    window.dispatchEvent(new WheelEvent('wheel', { deltaY: 120, cancelable: true }))
    await new Promise((resolve) => setTimeout(resolve, 40))
    window.dispatchEvent(new WheelEvent('wheel', { deltaY: 120, cancelable: true }))
  })
  const afterDoubleWheel = await waitForSettled(page)
  report.desktop.doubleWheel = { after: afterDoubleWheel, expected: geometry.stops[1] }

  // One real mouse-wheel gesture per page.
  await page.mouse.move(720, 450)
  await page.mouse.wheel(0, 120)
  const afterWheelDown = await waitForSettled(page)
  await page.keyboard.press('PageDown')
  const afterPageDown = await waitForSettled(page)
  await page.mouse.wheel(0, -120)
  const afterWheelUp = await waitForSettled(page)
  await page.keyboard.press('Home')
  const afterHome = await waitForSettled(page)
  await page.keyboard.press('End')
  const afterEnd = await waitForSettled(page, 1800)

  report.desktop.keys = {
    afterWheelDown,
    afterPageDown,
    afterWheelUp,
    afterHome,
    afterEnd,
    stops: geometry.stops.slice(0, 4),
    lastStop: geometry.stops[geometry.stops.length - 1],
  }

  // In-page navigation is routed through the pager.
  await page.locator('header a[href="#work"]').first().click()
  const afterWorkNav = await waitForSettled(page, 1700)
  const workTop = await page.evaluate(() => {
    const element = document.querySelector('#work')
    return Math.round(element.getBoundingClientRect().top + window.scrollY)
  })
  report.desktop.anchorNav = { afterWorkNav, workTop, hash: await page.evaluate(() => location.hash) }

  await page.screenshot({ path: path.join(OUT, 'pager-work-1440.png') })

  // Work-card links use href="#" and must not be hijacked.
  const beforeWorkCard = await page.evaluate(() => window.scrollY)
  await page.evaluate(() => {
    const link = document.querySelector('#work a[href="#"]')
    link?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
  })
  await page.waitForTimeout(400)
  const afterWorkCard = await page.evaluate(() => window.scrollY)
  report.desktop.workCard = { beforeWorkCard, afterWorkCard, hash: await page.evaluate(() => location.hash) }

  // The skip link must keep its native behavior.
  const skip = await page.evaluate(() => {
    const link = document.querySelector('a[href="#main"]')
    if (!link) return { found: false }
    const event = new MouseEvent('click', { bubbles: true, cancelable: true })
    return { found: true, notPrevented: link.dispatchEvent(event) }
  })
  report.desktop.skip = skip

  await page.screenshot({ path: path.join(OUT, 'pager-end-1440.png') })
  await page.close()

  // Reduced motion: static pager, native scrolling.
  const reducedPage = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'reduce',
  })
  reducedPage.on('console', (message) => {
    if (message.type() === 'error' || message.type() === 'warning') {
      report.console.push(`reduced ${message.type()}: ${message.text()}`)
    }
  })
  await reducedPage.goto(URL, { waitUntil: 'networkidle' })
  await reducedPage.waitForTimeout(1200)
  const reducedInitial = await reducedPage.evaluate(() => ({
    active: document.documentElement.classList.contains('page-pager-active'),
    scrollY: window.scrollY,
  }))
  await reducedPage.mouse.move(720, 450)
  await reducedPage.mouse.wheel(0, 200)
  await reducedPage.waitForTimeout(500)
  const reducedAfterWheel = await reducedPage.evaluate(() => window.scrollY)
  report.reduced = { initial: reducedInitial, afterWheel: reducedAfterWheel }
  await reducedPage.close()

  // Mobile touch: one swipe advances one page.
  const mobilePage = await browser.newPage({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  })
  mobilePage.on('console', (message) => {
    if (message.type() === 'error' || message.type() === 'warning') {
      report.console.push(`mobile ${message.type()}: ${message.text()}`)
    }
  })
  await mobilePage.goto(URL, { waitUntil: 'networkidle' })
  await mobilePage.waitForTimeout(1600)
  const mobileGeometry = await mobilePage.evaluate(collectStopsScript)
  const touch = await mobilePage.evaluate(async () => {
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

    const start = makeTouch(620)
    window.dispatchEvent(
      new TouchEvent('touchstart', {
        bubbles: true,
        cancelable: true,
        touches: [start],
        targetTouches: [start],
        changedTouches: [start],
      }),
    )
    const move = makeTouch(380)
    const moveEvent = new TouchEvent('touchmove', {
      bubbles: true,
      cancelable: true,
      touches: [move],
      targetTouches: [move],
      changedTouches: [move],
    })
    window.dispatchEvent(moveEvent)
    const end = makeTouch(380)
    window.dispatchEvent(
      new TouchEvent('touchend', {
        bubbles: true,
        cancelable: true,
        touches: [],
        targetTouches: [],
        changedTouches: [end],
      }),
    )

    return { movePrevented: !moveEvent.defaultPrevented ? false : true }
  })
  await mobilePage.waitForTimeout(1400)
  const mobileAfterSwipe = await mobilePage.evaluate(() => window.scrollY)
  report.mobile = {
    geometry: mobileGeometry,
    touch,
    afterSwipe: mobileAfterSwipe,
    expected: mobileGeometry.stops[1],
  }
  await mobilePage.screenshot({ path: path.join(OUT, 'pager-mobile-390.png') })
  await mobilePage.close()

  report.checks = {
    heroFitsViewport: initial.heroHeight <= 901,
    heroBarVisible: initial.barBottom !== null && initial.barBottom <= 901,
    noHorizontalOverflow: geometry.scrollWidth <= geometry.innerWidth,
    springAccepted: spring.defaultPrevented,
    springLandsFirstStop: near(spring.final, geometry.stops[1]),
    springOvershoots: peak > geometry.stops[1] + 5,
    oneGestureOnePage: near(afterDoubleWheel, geometry.stops[1]),
    wheelDown: near(afterWheelDown, geometry.stops[2]),
    pageDown: near(afterPageDown, geometry.stops[3]),
    wheelUp: near(afterWheelUp, geometry.stops[2]),
    home: near(afterHome, 0),
    end: near(afterEnd, geometry.stops[geometry.stops.length - 1]),
    anchorWork: near(afterWorkNav, workTop),
    workCardIgnored: near(afterWorkCard, beforeWorkCard) && report.desktop.workCard.hash === '#work',
    skipNative: skip.found && skip.notPrevented,
    reducedStatic: reducedInitial.active === false && reducedAfterWheel > 0,
    mobileSwipe: touch.movePrevented && near(mobileAfterSwipe, mobileGeometry.stops[1]),
    consoleClean: report.console.length === 0,
  }

  console.log(JSON.stringify(report, null, 2))
  await browser.close()
})().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
