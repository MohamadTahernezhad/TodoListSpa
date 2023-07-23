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
const destroyTask = (id) => {
    console.log(id)
    Swal.fire({
        title: 'Are You Sure To Delete This Task?',
        text: "It is not possible to return for this operation!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'
    }).then((result) => {
        if (result.isConfirmed) {
            axios.delete(`/task/${id}`).then(res => {
                if (res.data === 200) {
                    Swal.fire(
                        'Deleted',
                        'Your task Delete Successfully',
                        'success'
                    )
                    emit('alldata');
                }
            });
        }
    })
}
</script>

<template>
    <div class="mt-10 grid gap-5 no-scrollbar overflow-x-auto h-[28rem] dark:text-black">
        <div class="bg-slate-50 rounded-xl p-5 group" v-for="task in props.tasks">
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
                <div class="grid justify-items-center gap-5">
                    <input checked id="checked-checkbox" type="checkbox" v-if="task.active==1"
                           @change="UpdateTask(task.id,0)"
                           class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                    <input id="checked-checkbox" type="checkbox"
                           v-else @change="UpdateTask(task.id,1)"
                           class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                    <button
                        class="invisible opacity-0 transition-all duration-300 ease-in-out group-hover:visible group-hover:opacity-100">
                        <svg class="icon w-5 h-5">
                            <use xlink:href="#edit"></use>
                        </svg>
                    </button>
                    <button @click="destroyTask(task.id)"
                            class="invisible opacity-0 transition-all duration-300 ease-in-out group-hover:visible group-hover:opacity-100">
                        <svg class="icon w-5 h-5">
                            <use xlink:href="#delete"></use>
                        </svg>
                    </button>
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

