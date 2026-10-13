<script setup lang="ts">
import { computed } from 'vue';

const { value, size = 64 } = defineProps<{
    /** Progress between 0 and 1. */
    value: number;
    size?: number;
}>();

const STROKE = 6;
const radius = computed(() => (size - STROKE) / 2);
const circumference = computed(() => 2 * Math.PI * radius.value);
const clamped = computed(() => Math.min(Math.max(value, 0), 1));
const percent = computed(() => Math.round(clamped.value * 100));
</script>

<template>
    <div
        class="relative grid shrink-0 place-items-center"
        :style="{ width: `${size}px`, height: `${size}px` }"
        role="progressbar"
        aria-label="Tasks completed"
        :aria-valuenow="percent"
        aria-valuemin="0"
        aria-valuemax="100"
    >
        <svg :width="size" :height="size" class="-rotate-90" aria-hidden="true">
            <circle
                :cx="size / 2"
                :cy="size / 2"
                :r="radius"
                fill="none"
                :stroke-width="STROKE"
                class="stroke-line"
            />
            <circle
                :cx="size / 2"
                :cy="size / 2"
                :r="radius"
                fill="none"
                :stroke-width="STROKE"
                stroke-linecap="round"
                class="stroke-accent transition-[stroke-dashoffset] duration-700 ease-out"
                :stroke-dasharray="circumference"
                :stroke-dashoffset="circumference * (1 - clamped)"
            />
        </svg>
        <span class="absolute text-sm font-semibold tabular-nums">{{ percent }}%</span>
    </div>
</template>
