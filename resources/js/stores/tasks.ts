import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import { tasksApi } from '@/api/tasks';
import { compareTasks } from '@/lib/tasks';
import type { Task, TaskInput } from '@/types/task';

export type LoadStatus = 'idle' | 'loading' | 'ready' | 'error';

export const useTaskStore = defineStore('tasks', () => {
    const items = ref<Task[]>([]);
    const status = ref<LoadStatus>('idle');
    const pendingIds = ref(new Set<number>());

    const tasks = computed(() => items.value.toSorted(compareTasks));
    const completedCount = computed(() => items.value.filter((task) => task.is_completed).length);
    const counts = computed(() => ({
        all: items.value.length,
        open: items.value.length - completedCount.value,
        completed: completedCount.value,
    }));
    const progress = computed(() =>
        items.value.length === 0 ? 0 : completedCount.value / items.value.length,
    );

    function upsert(task: Task): void {
        const index = items.value.findIndex(({ id }) => id === task.id);

        if (index === -1) {
            items.value.push(task);
        } else {
            items.value[index] = task;
        }
    }

    function forget(id: number): void {
        items.value = items.value.filter((task) => task.id !== id);
    }

    async function fetchAll(): Promise<void> {
        status.value = 'loading';

        try {
            items.value = await tasksApi.list();
            status.value = 'ready';
        } catch (error) {
            status.value = 'error';
            throw error;
        }
    }

    async function create(input: TaskInput): Promise<Task> {
        const task = await tasksApi.create(input);
        upsert(task);

        return task;
    }

    async function update(id: number, input: TaskInput): Promise<Task> {
        const task = await tasksApi.update(id, input);
        upsert(task);

        return task;
    }

    /**
     * Optimistically flips the completion state and rolls back if the request
     * fails. Repeated clicks while a request is in flight are ignored.
     */
    async function toggle(task: Task): Promise<void> {
        if (pendingIds.value.has(task.id)) {
            return;
        }

        const isCompleted = !task.is_completed;
        pendingIds.value.add(task.id);
        upsert({
            ...task,
            is_completed: isCompleted,
            completed_at: isCompleted ? new Date().toISOString() : null,
        });

        try {
            upsert(await tasksApi.update(task.id, { is_completed: isCompleted }));
        } catch (error) {
            upsert(task);
            throw error;
        } finally {
            pendingIds.value.delete(task.id);
        }
    }

    async function remove(task: Task): Promise<void> {
        forget(task.id);

        try {
            await tasksApi.remove(task.id);
        } catch (error) {
            upsert(task);
            throw error;
        }
    }

    return { tasks, status, counts, progress, fetchAll, create, update, toggle, remove };
});
