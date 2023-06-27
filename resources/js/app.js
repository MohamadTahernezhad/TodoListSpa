import './bootstrap';
import {createApp} from "vue/dist/vue.esm-bundler";
import * as VueRouter from 'vue-router';

const app = createApp({});
import TaskComponent from "./component/TaskComponent.vue";
import AboutComponent from "./component/aboutComponent.vue";

//sweet alert
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
app.use(VueSweetalert2, {}).provide('swal', app.config.globalProperties.$swal);


const routes = [
    {path: '/', component: TaskComponent, props: true},
    {path: '/about', component: AboutComponent},
];
const router = VueRouter.createRouter({
    history: VueRouter.createWebHistory('/'), routes,
});
app.use(router);
app.component('task-component', TaskComponent);
app.component('about-component', AboutComponent);

app.mount('#app');
