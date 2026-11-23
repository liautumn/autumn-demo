<script setup lang="ts">
import { computed } from 'vue'
import { usePreferredReducedMotion } from '@vueuse/core'
import { supportsHtmlInCanvas } from '@/components/inspira/html-in-canvas'
import HtmlLiquid from '@/components/inspira/html-liquid/HtmlLiquid.vue'
import { cn } from '@/lib/utils'

const props = defineProps<{ class?: string; id?: string; reveal?: boolean }>()

const reduced = usePreferredReducedMotion()
const nativeSupported = supportsHtmlInCanvas()
const active = computed(() => nativeSupported && reduced.value !== 'reduce')
</script>

<template>
  <div
    v-if="active"
    :id="props.id"
    :class="cn('relative', props.class, props.reveal && 'liquid-enter')"
    data-liquid-type
  >
    <div aria-hidden="true" class="invisible" data-liquid-measure>
      <slot />
    </div>

    <div class="absolute inset-0" data-liquid-surface>
      <HtmlLiquid
        :strength="0.03"
        :frequency="12"
        :speed="1.8"
        :mouse-damping="0.9"
        :pixel-ratio="2"
      >
        <slot />
      </HtmlLiquid>
    </div>
  </div>

  <div
    v-else
    :id="props.id"
    :class="cn(props.class, props.reveal && 'liquid-enter')"
    data-liquid-type="static"
  >
    <slot />
  </div>
</template>

<style scoped>
.liquid-enter {
  animation: liquid-enter 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes liquid-enter {
  from {
    opacity: 0;
    transform: translateY(24px);
  }

  to {
    opacity: 1;
    transform: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .liquid-enter {
    animation: none;
  }
}
</style>
