<script setup lang="ts">
import { capabilities, sectionLabels } from '@/data/site'
import SectionLabel from './SectionLabel.vue'
</script>

<template>
  <section
    id="capabilities"
    aria-labelledby="capabilities-title"
    class="theme-ink border-b border-line-dark py-[clamp(6rem,12vw,11rem)]"
  >
    <div class="shell">
      <SectionLabel id="capabilities-title" v-bind="sectionLabels.capabilities" class="text-paper/50" />

      <div class="mt-14 grid gap-16 md:grid-cols-12">
        <div class="md:col-span-5">
          <div class="md:sticky md:top-28">
            <p
              class="text-[clamp(2.5rem,5vw,5rem)] leading-[0.95] font-medium tracking-[-0.04em]"
            >
              WHAT<br />WE DO
            </p>
            <p class="mt-6 text-[15px] tracking-[0.08em] text-paper/50">我们能做什么</p>
          </div>
        </div>

        <ul class="md:col-span-6 md:col-start-7">
          <li v-for="capability in capabilities" :key="capability.index">
            <a
              href="#"
              class="group flex min-h-24 items-center gap-6 border-t border-line-dark py-8 transition-colors duration-500 hover:bg-paper/5"
              @click.prevent
            >
              <span class="w-8 shrink-0 font-mono text-[10px] tracking-[0.18em] text-paper/40">
                {{ capability.index }}
              </span>
              <span class="flex-1">
                <span class="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <span class="text-[clamp(1.4rem,2.4vw,1.9rem)] font-medium tracking-[-0.02em]">
                    {{ capability.titleZh }}
                  </span>
                  <span class="font-serif text-[clamp(1.1rem,1.8vw,1.35rem)] italic text-paper/55">
                    {{ capability.titleEn }}
                  </span>
                </span>
                <span class="mt-2 block text-[13px] leading-6 text-paper/50">
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
