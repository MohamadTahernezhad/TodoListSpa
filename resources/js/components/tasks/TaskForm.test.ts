import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import TaskForm from '@/components/tasks/TaskForm.vue';
import { makeTask } from '@/testing/factories';

describe('TaskForm', () => {
    it('submits a normalised payload', async () => {
        const wrapper = mount(TaskForm);

        await wrapper.get('input[name=title]').setValue('  Book flights  ');
        await wrapper.get('textarea[name=description]').setValue('   ');
        await wrapper.get('input[name=priority][value=high]').setValue(true);
        await wrapper.get('input[name=starts_at]').setValue('08:15');
        await wrapper.get('form').trigger('submit');

        expect(wrapper.emitted('submit')).toEqual([
            [
                {
                    title: 'Book flights',
                    description: null,
                    priority: 'high',
                    starts_at: '08:15',
                    ends_at: null,
                },
            ],
        ]);
    });

    it('defaults to medium priority', async () => {
        const wrapper = mount(TaskForm);

        await wrapper.get('input[name=title]').setValue('Stretch');
        await wrapper.get('form').trigger('submit');

        expect(wrapper.emitted('submit')?.[0]?.[0]).toMatchObject({ priority: 'medium' });
    });

    it('does not submit without a title', async () => {
        const wrapper = mount(TaskForm);

        await wrapper.get('input[name=title]').setValue('   ');
        await wrapper.get('form').trigger('submit');

        expect(wrapper.emitted('submit')).toBeUndefined();
        expect(wrapper.get('button[type=submit]').attributes('disabled')).toBeDefined();
    });

    it('submits with Ctrl+Enter', async () => {
        const wrapper = mount(TaskForm);

        await wrapper.get('input[name=title]').setValue('Quick one');
        await wrapper.get('input[name=title]').trigger('keydown', { key: 'Enter', ctrlKey: true });

        expect(wrapper.emitted('submit')).toHaveLength(1);
    });

    it('prefills the fields from an existing task', () => {
        const task = makeTask({
            title: 'Existing',
            description: 'Details',
            priority: 'low',
            starts_at: '10:00',
            ends_at: '11:00',
        });

        const wrapper = mount(TaskForm, { props: { initial: task } });

        expect(wrapper.get<HTMLInputElement>('input[name=title]').element.value).toBe('Existing');
        expect(wrapper.get<HTMLTextAreaElement>('textarea').element.value).toBe('Details');
        expect(wrapper.get<HTMLInputElement>('input[value=low]').element.checked).toBe(true);
        expect(wrapper.get<HTMLInputElement>('input[name=ends_at]').element.value).toBe('11:00');
    });

    it('shows server validation errors next to their fields', () => {
        const wrapper = mount(TaskForm, {
            props: { errors: { title: 'The title field is required.' } },
        });

        const title = wrapper.get('input[name=title]');
        const message = wrapper.get(`#${title.attributes('aria-describedby')}`);

        expect(title.attributes('aria-invalid')).toBe('true');
        expect(message.text()).toBe('The title field is required.');
    });

    it('emits cancel', async () => {
        const wrapper = mount(TaskForm);

        await wrapper.get('button[type=button]').trigger('click');

        expect(wrapper.emitted('cancel')).toHaveLength(1);
    });
});
