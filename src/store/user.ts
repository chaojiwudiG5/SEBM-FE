/*
 * @Description:
 * @version: v1.0.0
 * @Author: GaoMingze
 * @Date: 2025-09-24 21:29:14
 * @LastEditors: GaoMingze
 * @LastEditTime: 2025-09-25 12:43:24
 */
import { defineStore } from 'pinia'
import { getCurrentUser } from '../api/user'
import { showNotify } from 'vant'
//@ts-ignore
export const useUserStore = defineStore<'user',{
    userInfo: API.UserVo | null,
},{},{
    setUserInfo(user: API.UserVo): void
    clearUserInfo(): void
    loadFromServer(): Promise<void>
}>('user', {
    state: () => ({
        userInfo: null as API.UserVo | null,
    }),

    actions: {
        setUserInfo(user: API.UserVo) {
            this.userInfo = user
            if (user.token) {
                localStorage.setItem('token', user.token)
            }
        },

        clearUserInfo() {
            this.userInfo = null
            localStorage.removeItem('token')
        },

        async loadFromServer() {
            try {
                const res = await getCurrentUser()
                // 确保ID字段是字符串类型，避免精度丢失
                const processedUserVo: API.UserVo = {
                    ...res,
                    //@ts-ignore
                    id: res.id ? String(res.id) : res.id,
                    //@ts-ignore
                    userId: res.userId ? String(res.userId) : res.userId
                }
                this.userInfo = processedUserVo
                if (this.userInfo.token) {
                    localStorage.setItem('token', this.userInfo.token)
                }
            } catch (err) {
                this.userInfo = null
                showNotify('获取用户信息失败')
            }
        },
    },
    persist: {
        key: 'user',
        storage: localStorage,
    },
})
