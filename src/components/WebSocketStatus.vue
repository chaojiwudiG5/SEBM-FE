<template>
    <div class="websocket-status">
        <van-tag 
            :type="statusType" 
            :color="statusColor"
            size="medium"
            round
        >
            <van-icon :name="statusIcon" size="12" class="status-icon" />
            <span class="status-text">{{ statusText }}</span>
        </van-tag>
        
        <!-- 未读消息徽章 -->
        <van-badge 
            v-if="unreadCount > 0" 
            :content="unreadCount > 99 ? '99+' : unreadCount"
            class="message-badge"
            @click="goToMessages"
        >
            <van-icon name="bell" size="20" />
        </van-badge>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useMessageStore } from '../store/message'
import { WebSocketStatus } from '../utils/websocket'

const router = useRouter()
const messageStore = useMessageStore()

// 连接状态
const websocketStatus = computed(() => messageStore.websocketStatus)
const unreadCount = computed(() => messageStore.unreadCount)

// 状态样式
const statusType = computed(() => {
    switch (websocketStatus.value) {
        case WebSocketStatus.CONNECTED:
            return 'success'
        case WebSocketStatus.CONNECTING:
            return 'warning'
        case WebSocketStatus.ERROR:
            return 'danger'
        default:
            return 'default'
    }
})

const statusColor = computed(() => {
    switch (websocketStatus.value) {
        case WebSocketStatus.CONNECTED:
            return '#07c160'
        case WebSocketStatus.CONNECTING:
            return '#ff976a'
        case WebSocketStatus.ERROR:
            return '#ee0a24'
        default:
            return '#969799'
    }
})

const statusIcon = computed(() => {
    switch (websocketStatus.value) {
        case WebSocketStatus.CONNECTED:
            return 'success'
        case WebSocketStatus.CONNECTING:
            return 'clock'
        case WebSocketStatus.ERROR:
            return 'warning'
        default:
            return 'close'
    }
})

const statusText = computed(() => {
    switch (websocketStatus.value) {
        case WebSocketStatus.CONNECTED:
            return '已连接'
        case WebSocketStatus.CONNECTING:
            return '连接中'
        case WebSocketStatus.ERROR:
            return '连接失败'
        default:
            return '未连接'
    }
})

// 跳转到消息页面
const goToMessages = () => {
    router.push('/message')
}
</script>

<style scoped>
.websocket-status {
    display: flex;
    align-items: center;
    gap: 12px;
}

.status-icon {
    margin-right: 4px;
}

.status-text {
    font-size: 12px;
    font-weight: 500;
}

.message-badge {
    cursor: pointer;
    transition: transform 0.2s ease;
}

.message-badge:hover {
    transform: scale(1.1);
}

.message-badge :deep(.van-badge__wrapper) {
    display: flex;
    align-items: center;
}

.message-badge :deep(.van-icon) {
    color: #646566;
}

.message-badge:hover :deep(.van-icon) {
    color: #1989fa;
}
</style>


