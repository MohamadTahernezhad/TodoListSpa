import { describe, expect, it } from 'vitest';

import { compareTasks, formatTimeRange, matchesFilter, matchesQuery } from '@/lib/tasks';
import { makeTask } from '@/testing/factories';

describe('compareTasks', () => {
    it('orders open tasks first, then by priority, then newest first', () => {
        const done = makeTask({ id: 1, priority: 'high', is_completed: true });
        const low = makeTask({ id: 2, priority: 'low' });
        const olderHigh = makeTask({ id: 3, priority: 'high' });
        const newerHigh = makeTask({ id: 4, priority: 'high' });
        const medium = makeTask({ id: 5, priority: 'medium' });

        const sorted = [done, low, olderHigh, newerHigh, medium].sort(compareTasks);

        expect(sorted.map((task) => task.id)).toEqual([4, 3, 5, 2, 1]);
    });
});

describe('matchesFilter', () => {
    const open = makeTask();
    const done = makeTask({ is_completed: true });

    it.each([
        ['all', open, true],
        ['all', done, true],
        ['open', open, true],
        ['open', done, false],
        ['completed', open, false],
        ['completed', done, true],
    ] as const)('filter "%s" → %o matches: %s', (filter, task, expected) => {
        expect(matchesFilter(task, filter)).toBe(expected);
    });
});

describe('matchesQuery', () => {
    const task = makeTask({ title: 'Plan the Sprint', description: 'Invite the design team' });

    it('matches everything for a blank query', () => {
        expect(matchesQuery(task, '   ')).toBe(true);
    });

    it('matches the title case-insensitively', () => {
        expect(matchesQuery(task, 'sprint')).toBe(true);
    });

    it('matches the description', () => {
        expect(matchesQuery(task, 'DESIGN')).toBe(true);
    });

    it('rejects non-matching queries', () => {
        expect(matchesQuery(task, 'groceries')).toBe(false);
    });

    it('handles tasks without a description', () => {
        expect(matchesQuery(makeTask({ title: 'Call mum' }), 'design')).toBe(false);
    });
});

describe('formatTimeRange', () => {
    it.each([
        ['09:00', '10:30', '09:00 – 10:30'],
        ['09:00', null, 'From 09:00'],
        [null, '17:00', 'Until 17:00'],
        [null, null, null],
    ])('formats %s and %s as %s', (start, end, expected) => {
        expect(formatTimeRange(start, end)).toBe(expected);
    });
});
