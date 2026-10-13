export const TASK_PRIORITIES = ['high', 'medium', 'low'] as const;

export type TaskPriority = (typeof TASK_PRIORITIES)[number];

export type TaskFilter = 'all' | 'open' | 'completed';

export interface Task {
    id: number;
    title: string;
    description: string | null;
    priority: TaskPriority;
    /** Time of day in `HH:MM` format. */
    starts_at: string | null;
    /** Time of day in `HH:MM` format. */
    ends_at: string | null;
    is_completed: boolean;
    completed_at: string | null;
    created_at: string;
    updated_at: string;
}

/** Fields a user can edit through the task form. */
export interface TaskInput {
    title: string;
    description: string | null;
    priority: TaskPriority;
    starts_at: string | null;
    ends_at: string | null;
}

export type TaskUpdate = Partial<TaskInput> & { is_completed?: boolean };
