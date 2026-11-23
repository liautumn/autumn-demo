<script lang="ts" setup>
import { cn } from "@/lib/utils";
import { splitRevealTokens } from "@/lib/text";
import { revealProgress } from "@/lib/reveal";
import { computed, onMounted, onUnmounted, ref } from "vue";
import ScrollWord from "./ScrollWord.vue";

interface Props {
  class?: string;
  text: string;
  tokens?: string[];
  textClass?: string;
}

// Props
const props = defineProps<Props>();

const textScrollRevealRef = ref<HTMLElement | null>(null);
const stickyRef = ref<HTMLElement | null>(null);

const words = computed(() => splitRevealTokens(props.text, props.tokens));

const scrollYProgress = ref(0);

function updateScrollYProgress() {
  if (textScrollRevealRef.value) {
    const boundingRect = textScrollRevealRef.value.getBoundingClientRect();
    const stickyHeight = stickyRef.value?.offsetHeight ?? boundingRect.height / 2;

    scrollYProgress.value = revealProgress(
      boundingRect.top,
      boundingRect.height,
      stickyHeight,
    );
  }
}

onMounted(() => {
  window.addEventListener("scroll", updateScrollYProgress);
  window.addEventListener("resize", updateScrollYProgress);
  updateScrollYProgress();
});

onUnmounted(() => {
  window.removeEventListener("scroll", updateScrollYProgress);
  window.removeEventListener("resize", updateScrollYProgress);
});
</script>

<template>
  <div
    ref="textScrollRevealRef"
    :class="cn(`relative z-0 h-[200vh]`, $props.class)"
  >
    <div ref="stickyRef" class="sticky top-0 mx-auto flex h-1/2 max-w-4xl items-center bg-transparent px-4 py-20">
      <p
        :class="
          cn(
            'flex flex-wrap p-5 text-2xl font-bold text-current md:p-8 md:text-3xl lg:p-10 lg:text-4xl xl:text-5xl',
            $props.textClass,
          )
        "
      >
        <ScrollWord
          v-for="(word, i) in words"
          :key="i"
          :word="word"
          :progress="scrollYProgress"
          :range="[i / words.length, (i + 1) / words.length]"
        />
      </p>
    </div>
  </div>
</template>
