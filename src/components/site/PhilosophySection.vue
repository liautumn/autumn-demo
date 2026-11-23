<script setup lang="ts">
import Marquee from '@/components/inspira/marquee/Marquee.vue'
import { philosophy, sectionLabels } from '@/data/site'
import SectionLabel from './SectionLabel.vue'
</script>

<template>
  <section
    id="philosophy"
    aria-labelledby="philosophy-title"
    class="theme-paper border-b border-line-light py-[clamp(6rem,12vw,11rem)]"
  >
    <div class="shell">
      <SectionLabel id="philosophy-title" v-bind="sectionLabels.philosophy" class="text-ink/55" />
      <h2 class="sr-only">{{ philosophy.text }}</h2>

      <Marquee
        data-philosophy-marquee
        aria-hidden="true"
        :repeat="3"
        pause-on-hover
        class="mt-10 [--duration:70s] [--gap:3rem]"
      >
        <span
          class="text-outline whitespace-nowrap font-sans text-[clamp(3.5rem,11vw,11rem)] leading-none tracking-[-0.03em]"
        >
          {{ philosophy.text }}
        </span>
      </Marquee>

      <p class="mx-auto mt-16 max-w-xl text-center text-[15px] leading-7 text-ink/60">
        {{ philosophy.note }}
      </p>
    </div>
  </section>
</template>
