import { flushPromises, mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { tasksApi } from '@/api/tasks';
import TasksPage from '@/pages/TasksPage.vue';
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

async function mountPage() {
    const wrapper = mount(TasksPage, {
        global: { plugins: [createPinia()] },
        attachTo: document.body,
    });
    await flushPromises();

    return wrapper;
}

function taskTitles(wrapper: Awaited<ReturnType<typeof mountPage>>): string[] {
    return wrapper.findAll('#task-list h3').map((title) => title.text());
}

describe('TasksPage', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
        vi.resetAllMocks();
        document.body.innerHTML = '';
    });

    it('lists tasks once they have loaded', async () => {
        api.list.mockResolvedValue([
            makeTask({ title: 'Write tests', priority: 'high' }),
            makeTask({ title: 'Refactor', is_completed: true }),
        ]);

        const wrapper = await mountPage();

        expect(taskTitles(wrapper)).toEqual(['Write tests', 'Refactor']);
        expect(wrapper.text()).toContain('1 open task · 1 done');
    });

    it('filters tasks by status', async () => {
        api.list.mockResolvedValue([
            makeTask({ title: 'Open one' }),
            makeTask({ title: 'Finished one', is_completed: true }),
        ]);
        const wrapper = await mountPage();

        await wrapper.get('[role=tab]:nth-child(3)').trigger('click');
        expect(taskTitles(wrapper)).toEqual(['Finished one']);

        await wrapper.get('[role=tab]:nth-child(2)').trigger('click');
        expect(taskTitles(wrapper)).toEqual(['Open one']);
    });

    it('searches tasks and explains when nothing matches', async () => {
        api.list.mockResolvedValue([
            makeTask({ title: 'Buy groceries' }),
            makeTask({ title: 'Call the bank' }),
        ]);
        const wrapper = await mountPage();

        await wrapper.get('input[type=search]').setValue('bank');
        expect(taskTitles(wrapper)).toEqual(['Call the bank']);

        await wrapper.get('input[type=search]').setValue('dentist');
        expect(wrapper.text()).toContain('No matches');
    });

    it('invites the user to add a first task when the list is empty', async () => {
        api.list.mockResolvedValue([]);
        const wrapper = await mountPage();

        expect(wrapper.text()).toContain('No tasks yet');
        expect(wrapper.text()).toContain('Add a task');
    });

    it('offers a retry when loading fails', async () => {
        api.list.mockRejectedValueOnce(new Error('offline'));
        const wrapper = await mountPage();

        expect(wrapper.text()).toContain('Couldn’t load your tasks');

        api.list.mockResolvedValue([makeTask({ title: 'Back online' })]);
        const retry = wrapper.findAll('#task-list button').find((button) => button.text() === 'Try again');
        await retry!.trigger('click');
        await flushPromises();

        expect(taskTitles(wrapper)).toEqual(['Back online']);
    });

    it('toggles a task', async () => {
        const task = makeTask({ title: 'Stand-up' });
        api.list.mockResolvedValue([task]);
        api.update.mockResolvedValue({ ...task, is_completed: true });
        const wrapper = await mountPage();

        await wrapper.get('#task-list input[type=checkbox]').trigger('change');
        await flushPromises();

        expect(api.update).toHaveBeenCalledWith(task.id, { is_completed: true });
        expect(wrapper.text()).toContain('Everything’s done');
    });

    it('creates a task through the dialog', async () => {
        const created = makeTask({ title: 'Brand new' });
        api.list.mockResolvedValue([]);
        api.create.mockResolvedValue(created);
        const wrapper = await mountPage();

        await wrapper.get('#task-list button').trigger('click');
        await wrapper.get('dialog[open] input[name=title]').setValue('Brand new');
        await wrapper.get('dialog[open] form').trigger('submit');
        await flushPromises();

        expect(api.create).toHaveBeenCalledWith(expect.objectContaining({ title: 'Brand new' }));
        expect(taskTitles(wrapper)).toEqual(['Brand new']);
        expect(wrapper.find('dialog[open]').exists()).toBe(false);
    });

    it('keeps the dialog open and shows validation errors from the server', async () => {
        const { AxiosError } = await import('axios');
        api.list.mockResolvedValue([]);
        api.create.mockRejectedValue(
            new AxiosError('Unprocessable', '422', undefined, undefined, {
                status: 422,
                data: { errors: { ends_at: ['The end time must be after the start time.'] } },
            } as never),
        );
        const wrapper = await mountPage();

        await wrapper.get('#task-list button').trigger('click');
        await wrapper.get('dialog[open] input[name=title]').setValue('Bad times');
        await wrapper.get('dialog[open] form').trigger('submit');
        await flushPromises();

        expect(wrapper.find('dialog[open]').exists()).toBe(true);
        expect(wrapper.text()).toContain('The end time must be after the start time.');
    });

    it('deletes a task after confirmation', async () => {
        const task = makeTask({ title: 'Obsolete' });
        api.list.mockResolvedValue([task]);
        api.remove.mockResolvedValue();
        const wrapper = await mountPage();

        await wrapper.get('button[aria-label="Delete “Obsolete”"]').trigger('click');
        expect(wrapper.text()).toContain('“Obsolete” will be permanently removed.');
        expect(api.remove).not.toHaveBeenCalled();

        const confirm = wrapper.findAll('dialog[open] button').find((button) => button.text() === 'Delete');
        await confirm!.trigger('click');
        await flushPromises();

        expect(api.remove).toHaveBeenCalledWith(task.id);
        expect(taskTitles(wrapper)).toEqual([]);
    });
});
