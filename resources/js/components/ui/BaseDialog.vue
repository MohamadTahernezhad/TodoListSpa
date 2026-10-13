<script setup lang="ts">
import { X } from 'lucide-vue-next';
import { onMounted, useId, useTemplateRef, watch } from 'vue';

const { title, description } = defineProps<{
    title: string;
    description?: string;
}>();

const open = defineModel<boolean>('open', { required: true });

defineSlots<{ default?(): unknown; footer?(): unknown }>();

const dialog = useTemplateRef<HTMLDialogElement>('dialog');
const titleId = useId();
const descriptionId = useId();

function sync(isOpen: boolean): void {
    const element = dialog.value;

    if (!element) return;

    if (isOpen && !element.open) {
        element.showModal();
    } else if (!isOpen && element.open) {
        element.close();
    }
}

watch(open, sync, { flush: 'post' });
onMounted(() => sync(open.value));

/** Clicking the backdrop (the dialog element itself, outside the panel) closes it. */
function onClick(event: MouseEvent): void {
    if (event.target === dialog.value) {
        open.value = false;
    }
}
</script>

<template>
    <dialog
        ref="dialog"
        class="app-dialog m-auto w-[calc(100%-2rem)] max-w-lg overflow-visible bg-transparent p-0 text-fg backdrop:bg-transparent"
        :aria-labelledby="titleId"
        :aria-describedby="description ? descriptionId : undefined"
        @close="open = false"
        @click="onClick"
    >
        <div class="rounded-2xl border border-line bg-surface p-6 shadow-2xl shadow-black/10">
            <header class="mb-5 flex items-start justify-between gap-4">
                <div>
                    <h2 :id="titleId" class="text-lg font-semibold tracking-tight">{{ title }}</h2>
                    <p v-if="description" :id="descriptionId" class="mt-1 text-sm text-fg-muted">
                        {{ description }}
                    </p>
                </div>
                <button
                    type="button"
                    class="-m-1.5 grid size-8 cursor-pointer place-items-center rounded-lg text-fg-subtle transition hover:bg-surface-muted hover:text-fg"
                    aria-label="Close"
                    @click="open = false"
                >
                    <X class="size-4" aria-hidden="true" />
                </button>
            </header>

            <slot />

            <footer v-if="$slots.footer" class="mt-6 flex justify-end gap-2">
                <slot name="footer" />
            </footer>
        </div>
    </dialog>
</template>
