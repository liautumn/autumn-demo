# Vendored Inspira UI components

Vendored from [unovue/inspira-ui](https://github.com/unovue/inspira-ui) at commit
`eec920b047589058b4b02ba64deb614869e7237a`. MIT License, Copyright (c) 2024-2026
rahulv.dev. Local changes: `cn` import path, monochrome colors, anchor support.

## Components

- `interactive-grid-pattern/InteractiveGridPattern.vue`
- `shimmer-button/ShimmerButton.vue` — added `href`/`type` anchor support
- `text-scroll-reveal/TextScrollReveal.vue` + `ScrollWord.vue` — added `tokens`/`textClass`,
  CJK-aware splitting, monochrome opacity
- `glowing-effect/GlowingEffect.vue` — explicit Vue imports, grayscale gradient and mask
- `marquee/Marquee.vue` — local `cn` import
- `number-ticker/NumberTicker.vue` — local `cn` import, `text-current`
- `spinning-text/SpinningText.vue` — explicit Vue imports, motion-v type escape hatch
- `hyper-text/HyperText.vue` — `alphabet`/`disabled` props, lowercase support,
  animation off by default, monochrome text
- `html-in-canvas/` — `HtmlInCanvas.vue`, WebGL renderer, and snapshot fallback;
  local `cn` import, prototype-based support detection (SSR/jsdom-safe)
- `html-liquid/HtmlLiquid.vue` — local shader tuning: base flow at 35% and pointer
  ripple emphasized, so the surface stays calm at rest; used by `LiquidType.vue`
  for the hero headline and the contact statement
