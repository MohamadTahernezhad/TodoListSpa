import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import TaskItem from '@/components/tasks/TaskItem.vue';
import { makeTask } from '@/testing/factories';

describe('TaskItem', () => {
    it('renders the task details', () => {
        const task = makeTask({
            title: 'Review pull request',
            description: 'Focus on the API changes',
            priority: 'high',
            starts_at: '09:00',
            ends_at: '10:00',
        });

        const wrapper = mount(TaskItem, { props: { task } });

        expect(wrapper.get('h3').text()).toBe('Review pull request');
        expect(wrapper.text()).toContain('Focus on the API changes');
        expect(wrapper.text()).toContain('High');
        expect(wrapper.text()).toContain('09:00 – 10:00');
    });

    it('omits empty optional details', () => {
        const wrapper = mount(TaskItem, { props: { task: makeTask({ description: null }) } });

        expect(wrapper.find('p').exists()).toBe(false);
        expect(wrapper.text()).not.toContain('–');
    });

    it('reflects the completion state', () => {
        const wrapper = mount(TaskItem, { props: { task: makeTask({ is_completed: true }) } });

        expect(wrapper.get<HTMLInputElement>('input[type=checkbox]').element.checked).toBe(true);
        expect(wrapper.get('h3').classes()).toContain('line-through');
    });

    it('emits toggle, edit and delete events with the task', async () => {
        const task = makeTask({ title: 'Water plants' });
        const wrapper = mount(TaskItem, { props: { task } });

        await wrapper.get('input[type=checkbox]').trigger('change');
        await wrapper.get('button[aria-label="Edit “Water plants”"]').trigger('click');
        await wrapper.get('button[aria-label="Delete “Water plants”"]').trigger('click');

        expect(wrapper.emitted('toggle')).toEqual([[task]]);
        expect(wrapper.emitted('edit')).toEqual([[task]]);
        expect(wrapper.emitted('delete')).toEqual([[task]]);
    });
});
