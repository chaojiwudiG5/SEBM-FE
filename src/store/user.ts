/*
 * @Description:
 * @version: v1.0.0
 * @Author: GaoMingze
 * @Date: 2025-09-24 21:29:14
 * @LastEditors: GaoMingze
 * @LastEditTime: 2025-09-24 23:18:37
 */
import { defineStore } from 'pinia'
import { getCurrentUser } from '../api/user'
import { showNotify } from 'vant'
//@ts-ignore
export const useUserStore = defineStore('user', {
    state: () => ({
        userInfo: null as API.UserVo | null,
    }),

    actions: {
        setUserInfo(user: API.UserVo) {
            this.userInfo = user
        },

        clearUserInfo() {
            this.userInfo = null
        },

        async loadFromServer() {
            try {
                const res = await getCurrentUser() // 调用后端接口获取 session 用户信息
                this.userInfo = res as API.UserVo
            } catch (err) {
                this.userInfo = null
                showNotify('获取用户信息失败')
            }
        },
    },

    persist: {
        enabled: true, // 开启持久化
        strategies: [
            {
                key: 'user', // 存储的 key
                storage: localStorage, // 也可以使用 sessionStorage
            },
        ],
    },
})
