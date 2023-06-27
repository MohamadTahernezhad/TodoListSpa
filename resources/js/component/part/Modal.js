import {ref} from "vue";

const showModal = ref(false);

const closeModal = (e) => {
    if (e.target.className.includes('modalGallery')) {
        showModal.value = false;
    }
}
const btnShowModal = () => {
    showModal.value = true;
}


export {
    showModal,
    closeModal,
    btnShowModal,
}
