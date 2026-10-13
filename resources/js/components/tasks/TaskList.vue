<script setup lang="ts">
import TaskItem from '@/components/tasks/TaskItem.vue';
import type { Task } from '@/types/task';

const { tasks } = defineProps<{ tasks: Task[] }>();

const emit = defineEmits<{
    toggle: [task: Task];
    edit: [task: Task];
    delete: [task: Task];
}>();
</script>

<template>
    <TransitionGroup
        tag="ul"
        class="relative flex flex-col gap-2.5"
        move-class="transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
        enter-from-class="opacity-0 -translate-y-1.5"
        enter-active-class="transition duration-300 ease-out"
        leave-to-class="opacity-0 scale-[0.98]"
        leave-active-class="absolute inset-x-0 transition duration-200 ease-in"
    >
        <TaskItem
            v-for="task in tasks"
            :key="task.id"
            :task="task"
            @toggle="emit('toggle', $event)"
            @edit="emit('edit', $event)"
            @delete="emit('delete', $event)"
        />
    </TransitionGroup>
</template>
