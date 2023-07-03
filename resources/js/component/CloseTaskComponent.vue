<script setup>
import {ref} from "vue";

const props = defineProps(['tasks']);
</script>

<template>
    <div class="mt-10 grid gap-5 no-scrollbar overflow-x-auto h-[28rem] dark:text-black">
        <div v-for="taskclose in props.tasks">
            <div class="bg-slate-50 rounded-xl p-5">
                <div class="flex justify-between mb-5">
                    <div class="w-[80%]">
                        <div class="flex gap-2">
                            <p class="w-4 h-4 mt-1 bg-red-800 rounded-full" v-if="taskclose.importance===1"></p>
                            <p class="w-4 h-4 mt-1 bg-green-800 rounded-full" v-if="taskclose.importance===2"></p>
                            <p class="w-4 h-4 mt-1 bg-blue-800 rounded-full" v-if="taskclose.importance===3"></p>
                            <h2 class="line-through">{{ taskclose.title }}</h2>
                        </div>

                        <p class="text-sm ml-6 text-justify line-through">{{
                                taskclose.body
                            }}</p>
                    </div>
                    <div>
                        <input type="checkbox" class="bg-red-800 w-5 h-5" checked>
                    </div>
                </div>
                <hr>
                <div class="mt-2 ml-6 flex gap-2 items-center">
                    <span class="font-bold text-slate-500 text-sm">Today</span>
                    <span class="text-slate-400 text-sm">{{ taskclose.start_at }}</span>
                    <span class="text-slate-400 text-sm">{{ taskclose.end_at }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

