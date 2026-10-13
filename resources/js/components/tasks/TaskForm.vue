<script setup lang="ts">
import { computed, reactive, useId } from 'vue';

import type { ValidationErrors } from '@/api/http';
import AppButton from '@/components/ui/AppButton.vue';
import Kbd from '@/components/ui/Kbd.vue';
import { PRIORITY_META } from '@/lib/tasks';
import { TASK_PRIORITIES, type TaskInput, type TaskPriority } from '@/types/task';

const {
    initial = null,
    errors = {},
    submitting = false,
    submitLabel = 'Save',
} = defineProps<{
    initial?: TaskInput | null;
    errors?: ValidationErrors;
    submitting?: boolean;
    submitLabel?: string;
}>();

const emit = defineEmits<{
    submit: [input: TaskInput];
    cancel: [];
}>();

const form = reactive({
    title: initial?.title ?? '',
    description: initial?.description ?? '',
    priority: initial?.priority ?? 'medium',
    starts_at: initial?.starts_at ?? '',
    ends_at: initial?.ends_at ?? '',
});

const canSubmit = computed(() => form.title.trim() !== '' && !submitting);

const ids = {
    title: useId(),
    description: useId(),
    startsAt: useId(),
    endsAt: useId(),
    error: (field: string) => `${ids.title}-${field}-error`,
};

const dots: Record<TaskPriority, string> = {
    high: 'bg-rose-500',
    medium: 'bg-amber-500',
    low: 'bg-sky-500',
};

const fieldClass =
    'w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm text-fg shadow-xs transition placeholder:text-fg-subtle focus:border-accent focus:ring-4 focus:ring-accent/15 focus-visible:outline-none aria-invalid:border-danger aria-invalid:focus:ring-danger/15';

function submit(): void {
    if (!canSubmit.value) return;

    emit('submit', {
        title: form.title.trim(),
        description: form.description.trim() || null,
        priority: form.priority,
        starts_at: form.starts_at || null,
        ends_at: form.ends_at || null,
    });
}
</script>

<template>
    <form
        class="space-y-5"
        novalidate
        @submit.prevent="submit"
        @keydown.meta.enter="submit"
        @keydown.ctrl.enter="submit"
    >
        <div>
            <label :for="ids.title" class="mb-1.5 block text-sm font-medium">Title</label>
            <input
                :id="ids.title"
                v-model="form.title"
                type="text"
                name="title"
                maxlength="120"
                autocomplete="off"
                autofocus
                placeholder="What needs to be done?"
                :class="fieldClass"
                :aria-invalid="!!errors.title || undefined"
                :aria-describedby="errors.title ? ids.error('title') : undefined"
            />
            <p v-if="errors.title" :id="ids.error('title')" class="mt-1.5 text-xs text-danger">
                {{ errors.title }}
            </p>
        </div>

        <div>
            <label :for="ids.description" class="mb-1.5 flex justify-between text-sm font-medium">
                Notes
                <span class="font-normal text-fg-subtle">Optional</span>
            </label>
            <textarea
                :id="ids.description"
                v-model="form.description"
                name="description"
                rows="3"
                maxlength="2000"
                placeholder="Add a little context…"
                :class="[fieldClass, 'field-sizing-content min-h-20 resize-none']"
                :aria-invalid="!!errors.description || undefined"
                :aria-describedby="errors.description ? ids.error('description') : undefined"
            />
            <p v-if="errors.description" :id="ids.error('description')" class="mt-1.5 text-xs text-danger">
                {{ errors.description }}
            </p>
        </div>

        <fieldset>
            <legend class="mb-1.5 text-sm font-medium">Priority</legend>
            <div class="grid grid-cols-3 gap-2">
                <label
                    v-for="priority in TASK_PRIORITIES"
                    :key="priority"
                    class="flex h-10 cursor-pointer items-center justify-center gap-2 rounded-xl border border-line text-sm font-medium text-fg-muted transition select-none hover:bg-surface-muted has-checked:border-accent has-checked:bg-accent-soft has-checked:text-fg has-focus-visible:ring-4 has-focus-visible:ring-accent/15"
                >
                    <input
                        v-model="form.priority"
                        type="radio"
                        name="priority"
                        :value="priority"
                        class="sr-only"
                    />
                    <span class="size-2 rounded-full" :class="dots[priority]" aria-hidden="true" />
                    {{ PRIORITY_META[priority].label }}
                </label>
            </div>
            <p v-if="errors.priority" class="mt-1.5 text-xs text-danger">{{ errors.priority }}</p>
        </fieldset>

        <div class="grid grid-cols-2 gap-3">
            <div>
                <label :for="ids.startsAt" class="mb-1.5 block text-sm font-medium">Start</label>
                <input
                    :id="ids.startsAt"
                    v-model="form.starts_at"
                    type="time"
                    name="starts_at"
                    :class="[fieldClass, 'tabular-nums']"
                    :aria-invalid="!!errors.starts_at || undefined"
                    :aria-describedby="errors.starts_at ? ids.error('starts_at') : undefined"
                />
                <p v-if="errors.starts_at" :id="ids.error('starts_at')" class="mt-1.5 text-xs text-danger">
                    {{ errors.starts_at }}
                </p>
            </div>
            <div>
                <label :for="ids.endsAt" class="mb-1.5 block text-sm font-medium">End</label>
                <input
                    :id="ids.endsAt"
                    v-model="form.ends_at"
                    type="time"
                    name="ends_at"
                    :class="[fieldClass, 'tabular-nums']"
                    :aria-invalid="!!errors.ends_at || undefined"
                    :aria-describedby="errors.ends_at ? ids.error('ends_at') : undefined"
                />
                <p v-if="errors.ends_at" :id="ids.error('ends_at')" class="mt-1.5 text-xs text-danger">
                    {{ errors.ends_at }}
                </p>
            </div>
        </div>

        <div class="flex items-center justify-between gap-3 pt-1">
            <p class="hidden items-center gap-1 text-xs text-fg-subtle sm:flex">
                <Kbd>Ctrl</Kbd><Kbd>Enter</Kbd> to save
            </p>
            <div class="ml-auto flex gap-2">
                <AppButton variant="ghost" @click="emit('cancel')">Cancel</AppButton>
                <AppButton type="submit" variant="primary" :loading="submitting" :disabled="!canSubmit">
                    {{ submitLabel }}
                </AppButton>
            </div>
        </div>
    </form>
</template>
