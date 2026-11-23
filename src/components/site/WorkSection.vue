<script setup lang="ts">
import { sectionLabels, works } from '@/data/site'
import SectionLabel from './SectionLabel.vue'
import WorkCard from './WorkCard.vue'

const spans: Record<string, string> = {
  'blank-furniture': 'lg:col-span-7',
  'north-34': 'lg:col-span-4 lg:col-start-9 lg:mt-24',
  handle: 'lg:col-span-5',
  'slow-press': 'lg:col-span-6 lg:col-start-7',
  atlas: 'lg:col-span-12',
}

function spanFor(id: string): string {
  return spans[id] ?? 'lg:col-span-6'
}
</script>

<template>
  <section
    id="work"
    aria-labelledby="work-title"
    class="theme-paper border-b border-line-light py-[clamp(6rem,12vw,11rem)]"
  >
    <div class="shell">
      <div class="flex items-baseline justify-between gap-6 border-b border-line-light pb-5">
        <SectionLabel id="work-title" v-bind="sectionLabels.work" class="text-ink/55" />
        <span class="font-mono text-[10px] tracking-[0.18em] text-ink/40">2023—2026</span>
      </div>

      <div class="mt-12 grid gap-x-8 gap-y-16 lg:grid-cols-12">
        <div v-for="work in works" :key="work.id" :class="spanFor(work.id)">
          <WorkCard :work="work" />
        </div>
      </div>
    </div>
  </section>
</template>
