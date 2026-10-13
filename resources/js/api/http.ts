import axios, { isAxiosError } from 'axios';

export const http = axios.create({
    baseURL: '/api',
    headers: {
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    },
});

export type ValidationErrors = Record<string, string>;

/**
 * Extracts the first message per field from a Laravel 422 response.
 * Returns `null` for any other kind of error.
 */
export function getValidationErrors(error: unknown): ValidationErrors | null {
    if (!isAxiosError<{ errors?: Record<string, string[]> }>(error) || error.response?.status !== 422) {
        return null;
    }

    const errors = error.response.data.errors ?? {};

    return Object.fromEntries(
        Object.entries(errors).flatMap(([field, messages]) => (messages[0] ? [[field, messages[0]]] : [])),
    );
}

export function getErrorMessage(error: unknown): string {
    if (isAxiosError(error)) {
        if (!error.response) {
            return 'Network error — check your connection and try again.';
        }

        if (error.response.status === 429) {
            return 'Too many requests — please slow down a little.';
        }

        if (error.response.status === 404) {
            return 'That task no longer exists.';
        }
    }

    return 'Something went wrong. Please try again.';
}
