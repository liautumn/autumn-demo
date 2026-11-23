const { chromium } = require('/Users/autumn/.npm/_npx/9833c18b2d85bc59/node_modules/playwright-core')

;(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true })
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
  await page.goto('http://localhost:4174', { waitUntil: 'networkidle' })

  const initialUrl = page.url()
  await page.locator('#work article a').first().click()
  await page.waitForTimeout(300)
  const afterCardClick = page.url()

  await page.locator('header a[href="#contact"]').click()
  await page.waitForTimeout(1400)
  const afterContactClick = await page.evaluate(() => ({
    hash: location.hash,
    contactTop: Math.round(document.querySelector('#contact').getBoundingClientRect().top),
  }))

  await page.locator('footer a[href="#hero"]').click()
  await page.waitForTimeout(1600)
  const afterTopClick = await page.evaluate(() => ({
    hash: location.hash,
    scrollY: Math.round(window.scrollY),
  }))

  console.log(
    JSON.stringify({ initialUrl, afterCardClick, afterContactClick, afterTopClick }, null, 2),
  )
  await browser.close()
})().catch((err) => {
  console.error(err)
  process.exit(1)
})
