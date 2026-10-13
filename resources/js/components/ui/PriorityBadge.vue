<script setup lang="ts">
import { PRIORITY_META } from '@/lib/tasks';
import type { TaskPriority } from '@/types/task';

const { priority } = defineProps<{ priority: TaskPriority }>();

const tones: Record<TaskPriority, string> = {
    high: 'bg-rose-500/10 text-rose-700 dark:text-rose-300',
    medium: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
    low: 'bg-sky-500/10 text-sky-700 dark:text-sky-300',
};

const dots: Record<TaskPriority, string> = {
    high: 'bg-rose-500',
    medium: 'bg-amber-500',
    low: 'bg-sky-500',
};
</script>

<template>
    <span
        class="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium"
        :class="tones[priority]"
    >
        <span class="size-1.5 rounded-full" :class="dots[priority]" aria-hidden="true" />
        {{ PRIORITY_META[priority].label }}
        <span class="sr-only">priority</span>
    </span>
</template>
