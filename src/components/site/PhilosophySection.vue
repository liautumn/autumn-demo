<script setup lang="ts">
import Marquee from '@/components/inspira/marquee/Marquee.vue'
import { philosophy, sectionLabels } from '@/data/site'
import SectionLabel from './SectionLabel.vue'
</script>

<template>
  <section
    id="philosophy"
    aria-labelledby="philosophy-title"
    data-page-anchor="philosophy"
    class="page-slide theme-paper border-b border-line-light"
  >
    <div class="shell flex h-full flex-col pt-24 pb-6 md:pb-8">
      <SectionLabel
        id="philosophy-title"
        v-bind="sectionLabels.philosophy"
        class="text-ink/55"
      />
      <h2 class="sr-only">{{ philosophy.text }}</h2>

      <div class="flex min-h-0 flex-1 flex-col justify-center">
        <Marquee
          data-philosophy-marquee
          aria-hidden="true"
          :repeat="3"
          pause-on-hover
          class="[--duration:70s] [--gap:3rem]"
        >
          <span
            class="text-outline whitespace-nowrap font-sans text-[clamp(2.75rem,min(11vw,15dvh),11rem)] leading-none tracking-[-0.03em]"
          >
            {{ philosophy.text }}
          </span>
        </Marquee>
      </div>

      <p
        class="mx-auto max-w-xl shrink-0 border-t border-line-light pt-5 text-center text-[clamp(0.9rem,1.25vw,1rem)] leading-7 text-ink/60"
      >
        {{ philosophy.note }}
      </p>
    </div>
  </section>
</template>
