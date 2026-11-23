<script setup lang="ts">
import TextScrollReveal from '@/components/inspira/text-scroll-reveal/TextScrollReveal.vue'
import { manifesto, sectionLabels } from '@/data/site'
import SectionLabel from './SectionLabel.vue'
</script>

<template>
  <section id="about" aria-labelledby="about-title" class="theme-paper relative border-b border-line-light">
    <div class="shell pt-[clamp(5rem,10vw,9rem)]">
      <SectionLabel id="about-title" v-bind="sectionLabels.about" class="text-ink/55" />
    </div>

    <p class="sr-only">{{ manifesto.text }}</p>
    <TextScrollReveal
      aria-hidden="true"
      :text="manifesto.text"
      :tokens="manifesto.tokens"
      class="h-[140vh]"
      text-class="text-[clamp(2.5rem,7vw,6.5rem)] font-light leading-[1.12] tracking-[-0.02em]"
    />

    <div
      class="shell grid gap-10 pb-[clamp(6rem,12vw,11rem)] md:grid-cols-12"
    >
      <div class="space-y-6 md:col-span-4">
        <p
          v-for="paragraph in manifesto.paragraphs"
          :key="paragraph"
          class="text-[15px] leading-[1.8] text-ink/65"
        >
          {{ paragraph }}
        </p>
      </div>
      <p
        class="font-serif text-[clamp(1.35rem,2.2vw,1.75rem)] leading-[1.4] text-ink/80 md:col-span-4 md:col-start-9"
      >
        {{ manifesto.en }}
      </p>
    </div>
  </section>
</template>
