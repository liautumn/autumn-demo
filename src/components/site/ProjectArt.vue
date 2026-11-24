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
      data-orientation="wide"
      viewBox="0 0 1600 760"
      preserveAspectRatio="xMidYMid meet"
      class="hidden h-full w-full lg:block"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="wide-blank-soft" cx="50%" cy="48%" r="55%">
          <stop offset="0%" stop-color="#8B8A83" stop-opacity="0.3" />
          <stop offset="100%" stop-color="#8B8A83" stop-opacity="0" />
        </radialGradient>
        <radialGradient id="wide-atlas-soft" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stop-color="#8B8A83" stop-opacity="0.16" />
          <stop offset="100%" stop-color="#8B8A83" stop-opacity="0" />
        </radialGradient>
        <pattern id="wide-handle-dots" width="12" height="12" patternUnits="userSpaceOnUse">
          <circle cx="6" cy="6" r="1.8" fill="#0A0A09" opacity="0.55" />
        </pattern>
        <linearGradient id="wide-handle-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#F2F0EA" stop-opacity="0" />
          <stop offset="100%" stop-color="#F2F0EA" stop-opacity="0.95" />
        </linearGradient>
        <g id="wide-north-module" fill="none" stroke="#0A0A09" stroke-width="1.4">
          <path d="M0 0L220 120L0 240L-220 120Z" fill="#8B8A83" fill-opacity="0.1" stroke="none" />
          <path d="M0 0L220 120L0 240L-220 120Z" stroke-opacity="0.34" />
          <path d="M-220 120V-40M0 240V80M220 120V-40" stroke-opacity="0.14" />
          <path d="M0 240L220 360L0 480L-220 360Z" fill="#8B8A83" fill-opacity="0.06" stroke="none" />
          <path d="M0 240L220 360L0 480L-220 360Z" stroke-opacity="0.34" />
          <path d="M-220 360V120M220 360V120M0 480V240" stroke-opacity="0.2" />
          <path d="M0 480L220 600L0 720L-220 600Z" stroke-opacity="0.34" />
          <path d="M-220 600V360M220 600V360M0 720V480" stroke-opacity="0.2" />
        </g>
      </defs>

      <g v-if="variant === 'blank'" data-art="blank">
        <rect x="0.5" y="0.5" width="1599" height="759" fill="#F2F0EA" stroke="#0A0A09" stroke-opacity="0.08" />
        <g stroke="#0A0A09" stroke-opacity="0.06" stroke-width="1">
          <path
            d="M160 80V680M320 80V680M480 80V680M640 80V680M800 80V680M960 80V680M1120 80V680M1280 80V680M1440 80V680"
          />
        </g>
        <ellipse cx="800" cy="380" rx="420" ry="250" fill="url(#wide-blank-soft)" />
        <line x1="80" y1="640" x2="1520" y2="640" stroke="#0A0A09" stroke-opacity="0.2" />
        <g fill="#8B8A83">
          <rect x="340" y="420" width="190" height="220" opacity="0.08" />
          <rect x="1070" y="340" width="170" height="300" opacity="0.11" />
          <rect x="735" y="200" width="130" height="440" opacity="0.18" />
        </g>
        <g fill="none" stroke="#0A0A09" stroke-opacity="0.12">
          <rect x="340.5" y="420.5" width="189" height="219" />
          <rect x="1070.5" y="340.5" width="169" height="299" />
          <rect x="735.5" y="200.5" width="129" height="439" />
        </g>
        <g stroke="#0A0A09" stroke-opacity="0.18">
          <path d="M340 500H530M1070 460H1240" />
        </g>
        <g fill="#0A0A09">
          <rect x="735" y="598" width="130" height="8" opacity="0.35" />
          <rect x="340" y="640" width="190" height="6" opacity="0.18" />
          <rect x="1070" y="640" width="170" height="6" opacity="0.18" />
        </g>
        <path
          d="M80 80H250M80 80V210M1520 680H1350M1520 680V550"
          fill="none"
          stroke="#0A0A09"
          stroke-opacity="0.3"
        />
        <g
          fill="#0A0A09"
          fill-opacity="0.42"
          font-family="'IBM Plex Mono', monospace"
          font-size="16"
          letter-spacing="4"
        >
          <text x="100" y="120">BLANK FURNITURE</text>
          <text x="1500" y="700" text-anchor="end">01 — 2026</text>
        </g>
      </g>

      <g
        v-else-if="variant === 'north34'"
        data-art="north34"
        fill="none"
        stroke="#0A0A09"
        stroke-width="1.4"
      >
        <rect x="0.5" y="0.5" width="1599" height="759" fill="#F2F0EA" stroke="#0A0A09" stroke-opacity="0.08" />
        <g stroke-opacity="0.1">
          <path d="M-80 600C260 560 500 640 800 600S1340 560 1680 600" />
          <path d="M-80 630C260 590 500 670 800 630S1340 590 1680 630" />
          <path d="M-80 660C260 620 500 700 800 660S1340 620 1680 660" />
          <path d="M-80 690C260 650 500 730 800 690S1340 650 1680 690" />
        </g>
        <path d="M520 430H1080" stroke-opacity="0.16" />
        <path d="M370 586V650M800 610V650M1230 586V650" stroke-opacity="0.2" />
        <use href="#wide-north-module" transform="translate(370 190) scale(0.55)" />
        <use href="#wide-north-module" transform="translate(800 120) scale(0.68)" />
        <use href="#wide-north-module" transform="translate(1230 190) scale(0.55)" />
        <path
          d="M80 80H220M80 80V180M1520 680H1380M1520 680V580"
          stroke-opacity="0.3"
        />
        <g
          fill="#0A0A09"
          fill-opacity="0.42"
          font-family="'IBM Plex Mono', monospace"
          font-size="16"
          letter-spacing="4"
          stroke="none"
        >
          <text x="100" y="120">NORTH / 34</text>
          <text x="1500" y="700" text-anchor="end">02 — 2025</text>
        </g>
      </g>

      <g v-else-if="variant === 'handle'" data-art="handle">
        <rect x="0.5" y="0.5" width="1599" height="759" fill="#F2F0EA" stroke="#0A0A09" stroke-opacity="0.08" />
        <line x1="80" y1="620" x2="1520" y2="620" stroke="#0A0A09" stroke-opacity="0.12" />
        <g fill="none">
          <circle cx="300" cy="380" r="118" stroke="url(#wide-handle-dots)" stroke-width="76" />
          <circle cx="800" cy="380" r="220" stroke="url(#wide-handle-dots)" stroke-width="118" />
          <circle cx="1300" cy="380" r="118" stroke="url(#wide-handle-dots)" stroke-width="76" />
          <circle cx="300" cy="380" r="160" stroke="#0A0A09" stroke-opacity="0.14" />
          <circle cx="800" cy="380" r="286" stroke="#0A0A09" stroke-opacity="0.16" />
          <circle cx="1300" cy="380" r="160" stroke="#0A0A09" stroke-opacity="0.14" />
          <circle cx="800" cy="380" r="160" stroke="#0A0A09" stroke-opacity="0.1" />
        </g>
        <path
          d="M960 300C1040 340 1076 420 1060 500"
          fill="none"
          stroke="#0A0A09"
          stroke-opacity="0.32"
          stroke-width="1.4"
        />
        <rect x="0" y="560" width="1600" height="200" fill="url(#wide-handle-fade)" />
        <path
          d="M900 650H1140M900 650V630M1140 650V630"
          fill="none"
          stroke="#0A0A09"
          stroke-opacity="0.3"
        />
        <g
          fill="#0A0A09"
          fill-opacity="0.42"
          font-family="'IBM Plex Mono', monospace"
          font-size="16"
          letter-spacing="4"
        >
          <text x="100" y="120">HANDLE — OBJECTS</text>
          <text x="1500" y="700" text-anchor="end">03 — 2025</text>
        </g>
      </g>

      <g v-else-if="variant === 'slowpress'" data-art="slowpress">
        <rect x="0.5" y="0.5" width="1599" height="759" fill="#F2F0EA" stroke="#0A0A09" stroke-opacity="0.08" />
        <g stroke="#0A0A09" stroke-opacity="0.06">
          <path
            d="M160 0V760M320 0V760M480 0V760M640 0V760M800 0V760M960 0V760M1120 0V760M1280 0V760M1440 0V760"
          />
        </g>
        <g fill="none" stroke="#0A0A09" stroke-opacity="0.16">
          <path d="M80 650C360 600 500 360 800 360S1240 600 1520 650" />
          <path d="M80 690C380 640 520 420 800 420S1220 640 1520 690" stroke-opacity="0.5" />
        </g>
        <text
          x="800"
          y="660"
          fill="#0A0A09"
          fill-opacity="0.88"
          font-family="'Instrument Serif', Georgia, serif"
          font-style="italic"
          font-size="720"
          text-anchor="middle"
        >S</text>
        <path
          d="M80 80H240M80 80V210M1520 680H1360M1520 680V550"
          fill="none"
          stroke="#0A0A09"
          stroke-opacity="0.35"
        />
        <g
          fill="#0A0A09"
          fill-opacity="0.42"
          font-family="'IBM Plex Mono', monospace"
          font-size="16"
          letter-spacing="4"
        >
          <text x="100" y="120">SLOW PRESS</text>
          <text x="1500" y="700" text-anchor="end">04 — 2024</text>
        </g>
      </g>

      <g v-else data-art="atlas" fill="none" stroke="#0A0A09">
        <rect x="0.5" y="0.5" width="1599" height="759" fill="#F2F0EA" stroke="#0A0A09" stroke-opacity="0.08" />
        <ellipse cx="800" cy="390" rx="520" ry="280" fill="url(#wide-atlas-soft)" stroke="none" />
        <g stroke-opacity="0.22" stroke-width="1.3">
          <path d="M-80 250C160 220 300 300 500 280S900 230 1100 270S1420 310 1680 270" />
          <path d="M-80 300C180 260 320 350 520 330S920 270 1120 320S1440 360 1680 320" />
          <path d="M-80 350C180 310 330 400 540 380S940 320 1140 370S1460 410 1680 370" />
          <path d="M-80 400C200 350 360 450 580 420S960 370 1160 420S1480 460 1680 420" />
          <path d="M-80 450C180 410 340 500 560 470S960 420 1160 470S1480 510 1680 470" />
          <path d="M-80 500C180 460 340 550 560 520S960 470 1160 520S1480 560 1680 520" />
          <path d="M-80 550C180 510 340 600 560 570S960 520 1160 570S1480 610 1680 570" />
          <path d="M-80 600C180 560 360 640 580 610S960 560 1160 610S1480 650 1680 610" />
        </g>
        <g stroke-opacity="0.46" stroke-width="1.6">
          <path d="M180 430C300 370 420 490 560 450S780 380 920 440" />
          <path d="M220 490C340 440 440 550 600 510S820 450 960 500" />
        </g>
        <g stroke-opacity="0.14" stroke-width="1">
          <ellipse cx="800" cy="390" rx="250" ry="100" />
          <ellipse cx="800" cy="390" rx="340" ry="140" />
          <ellipse cx="800" cy="390" rx="430" ry="180" />
        </g>
        <g stroke-opacity="0.2">
          <path d="M80 250V560M1520 250V560" />
          <path d="M40 400H120M1480 400H1560" />
        </g>
        <g
          fill="#0A0A09"
          fill-opacity="0.42"
          font-family="'IBM Plex Mono', monospace"
          font-size="16"
          letter-spacing="4"
          stroke="none"
        >
          <text x="100" y="120">ATLAS — DENSITY</text>
          <text x="1500" y="700" text-anchor="end">05 — 2024</text>
        </g>
      </g>
    </svg>

    <svg
      data-orientation="portrait"
      viewBox="0 0 800 1000"
      preserveAspectRatio="xMidYMid meet"
      class="h-full w-full lg:hidden"
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
        <rect
          x="0.5"
          y="0.5"
          width="799"
          height="999"
          fill="#F2F0EA"
          stroke="#0A0A09"
          stroke-opacity="0.08"
        />
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
        <rect
          x="0.5"
          y="0.5"
          width="799"
          height="999"
          fill="#F2F0EA"
          stroke="#0A0A09"
          stroke-opacity="0.08"
        />
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
        <rect
          x="0.5"
          y="0.5"
          width="799"
          height="999"
          fill="#F2F0EA"
          stroke="#0A0A09"
          stroke-opacity="0.08"
        />
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
        <rect
          x="0.5"
          y="0.5"
          width="799"
          height="999"
          fill="#F2F0EA"
          stroke="#0A0A09"
          stroke-opacity="0.08"
        />
        <g stroke="#0A0A09" stroke-opacity="0.08">
          <path
            d="M100 0V1000M200 0V1000M300 0V1000M400 0V1000M500 0V1000M600 0V1000M700 0V1000"
          />
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
        <rect
          x="0.5"
          y="0.5"
          width="799"
          height="999"
          fill="#F2F0EA"
          stroke="#0A0A09"
          stroke-opacity="0.08"
        />
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
