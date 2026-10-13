<script setup lang="ts">
import type { Component } from 'vue';

const { icon, title, description } = defineProps<{
    icon: Component;
    title: string;
    description: string;
}>();

defineSlots<{ default?(): unknown }>();
</script>

<template>
    <div
        class="flex animate-fade-up flex-col items-center rounded-2xl border border-dashed border-line-strong/70 px-6 py-14 text-center"
    >
        <div class="grid size-12 place-items-center rounded-2xl bg-accent-soft text-accent">
            <component :is="icon" class="size-5.5" aria-hidden="true" />
        </div>
        <h2 class="mt-4 font-semibold">{{ title }}</h2>
        <p class="mt-1 max-w-xs text-sm text-pretty text-fg-muted">{{ description }}</p>
        <div v-if="$slots.default" class="mt-5">
            <slot />
        </div>
    </div>
</template>
