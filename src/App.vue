<!--
 * @Description: 
 * @version: v1.0.0
 * @Author: GaoMingze
 * @Date: 2025-09-12 17:07:43
 * @LastEditors: GaoMingze
 * @LastEditTime: 2025-09-12 17:42:07
-->
<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue'
import { useUserStore } from './store/user'
import { useMessageStore } from './store/message'
import { useRoute } from 'vue-router'

const userStore = useUserStore()
const messageStore = useMessageStore()
const route = useRoute()

// 在用户登录后初始化WebSocket
onMounted(async () => {
    // 如果用户已登录，初始化WebSocket
    if (userStore.userInfo) {
        await initializeWebSocket()
    }
})

// 监听用户登录状态变化
watch(() => userStore.userInfo, async (newUserInfo, oldUserInfo) => {
    if (newUserInfo && !oldUserInfo) {
        // 用户刚登录，初始化WebSocket
        await initializeWebSocket()
    } else if (!newUserInfo && oldUserInfo) {
        // 用户登出，断开WebSocket
        messageStore.disconnectWebSocket()
    }
})

// 初始化WebSocket连接
async function initializeWebSocket() {
    try {
        // 确保不在登录页面
        if (route.path !== '/login' && route.path !== '/register') {
            console.log('🚀 正在初始化WebSocket连接...')
            await messageStore.initWebSocket()
            console.log('✅ WebSocket连接初始化成功')
        }
    } catch (error) {
        console.error('❌ WebSocket初始化失败:', error)
        // 不显示错误提示，避免干扰用户体验
    }
}

// 组件卸载时清理
onUnmounted(() => {
    // 注意：这里不主动断开WebSocket，因为可能是页面切换
    // WebSocket会在用户登出时自动断开
})
</script>

<template>
    <router-view />
</template>

<style scoped></style>
