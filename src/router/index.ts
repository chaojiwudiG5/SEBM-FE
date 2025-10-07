/*
 * @Description:
 * @version: v1.0.0
 * @Author: GaoMingze
 * @Date: 2025-09-12 17:13:29
 * @LastEditors: GaoMingze
 * @LastEditTime: 2025-09-25 22:46:22
 */
import { createRouter, createWebHistory } from 'vue-router'
import LoginLayout from '../layouts/LoginLayout.vue'
import BasicLayout from '../layouts/BasicLayout.vue'
import { useUserStore } from '../store/user'
import { showNotify } from 'vant'

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
    // 普通用户布局
    {
        path: '/sebm/user',
        component: BasicLayout,
        meta: { requiresAuth: true, role: 0 }, // 普通用户role为0
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
            // 借用页
            {
                path: 'borrow',
                name: 'Borrow',
                component: () => import('../views/sebm/BorrowPage.vue'),
                meta: { title: 'Borrow Device' },
            },
            // 归还页
            {
                path: 'return',
                name: 'Return',
                component: () => import('../views/sebm/ReturnPage.vue'),
                meta: { title: 'Return Device' },
            },
        ],
    },
    // 技工布局
    {
        path: '/sebm/mechanic',
        component: BasicLayout,
        meta: { requiresAuth: true, role: 2 }, // 技工role为2
        children: [
            // 任务页
            {
                path: 'tasks',
                name: 'Tasks',
                component: () => import('../views/sebm/TasksPage.vue'),
                meta: { title: 'Tasks' },
            },
            // 技工用户主页
            {
                path: 'userinfo',
                name: 'MechanicUserInfo',
                component: () => import('../views/sebm/UserInfoPage.vue'),
                meta: { title: 'UserInfo' },
            },
            // 维修完成页
            {
                path: 'maintenance-complete',
                name: 'MaintenanceComplete',
                component: () => import('../views/sebm/MaintenanceCompletePage.vue'),
                meta: { title: 'Maintenance Complete' },
            },
        ],
    },
    // 404处理
    {
        path: '/:pathMatch(.*)*',
        redirect: (to: any) => {
            const userStore = useUserStore()
            if (userStore.userInfo?.userRole === 2) {
                return '/sebm/mechanic/tasks'
            } else if (userStore.userInfo?.userRole === 0) {
                return '/sebm/user/home'
            } else if (userStore.userInfo?.userRole === 1) {
                return '/sebm/user/home' // 管理员暂时跳转到用户页面
            } else {
                return '/login'
            }
        },
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach((to, from, next) => {
    const userStore = useUserStore()

    // 不需要认证的路由直接放行
    if (!to.meta.requiresAuth) {
        return next()
    }

    // 检查用户是否登录
    if (!userStore.userInfo) {
        return next('/login')
    }

    // 检查用户角色是否匹配路由要求的角色
    if (userStore.userInfo.userRole !== to.meta.role) {
        showNotify({ type: 'danger', message: '非法路径' })
        return next(
            userStore.userInfo.userRole === 2
                ? '/sebm/mechanic/tasks'
                : userStore.userInfo.userRole === 0
                ? '/sebm/user/home'
                : userStore.userInfo.userRole === 1
                ? '/sebm/user/home' // 管理员暂时跳转到用户页面
                : '/login'
        )
    }

    next()
})

export default router
