<script setup lang="ts">
import { useTemplateRef } from 'vue';

import type { TaskFilter } from '@/types/task';

const { counts, controls } = defineProps<{
    counts: Record<TaskFilter, number>;
    /** Id of the element whose content the tabs filter. */
    controls?: string;
}>();

const filter = defineModel<TaskFilter>({ required: true });

const tabs: { value: TaskFilter; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'open', label: 'Open' },
    { value: 'completed', label: 'Done' },
];

const buttons = useTemplateRef<HTMLButtonElement[]>('buttons');

/** Arrow-key navigation between tabs, per the WAI-ARIA tabs pattern. */
function onKeydown(event: KeyboardEvent, index: number): void {
    const step = { ArrowRight: 1, ArrowLeft: -1 }[event.key];

    if (step === undefined) return;

    event.preventDefault();
    const next = (index + step + tabs.length) % tabs.length;
    filter.value = tabs[next]!.value;
    buttons.value?.[next]?.focus();
}
</script>

<template>
    <div class="inline-flex rounded-xl bg-surface-muted p-1" role="tablist" aria-label="Filter tasks">
        <button
            v-for="(tab, index) in tabs"
            ref="buttons"
            :key="tab.value"
            type="button"
            role="tab"
            :aria-selected="filter === tab.value"
            :aria-controls="controls"
            :tabindex="filter === tab.value ? 0 : -1"
            class="flex h-8 cursor-pointer items-center gap-2 rounded-lg px-3 text-sm font-medium transition duration-200"
            :class="
                filter === tab.value
                    ? 'bg-surface text-fg shadow-sm shadow-black/5'
                    : 'text-fg-muted hover:text-fg'
            "
            @click="filter = tab.value"
            @keydown="onKeydown($event, index)"
        >
            {{ tab.label }}
            <span
                class="min-w-5 rounded-full px-1.5 text-center text-xs tabular-nums transition-colors"
                :class="filter === tab.value ? 'bg-accent-soft text-accent' : 'bg-line/70 text-fg-muted'"
            >
                {{ counts[tab.value] }}
            </span>
        </button>
    </div>
</template>
