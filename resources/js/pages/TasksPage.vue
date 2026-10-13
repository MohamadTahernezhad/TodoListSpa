<script setup lang="ts">
import {
    CircleDashed,
    CloudOff,
    ListTodo,
    PartyPopper,
    Plus,
    RotateCw,
    Search,
    SearchX,
} from 'lucide-vue-next';
import { computed, onMounted, ref, useTemplateRef, type Component } from 'vue';

import { getErrorMessage } from '@/api/http';
import TaskFilterTabs from '@/components/tasks/TaskFilterTabs.vue';
import TaskFormDialog from '@/components/tasks/TaskFormDialog.vue';
import TaskList from '@/components/tasks/TaskList.vue';
import TaskListSkeleton from '@/components/tasks/TaskListSkeleton.vue';
import TodayOverview from '@/components/tasks/TodayOverview.vue';
import AppButton from '@/components/ui/AppButton.vue';
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue';
import EmptyState from '@/components/ui/EmptyState.vue';
import Kbd from '@/components/ui/Kbd.vue';
import { useShortcut } from '@/composables/useShortcut';
import { useToast } from '@/composables/useToast';
import { matchesFilter, matchesQuery } from '@/lib/tasks';
import { useTaskStore } from '@/stores/tasks';
import type { Task, TaskFilter } from '@/types/task';

const store = useTaskStore();
const toast = useToast();

const filter = ref<TaskFilter>('all');
const query = ref('');
const searchInput = useTemplateRef<HTMLInputElement>('search');

const formOpen = ref(false);
const editingTask = ref<Task | null>(null);
const confirmOpen = ref(false);
const deletingTask = ref<Task | null>(null);

const visibleTasks = computed(() =>
    store.tasks.filter((task) => matchesFilter(task, filter.value) && matchesQuery(task, query.value)),
);

const emptyState = computed<{ icon: Component; title: string; description: string; canCreate?: boolean }>(
    () => {
        if (query.value.trim() !== '') {
            return {
                icon: SearchX,
                title: 'No matches',
                description: `Nothing matches “${query.value.trim()}”.`,
            };
        }

        if (filter.value === 'open' && store.counts.all > 0) {
            return {
                icon: PartyPopper,
                title: 'All caught up',
                description: 'You’ve finished everything on your list.',
            };
        }

        if (filter.value === 'completed') {
            return {
                icon: CircleDashed,
                title: 'Nothing done yet',
                description: 'Tasks you check off will show up here.',
            };
        }

        return {
            icon: ListTodo,
            title: 'No tasks yet',
            description: 'Add your first task to get started.',
            canCreate: true,
        };
    },
);

async function load(): Promise<void> {
    try {
        await store.fetchAll();
    } catch {
        // The error state is rendered from `store.status`.
    }
}

function openCreate(): void {
    editingTask.value = null;
    formOpen.value = true;
}

function openEdit(task: Task): void {
    editingTask.value = task;
    formOpen.value = true;
}

function askToDelete(task: Task): void {
    deletingTask.value = task;
    confirmOpen.value = true;
}

async function toggle(task: Task): Promise<void> {
    try {
        await store.toggle(task);
    } catch (error) {
        toast.error(getErrorMessage(error));
    }
}

async function remove(): Promise<void> {
    if (!deletingTask.value) return;

    try {
        await store.remove(deletingTask.value);
        toast.success('Task deleted');
    } catch (error) {
        toast.error(getErrorMessage(error));
    }
}

useShortcut('n', openCreate);
useShortcut('/', () => searchInput.value?.focus());

onMounted(load);
</script>

<template>
    <TodayOverview :counts="store.counts" :progress="store.progress" />

    <div class="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <TaskFilterTabs v-model="filter" :counts="store.counts" controls="task-list" />

        <div class="flex gap-2">
            <label class="relative flex-1 sm:w-52 sm:flex-none">
                <span class="sr-only">Search tasks</span>
                <Search
                    class="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-fg-subtle"
                    aria-hidden="true"
                />
                <input
                    ref="search"
                    v-model="query"
                    type="search"
                    placeholder="Search"
                    class="peer h-10 w-full rounded-xl border border-line bg-surface pr-9 pl-9 text-sm shadow-xs transition placeholder:text-fg-subtle focus:border-accent focus:ring-4 focus:ring-accent/15 focus-visible:outline-none"
                    @keydown.esc="query = ''"
                />
                <Kbd
                    class="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-fg-subtle peer-focus:hidden pointer-coarse:hidden"
                >
                    /
                </Kbd>
            </label>

            <AppButton variant="primary" @click="openCreate">
                <Plus class="size-4" aria-hidden="true" />
                <span>New task</span>
                <span class="hidden pointer-fine:contents"><Kbd>N</Kbd></span>
            </AppButton>
        </div>
    </div>

    <div id="task-list" class="mt-5" role="tabpanel">
        <TaskListSkeleton v-if="store.status === 'idle' || store.status === 'loading'" />

        <EmptyState
            v-else-if="store.status === 'error'"
            :icon="CloudOff"
            title="Couldn’t load your tasks"
            description="Check your connection and give it another go."
        >
            <AppButton @click="load">
                <RotateCw class="size-4" aria-hidden="true" />
                Try again
            </AppButton>
        </EmptyState>

        <EmptyState
            v-else-if="visibleTasks.length === 0"
            :key="emptyState.title"
            :icon="emptyState.icon"
            :title="emptyState.title"
            :description="emptyState.description"
        >
            <AppButton v-if="emptyState.canCreate" variant="primary" @click="openCreate">
                <Plus class="size-4" aria-hidden="true" />
                Add a task
            </AppButton>
        </EmptyState>

        <TaskList v-else :tasks="visibleTasks" @toggle="toggle" @edit="openEdit" @delete="askToDelete" />
    </div>

    <TaskFormDialog v-model:open="formOpen" :task="editingTask" />

    <ConfirmDialog
        v-model:open="confirmOpen"
        title="Delete this task?"
        :description="deletingTask ? `“${deletingTask.title}” will be permanently removed.` : undefined"
        confirm-label="Delete"
        @confirm="remove"
    />
</template>
