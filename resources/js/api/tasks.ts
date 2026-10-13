import { http } from '@/api/http';
import type { Task, TaskInput, TaskUpdate } from '@/types/task';

interface Envelope<T> {
    data: T;
}

export const tasksApi = {
    async list(): Promise<Task[]> {
        const { data } = await http.get<Envelope<Task[]>>('/tasks');

        return data.data;
    },

    async create(input: TaskInput): Promise<Task> {
        const { data } = await http.post<Envelope<Task>>('/tasks', input);

        return data.data;
    },

    async update(id: number, changes: TaskUpdate): Promise<Task> {
        const { data } = await http.patch<Envelope<Task>>(`/tasks/${id}`, changes);

        return data.data;
    },

    async remove(id: number): Promise<void> {
        await http.delete(`/tasks/${id}`);
    },
};
