<script setup lang="ts">
import { ref, watch } from 'vue';

import { getErrorMessage, getValidationErrors, type ValidationErrors } from '@/api/http';
import TaskForm from '@/components/tasks/TaskForm.vue';
import BaseDialog from '@/components/ui/BaseDialog.vue';
import { useToast } from '@/composables/useToast';
import { useTaskStore } from '@/stores/tasks';
import type { Task, TaskInput } from '@/types/task';

/** The task being edited, or `null` to create a new one. */
const { task } = defineProps<{ task: Task | null }>();

const open = defineModel<boolean>('open', { required: true });

const store = useTaskStore();
const toast = useToast();

const errors = ref<ValidationErrors>({});
const submitting = ref(false);
const formKey = ref(0);

// Start with a fresh form every time the dialog opens.
watch(open, (isOpen) => {
    if (isOpen) {
        errors.value = {};
        formKey.value++;
    }
});

async function save(input: TaskInput): Promise<void> {
    submitting.value = true;
    errors.value = {};

    try {
        if (task) {
            await store.update(task.id, input);
            toast.success('Task updated');
        } else {
            await store.create(input);
            toast.success('Task added');
        }

        open.value = false;
    } catch (error) {
        const validationErrors = getValidationErrors(error);

        if (validationErrors) {
            errors.value = validationErrors;
        } else {
            toast.error(getErrorMessage(error));
        }
    } finally {
        submitting.value = false;
    }
}
</script>

<template>
    <BaseDialog
        v-model:open="open"
        :title="task ? 'Edit task' : 'New task'"
        :description="task ? undefined : 'Capture it now, sort it out later.'"
    >
        <TaskForm
            :key="formKey"
            :initial="task"
            :errors="errors"
            :submitting="submitting"
            :submit-label="task ? 'Save changes' : 'Add task'"
            @submit="save"
            @cancel="open = false"
        />
    </BaseDialog>
</template>
