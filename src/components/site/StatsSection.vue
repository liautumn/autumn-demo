<script setup lang="ts">
import { computed } from 'vue'
import { usePreferredReducedMotion } from '@vueuse/core'
import NumberTicker from '@/components/inspira/number-ticker/NumberTicker.vue'
import { stats } from '@/data/site'

const reduced = usePreferredReducedMotion()
const isReduced = computed(() => reduced.value === 'reduce')
</script>

<template>
  <section
    id="stats"
    aria-labelledby="stats-title"
    data-page-anchor="stats"
    class="page-slide theme-ink border-b border-line-dark"
  >
    <div class="shell flex h-full flex-col pt-24 pb-6 md:pb-8">
      <h2 id="stats-title" class="sr-only">工作室数字</h2>

      <div
        class="flex shrink-0 items-baseline justify-between gap-6 border-b border-line-dark pb-4 font-mono text-[10px] tracking-[0.18em] text-paper/45"
      >
        <span>STUDIO IN NUMBERS / 数字</span>
        <span>2019—2026</span>
      </div>

      <dl
        class="grid min-h-0 flex-1 grid-cols-2 content-center gap-x-8 gap-y-[clamp(1.25rem,4dvh,3.5rem)] md:grid-cols-4"
      >
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="flex flex-col border-t border-line-dark pt-4 md:pt-6"
        >
          <dt
            class="order-2 mt-3 font-mono text-[10px] tracking-[0.18em] text-paper/45 md:mt-4"
          >
            {{ stat.label }}
          </dt>
          <dd
            class="order-1 text-[clamp(2.75rem,min(7vw,14dvh),7.5rem)] leading-none font-light tabular-nums tracking-[-0.03em]"
          >
            <template v-if="isReduced">
              <span v-if="stat.pad">0</span>{{ stat.value }}
            </template>
            <template v-else>
              <span v-if="stat.pad">0</span>
              <NumberTicker :value="stat.value" :duration="1600" :decimal-places="0" />
            </template>
          </dd>
        </div>
      </dl>
    </div>
  </section>
</template>
