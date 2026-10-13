<template>
    <ul class="flex flex-col gap-2.5" aria-busy="true" aria-label="Loading tasks">
        <li
            v-for="row in 3"
            :key="row"
            class="flex animate-pulse gap-3.5 rounded-2xl border border-line bg-surface p-4"
            :style="{ animationDelay: `${row * 120}ms` }"
        >
            <div class="size-5 shrink-0 rounded-full bg-surface-muted" />
            <div class="flex-1 space-y-2.5">
                <div class="h-4 w-2/3 rounded-md bg-surface-muted" />
                <div class="h-3 w-full rounded-md bg-surface-muted" />
                <div class="h-5 w-24 rounded-full bg-surface-muted" />
            </div>
        </li>
    </ul>
</template>
