import type { Task } from '@/types/task';

let sequence = 0;

export function makeTask(overrides: Partial<Task> = {}): Task {
    sequence++;

    return {
        id: sequence,
        title: `Task ${sequence}`,
        description: null,
        priority: 'medium',
        starts_at: null,
        ends_at: null,
        is_completed: false,
        completed_at: null,
        created_at: '2026-10-13T08:00:00+00:00',
        updated_at: '2026-10-13T08:00:00+00:00',
        ...overrides,
    };
}
