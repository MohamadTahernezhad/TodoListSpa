import { AxiosError, AxiosHeaders, type AxiosResponse } from 'axios';
import { describe, expect, it } from 'vitest';

import { getErrorMessage, getValidationErrors } from '@/api/http';

function httpError(status: number, data: unknown = {}): AxiosError {
    const response = { status, data, headers: {}, config: { headers: new AxiosHeaders() } } as AxiosResponse;

    return new AxiosError('Request failed', String(status), undefined, undefined, response);
}

describe('getValidationErrors', () => {
    it('returns the first message for each invalid field', () => {
        const error = httpError(422, {
            errors: {
                title: ['The title field is required.', 'Another message'],
                ends_at: ['The end time must be after the start time.'],
            },
        });

        expect(getValidationErrors(error)).toEqual({
            title: 'The title field is required.',
            ends_at: 'The end time must be after the start time.',
        });
    });

    it('returns null for non-validation errors', () => {
        expect(getValidationErrors(httpError(500))).toBeNull();
        expect(getValidationErrors(new Error('boom'))).toBeNull();
    });
});

describe('getErrorMessage', () => {
    it('explains network failures', () => {
        expect(getErrorMessage(new AxiosError('Network Error'))).toMatch(/network error/i);
    });

    it('explains rate limiting', () => {
        expect(getErrorMessage(httpError(429))).toMatch(/too many requests/i);
    });

    it('explains missing tasks', () => {
        expect(getErrorMessage(httpError(404))).toMatch(/no longer exists/i);
    });

    it('falls back to a generic message', () => {
        expect(getErrorMessage(httpError(500))).toMatch(/something went wrong/i);
        expect(getErrorMessage('???')).toMatch(/something went wrong/i);
    });
});
