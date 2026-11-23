<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import InteractiveGridPattern from '@/components/inspira/interactive-grid-pattern/InteractiveGridPattern.vue'
import ShimmerButton from '@/components/inspira/shimmer-button/ShimmerButton.vue'
import { hero, studio } from '@/data/site'
import LiquidType from './LiquidType.vue'
import Reveal from './Reveal.vue'

const heroRef = ref<HTMLElement | null>(null)
let frame = 0
let pending: { x: number; y: number } | null = null

function onPointerMove(event: PointerEvent) {
  const el = heroRef.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  pending = { x: event.clientX - rect.left, y: event.clientY - rect.top }
  if (frame) return
  frame = requestAnimationFrame(() => {
    frame = 0
    if (!pending || !heroRef.value) return
    heroRef.value.style.setProperty('--mx', `${pending.x}px`)
    heroRef.value.style.setProperty('--my', `${pending.y}px`)
  })
}

onBeforeUnmount(() => {
  if (frame) cancelAnimationFrame(frame)
})
</script>

<template>
  <section
    id="hero"
    ref="heroRef"
    aria-labelledby="hero-title"
    class="theme-ink relative flex min-h-[100svh] flex-col overflow-hidden pt-28 pb-8"
    @pointermove="onPointerMove"
  >
    <div
      class="pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_78%)]"
      aria-hidden="true"
    >
      <InteractiveGridPattern
        class="absolute inset-0"
        :width="56"
        :height="56"
        :squares="[32, 32]"
      />
    </div>
    <div
      class="hero-spotlight pointer-events-none absolute inset-0 hidden mix-blend-screen md:block motion-reduce:hidden"
      aria-hidden="true"
    />

    <div class="shell relative flex flex-1 flex-col justify-between">
      <div class="flex flex-1 flex-col justify-center py-16">
        <LiquidType id="hero-title" reveal>
          <h1
            class="text-[clamp(3.25rem,11vw,10.5rem)] leading-[0.92] font-medium tracking-[-0.04em]"
          >
            <span v-for="line in hero.lines" :key="line" class="block">
              <em
                v-if="line === 'quiet,' || line === 'digital.'"
                class="font-serif font-normal italic"
              >{{ line }}</em>
              <template v-else>{{ line }}</template>
            </span>
          </h1>
        </LiquidType>

      <div class="mt-12 flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
        <Reveal :delay="0.4" class="max-w-xl text-[15px] leading-7 text-paper/65">
          {{ hero.subtitle }}
        </Reveal>
        <Reveal :delay="0.5" class="flex flex-wrap items-center gap-8">
          <ShimmerButton
            href="#work"
            background="#F2F0EA"
            shimmer-color="#0A0A09"
            class="min-h-11 font-mono text-[11px] tracking-[0.18em] text-ink focus-visible:outline-paper"
          >
            查看作品
          </ShimmerButton>
          <a
            :href="`mailto:${studio.email}`"
            class="inline-flex min-h-11 items-center font-mono text-[11px] uppercase tracking-[0.18em] text-paper/70 underline decoration-paper/30 underline-offset-4 transition-colors hover:text-paper hover:decoration-paper"
          >
            开始一个项目 ↗
          </a>
        </Reveal>
      </div>
      </div>
    </div>

    <div
      class="shell relative flex items-center justify-between gap-6 border-t border-paper/10 pt-5 font-mono text-[10px] tracking-[0.18em] text-paper/50"
    >
      <span>SCROLL ↓</span>
      <span class="hidden sm:block">{{ studio.city }}</span>
      <span class="hidden md:block">{{ studio.coords }}</span>
    </div>
  </section>
</template>

<style scoped>
.hero-spotlight {
  background: radial-gradient(
    500px circle at var(--mx, 50%) var(--my, 40%),
    rgba(242, 240, 234, 0.07),
    transparent 70%
  );
}

@media (hover: none), (prefers-reduced-motion: reduce) {
  .hero-spotlight {
    display: none;
  }
}
</style>
