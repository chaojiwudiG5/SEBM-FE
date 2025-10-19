/*
 * @Description: 调试工具
 * @version: v1.0.0
 * @Author: GaoMingze
 * @Date: 2025-01-27
 */

import { useUserStore } from '../store/user'

// 调试用户状态和路由信息
export function debugUserState() {
    const userStore = useUserStore()
    
    console.group('🔍 用户状态调试信息')
    console.log('用户信息:', userStore.userInfo)
    console.log('用户角色:', userStore.userInfo?.userRole)
    console.log('角色名称:', userStore.getUserRoleName())
    console.log('角色验证:', userStore.validateUserRole())
    console.log('Token:', localStorage.getItem('token'))
    console.groupEnd()
}

// 调试路由信息
export function debugRouteInfo(to: any, from: any) {
    console.group('🛣️ 路由调试信息')
    console.log('目标路由:', to.path)
    console.log('来源路由:', from.path)
    console.log('路由元信息:', to.meta)
    console.log('需要认证:', to.meta.requiresAuth)
    console.log('所需角色:', to.meta.role)
    console.groupEnd()
}

// 调试权限检查
export function debugPermissionCheck(userRole: number, requiredRole: number) {
    console.group('🔐 权限检查调试')
    console.log('用户角色:', userRole)
    console.log('所需角色:', requiredRole)
    console.log('角色匹配:', userRole === requiredRole)
    
    const roleNames = { 0: '普通用户', 1: '管理员', 2: '技工' }
    console.log('用户角色名称:', roleNames[userRole as keyof typeof roleNames])
    console.log('所需角色名称:', roleNames[requiredRole as keyof typeof roleNames])
    console.groupEnd()
}

// 在开发环境下自动调试
export function autoDebug() {
    if (import.meta.env.DEV) {
        // 监听路由变化
        window.addEventListener('popstate', () => {
            console.log('路由变化:', window.location.pathname)
            debugUserState()
        })
        
        // 定期检查用户状态
        setInterval(() => {
            const userStore = useUserStore()
            if (userStore.userInfo && !userStore.validateUserRole()) {
                console.warn('⚠️ 检测到无效的用户角色')
                debugUserState()
            }
        }, 5000)
    }
}

