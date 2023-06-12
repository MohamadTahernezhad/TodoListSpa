<script setup>
import {onMounted, ref} from "vue";

const props = defineProps(['date', 'tasks', 'countData']);
const tasks = ref(props.tasks.data);

</script>

<template>
    <div class="my-5 flex justify-between items-center">
        <div class="ml-1">
            <h2 class="font-bold text-[1.3rem]">Todayُ s Task</h2>
            <span class="ml-[.1rem]">{{ props.date }}</span>
        </div>
        <div
            class="flex items-center gap-2 bg-blue-50 px-6 py-2 rounded-xl text-blue-900 text font-bold hover:cursor-pointer hover:shadow transition-shadow">
            <strong class="text-xl font-bold">+</strong>
            <strong>NewTask</strong>
        </div>
    </div>
    <div class="flex gap-5 ml-[.2rem]">
        <div class="flex gap-1 hover:cursor-pointer">
            <strong class="text-blue-900 font-bold text-sm">All</strong>
            <strong
                class="text-[.65rem] bg-blue-900 text-white rounded-full w-6 flex justify-center items-center">{{
                    tasks.length
                }}</strong>
        </div>
        <div class="flex gap-1 hover:cursor-pointer border-l-2 border-slate-200 border-solid pl-5">
            <strong class="font-bold text-sm">Open</strong>
            <strong
                class="text-[.65rem] bg-gray-300 text-white rounded-full w-6 flex justify-center items-center">15</strong>
        </div>
        <div class="flex gap-1 hover:cursor-pointer">
            <strong class="font-bold text-sm">Closed</strong>
            <strong
                class="text-[.65rem] bg-gray-300 text-white rounded-full w-6 flex justify-center items-center">19</strong>
        </div>
    </div>
    <div class="mt-10 grid gap-5 no-scrollbar overflow-x-auto h-[28rem]">
        <div class="bg-slate-50 rounded-xl p-5" v-for="(task,index) in tasks">
            <div class="flex justify-between mb-5">
                <div class="w-[80%]">
                    <div class="flex gap-2">
                        <p class="w-4 h-4 mt-1 bg-red-800 rounded-full" v-if="task.importance===1"></p>
                        <p class="w-4 h-4 mt-1 bg-green-800 rounded-full" v-if="task.importance===2"></p>
                        <p class="w-4 h-4 mt-1 bg-blue-800 rounded-full" v-if="task.importance===3"></p>
                        <h2>{{ task.title }}</h2>
                    </div>

                    <p class="text-sm ml-6 text-justify">{{ task.body }}</p>
                </div>
                <div>
                    <input type="checkbox" class="bg-red-800 w-5 h-5">
                </div>
            </div>
            <hr>
            <div class="mt-2 ml-6 flex gap-2 items-center">
                <span class="font-bold text-slate-500 text-sm">Today</span>
                <span class="text-slate-400 text-sm">{{ task.start_at }}</span>
                <span class="text-slate-400 text-sm">{{ task.end_at }}</span>
            </div>
        </div>
    </div>
</template>
