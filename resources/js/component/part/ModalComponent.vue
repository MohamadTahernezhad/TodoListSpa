<script setup>
import {closeModal, showModal} from "./Modal.js";
import {inject, ref} from "vue";

const emits = defineEmits(['data'])

const Swal = inject('swal')

const errorList = ref([]);

const timeForm = ref({
    start_at_hour: '',
    start_at_minute: '',
    end_at_hour: '',
    end_at_minute: '',
});

const form = ref({
    title: '',
    importance: -1,
    body: '',
    start_at: '',
    end_at: '',
});
const CheckTime = () => {
    if (timeForm.value.start_at_hour == "" && timeForm.value.start_at_minute == "") {
        form.value.start_at = "";
    } else if (timeForm.value.end_at_hour == "" && timeForm.value.end_at_minute == "") {
        form.value.end_at = "";
    } else {
        form.value.start_at = timeForm.value.start_at_hour + ':' + timeForm.value.start_at_minute;
        form.value.end_at = timeForm.value.end_at_hour + ':' + timeForm.value.end_at_minute;
    }
}
const storeTask = () => {
    form.value.importance = (form.value.importance === -1) ? null : form.value.importance;
    CheckTime();
    axios.post('/task/create', form.value).then(res => {
        if (res.data === 200) {
            Swal.fire(
                'Insert Success',
                'Your Task Insert Successfully',
                'success'
            ).then((result) => {
                if (result.isConfirmed) {
                    showModal.value = false;
                }
            });
        }
    }).catch(error => {
        errorList.value = error.response.data.errors
    });
}
const ClearData = () => {
    form.value = {
        title: '',
        importance: -1,
        body: '',
        start_at: '',
        end_at: '',
    }
    errorList.value = []
}

function GetData() {
    storeTask();
    emits('data');
}

</script>

<template>
    <div
        class="modalGallery fixed left-0 top-0 w-screen h-screen bg-[rgba(5,5,5,.6)] grid justify-center items-center hover:cursor-default transition-all"
        @click="closeModal">
        <div class="bg-white w-[40rem] p-5 rounded-lg">
            <h1 class="text-center text-xl drop-shadow">Add New Task</h1>
            <div class="p-5 m-5 bg-slate-100 shadow rounded-lg grid gap-5">
                <div class="grid grid-cols-2 gap-5 rounded">
                    <div>
                        <input type="text" placeholder="Title" v-model="form.title"
                               class="rounded-lg p-1 text-[.8rem] text-black w-full focus:outline-none">
                        <div class="text-red-500 text-[.7rem] pr-1 pt-2" v-if="errorList.title">
                            {{ errorList.title[0] }}
                        </div>

                    </div>
                    <div>
                        <select name="" id="" class="w-full rounded-lg p-[.4rem] text-[.8rem] text-black bg-white"
                                v-model="form.importance">
                            <option value="-1" disabled>Important</option>
                            <option value="1">High Important</option>
                            <option value="2">Middle Important</option>
                            <option value="3">Low Important</option>
                        </select>
                        <div class="text-red-500 text-[.7rem] pr-1 pt-2" v-if="errorList.importance">
                            {{ errorList.importance[0] }}
                        </div>
                    </div>
                </div>
                <div>
                        <textarea
                            class="w-full resize-none h-44 rounded-lg shadow p-2 focus:outline-none text-black text-[.8rem]"
                            v-model="form.body"></textarea>
                    <div class="text-red-500 text-[.7rem] pr-1 pt-2" v-if="errorList.body">
                        {{ errorList.body[0] }}
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-5">
                    <div class="grid gap-2">
                        <label for="" class="text-black text-[.79rem]">Start at</label>
                        <div>
                            <input type="text" placeholder="00"
                                   class="rounded-lg text-black text-[.79rem] p-1 shadow w-8 text-center" maxlength="2"
                                   v-model="timeForm.start_at_hour">
                            :
                            <input type="text" placeholder="00"
                                   class="rounded-lg text-black text-[.79rem] p-1 shadow w-8 text-center" maxlength="2"
                                   v-model="timeForm.start_at_minute">
                            <div class="text-red-500 text-[.7rem] pr-1 pt-2" v-if="errorList.start_at">
                                {{ errorList.start_at[0] }}
                            </div>
                        </div>
                    </div>
                    <div class="grid gap-2">
                        <label for="" class="text-black text-[.79rem]">End at</label>
                        <div>
                            <input type="text" placeholder="00"
                                   class="rounded-lg text-black text-[.79rem] p-1 shadow w-8 text-center" maxlength="2"
                                   v-model="timeForm.end_at_hour">
                            :
                            <input type="text" placeholder="00"
                                   class="rounded-lg text-black text-[.79rem] p-1 shadow w-8 text-center" maxlength="2"
                                   v-model="timeForm.end_at_minute">
                            <div class="text-red-500 text-[.7rem] pr-1 pt-2" v-if="errorList.end_at">
                                {{ errorList.end_at[0] }}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-5">
                    <button class="text-[.8rem] bg-red-600 text-white p-2 rounded-lg shadow" @click="ClearData">
                        Clear
                    </button>
                    <button class="text-[.8rem] bg-blue-600 text-white p-2 rounded-lg shadow" @click="GetData()">
                        Save
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
