<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";
import { animate } from "motion-v";
import { computed, onMounted, onUnmounted, ref, useTemplateRef } from "vue";

interface Props {
  blur?: number;
  inactiveZone?: number;
  proximity?: number;
  spread?: number;
  variant?: "default" | "white";
  glow?: boolean;
  class?: HTMLAttributes["class"];
  disabled?: boolean;
  movementDuration?: number;
  borderWidth?: number;
}

const props = withDefaults(defineProps<Props>(), {
  blur: 0,
  inactiveZone: 0.7,
  proximity: 0,
  spread: 20,
  variant: "default",
  glow: false,
  movementDuration: 2,
  borderWidth: 1,
  disabled: true,
});

const containerRef = useTemplateRef("containerRef");
const lastPosition = ref({
  x: 0,
  y: 0,
});
const animationFrame = ref(0);

const containerStyles = computed(() => {
  return {
    "--blur": `${props.blur}px`,
    "--spread": props.spread,
    "--start": "0",
    "--active": "0",
    "--glowingeffect-border-width": `${props.borderWidth}px`,
    "--repeating-conic-gradient-times": "5",
    "--gradient":
      props.variant === "white"
        ? `repeating-conic-gradient(
                  from 236.84deg at 50% 50%,
                  var(--color-paper),
                  var(--color-paper) calc(25% / var(--repeating-conic-gradient-times))
                )`
        : `radial-gradient(circle, var(--color-ink) 10%, transparent 20%),
                radial-gradient(circle at 40% 40%, var(--color-ash) 5%, transparent 15%),
                radial-gradient(circle at 60% 60%, var(--color-ink) 10%, transparent 20%),
                radial-gradient(circle at 40% 60%, var(--color-ash) 10%, transparent 20%),
                repeating-conic-gradient(
                  from 236.84deg at 50% 50%,
                  var(--color-ink) 0%,
                  var(--color-ash) calc(25% / var(--repeating-conic-gradient-times)),
                  var(--color-ink) calc(50% / var(--repeating-conic-gradient-times)),
                  var(--color-ash) calc(75% / var(--repeating-conic-gradient-times)),
                  var(--color-ink) calc(100% / var(--repeating-conic-gradient-times))
                )`,
  };
});

onMounted(() => {
  if (props.disabled) return;

  window.addEventListener("scroll", handleScroll, { passive: true });
  document.body.addEventListener("pointermove", handlePointerMove, {
    passive: true,
  });
});

onUnmounted(() => {
  if (animationFrame.value) {
    cancelAnimationFrame(animationFrame.value);
  }

  window.removeEventListener("scroll", handleScroll);
  document.body.removeEventListener("pointermove", handlePointerMove);
});

function handlePointerMove(e: PointerEvent) {
  handleMove(e);
}

function handleScroll() {
  handleMove();
}

function handleMove(e?: MouseEvent | PointerEvent | { x: number; y: number }) {
  if (!containerRef.value) return;

  if (animationFrame.value) {
    cancelAnimationFrame(animationFrame.value);
  }

  animationFrame.value = requestAnimationFrame(() => {
    const element = containerRef.value;

    if (!element) return;

    const { left, top, width, height } = element.getBoundingClientRect();

    const mouseX = e?.x ?? lastPosition.value.x;
    const mouseY = e?.y ?? lastPosition.value.y;

    if (e) {
      lastPosition.value = { x: mouseX, y: mouseY };
    }

    const centerX = left + width * 0.5;
    const centerY = top + height * 0.5;
    const distanceFromCenter = Math.hypot(mouseX - centerX, mouseY - centerY);
    const inactiveRadius = 0.5 * Math.min(width, height) * props.inactiveZone;

    if (distanceFromCenter < inactiveRadius) {
      element.style.setProperty("--active", "0");
      return;
    }

    const isActive =
      mouseX > left - props.proximity &&
      mouseX < left + width + props.proximity &&
      mouseY > top - props.proximity &&
      mouseY < top + height + props.proximity;

    element.style.setProperty("--active", isActive ? "1" : "0");

    if (!isActive) return;

    const currentAngle = Number.parseFloat(element.style.getPropertyValue("--start")) || 0;
    const targetAngle = (180 * Math.atan2(mouseY - centerY, mouseX - centerX)) / Math.PI + 90;

    const angleDiff = ((targetAngle - currentAngle + 180) % 360) - 180;
    const newAngle = currentAngle + angleDiff;

    animate(currentAngle, newAngle, {
      duration: props.movementDuration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (value) => {
        element.style.setProperty("--start", String(value));
      },
    });
  });
}
</script>

<template>
  <div
    :class="
      cn(
        'pointer-events-none absolute -inset-px hidden rounded-[inherit] border opacity-0 transition-opacity',
        glow && 'opacity-100',
        variant === 'white' && 'border-paper',
        disabled && 'block!',
      )
    "
  />
  <div
    ref="containerRef"
    :style="containerStyles"
    :class="
      cn(
        'pointer-events-none absolute inset-0 rounded-[inherit] opacity-100 transition-opacity',
        glow && 'opacity-100',
        blur > 0 && 'blur-(--blur)',
        props.class,
        disabled && 'hidden!',
      )
    "
  >
    <div
      class="glow rounded-[inherit] after:absolute after:inset-[calc(-1*var(--glowingeffect-border-width))] after:rounded-[inherit] after:mask-[linear-gradient(transparent,transparent),conic-gradient(from_calc((var(--start)-var(--spread))*1deg),transparent_0deg,var(--color-paper)_calc(var(--spread)*2deg),transparent_calc(var(--spread)*2deg))] after:bg-fixed after:mask-intersect after:[mask-clip:padding-box,border-box] after:opacity-(--active) after:transition-opacity after:duration-300 after:content-[''] after:[background:var(--gradient)] after:[border:var(--glowingeffect-border-width)_solid_transparent]"
    />
  </div>
</template>
