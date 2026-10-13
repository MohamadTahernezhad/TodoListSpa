import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useToast } from '@/composables/useToast';

describe('useToast', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.runAllTimers();
        vi.useRealTimers();
    });

    it('shows toasts and dismisses them automatically', () => {
        const toast = useToast();

        toast.success('Saved');
        toast.error('Failed');

        expect(toast.toasts.value.map(({ message, tone }) => [message, tone])).toEqual([
            ['Saved', 'success'],
            ['Failed', 'error'],
        ]);

        vi.advanceTimersByTime(3500);

        expect(toast.toasts.value).toEqual([]);
    });

    it('can be dismissed early', () => {
        const toast = useToast();
        toast.success('Saved');

        toast.dismiss(toast.toasts.value[0]!.id);

        expect(toast.toasts.value).toEqual([]);
    });

    it('keeps at most three toasts on screen', () => {
        const toast = useToast();

        ['one', 'two', 'three', 'four'].forEach((message) => toast.success(message));

        expect(toast.toasts.value.map(({ message }) => message)).toEqual(['two', 'three', 'four']);
    });
});
