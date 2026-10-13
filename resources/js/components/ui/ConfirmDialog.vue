<script setup lang="ts">
import AppButton from '@/components/ui/AppButton.vue';
import BaseDialog from '@/components/ui/BaseDialog.vue';

const {
    title,
    description,
    confirmLabel = 'Confirm',
} = defineProps<{
    title: string;
    description?: string;
    confirmLabel?: string;
}>();

const emit = defineEmits<{ confirm: [] }>();

const open = defineModel<boolean>('open', { required: true });

function confirm(): void {
    open.value = false;
    emit('confirm');
}
</script>

<template>
    <BaseDialog v-model:open="open" :title="title" :description="description">
        <template #footer>
            <AppButton variant="ghost" @click="open = false">Cancel</AppButton>
            <AppButton variant="danger" @click="confirm">{{ confirmLabel }}</AppButton>
        </template>
    </BaseDialog>
</template>
