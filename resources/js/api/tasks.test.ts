import { describe, expect, it, vi } from 'vitest';

import { http } from '@/api/http';
import { tasksApi } from '@/api/tasks';
import { makeTask } from '@/testing/factories';

describe('tasksApi', () => {
    const task = makeTask();

    it('lists tasks', async () => {
        const get = vi.spyOn(http, 'get').mockResolvedValue({ data: { data: [task] } });

        await expect(tasksApi.list()).resolves.toEqual([task]);
        expect(get).toHaveBeenCalledWith('/tasks');
    });

    it('creates a task', async () => {
        const post = vi.spyOn(http, 'post').mockResolvedValue({ data: { data: task } });
        const input = {
            title: 'New',
            description: null,
            priority: 'low',
            starts_at: null,
            ends_at: null,
        } as const;

        await expect(tasksApi.create(input)).resolves.toEqual(task);
        expect(post).toHaveBeenCalledWith('/tasks', input);
    });

    it('updates a task', async () => {
        const patch = vi.spyOn(http, 'patch').mockResolvedValue({ data: { data: task } });

        await expect(tasksApi.update(7, { is_completed: true })).resolves.toEqual(task);
        expect(patch).toHaveBeenCalledWith('/tasks/7', { is_completed: true });
    });

    it('deletes a task', async () => {
        const remove = vi.spyOn(http, 'delete').mockResolvedValue({ status: 204 });

        await tasksApi.remove(7);
        expect(remove).toHaveBeenCalledWith('/tasks/7');
    });
});
