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
    data-page-anchor="contact"
    class="page-slide theme-paper"
  >
    <div class="shell flex h-full flex-col pt-24 pb-6 md:pb-8">
      <SectionLabel
        id="contact-title"
        v-bind="sectionLabels.contact"
        class="text-ink/55"
      />

      <div class="flex min-h-0 flex-1 items-center py-[clamp(1rem,3dvh,2rem)]">
        <LiquidType class="w-full">
          <p
            v-for="(line, i) in contact.lines"
            :key="line"
            class="text-[clamp(2.75rem,min(10vw,14dvh),10rem)] leading-[0.9] tracking-[-0.04em]"
            :class="
              i === contact.lines.length - 1
                ? 'font-serif font-normal italic'
                : 'font-medium'
            "
          >
            {{ line }}
          </p>
        </LiquidType>
      </div>

      <div
        class="flex shrink-0 flex-col gap-5 border-t border-line-light pt-5 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <a
            :href="`mailto:${studio.email}`"
            class="inline-flex min-h-11 items-center border-b border-ink/25 pb-1 font-mono text-[clamp(1.05rem,2.2vw,1.6rem)] tracking-[-0.01em] transition-colors hover:border-ink"
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
          <p class="mt-3 font-mono text-[10px] tracking-[0.18em] text-ink/45">
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
      class="pointer-events-none absolute right-6 bottom-24 hidden md:block"
      aria-hidden="true"
    >
      <SpinningText
        :text="contact.badge"
        :duration="14"
        :radius="12"
        class="h-36 w-36 text-[10px] tracking-[0.18em]"
      />
    </div>
  </section>
</template>
