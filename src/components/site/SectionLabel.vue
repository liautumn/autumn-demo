<script setup lang="ts">
import { cn } from '@/lib/utils'

const props = defineProps<{
  index: string
  label: string
  id?: string
  class?: string
}>()
</script>

<template>
  <h2 :id="props.id" :class="cn('font-mono text-[11px] uppercase tracking-[0.18em]', props.class)">
    {{ index }} / {{ label }}
  </h2>
</template>
