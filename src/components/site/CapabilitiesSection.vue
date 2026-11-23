<script setup lang="ts">
import { capabilities, sectionLabels } from '@/data/site'
import SectionLabel from './SectionLabel.vue'
</script>

<template>
  <section
    id="capabilities"
    aria-labelledby="capabilities-title"
    data-page-anchor="capabilities"
    class="page-slide theme-ink border-b border-line-dark"
  >
    <div class="shell flex h-full flex-col pt-24 pb-6 md:pb-8">
      <SectionLabel
        id="capabilities-title"
        v-bind="sectionLabels.capabilities"
        class="text-paper/50"
      />

      <div
        class="mt-4 flex min-h-0 flex-1 flex-col gap-4 md:mt-6 md:grid md:grid-cols-12 md:gap-12"
      >
        <div class="flex shrink-0 flex-col justify-center md:col-span-5">
          <p
            class="text-[clamp(2.25rem,min(5vw,8dvh),5rem)] leading-[0.95] font-medium tracking-[-0.04em]"
          >
            WHAT<br />WE DO
          </p>
          <p class="mt-3 text-[13px] tracking-[0.08em] text-paper/50">我们能做什么</p>
        </div>

        <ul
          class="flex min-h-0 flex-1 flex-col justify-center md:col-span-6 md:col-start-7"
        >
          <li
            v-for="capability in capabilities"
            :key="capability.index"
            class="flex min-h-0 flex-1 flex-col"
          >
            <a
              href="#"
              class="group flex h-full min-h-[clamp(3.75rem,8dvh,6.5rem)] items-center gap-4 border-t border-line-dark py-[clamp(0.5rem,1.5dvh,1.25rem)] transition-colors duration-500 hover:bg-paper/5 md:gap-6"
              @click.prevent
            >
              <span
                class="w-8 shrink-0 font-mono text-[10px] tracking-[0.18em] text-paper/40"
              >
                {{ capability.index }}
              </span>
              <span class="flex-1">
                <span class="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <span
                    class="text-[clamp(1.25rem,2.4vw,1.9rem)] font-medium tracking-[-0.02em]"
                  >
                    {{ capability.titleZh }}
                  </span>
                  <span
                    class="font-serif text-[clamp(1rem,1.8vw,1.35rem)] italic text-paper/55"
                  >
                    {{ capability.titleEn }}
                  </span>
                </span>
                <span
                  class="mt-1.5 block text-[clamp(0.78rem,1vw,0.82rem)] leading-5 text-paper/50"
                >
                  {{ capability.description }}
                </span>
              </span>
              <span
                class="shrink-0 translate-x-[-6px] font-mono text-sm text-paper/0 transition-all duration-500 group-hover:translate-x-0 group-hover:text-paper/70 motion-reduce:translate-x-0 motion-reduce:text-paper/40"
                aria-hidden="true"
              >
                ↗
              </span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>
