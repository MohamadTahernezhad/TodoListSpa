import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import TaskFilterTabs from '@/components/tasks/TaskFilterTabs.vue';
import type { TaskFilter } from '@/types/task';

function mountTabs(modelValue: TaskFilter = 'all') {
    return mount(TaskFilterTabs, {
        props: { modelValue, counts: { all: 5, open: 3, completed: 2 } },
        attachTo: document.body,
    });
}

describe('TaskFilterTabs', () => {
    it('shows each filter with its count', () => {
        const tabs = mountTabs().findAll('[role=tab]');

        expect(tabs.map((tab) => tab.text())).toEqual(['All 5', 'Open 3', 'Done 2']);
    });

    it('marks the active tab as selected and focusable', () => {
        const tabs = mountTabs('open').findAll('[role=tab]');

        expect(tabs.map((tab) => tab.attributes('aria-selected'))).toEqual(['false', 'true', 'false']);
        expect(tabs.map((tab) => tab.attributes('tabindex'))).toEqual(['-1', '0', '-1']);
    });

    it('selects a filter on click', async () => {
        const wrapper = mountTabs();

        await wrapper.findAll('[role=tab]')[2]!.trigger('click');

        expect(wrapper.emitted('update:modelValue')).toEqual([['completed']]);
    });

    it('moves between filters with the arrow keys, wrapping around', async () => {
        const wrapper = mountTabs('all');

        await wrapper.findAll('[role=tab]')[0]!.trigger('keydown', { key: 'ArrowLeft' });

        expect(wrapper.emitted('update:modelValue')).toEqual([['completed']]);
        expect(document.activeElement?.textContent).toContain('Done');
    });
});
