<script setup>
import {onMounted, ref} from "vue";
import AllTaskComponent from "./AllTaskComponent.vue";
import OpenTaskComponent from "./OpenTaskComponent.vue";
import CloseTaskComponent from "./CloseTaskComponent.vue";

const props = defineProps(['date', 'tasks', 'countData']);
const tasks = ref(props.tasks.data);

const currentTab = ref(AllTaskComponent)
const isActive = ref('all')
const changeTab = (componentName, type) => {
    currentTab.value = componentName;
    isActive.value = type;
}

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
    <div class="flex gap-5 ml-[.4rem]">
        <div class="flex gap-1 hover:cursor-pointer" @click="changeTab(AllTaskComponent,'all')">
            <strong class="font-bold text-sm" :class="{'text-blue-700':isActive=='all'}"
            >All</strong>
            <strong
                class="text-[.65rem] bg-gray-300 text-white rounded-full w-6 flex justify-center items-center"
                :class="{'bg-blue-700':isActive=='all'}">{{
                    tasks.length
                }}</strong>
        </div>
        <div class="flex gap-1 hover:cursor-pointer border-l-2 border-slate-200 border-solid pl-5"
             @click="changeTab(OpenTaskComponent,'open')">
            <strong class="font-bold text-sm"
                    :class="{'text-blue-700':isActive=='open'}">Open</strong>
            <strong
                class="text-[.65rem] bg-gray-300 text-white rounded-full w-6 flex justify-center items-center"
                :class="{'bg-blue-700':isActive=='open'}">15</strong>
        </div>
        <div class="flex gap-1 hover:cursor-pointer" @click="changeTab(CloseTaskComponent,'close')">
            <strong class="font-bold text-sm" :class="{'text-blue-700':isActive=='close'}">Closed</strong>
            <strong
                class="text-[.65rem] bg-gray-300 text-white rounded-full w-6 flex justify-center items-center"
                :class="{'bg-blue-700':isActive=='close'}">19</strong>
        </div>
    </div>
    <component :is="currentTab" :tasks="props.tasks" :date="props.date"></component>
</template>
