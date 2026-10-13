import type { Task, TaskFilter, TaskPriority } from '@/types/task';

export const PRIORITY_META: Record<TaskPriority, { label: string; rank: number }> = {
    high: { label: 'High', rank: 0 },
    medium: { label: 'Medium', rank: 1 },
    low: { label: 'Low', rank: 2 },
};

/**
 * Mirrors the API's ordering: open tasks first, then by priority, then newest.
 */
export function compareTasks(a: Task, b: Task): number {
    return (
        Number(a.is_completed) - Number(b.is_completed) ||
        PRIORITY_META[a.priority].rank - PRIORITY_META[b.priority].rank ||
        b.id - a.id
    );
}

export function matchesFilter(task: Task, filter: TaskFilter): boolean {
    switch (filter) {
        case 'open':
            return !task.is_completed;
        case 'completed':
            return task.is_completed;
        case 'all':
            return true;
    }
}

export function matchesQuery(task: Task, query: string): boolean {
    const needle = query.trim().toLocaleLowerCase();

    if (needle === '') {
        return true;
    }

    return [task.title, task.description ?? ''].some((text) => text.toLocaleLowerCase().includes(needle));
}

export function formatTimeRange(startsAt: string | null, endsAt: string | null): string | null {
    if (startsAt && endsAt) {
        return `${startsAt} – ${endsAt}`;
    }

    if (startsAt) {
        return `From ${startsAt}`;
    }

    if (endsAt) {
        return `Until ${endsAt}`;
    }

    return null;
}
