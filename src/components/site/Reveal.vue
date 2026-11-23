<script setup lang="ts">
import { computed, type Component } from 'vue'
import { Motion } from 'motion-v'
import { usePreferredReducedMotion } from '@vueuse/core'

// motion-v's generic component typing does not resolve under vue-tsc + TS 6;
// runtime props are unchanged.
const MotionAny = Motion as unknown as Component

const props = withDefaults(defineProps<{ delay?: number; as?: string; class?: string }>(), {
  delay: 0,
  as: 'div',
})
const reduced = usePreferredReducedMotion()
const isReduced = computed(() => reduced.value === 'reduce')
</script>

<template>
  <MotionAny
    v-if="!isReduced"
    :as="props.as"
    :class="props.class"
    :initial="{ opacity: 0, y: 24 }"
    :while-in-view="{ opacity: 1, y: 0 }"
    :in-view-options="{ once: true, amount: 0.15 }"
    :transition="{ duration: 0.7, delay: props.delay, ease: [0.16, 1, 0.3, 1] }"
  >
    <slot />
  </MotionAny>
  <component :is="props.as" v-else :class="props.class">
    <slot />
  </component>
</template>
