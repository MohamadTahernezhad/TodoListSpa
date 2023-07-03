<script setup>
import {inject, ref} from "vue";
import axios from "axios";

const props = defineProps(['tasks']);
const emit = defineEmits(['alldata']);

const Swal = inject('swal')

const UpdateTask = (taskId, data) => {
    axios.put(`/task/${taskId}`, {data: data}).then(res => {
        if (res.data === 200) {
            Swal.fire(
                'Update Success',
                'Your Task Update Successfully',
                'success'
            )
        }
    });
    emit('alldata');
}
</script>

<template>

    <div class="mt-10 grid gap-5 no-scrollbar overflow-x-auto h-[28rem] dark:text-black">
        <div class="bg-slate-50 rounded-xl p-5" v-for="task in props.tasks">
            <div class="flex justify-between mb-5">
                <div class="w-[80%]">
                    <div class="flex gap-2">
                        <p class="w-4 h-4 mt-1 bg-red-800 rounded-full" v-if="task.importance===1"></p>
                        <p class="w-4 h-4 mt-1 bg-green-800 rounded-full" v-if="task.importance===2"></p>
                        <p class="w-4 h-4 mt-1 bg-blue-800 rounded-full" v-if="task.importance===3"></p>
                        <h2 :class="{'line-through':task.active==1}">{{ task.title }}</h2>
                    </div>

                    <p class="text-sm ml-6 text-justify" :class="{'line-through':task.active==1}">{{ task.body }}</p>
                </div>
                <div>
                    <input type="checkbox" class="bg-red-800 w-5 h-5" v-if="task.active==1" checked
                           @change="UpdateTask(task.id,0)">
                    <input type="checkbox" class="bg-red-800 w-5 h-5" v-else @change="UpdateTask(task.id,1)">
                </div>
            </div>
            <hr>
            <div class="mt-2 ml-6 flex gap-2 items-center">
                <span class="font-bold text-slate-500 text-sm">{{ task.created_at }}</span>
                <span class="text-slate-400 text-sm">{{ task.start_at }}</span>
                <span class="text-slate-400 text-sm">{{ task.end_at }}</span>
            </div>
        </div>
    </div>
</template>

