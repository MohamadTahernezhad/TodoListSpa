<script setup lang="ts">
import { useColorMode } from '@vueuse/core';
import { Monitor, Moon, Sun } from 'lucide-vue-next';

const { store: mode } = useColorMode({ storageKey: 'theme', disableTransition: true });

const options = [
    { value: 'light', label: 'Light theme', icon: Sun },
    { value: 'auto', label: 'System theme', icon: Monitor },
    { value: 'dark', label: 'Dark theme', icon: Moon },
] as const;
</script>

<template>
    <div
        class="flex items-center gap-0.5 rounded-xl border border-line bg-surface p-0.5"
        role="radiogroup"
        aria-label="Theme"
    >
        <button
            v-for="option in options"
            :key="option.value"
            type="button"
            role="radio"
            :aria-checked="mode === option.value"
            :aria-label="option.label"
            :title="option.label"
            class="grid size-7 cursor-pointer place-items-center rounded-[0.625rem] transition"
            :class="
                mode === option.value ? 'bg-surface-muted text-fg shadow-xs' : 'text-fg-subtle hover:text-fg'
            "
            @click="mode = option.value"
        >
            <component :is="option.icon" class="size-3.5" aria-hidden="true" />
        </button>
    </div>
</template>
