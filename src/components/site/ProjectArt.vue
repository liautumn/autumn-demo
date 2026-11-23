<script setup lang="ts">
import type { WorkArt } from '@/data/site'

defineProps<{
  variant: WorkArt
  label: string
}>()
</script>

<template>
  <div role="img" :aria-label="label" class="absolute inset-0 overflow-hidden bg-paper">
    <svg
      viewBox="0 0 800 1000"
      preserveAspectRatio="xMidYMid slice"
      class="h-full w-full"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="blank-soft" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stop-color="#8B8A83" stop-opacity="0.34" />
          <stop offset="100%" stop-color="#8B8A83" stop-opacity="0" />
        </radialGradient>
        <pattern id="handle-dots" width="12" height="12" patternUnits="userSpaceOnUse">
          <circle cx="6" cy="6" r="1.8" fill="#0A0A09" opacity="0.55" />
        </pattern>
        <linearGradient id="handle-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#F2F0EA" stop-opacity="0" />
          <stop offset="55%" stop-color="#F2F0EA" stop-opacity="0.55" />
          <stop offset="100%" stop-color="#F2F0EA" stop-opacity="0.95" />
        </linearGradient>
      </defs>

      <g v-if="variant === 'blank'" data-art="blank">
        <rect width="800" height="1000" fill="#F2F0EA" />
        <g stroke="#0A0A09" stroke-opacity="0.07" stroke-width="1">
          <path d="M160 80V920M320 80V920M480 80V920M640 80V920" />
        </g>
        <rect x="250" y="230" width="300" height="580" fill="url(#blank-soft)" />
        <rect x="338" y="292" width="124" height="456" fill="#8B8A83" opacity="0.16" />
        <rect x="338" y="748" width="124" height="10" fill="#0A0A09" opacity="0.38" />
        <path d="M120 880H680" stroke="#0A0A09" stroke-opacity="0.22" />
        <text
          x="120"
          y="132"
          fill="#0A0A09"
          fill-opacity="0.42"
          font-family="'IBM Plex Mono', monospace"
          font-size="17"
          letter-spacing="4"
        >BLANK FURNITURE</text>
        <text
          x="680"
          y="920"
          fill="#0A0A09"
          fill-opacity="0.3"
          font-family="'IBM Plex Mono', monospace"
          font-size="15"
          letter-spacing="3"
          text-anchor="end"
        >01 — 2026</text>
      </g>

      <g
        v-else-if="variant === 'north34'"
        data-art="north34"
        fill="none"
        stroke="#0A0A09"
        stroke-width="1.4"
      >
        <rect width="800" height="1000" fill="#F2F0EA" stroke="none" />
        <g stroke-opacity="0.12">
          <path d="M-40 800L420 520L860 780" />
          <path d="M-40 860L420 580L860 840" />
          <path d="M40 140L400 350L760 140" />
        </g>
        <g stroke-opacity="0.34">
          <path d="M400 180L620 300L400 420L180 300Z" />
          <path d="M400 180V20M620 300V140M400 420V260M180 300V140" stroke-opacity="0.14" />
          <path d="M400 420L620 540L400 660L180 540Z" />
          <path d="M180 540V300M620 540V300M400 660V420" stroke-opacity="0.2" />
          <path d="M400 660L620 780L400 900L180 780Z" />
          <path d="M180 780V540M620 780V540M400 900V660" stroke-opacity="0.2" />
        </g>
        <g fill="#8B8A83" fill-opacity="0.1" stroke="none">
          <path d="M400 180L620 300L400 420L180 300Z" />
          <path d="M400 420L620 300V540L400 660Z" />
        </g>
        <path d="M300 240L520 360" stroke-opacity="0.18" />
        <path d="M280 700L520 840" stroke-opacity="0.14" />
        <g
          fill="#0A0A09"
          fill-opacity="0.4"
          font-family="'IBM Plex Mono', monospace"
          font-size="16"
          letter-spacing="4"
          stroke="none"
        >
          <text x="120" y="132">NORTH / 34</text>
          <text x="680" y="920" text-anchor="end">02 — 2025</text>
        </g>
      </g>

      <g v-else-if="variant === 'handle'" data-art="handle">
        <rect width="800" height="1000" fill="#F2F0EA" />
        <circle
          cx="400"
          cy="490"
          r="252"
          fill="none"
          stroke="url(#handle-dots)"
          stroke-width="132"
        />
        <circle cx="400" cy="490" r="318" fill="none" stroke="#0A0A09" stroke-opacity="0.16" />
        <circle cx="400" cy="490" r="186" fill="none" stroke="#0A0A09" stroke-opacity="0.1" />
        <rect x="0" y="470" width="800" height="530" fill="url(#handle-fade)" />
        <path
          d="M560 300C640 340 676 420 660 500"
          fill="none"
          stroke="#0A0A09"
          stroke-opacity="0.32"
          stroke-width="1.4"
        />
        <g
          fill="#0A0A09"
          fill-opacity="0.42"
          font-family="'IBM Plex Mono', monospace"
          font-size="16"
          letter-spacing="4"
        >
          <text x="120" y="132">HANDLE — OBJECTS</text>
          <text x="680" y="920" text-anchor="end">03 — 2025</text>
        </g>
      </g>

      <g v-else-if="variant === 'slowpress'" data-art="slowpress">
        <rect width="800" height="1000" fill="#F2F0EA" />
        <g stroke="#0A0A09" stroke-opacity="0.08">
          <path d="M100 0V1000M200 0V1000M300 0V1000M400 0V1000M500 0V1000M600 0V1000M700 0V1000" />
        </g>
        <text
          x="430"
          y="905"
          fill="#0A0A09"
          fill-opacity="0.88"
          font-family="'Instrument Serif', Georgia, serif"
          font-style="italic"
          font-size="1120"
          text-anchor="middle"
        >S</text>
        <path d="M60 60H240M60 60V210" stroke="#0A0A09" stroke-opacity="0.35" />
        <path d="M740 940H560M740 940V790" stroke="#0A0A09" stroke-opacity="0.35" />
        <g
          fill="#0A0A09"
          fill-opacity="0.42"
          font-family="'IBM Plex Mono', monospace"
          font-size="16"
          letter-spacing="4"
        >
          <text x="130" y="960">SLOW PRESS</text>
          <text x="680" y="132" text-anchor="end">04 — 2024</text>
        </g>
      </g>

      <g v-else data-art="atlas" fill="none" stroke="#0A0A09">
        <rect width="800" height="1000" fill="#F2F0EA" stroke="none" />
        <g stroke-opacity="0.3" stroke-width="1.3">
          <path d="M-60 380C90 300 210 470 360 420S650 300 860 390" />
          <path d="M-60 440C100 350 230 530 380 470S660 350 860 440" />
          <path d="M-60 500C110 420 240 585 400 520S670 405 860 495" />
          <path d="M-60 560C120 490 250 640 415 570S680 460 860 550" />
          <path d="M-60 620C130 560 260 695 430 620S690 520 860 605" />
        </g>
        <g stroke-opacity="0.5" stroke-width="1.6">
          <path d="M120 470C200 400 280 540 380 500S520 410 620 470" />
          <path d="M150 540C230 480 300 610 400 560S540 490 640 540" />
        </g>
        <g stroke-opacity="0.16" stroke-width="1">
          <ellipse cx="390" cy="505" rx="150" ry="68" />
          <ellipse cx="390" cy="505" rx="220" ry="100" />
          <ellipse cx="390" cy="505" rx="290" ry="132" />
        </g>
        <g stroke-opacity="0.2">
          <path d="M60 380V640M740 380V640" />
          <path d="M40 505H92M708 505H760" />
        </g>
        <g
          fill="#0A0A09"
          fill-opacity="0.42"
          font-family="'IBM Plex Mono', monospace"
          font-size="16"
          letter-spacing="4"
          stroke="none"
        >
          <text x="80" y="330">ATLAS — DENSITY</text>
          <text x="720" y="720" text-anchor="end">05 — 2024</text>
        </g>
      </g>
    </svg>
  </div>
</template>
