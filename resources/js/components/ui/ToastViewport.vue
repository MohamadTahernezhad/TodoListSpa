<script setup lang="ts">
import { CircleAlert, CircleCheck } from 'lucide-vue-next';

import { useToast } from '@/composables/useToast';

const { toasts, dismiss } = useToast();
</script>

<template>
    <div
        class="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex flex-col items-center gap-2 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]"
        role="status"
        aria-live="polite"
    >
        <TransitionGroup
            enter-from-class="opacity-0 translate-y-3 scale-95"
            leave-to-class="opacity-0 scale-95"
            enter-active-class="transition duration-300 ease-out"
            leave-active-class="transition duration-200 ease-in"
        >
            <button
                v-for="toast in toasts"
                :key="toast.id"
                type="button"
                class="pointer-events-auto flex cursor-pointer items-center gap-2.5 rounded-full border border-line bg-surface/90 py-2 pr-4 pl-3 text-sm font-medium shadow-lg shadow-black/5 backdrop-blur-md"
                @click="dismiss(toast.id)"
            >
                <CircleCheck
                    v-if="toast.tone === 'success'"
                    class="size-4 text-emerald-500"
                    aria-hidden="true"
                />
                <CircleAlert v-else class="size-4 text-danger" aria-hidden="true" />
                {{ toast.message }}
            </button>
        </TransitionGroup>
    </div>
</template>
