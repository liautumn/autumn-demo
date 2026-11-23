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
    class="theme-ink border-b border-line-dark py-[clamp(5rem,10vw,9rem)]"
  >
    <div class="shell">
      <h2 id="stats-title" class="sr-only">工作室数字</h2>

      <dl class="grid grid-cols-2 gap-x-8 gap-y-12 md:grid-cols-4">
        <div v-for="stat in stats" :key="stat.label" class="flex flex-col border-t border-line-dark pt-6">
          <dt class="order-2 mt-4 font-mono text-[10px] tracking-[0.18em] text-paper/45">
            {{ stat.label }}
          </dt>
          <dd class="order-1 text-[clamp(3rem,6vw,5.5rem)] leading-none font-light tabular-nums tracking-[-0.03em]">
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
