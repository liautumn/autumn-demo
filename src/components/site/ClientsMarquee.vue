<script setup lang="ts">
import Marquee from '@/components/inspira/marquee/Marquee.vue'
import { clients } from '@/data/site'

const reversed = [...clients].reverse()
const rotated = [...clients.slice(4), ...clients.slice(0, 4)]
</script>

<template>
  <section
    aria-label="合作客户"
    data-page-anchor="clients"
    class="page-slide theme-paper border-b border-line-light"
  >
    <h2 class="sr-only">合作客户</h2>
    <span data-clients-sr class="sr-only">{{ clients.join('、') }}</span>

    <div class="flex h-full flex-col pt-24 pb-6 md:pb-8">
      <div class="shell flex items-baseline justify-between gap-6">
        <span class="font-mono text-[10px] tracking-[0.18em] text-ink/45">
          CLIENTS / 合作客户
        </span>
        <span class="font-mono text-[10px] tracking-[0.18em] text-ink/40">2019—2026</span>
      </div>

      <div class="flex min-h-0 flex-1 flex-col justify-center">
        <Marquee
          data-clients-marquee
          aria-hidden="true"
          :repeat="2"
          pause-on-hover
          class="border-y border-line-light py-[clamp(0.5rem,2dvh,1.25rem)] [--duration:55s] [--gap:2rem]"
        >
          <template v-for="client in clients" :key="client">
            <span
              class="whitespace-nowrap font-mono text-[clamp(1.5rem,min(5.5vw,9dvh),5rem)] tracking-[0.08em] text-ink/65"
            >
              {{ client }}
            </span>
            <span
              class="font-mono text-[clamp(1.5rem,min(5.5vw,9dvh),5rem)] text-ink/20"
            >·</span>
          </template>
        </Marquee>

        <Marquee
          aria-hidden="true"
          :repeat="2"
          reverse
          pause-on-hover
          class="border-b border-line-light py-[clamp(0.5rem,2dvh,1.25rem)] [--duration:70s] [--gap:2rem]"
        >
          <template v-for="client in reversed" :key="client">
            <span
              class="whitespace-nowrap font-mono text-[clamp(1.5rem,min(5.5vw,9dvh),5rem)] tracking-[0.08em] text-ink/40"
            >
              {{ client }}
            </span>
            <span
              class="font-mono text-[clamp(1.5rem,min(5.5vw,9dvh),5rem)] text-ink/15"
            >·</span>
          </template>
        </Marquee>

        <Marquee
          aria-hidden="true"
          :repeat="2"
          pause-on-hover
          class="border-b border-line-light py-[clamp(0.5rem,2dvh,1.25rem)] [--duration:85s] [--gap:2rem]"
        >
          <template v-for="client in rotated" :key="client">
            <span
              class="whitespace-nowrap font-mono text-[clamp(1.5rem,min(5.5vw,9dvh),5rem)] tracking-[0.08em] text-ink/20"
            >
              {{ client }}
            </span>
            <span
              class="font-mono text-[clamp(1.5rem,min(5.5vw,9dvh),5rem)] text-ink/10"
            >·</span>
          </template>
        </Marquee>
      </div>

      <div
        class="shell flex shrink-0 items-end justify-between gap-8 border-t border-line-light pt-5"
      >
        <p class="max-w-md text-[clamp(0.88rem,1.5vw,1.05rem)] leading-7 text-ink/55">
          我们与相信长期主义的团队并肩工作，从第一次对话到最终上线。
        </p>
        <span class="hidden font-mono text-[10px] tracking-[0.18em] text-ink/40 sm:block">
          LONG-TERM PARTNERSHIPS
        </span>
      </div>
    </div>
  </section>
</template>
