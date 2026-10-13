<script setup lang="ts">
import { LoaderCircle } from 'lucide-vue-next';
import { computed } from 'vue';

import { cn } from '@/lib/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'icon';

const {
    variant = 'secondary',
    size = 'md',
    type = 'button',
    loading = false,
    disabled = false,
} = defineProps<{
    variant?: Variant;
    size?: Size;
    type?: 'button' | 'submit';
    loading?: boolean;
    disabled?: boolean;
}>();

defineSlots<{ default(): unknown }>();

const variants: Record<Variant, string> = {
    primary: 'bg-accent text-accent-fg shadow-sm shadow-accent/25 hover:bg-accent-hover',
    secondary: 'border border-line bg-surface text-fg shadow-xs hover:bg-surface-muted',
    ghost: 'text-fg-muted hover:bg-surface-muted hover:text-fg',
    danger: 'bg-danger text-white shadow-sm shadow-danger/25 hover:brightness-110',
};

const sizes: Record<Size, string> = {
    sm: 'h-8 gap-1.5 rounded-lg px-3 text-sm',
    md: 'h-10 gap-2 rounded-xl px-4 text-sm',
    icon: 'size-9 rounded-lg',
};

const classes = computed(() =>
    cn(
        'inline-flex shrink-0 cursor-pointer items-center justify-center font-medium whitespace-nowrap transition duration-150 select-none active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50',
        variants[variant],
        sizes[size],
    ),
);
</script>

<template>
    <button :type="type" :class="classes" :disabled="disabled || loading" :aria-busy="loading || undefined">
        <LoaderCircle v-if="loading" class="size-4 animate-spin" aria-hidden="true" />
        <slot />
    </button>
</template>
