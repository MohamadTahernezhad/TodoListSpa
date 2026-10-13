<script setup lang="ts">
defineSlots<{ default(): unknown }>();
</script>

<template>
    <kbd
        class="inline-grid h-5 min-w-5 place-items-center rounded-md border border-current/20 px-1 font-sans text-[0.6875rem] font-medium opacity-70"
    >
        <slot />
    </kbd>
</template>
