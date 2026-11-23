<script setup lang="ts">
import { computed } from 'vue'
import { usePreferredReducedMotion } from '@vueuse/core'
import HyperText from '@/components/inspira/hyper-text/HyperText.vue'
import ShimmerButton from '@/components/inspira/shimmer-button/ShimmerButton.vue'
import SpinningText from '@/components/inspira/spinning-text/SpinningText.vue'
import { contact, sectionLabels, studio } from '@/data/site'
import LiquidType from './LiquidType.vue'
import SectionLabel from './SectionLabel.vue'

const reduced = usePreferredReducedMotion()
const isReduced = computed(() => reduced.value === 'reduce')
</script>

<template>
  <section
    id="contact"
    aria-labelledby="contact-title"
    class="theme-paper relative overflow-hidden py-[clamp(6rem,12vw,11rem)]"
  >
    <div class="shell">
      <SectionLabel id="contact-title" v-bind="sectionLabels.contact" class="text-ink/55" />

      <LiquidType class="mt-16">
        <p
          v-for="(line, i) in contact.lines"
          :key="line"
          class="text-[clamp(3rem,10vw,10rem)] leading-[0.9] tracking-[-0.04em]"
          :class="
            i === contact.lines.length - 1
              ? 'font-serif font-normal italic'
              : 'font-medium'
          "
        >
          {{ line }}
        </p>
      </LiquidType>

      <div
        class="mt-16 flex flex-col gap-8 border-t border-line-light pt-8 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <a
            :href="`mailto:${studio.email}`"
            class="inline-flex min-h-11 items-center border-b border-ink/25 pb-1 font-mono text-[clamp(1.15rem,2.4vw,1.75rem)] tracking-[-0.01em] transition-colors hover:border-ink"
            :aria-label="`发送邮件至 ${studio.email}`"
          >
            <HyperText
              v-if="!isReduced"
              :text="studio.email"
              :animate-on-load="false"
              alphabet="abcdefghijklmnopqrstuvwxyz."
              class="py-0"
            />
            <template v-else>{{ studio.email }}</template>
          </a>
          <p class="mt-4 font-mono text-[10px] tracking-[0.18em] text-ink/45">
            {{ contact.availability }}
          </p>
        </div>

        <ShimmerButton
          :href="`mailto:${studio.email}`"
          background="#0A0A09"
          shimmer-color="#F2F0EA"
          class="min-h-11 font-mono text-[11px] tracking-[0.18em] text-paper focus-visible:outline-ink"
        >
          开始一个项目
        </ShimmerButton>
      </div>
    </div>

    <div
      v-if="!isReduced"
      data-spinning-badge
      class="pointer-events-none absolute right-8 bottom-12 hidden md:block"
      aria-hidden="true"
    >
      <SpinningText
        :text="contact.badge"
        :duration="14"
        :radius="12"
        class="h-40 w-40 text-[10px] tracking-[0.18em]"
      />
    </div>
  </section>
</template>
