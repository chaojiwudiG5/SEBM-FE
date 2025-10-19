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
    validateUserRole(): boolean
    getUserRoleName(): string
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
            console.log('User info set:', user)
        },

        clearUserInfo() {
            this.userInfo = null
            localStorage.removeItem('token')
            console.log('User info cleared')
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
                console.log('User info loaded from server:', processedUserVo)
            } catch (err) {
                this.userInfo = null
                showNotify('获取用户信息失败')
                console.error('Failed to load user info from server:', err)
            }
        },

        // 验证用户角色是否有效
        validateUserRole(): boolean {
            if (!this.userInfo) {
                console.warn('No user info available for role validation')
                return false
            }
            
            const validRoles = [0, 1, 2] // 0: 普通用户, 1: 管理员, 2: 技工
            const isValid = this.userInfo.userRole !== undefined && validRoles.includes(this.userInfo.userRole)
            
            if (!isValid) {
                console.error('Invalid user role:', this.userInfo.userRole)
            }
            
            return isValid
        },

        // 获取用户角色名称
        getUserRoleName(): string {
            if (!this.userInfo || this.userInfo.userRole === undefined) return '未登录'
            
            const roleNames = { 0: '普通用户', 1: '管理员', 2: '技工' }
            return roleNames[this.userInfo.userRole as keyof typeof roleNames] || '未知角色'
        },
    },
    persist: {
        key: 'user',
        storage: localStorage,
    },
})
