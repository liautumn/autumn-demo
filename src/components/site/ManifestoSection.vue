<script setup lang="ts">
import { manifesto, sectionLabels } from '@/data/site'
import SectionLabel from './SectionLabel.vue'
</script>

<template>
  <section
    id="about"
    aria-labelledby="about-title"
    data-page-anchor="about"
    class="page-slide theme-paper border-b border-line-light"
  >
    <div class="shell flex h-full flex-col pt-24 pb-6 md:pb-8">
      <SectionLabel id="about-title" v-bind="sectionLabels.about" class="text-ink/55" />

      <p class="sr-only">{{ manifesto.text }}</p>

      <div class="flex min-h-0 flex-1 items-center py-[clamp(1rem,4dvh,3rem)]">
        <p
          aria-hidden="true"
          class="text-[clamp(2.5rem,min(7vw,12dvh),7rem)] leading-[1.04] font-medium tracking-[-0.035em]"
        >
          <span
            v-for="(token, index) in manifesto.tokens"
            :key="token"
            data-reveal-token
            class="block"
            :class="index === 2 ? 'font-serif font-normal italic' : ''"
          >
            {{ token }}
          </span>
        </p>
      </div>

      <div
        class="grid shrink-0 gap-6 border-t border-line-light pt-6 md:grid-cols-12 md:items-end md:gap-8"
      >
        <div class="space-y-3 md:col-span-5">
          <p
            v-for="paragraph in manifesto.paragraphs"
            :key="paragraph"
            class="text-[clamp(0.82rem,1.15vw,0.95rem)] leading-6 text-ink/60"
          >
            {{ paragraph }}
          </p>
        </div>
        <p
          class="font-serif text-[clamp(1.2rem,2.2vw,1.65rem)] leading-[1.4] text-ink/80 md:col-span-5 md:col-start-8"
        >
          {{ manifesto.en }}
        </p>
      </div>
    </div>
  </section>
</template>
