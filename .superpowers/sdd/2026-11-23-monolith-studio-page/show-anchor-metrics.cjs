const r = require('./anchor-metrics.json')
for (const x of r) {
  const i = x.info
  console.log(`\n== ${x.width}x${x.height} vh=${i.vh} max=${i.maxScroll} doc=${i.docHeight}`)
  console.log('sections:', i.sections.map((s) => `${s.sel}@${s.top}+${s.height}`).join(' | '))
  console.log('about children:', i.aboutChildren.map((s) => `${s.tag}@${s.top}+${s.height}`).join(' | '))
  console.log('about shells:', i.aboutShells.map((s) => `${s.top}+${s.height}`).join(' | '))
  console.log('reveal:', JSON.stringify(i.reveal))
  console.log('sticky:', JSON.stringify(i.revealSticky))
  console.log('work cards:', i.workCards.map((s) => `${s.top}+${s.height}`).join(' | '))
  console.log('work grid children:')
  for (const s of i.workGridChildren) console.log(`  ${s.top}+${s.height} [${s.cls}]`)
  console.log('marquee:', JSON.stringify(i.marquee))
  console.log('stats children:', i.statsChildren.map((s) => `${s.top}+${s.height}`).join(' | '))
  console.log('footer:', JSON.stringify(i.footer))
}
