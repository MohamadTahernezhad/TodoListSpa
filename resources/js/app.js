import './bootstrap';
import {createApp} from "vue/dist/vue.esm-bundler.js";
import * as VueRouter from 'vue-router';

const app = createApp({});
import TaskComponent from "./component/TaskComponent.vue";
import AboutComponent from "./component/aboutComponent.vue";

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
