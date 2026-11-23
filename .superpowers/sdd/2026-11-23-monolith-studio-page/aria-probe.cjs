const { chromium } = require('/Users/autumn/.npm/_npx/9833c18b2d85bc59/node_modules/playwright-core')
;(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true })
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } })
  await page.goto('http://localhost:4173', { waitUntil: 'networkidle' })
  await page.waitForTimeout(1200)
  await page.locator('#contact').scrollIntoViewIfNeeded()
  await page.waitForTimeout(500)
  const aria = await page.locator('#contact').ariaSnapshot()
  const client = await page.context().newCDPSession(page)
  const { nodes } = await client.send('Accessibility.getFullAXTree')
  const matches = nodes
    .filter((n) => {
      const name = n.name?.value || ''
      return name.includes('LET') || name.includes('quiet') || (n.role?.value === 'heading' && name)
    })
    .map((n) => ({ role: n.role?.value, name: n.name?.value, ignored: n.ignored }))
  console.log('ARIA SNAPSHOT CONTACT\n' + aria)
  console.log('AX MATCHES', JSON.stringify(matches, null, 2))
  await browser.close()
})().catch((e) => { console.error(e); process.exit(1) })
