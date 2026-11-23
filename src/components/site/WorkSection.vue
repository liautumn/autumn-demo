<script setup lang="ts">
import { sectionLabels, works } from '@/data/site'
import SectionLabel from './SectionLabel.vue'
import WorkCard from './WorkCard.vue'

const total = String(works.length).padStart(2, '0')
</script>

<template>
  <section
    v-for="(work, index) in works"
    :id="index === 0 ? 'work' : undefined"
    :key="work.id"
    :aria-labelledby="index === 0 ? 'work-title' : undefined"
    :aria-label="index === 0 ? undefined : `作品 ${work.index}：${work.titleEn}`"
    :data-page-anchor="`work-${index + 1}`"
    class="page-slide theme-paper border-b border-line-light"
  >
    <div class="shell flex h-full flex-col pt-24 pb-6 md:pb-8">
      <div
        class="flex shrink-0 items-baseline justify-between gap-6 border-b border-line-light pb-4"
      >
        <SectionLabel
          v-if="index === 0"
          id="work-title"
          v-bind="sectionLabels.work"
          class="text-ink/55"
        />
        <span v-else class="font-mono text-[10px] tracking-[0.18em] text-ink/45">
          SELECTED WORK
        </span>
        <span class="font-mono text-[10px] tracking-[0.18em] text-ink/40">
          {{ index === 0 ? '2023—2026' : `${work.index} / ${total}` }}
        </span>
      </div>

      <div class="mt-5 min-h-0 flex-1 md:mt-6">
        <WorkCard :work="work" />
      </div>
    </div>
  </section>
</template>
