<script setup>
import {ref} from "vue";

const props = defineProps(['date']);


</script>

<template>
    <div class="my-5 flex justify-between items-center">
        <div>
            <h2 class="font-bold text-[1.3rem]">Todayُ s Task</h2>
            <span>{{ props.date }}</span>
        </div>
        <div
            class="flex items-center gap-2 bg-blue-50 px-6 py-2 rounded-xl text-blue-900 text font-bold hover:cursor-pointer hover:shadow transition-shadow">
            <strong class="text-xl">+</strong>
            <strong>NewTask</strong>
        </div>
    </div>
    <div class="flex gap-5">
        <div class="flex gap-1 hover:cursor-pointer">
            <strong class="text-blue-900 font-bold">All</strong>
            <strong
                class="text-[.65rem] bg-blue-900 text-white rounded-full w-6 flex justify-center items-center">35</strong>
        </div>
        <div class="flex gap-1 hover:cursor-pointer border-l-2 border-slate-200 border-solid pl-5">
            <strong class="font-bold">Open</strong>
            <strong
                class="text-[.65rem] bg-gray-300 text-white rounded-full w-6 flex justify-center items-center">14</strong>
        </div>
        <div class="flex gap-1 hover:cursor-pointer">
            <strong class="font-bold">Closed</strong>
            <strong
                class="text-[.65rem] bg-gray-300 text-white rounded-full w-6 flex justify-center items-center">19</strong>
        </div>
    </div>
    <div class="mt-10 grid gap-5">
        <div class="bg-slate-100 rounded p-5 ">
            <div class="flex justify-between">
                <div class="w-[60%]">
                    <div class="flex items-center gap-2">
                        <p class="w-4 h-4 bg-red-800 rounded-full"></p>
                        <h2>Lorem ipsum dolor sit amet</h2>
                    </div>

                    <p class="text-sm ml-6">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nulla,
                        officiis?</p>
                </div>
                <div>
                    <input type="checkbox" class="bg-red-800 w-5 h-5">
                </div>
            </div>
            <hr>
            <div class="mt-2">
                slm
            </div>
        </div>

        <div class="bg-slate-100 rounded p-5 flex justify-between">
            <div class="w-[60%]">
                <div class="flex items-center gap-2">
                    <p class="w-4 h-4 bg-red-800 rounded-full"></p>
                    <h2>Lorem ipsum dolor sit amet</h2>
                </div>

                <p class="text-sm ml-6">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nulla, officiis?</p>
            </div>
            <div>
                <input type="checkbox" class="bg-red-800 w-5 h-5">
            </div>
        </div>
        <div class="bg-slate-100 rounded p-5 flex justify-between">
            <div class="w-[60%]">
                <div class="flex items-center gap-2">
                    <p class="w-4 h-4 bg-red-800 rounded-full"></p>
                    <h2>Lorem ipsum dolor sit amet</h2>
                </div>
                <p class="text-sm ml-6">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nulla, officiis?</p>
            </div>
            <div>
                <input type="checkbox" class="bg-red-800 w-5 h-5">
            </div>
        </div>
    </div>
</template>
