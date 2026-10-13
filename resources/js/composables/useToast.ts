import { readonly, ref } from 'vue';

export type ToastTone = 'success' | 'error';

export interface Toast {
    id: number;
    message: string;
    tone: ToastTone;
}

const DISMISS_AFTER_MS = 3500;

const toasts = ref<Toast[]>([]);
let nextId = 1;

function dismiss(id: number): void {
    toasts.value = toasts.value.filter((toast) => toast.id !== id);
}

function show(message: string, tone: ToastTone): void {
    const id = nextId++;
    toasts.value = [...toasts.value.slice(-2), { id, message, tone }];
    setTimeout(() => dismiss(id), DISMISS_AFTER_MS);
}

/** App-wide toast notifications, shared by every caller. */
export function useToast() {
    return {
        toasts: readonly(toasts),
        dismiss,
        success: (message: string) => show(message, 'success'),
        error: (message: string) => show(message, 'error'),
    };
}
