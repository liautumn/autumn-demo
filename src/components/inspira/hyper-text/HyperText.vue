<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";
import { useIntervalFn } from "@vueuse/core";
import { Motion } from "motion-v";
import { computed, ref, watch, type Component } from "vue";

// motion-v's generic component typing does not resolve under vue-tsc + TS 6.
const MotionAny = Motion as unknown as Component;

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes["class"];
    text: string;
    duration?: number;
    animateOnLoad?: boolean;
    alphabet?: string;
    disabled?: boolean;
  }>(),
  {
    duration: 800,
    animateOnLoad: false,
    alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    disabled: false,
  },
);

const displayText = ref(props.text.split(""));
const iterations = ref(0);

function getRandomLetter() {
  return props.alphabet[Math.floor(Math.random() * props.alphabet.length)] ?? "";
}
function triggerAnimation() {
  if (props.disabled) return;
  iterations.value = 0;
  startAnimation();
}

const { pause, resume } = useIntervalFn(
  () => {
    if (iterations.value < props.text.length) {
      displayText.value = displayText.value.map((l, i) =>
        l === " " ? l : i <= iterations.value ? (props.text[i] ?? l) : getRandomLetter(),
      );
      iterations.value += 0.1;
    } else {
      pause();
    }
  },
  computed(() => props.duration / (props.text.length * 10)),
);

function startAnimation() {
  pause();
  resume();
}

watch(
  () => props.text,
  (newText) => {
    displayText.value = newText.split("");
    triggerAnimation();
  },
);

if (props.animateOnLoad) {
  triggerAnimation();
}
</script>

<template>
  <div
    :class="cn(`flex scale-100 cursor-default overflow-hidden py-2`, $props.class)"
    @mouseenter="triggerAnimation"
  >
    <div class="flex">
      <MotionAny
        v-for="(letter, i) in displayText"
        :key="i"
        as="span"
        :initial="{ opacity: 0, y: -10 }"
        :animate="{ opacity: 1, y: 0 }"
        :delay="i * (duration / (text.length * 10))"
        :class="cn(`inline-block font-mono`, letter === ' ' ? 'w-3' : '', $props.class)"
      >
        {{ letter }}
      </MotionAny>
    </div>
  </div>
</template>
