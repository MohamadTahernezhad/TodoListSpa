<script setup>
import {onMounted, ref} from "vue";
import {btnShowModal, showModal} from './part/Modal.js';
import axios from "axios";
import {useDark, useToggle} from "@vueuse/core";

import AllTaskComponent from "./AllTaskComponent.vue";
import OpenTaskComponent from "./OpenTaskComponent.vue";
import CloseTaskComponent from "./CloseTaskComponent.vue";
import ModalComponent from "./../component/part/ModalComponent.vue";


const isDark = useDark();
const toggleDark = useToggle(isDark);

const props = defineProps(['date', 'tasks']);
const tasks = ref(props.tasks.data);

const currentTab = ref(AllTaskComponent)
const isActive = ref('all')
const ActiveArray = ref([]);
const NotActiveArray = ref([]);
const AllArray = ref([]);

const changeTab = (componentName, type) => {
    currentTab.value = componentName;
    isActive.value = type;
}
const GetData = () => {
    tasks.value.forEach((item) => {
        AllArray.value.push(item);
        if (item.active === 0) {
            ActiveArray.value.push(item);
        } else {
            NotActiveArray.value.push(item);
        }
    })
}
const GetNewData = () => {
    axios.get('get-all-tasks-data').then(res => {
        ClearArray();
        tasks.value = res.data.data;
        GetData();
    })
}
const ClearArray = () => {
    ActiveArray.value = [];
    NotActiveArray.value = [];
    AllArray.value = [];
}
onMounted(() => {
    GetData();
})
</script>

<template>
    <div class="my-5 flex justify-between items-center">
        <div class="ml-1">
            <h2 class="font-bold text-[1.3rem]">Todayُ s Task</h2>
            <span class="ml-[.1rem]">{{ props.date }}</span>
        </div>

        <div class="flex gap-1 items-center">
            <button
                class="w-8 h-8 rounded-full text-xs dark:text-black flex justify-center items-center"
                @click="toggleDark()">
                <svg class="icon w-5 h-5" v-if="!isDark">
                    <use xlink:href="#moon"></use>
                </svg>
                <svg class="icon w-5 h-5 dark:fill-white" v-else>
                    <use xlink:href="#day"></use>
                </svg>
            </button>
            <div
                class="flex items-center gap-2 bg-blue-50 px-6 py-2 rounded-xl text-blue-900 text font-bold hover:cursor-pointer hover:shadow transition-shadow">
                <strong class="text-xl font-bold">+</strong>
                <strong @click="btnShowModal">NewTask</strong>
                <modal-component v-if="showModal" @data="GetNewData()"></modal-component>
            </div>
        </div>

    </div>
    <div class="flex gap-5 ml-[.4rem]">
        <div class="flex gap-1 hover:cursor-pointer" @click="changeTab(AllTaskComponent,'all')">
            <strong class="font-bold text-sm" :class="{'text-blue-700':isActive=='all'}"
            >All</strong>
            <strong
                class="text-[.65rem] bg-gray-300 text-black rounded-full w-6 flex justify-center items-center">{{
                    AllArray.length
                }}</strong>
        </div>
        <div class="flex gap-1 hover:cursor-pointer border-l-2 border-slate-200 border-solid pl-5"
             @click="changeTab(OpenTaskComponent,'open')">
            <strong class="font-bold text-sm"
                    :class="{'text-blue-700':isActive=='open'}">Open</strong>
            <strong
                class="text-[.65rem] bg-gray-300 text-black rounded-full w-6 flex justify-center items-center">{{
                    ActiveArray.length
                }}</strong>
        </div>
        <div class="flex gap-1 hover:cursor-pointer" @click="changeTab(CloseTaskComponent,'close')">
            <strong class="font-bold text-sm" :class="{'text-blue-700':isActive=='close'}">Closed</strong>
            <strong
                class="text-[.65rem] bg-gray-300 text-black rounded-full w-6 flex justify-center items-center">{{
                    NotActiveArray.length
                }}</strong>
        </div>
    </div>
    <div v-if="isActive==='all'">
        <component :is="currentTab" :tasks="AllArray" @alldata="GetNewData()"></component>
    </div>
    <div v-else-if="isActive==='open'">
        <component :is="currentTab" :tasks="ActiveArray" @alldata="GetNewData()"></component>
    </div>
    <div v-else>
        <component :is="currentTab" :tasks="NotActiveArray" @alldata="GetNewData()"></component>
    </div>
</template>
