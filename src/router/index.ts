/*
 * @Description:
 * @version: v1.0.0
 * @Author: GaoMingze
 * @Date: 2025-09-12 17:13:29
 * @LastEditors: GaoMingze
 * @LastEditTime: 2025-09-22 01:04:47
 */
import { createRouter, createWebHistory } from 'vue-router'
import LoginLayout from '../layouts/LoginLayout.vue'
import BasicLayout from '../layouts/BasicLayout.vue'

const routes = [
    {
        path: '/',
        redirect: '/login',
    },
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
    // 主应用布局 (包含Tabbar页面)
    {
        path: '/sebm',
        component: BasicLayout,
        children: [
            // 首页
            {
                path: 'home',
                name: 'Home',
                component: () => import('../views/sebm/HomePage.vue'),
                meta: { title: 'Home' },
            },
            // 用户主页
            {
                path: 'userinfo',
                name: 'UserInfo',
                component: () => import('../views/sebm/UserInfoPage.vue'),
                meta: { title: 'UserInfo' },
            },
            // 用户信息编辑页
            {
                path: 'userinfoedit',
                name: 'UserInfoEdit',
                component: () => import('../views/sebm/UserInfoEditPage.vue'),
                meta: { title: 'Edit User Info' },
            },
            // 设备页
            {
                path: 'device',
                name: 'Device',
                component: () => import('../views/sebm/DevicePage.vue'),
                meta: { title: 'Device' },
            },
            // 消息页
            {
                path: 'messagebox',
                name: 'MessageBox',
                component: () => import('../views/sebm/MessageBoxPage.vue'),
                meta: { title: 'MessageBox' },
            },
        ],
    },
    // 404处理
    {
        path: '/:pathMatch(.*)*',
        redirect: '/sebm/home', // 或指定到404页面
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router
