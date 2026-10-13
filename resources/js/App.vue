<script setup lang="ts">
import AppHeader from '@/components/layout/AppHeader.vue';
import ToastViewport from '@/components/ui/ToastViewport.vue';
import TasksPage from '@/pages/TasksPage.vue';
</script>

<template>
    <div
        class="pointer-events-none fixed inset-x-0 top-0 -z-10 h-[28rem] bg-[radial-gradient(ellipse_60%_60%_at_50%_-10%,var(--color-accent-soft),transparent)] opacity-90 dark:opacity-60"
        aria-hidden="true"
    />

    <div class="mx-auto flex min-h-dvh max-w-2xl flex-col px-4 sm:px-6">
        <AppHeader />

        <main class="flex-1 pt-6 pb-16 sm:pt-10">
            <TasksPage />
        </main>

        <footer class="border-t border-line py-6 text-center text-xs text-fg-subtle">
            Built with Laravel &amp; Vue · Press <span class="font-medium text-fg-muted">N</span> to add a
            task
        </footer>
    </div>

    <ToastViewport />
</template>
