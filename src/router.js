import { createRouter, createWebHistory } from "vue-router";
import Login from './components/Login.vue'
import Users from './components/Users.vue'
import User from './components/User.vue'


const routes = [
    {path: '/login', component: Login, meta: {auth: false}},
    {path: '/users', component: Users, meta: {auth: true}},
    {path: '/user/:id', component: User,  name: "user-view", meta: {auth: true}}
]
const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach( (to, from, next) => {
    if (to.meta.auth && !localStorage.getItem('user-data')) {
        next('/login');
    } else if (!to.meta.auth && localStorage.getItem('user-data')) {
        next('/users')
    }
    next();
})


export default router;