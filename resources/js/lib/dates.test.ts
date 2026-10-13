import { describe, expect, it } from 'vitest';

import { formatLongDate, greetingFor } from '@/lib/dates';

describe('greetingFor', () => {
    it.each([
        [2, 'Good night'],
        [7, 'Good morning'],
        [11, 'Good morning'],
        [12, 'Good afternoon'],
        [17, 'Good afternoon'],
        [18, 'Good evening'],
        [23, 'Good evening'],
    ])('greets %i o’clock with "%s"', (hour, greeting) => {
        expect(greetingFor(new Date(2026, 9, 13, hour))).toBe(greeting);
    });
});

describe('formatLongDate', () => {
    it('formats the weekday, month and day', () => {
        expect(formatLongDate(new Date(2026, 9, 13), 'en-US')).toBe('Tuesday, October 13');
    });
});
