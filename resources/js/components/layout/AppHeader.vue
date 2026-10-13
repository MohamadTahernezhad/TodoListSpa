<script setup lang="ts">
import { Check, Github } from 'lucide-vue-next';

import ThemeToggle from '@/components/ui/ThemeToggle.vue';

const repositoryUrl = 'https://github.com/MohamadTahernezhad/TodoListSpa';
</script>

<template>
    <header class="flex items-center justify-between py-6">
        <a href="/" class="flex items-center gap-2.5 rounded-lg font-semibold tracking-tight">
            <span
                class="grid size-8 place-items-center rounded-[0.625rem] bg-linear-to-br from-violet-500 to-indigo-600 text-white shadow-md shadow-indigo-500/25"
            >
                <Check class="size-4.5" :stroke-width="3" aria-hidden="true" />
            </span>
            Todo
        </a>

        <div class="flex items-center gap-2">
            <ThemeToggle />
            <a
                :href="repositoryUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="grid size-8 place-items-center rounded-lg text-fg-subtle transition hover:bg-surface-muted hover:text-fg"
                aria-label="Source code on GitHub"
                title="Source code on GitHub"
            >
                <Github class="size-4" aria-hidden="true" />
            </a>
        </div>
    </header>
</template>
