/*
 * @Description:
 * @version: v1.0.0
 * @Author: GaoMingze
 * @Date: 2025-09-12 17:13:29
 * @LastEditors: GaoMingze
 * @LastEditTime: 2025-09-12 18:00:59
 */
import { createRouter, createWebHistory } from 'vue-router'
import LoginLayout from '../layouts/LoginLayout.vue'

const routes = [
    {
        path: '/',
        component: LoginLayout, // 使用布局组件
        children: [
            {
                path: 'login', // 默认子路由
                name: 'Login',
                component: () => import('../views/UserLoginPage.vue'),
            },
            {
                path: 'register',
                name: 'Register',
                component: () => import('../views/UserRegisterPage.vue'),
            },
        ],
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router
