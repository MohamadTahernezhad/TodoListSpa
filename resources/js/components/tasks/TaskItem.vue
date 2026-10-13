<script setup lang="ts">
import { Check, Clock, Pencil, Trash2 } from 'lucide-vue-next';
import { computed } from 'vue';

import PriorityBadge from '@/components/ui/PriorityBadge.vue';
import { formatTimeRange } from '@/lib/tasks';
import type { Task } from '@/types/task';

const { task } = defineProps<{ task: Task }>();

const emit = defineEmits<{
    toggle: [task: Task];
    edit: [task: Task];
    delete: [task: Task];
}>();

const timeRange = computed(() => formatTimeRange(task.starts_at, task.ends_at));
</script>

<template>
    <li
        class="group relative flex gap-3.5 rounded-2xl border border-line p-4 shadow-xs transition-[box-shadow,border-color,background-color] duration-200 hover:border-line-strong hover:shadow-md hover:shadow-black/[0.03]"
        :class="task.is_completed ? 'bg-surface/60' : 'bg-surface'"
    >
        <label class="relative mt-px grid size-5 shrink-0 cursor-pointer place-items-center">
            <input
                type="checkbox"
                class="peer size-5 cursor-pointer appearance-none rounded-full border-[1.5px] border-line-strong transition duration-200 checked:border-accent checked:bg-accent hover:border-accent"
                :checked="task.is_completed"
                :aria-label="`Mark “${task.title}” as ${task.is_completed ? 'not done' : 'done'}`"
                @change="emit('toggle', task)"
            />
            <Check
                class="pointer-events-none absolute size-3 scale-50 text-accent-fg opacity-0 transition duration-200 peer-checked:scale-100 peer-checked:opacity-100"
                :stroke-width="3.5"
                aria-hidden="true"
            />
        </label>

        <div class="min-w-0 flex-1">
            <h3
                class="leading-snug font-medium break-words transition-colors duration-200"
                :class="task.is_completed ? 'text-fg-subtle line-through decoration-fg-subtle/60' : 'text-fg'"
            >
                {{ task.title }}
            </h3>
            <p
                v-if="task.description"
                class="mt-1 line-clamp-2 text-sm break-words text-fg-muted"
                :class="{ 'opacity-60': task.is_completed }"
            >
                {{ task.description }}
            </p>

            <div class="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-fg-muted">
                <PriorityBadge :priority="task.priority" />
                <span v-if="timeRange" class="inline-flex items-center gap-1 tabular-nums">
                    <Clock class="size-3.5" aria-hidden="true" />
                    {{ timeRange }}
                </span>
            </div>
        </div>

        <div
            class="-mt-1 -mr-1 flex shrink-0 items-start gap-0.5 transition-opacity duration-150 pointer-fine:opacity-0 pointer-fine:group-focus-within:opacity-100 pointer-fine:group-hover:opacity-100"
        >
            <button
                type="button"
                class="grid size-8 cursor-pointer place-items-center rounded-lg text-fg-subtle transition hover:bg-surface-muted hover:text-fg"
                :aria-label="`Edit “${task.title}”`"
                title="Edit"
                @click="emit('edit', task)"
            >
                <Pencil class="size-4" aria-hidden="true" />
            </button>
            <button
                type="button"
                class="grid size-8 cursor-pointer place-items-center rounded-lg text-fg-subtle transition hover:bg-danger-soft hover:text-danger"
                :aria-label="`Delete “${task.title}”`"
                title="Delete"
                @click="emit('delete', task)"
            >
                <Trash2 class="size-4" aria-hidden="true" />
            </button>
        </div>
    </li>
</template>
