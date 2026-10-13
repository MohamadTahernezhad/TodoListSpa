<script setup lang="ts">
import { useIntervalFn, useNow } from '@vueuse/core';
import { computed } from 'vue';

import ProgressRing from '@/components/ui/ProgressRing.vue';
import { formatLongDate, greetingFor } from '@/lib/dates';
import type { TaskFilter } from '@/types/task';

const { counts, progress } = defineProps<{
    counts: Record<TaskFilter, number>;
    progress: number;
}>();

const now = useNow({ scheduler: (tick) => useIntervalFn(tick, 60_000) });

const summary = computed(() => {
    if (counts.all === 0) return 'Your list is empty — what’s first?';
    if (counts.open === 0) return 'Everything’s done. Enjoy the calm.';

    const tasks = counts.open === 1 ? 'task' : 'tasks';

    return `${counts.open} open ${tasks} · ${counts.completed} done`;
});
</script>

<template>
    <section class="flex items-end justify-between gap-6">
        <div class="min-w-0">
            <p class="text-sm font-medium text-accent">{{ formatLongDate(now) }}</p>
            <h1 class="mt-1 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                {{ greetingFor(now) }}
            </h1>
            <p class="mt-2 text-fg-muted">{{ summary }}</p>
        </div>
        <ProgressRing v-if="counts.all > 0" :value="progress" :size="72" />
    </section>
</template>
