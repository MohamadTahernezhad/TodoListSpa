import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { tasksApi } from '@/api/tasks';
import { useTaskStore } from '@/stores/tasks';
import { makeTask } from '@/testing/factories';

vi.mock('@/api/tasks', () => ({
    tasksApi: {
        list: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        remove: vi.fn(),
    },
}));

const api = vi.mocked(tasksApi);

describe('task store', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
        vi.resetAllMocks();
    });

    describe('fetchAll', () => {
        it('loads tasks and exposes them sorted', async () => {
            const low = makeTask({ id: 1, priority: 'low' });
            const high = makeTask({ id: 2, priority: 'high' });
            api.list.mockResolvedValue([low, high]);
            const store = useTaskStore();

            const loading = store.fetchAll();
            expect(store.status).toBe('loading');
            await loading;

            expect(store.status).toBe('ready');
            expect(store.tasks).toEqual([high, low]);
        });

        it('flags an error when loading fails', async () => {
            api.list.mockRejectedValue(new Error('offline'));
            const store = useTaskStore();

            await expect(store.fetchAll()).rejects.toThrow('offline');
            expect(store.status).toBe('error');
        });
    });

    it('computes counts and progress', async () => {
        api.list.mockResolvedValue([
            makeTask(),
            makeTask({ is_completed: true }),
            makeTask({ is_completed: true }),
            makeTask(),
        ]);
        const store = useTaskStore();
        await store.fetchAll();

        expect(store.counts).toEqual({ all: 4, open: 2, completed: 2 });
        expect(store.progress).toBe(0.5);
    });

    it('reports zero progress for an empty list', () => {
        expect(useTaskStore().progress).toBe(0);
    });

    it('adds created tasks', async () => {
        const created = makeTask({ title: 'Ship it' });
        api.create.mockResolvedValue(created);
        const store = useTaskStore();

        const input = {
            title: 'Ship it',
            description: null,
            priority: 'high',
            starts_at: null,
            ends_at: null,
        } as const;
        await expect(store.create(input)).resolves.toEqual(created);

        expect(api.create).toHaveBeenCalledWith(input);
        expect(store.tasks).toEqual([created]);
    });

    it('replaces updated tasks', async () => {
        const task = makeTask({ title: 'Old' });
        api.list.mockResolvedValue([task]);
        api.update.mockResolvedValue({ ...task, title: 'New' });
        const store = useTaskStore();
        await store.fetchAll();

        await store.update(task.id, { ...task, title: 'New' });

        expect(store.tasks.map(({ title }) => title)).toEqual(['New']);
    });

    describe('toggle', () => {
        it('updates optimistically and then applies the server response', async () => {
            const task = makeTask();
            const completed = { ...task, is_completed: true, completed_at: '2026-10-13T12:00:00+00:00' };
            api.list.mockResolvedValue([task]);
            let respond!: (value: typeof completed) => void;
            api.update.mockReturnValue(new Promise((resolve) => (respond = resolve)));
            const store = useTaskStore();
            await store.fetchAll();

            const toggling = store.toggle(task);
            expect(store.tasks[0]?.is_completed).toBe(true);

            respond(completed);
            await toggling;

            expect(api.update).toHaveBeenCalledWith(task.id, { is_completed: true });
            expect(store.tasks[0]).toEqual(completed);
        });

        it('rolls back when the request fails', async () => {
            const task = makeTask();
            api.list.mockResolvedValue([task]);
            api.update.mockRejectedValue(new Error('offline'));
            const store = useTaskStore();
            await store.fetchAll();

            await expect(store.toggle(task)).rejects.toThrow('offline');

            expect(store.tasks[0]).toEqual(task);
        });

        it('ignores repeated toggles while a request is in flight', async () => {
            const task = makeTask();
            api.list.mockResolvedValue([task]);
            api.update.mockResolvedValue({ ...task, is_completed: true });
            const store = useTaskStore();
            await store.fetchAll();

            await Promise.all([store.toggle(task), store.toggle(task)]);

            expect(api.update).toHaveBeenCalledTimes(1);
        });
    });

    describe('remove', () => {
        it('removes the task optimistically', async () => {
            const task = makeTask();
            api.list.mockResolvedValue([task]);
            api.remove.mockResolvedValue();
            const store = useTaskStore();
            await store.fetchAll();

            await store.remove(task);

            expect(api.remove).toHaveBeenCalledWith(task.id);
            expect(store.tasks).toEqual([]);
        });

        it('restores the task when the request fails', async () => {
            const task = makeTask();
            api.list.mockResolvedValue([task]);
            api.remove.mockRejectedValue(new Error('offline'));
            const store = useTaskStore();
            await store.fetchAll();

            await expect(store.remove(task)).rejects.toThrow('offline');

            expect(store.tasks).toEqual([task]);
        });
    });
});
