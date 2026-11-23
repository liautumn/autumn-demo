const { chromium } = require('/Users/autumn/.npm/_npx/9833c18b2d85bc59/node_modules/playwright-core')
;(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true })
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  await page.goto('http://localhost:4173', { waitUntil: 'networkidle' })
  await page.evaluate(() => {
    const host = document.createElement('div')
    host.innerHTML = `
      <section id="probe-region" aria-labelledby="probe-title">
        <div id="probe-title">
          <div aria-hidden="true"><h1>WE SHAPE quiet, DELIBERATE digital.</h1></div>
          <div><h1>WE SHAPE quiet, DELIBERATE digital.</h1></div>
        </div>
      </section>
      <span id="probe-hidden-ref" hidden>Hidden label</span>
      <div id="probe-hidden-region" aria-labelledby="probe-hidden-ref"></div>
    `
    document.body.appendChild(host)
  })
  const client = await page.context().newCDPSession(page)
  const { nodes } = await client.send('Accessibility.getFullAXTree')
  const matches = nodes
    .filter((n) => ['probe-region', 'probe-hidden-region', 'probe-title'].includes(n.backendDOMNodeId + '') || (n.name?.value || '').includes('WE SHAPE quiet'))
    .map((n) => ({ role: n.role?.value, name: n.name?.value, ignored: n.ignored, backend: n.backendDOMNodeId }))
  console.log(JSON.stringify(matches, null, 2))
  const snapshot = await page.locator('#probe-region').ariaSnapshot()
  console.log('SNAPSHOT\n' + snapshot)
  await browser.close()
})().catch((e) => { console.error(e); process.exit(1) })
