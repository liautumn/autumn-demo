<script setup lang="ts">
import Marquee from '@/components/inspira/marquee/Marquee.vue'
import { clients } from '@/data/site'
</script>

<template>
  <section aria-label="合作客户" class="theme-paper border-b border-line-light">
    <h2 class="sr-only">合作客户</h2>
    <span data-clients-sr class="sr-only">{{ clients.join('、') }}</span>

    <Marquee
      data-clients-marquee
      aria-hidden="true"
      :repeat="3"
      pause-on-hover
      class="[--duration:45s] [--gap:2.5rem] py-6"
    >
      <template v-for="client in clients" :key="client">
        <span class="font-mono text-[clamp(1.25rem,2.5vw,2rem)] tracking-[0.12em] text-ink/50">
          {{ client }}
        </span>
        <span class="font-mono text-[clamp(1.25rem,2.5vw,2rem)] text-ink/25">·</span>
      </template>
    </Marquee>
  </section>
</template>
