<script setup lang="ts">
import { computed } from 'vue'
import { usePreferredReducedMotion } from '@vueuse/core'
import GlowingEffect from '@/components/inspira/glowing-effect/GlowingEffect.vue'
import type { Work } from '@/data/site'
import ProjectArt from './ProjectArt.vue'

const props = defineProps<{ work: Work }>()

const reduced = usePreferredReducedMotion()
const glowDisabled = computed(() => reduced.value === 'reduce')
</script>

<template>
  <article class="group relative h-full min-h-0">
    <a
      href="#"
      class="flex h-full min-h-0 flex-col border border-line-light p-2 transition-colors duration-500 hover:border-ink/30"
      :aria-label="`查看 ${work.titleEn} 项目（演示占位）`"
      @click.prevent
    >
      <div class="relative min-h-0 flex-1 overflow-hidden">
        <div
          class="absolute inset-0 transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
        >
          <ProjectArt :variant="work.art" :label="work.coverAlt" />
        </div>
        <GlowingEffect
          :disabled="glowDisabled"
          :proximity="64"
          :spread="40"
          :glow="true"
          variant="default"
        />
        <span
          class="absolute right-4 bottom-4 font-mono text-[10px] tracking-[0.18em] text-ink/70 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 motion-reduce:opacity-100"
          aria-hidden="true"
        >
          VIEW CASE ↗
        </span>
      </div>

      <div class="shrink-0 px-1 pt-4 pb-1">
        <div class="flex items-start justify-between gap-6 border-t border-line-light pt-3">
          <div>
            <p class="font-mono text-[10px] tracking-[0.18em] text-ink/40">{{ work.index }}</p>
            <h3 class="mt-1 text-[clamp(1.05rem,1.8vw,1.45rem)] font-medium tracking-[-0.02em]">
              {{ work.titleEn }}
            </h3>
            <p class="mt-0.5 text-[13px] text-ink/55">{{ work.titleZh }}</p>
          </div>
          <div
            class="shrink-0 text-right font-mono text-[10px] leading-5 uppercase tracking-[0.14em] text-ink/45"
          >
            <p>{{ work.discipline }}</p>
            <p>{{ work.year }}</p>
          </div>
        </div>
        <p class="mt-2 text-[13px] leading-5 text-ink/55">{{ work.summary }}</p>
      </div>
    </a>
  </article>
</template>
