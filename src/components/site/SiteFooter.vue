<script setup lang="ts">
import { footer, navLinks, studio } from '@/data/site'
</script>

<template>
  <footer class="theme-ink border-t border-line-dark pt-[clamp(4rem,8vw,7rem)]">
    <div class="shell">
      <div class="overflow-hidden" aria-hidden="true">
        <p
          class="whitespace-nowrap text-[clamp(4rem,18vw,16rem)] leading-[0.75] font-medium tracking-[-0.05em] text-paper/15"
        >
          {{ studio.name }}
        </p>
      </div>

      <div class="mt-16 grid gap-10 border-t border-line-dark pt-10 pb-16 sm:grid-cols-3">
        <nav aria-label="页脚导航">
          <p class="font-mono text-[10px] tracking-[0.18em] text-paper/35">SITEMAP</p>
          <ul class="mt-5 space-y-3">
            <li v-for="link in navLinks" :key="link.href">
              <a
                :href="link.href"
                class="inline-flex min-h-11 items-center text-[15px] text-paper/70 transition-colors hover:text-paper"
              >
                {{ link.label }}
              </a>
            </li>
          </ul>
        </nav>

        <div>
          <p class="font-mono text-[10px] tracking-[0.18em] text-paper/35">SOCIAL</p>
          <ul class="mt-5 space-y-3">
            <li v-for="social in footer.socials" :key="social" class="text-[15px] text-paper/55">
              {{ social }}
            </li>
          </ul>
        </div>

        <div>
          <p class="font-mono text-[10px] tracking-[0.18em] text-paper/35">CONTACT</p>
          <ul class="mt-5 space-y-3">
            <li>
              <a
                :href="`mailto:${studio.email}`"
                class="inline-flex min-h-11 items-center text-[15px] text-paper/70 transition-colors hover:text-paper"
              >
                {{ studio.email }}
              </a>
            </li>
            <li class="font-mono text-[11px] tracking-[0.16em] text-paper/40">{{ studio.city }}</li>
            <li class="font-mono text-[11px] tracking-[0.16em] text-paper/40">{{ studio.coords }}</li>
          </ul>
        </div>
      </div>

      <div
        class="flex flex-col gap-4 border-t border-line-dark py-6 font-mono text-[10px] tracking-[0.16em] text-paper/40 sm:flex-row sm:items-center sm:justify-between"
      >
        <span>{{ footer.copyright }}</span>
        <span class="text-paper/30">{{ footer.motto }}</span>
        <a href="#hero" class="inline-flex min-h-11 items-center transition-colors hover:text-paper">返回顶部 ↑</a>
      </div>
    </div>
  </footer>
</template>
