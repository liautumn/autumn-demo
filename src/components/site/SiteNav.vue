<script setup lang="ts">
import { computed } from 'vue'
import { useIntervalFn, useNow, useWindowScroll } from '@vueuse/core'
import { navLinks, studio } from '@/data/site'
import { formatShanghaiTime } from '@/lib/time'

const { y } = useWindowScroll()
const scrolled = computed(() => y.value > 24)

const now = useNow({ scheduler: (cb) => useIntervalFn(cb, 1000) })
const time = computed(() => formatShanghaiTime(new Date(now.value)))
</script>

<template>
  <header
    class="fixed inset-x-0 top-0 z-50 mix-blend-difference text-paper"
    :data-scrolled="scrolled"
    :class="scrolled ? 'border-b border-paper/20 backdrop-blur-[2px]' : 'border-b border-transparent'"
  >
    <div
      class="shell flex items-center justify-between py-5"
    >
      <a
        href="#hero"
        class="inline-flex min-h-11 items-center font-mono text-[13px] tracking-[0.18em]"
        aria-label="MONOLITH 首页"
      >
        {{ studio.name }}<span class="align-super text-[8px] tracking-normal">®</span>
      </a>

      <nav aria-label="主导航" class="hidden items-center gap-10 md:flex">
        <a
          v-for="link in navLinks"
          :key="link.href"
          :href="link.href"
          class="inline-flex min-h-11 items-center font-mono text-[11px] uppercase tracking-[0.18em] transition-opacity duration-300 hover:opacity-60"
        >
          {{ link.label }}
        </a>
      </nav>

      <div class="flex items-center gap-6">
        <time
          class="hidden font-mono text-[11px] tracking-[0.18em] text-paper/70 md:block"
          aria-label="上海时间"
        >
          SHANGHAI {{ time }}
        </time>
        <a
          :href="`mailto:${studio.email}`"
          class="inline-flex min-h-11 items-center font-mono text-[11px] uppercase tracking-[0.18em] underline decoration-paper/30 underline-offset-4 transition-colors hover:decoration-paper focus-visible:outline-paper"
        >
          开始项目 ↗
        </a>
      </div>
    </div>
  </header>
</template>
