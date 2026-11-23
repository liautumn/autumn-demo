<script setup lang="ts">
import { RouterView } from 'vue-router'
import NoiseOverlay from './components/site/NoiseOverlay.vue'
import SiteFooter from './components/site/SiteFooter.vue'
import SiteNav from './components/site/SiteNav.vue'
</script>

<template>
  <a
    href="#main"
    class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[70] focus:bg-paper focus:px-4 focus:py-2 focus:font-mono focus:text-[11px] focus:tracking-[0.18em] focus:text-ink focus-visible:outline-paper"
  >
    跳到主内容
  </a>
  <NoiseOverlay />
  <SiteNav />
  <RouterView />
  <SiteFooter />
</template>
