<template>
    <div class="message-box-page">
        <!-- 页面头部 - 滚动时显示 -->
        <transition name="slide-down">
            <div v-show="showHeaderActions" class="page-header">
                <div class="header-content">
                    <div class="header-actions">
                        <van-button 
                            size="small" 
                            type="primary" 
                            @click="markAllAsRead"
                            :disabled="unreadCount === 0"
                        >
                            Mark All Read
                        </van-button>
                        <van-button 
                            size="small" 
                            type="default" 
                            @click="clearReadMessages"
                        >
                            Clear Read
                        </van-button>
                    </div>
                </div>
            </div>
        </transition>

        <!-- 筛选器 -->
        <div class="filter-section" ref="filterRef">
            <van-tabs v-model:active="activeFilter" @change="onFilterChange">
                <van-tab title="Read" name="read" />
                <van-tab title="Unread" name="unread" />
            </van-tabs>
        </div>

        <!-- 搜索框 -->
        <div class="search-section">
            <van-search
                v-model="searchQuery"
                placeholder="Search messages..."
                @search="onSearch"
                @clear="onSearchClear"
            />
        </div>

        <!-- 消息列表 -->
        <div class="message-list" ref="scrollContainer">
            <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
                <van-list
                    v-model:loading="loading"
                    :finished="finished"
                    finished-text="No more messages"
                    @load="onLoad"
                >
                    <!-- 按日期分组显示消息 -->
                    <div v-for="(messages, date) in groupedMessages" :key="date" class="date-group">
                        <div class="date-header">
                            <van-divider>{{ formatDate(String(date)) }}</van-divider>
                        </div>
                        
                        <div v-for="message in messages" :key="message.id" class="message-item">
                            <van-swipe-cell>
                                <van-cell
                                    :class="['message-cell', { 'unread': !message.read }]"
                                    @click="onMessageClick(message)"
                                >
                                    <template #icon>
                                        <div class="message-icon">
                                            <van-icon 
                                                :name="getMessageIcon(message.type)" 
                                                :color="getMessageColor(message.priority)"
                                                size="20"
                                            />
                                        </div>
                                    </template>
                                    
                                    <template #title>
                                        <div class="message-title">
                                            <span class="title-text">{{ message.title }}</span>
                                            <van-tag 
                                                v-if="message.priority === 'urgent' || message.priority === 'high'"
                                                :type="message.priority === 'urgent' ? 'danger' : 'warning'"
                                            >
                                                {{ getPriorityText(message.priority) }}
                                            </van-tag>
                                        </div>
                                    </template>
                                    
                                    <template #label>
                                        <div class="message-content">{{ message.content }}</div>
                                        <div class="message-time">{{ formatTime(message.timestamp) }}</div>
                                    </template>
                                </van-cell>
                                
                                <template #right>
                                    <div class="swipe-actions">
                                        <!-- Unread 栏：显示标记已读和删除按钮 -->
                                        <template v-if="activeFilter === 'unread'">
                                            <van-button 
                                                square 
                                                type="primary" 
                                                text="标为已读"
                                                class="swipe-button swipe-button-read"
                                                @click="markAsReadSingle(message)"
                                            />
                                            <van-button 
                                                square 
                                                type="danger" 
                                                text="删除"
                                                class="swipe-button swipe-button-delete"
                                                @click="removeMessage(message.id)"
                                            />
                                        </template>
                                        <!-- Read 栏：只显示删除按钮 -->
                                        <template v-else>
                                            <van-button 
                                                square 
                                                type="danger" 
                                                text="删除"
                                                class="swipe-button swipe-button-delete"
                                                @click="removeMessage(message.id)"
                                            />
                                        </template>
                                    </div>
                                </template>
                            </van-swipe-cell>
                        </div>
                    </div>
                    
                    <!-- 空状态 -->
                    <van-empty 
                        v-if="!loading && filteredMessages.length === 0"
                        image="search"
                        description="No messages"
                    />
                </van-list>
            </van-pull-refresh>
        </div>

        <!-- 浮动操作按钮 -->
        <van-floating-bubble
            axis="xy"
            icon="plus"
            @click="showTestMessageDialog = true"
            v-if="isDev"
        />
        
        <!-- 测试消息对话框 -->
        <van-dialog
            v-model:show="showTestMessageDialog"
            title="Send Test Message"
            show-cancel-button
            @confirm="sendTestMessage"
        >
            <van-form>
                <van-field
                    v-model="testMessageType"
                    label="Type"
                    placeholder="notification"
                />
                <van-field
                    v-model="testMessagePriority"
                    label="Priority"
                    placeholder="normal"
                />
            </van-form>
        </van-dialog>
    </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useMessageStore } from '../../store/message'
import { WebSocketMessage, WebSocketStatus as WsStatus } from '../../utils/websocket'
import { showNotify, showConfirmDialog } from 'vant'
import { deleteNotificationRecord, markAllAsRead as markAllAsReadApi, clearUserNotifications } from '../../api/notificationRecord'
import { useUserStore } from '../../store/user'

const messageStore = useMessageStore()
const userStore = useUserStore()

// 响应式数据
const activeFilter = ref('read')
const searchQuery = ref('')
const refreshing = ref(false)
const loading = ref(false)
const finished = ref(false)
const showTestMessageDialog = ref(false)
const testMessageType = ref('notification')
const testMessagePriority = ref('normal')
const showHeaderActions = ref(false) // 控制头部按钮显示
const scrollContainer = ref<HTMLElement | null>(null)
const filterRef = ref<HTMLElement | null>(null)

// 开发环境标识
const isDev = import.meta.env.DEV

// 计算属性
const unreadCount = computed(() => messageStore.unreadCount)
const websocketStatus = computed(() => messageStore.websocketStatus)
const isConnected = computed(() => messageStore.isConnected)

// 连接状态相关
const connectionStatusType = computed(() => {
    switch (websocketStatus.value) {
        case WsStatus.CONNECTED:
            return 'success'
        case WsStatus.CONNECTING:
            return 'warning'
        case WsStatus.ERROR:
            return 'danger'
        default:
            return 'default'
    }
})

const connectionIcon = computed(() => {
    switch (websocketStatus.value) {
        case WsStatus.CONNECTED:
            return 'success'
        case WsStatus.CONNECTING:
            return 'clock'
        case WsStatus.ERROR:
            return 'warning'
        default:
            return 'close'
    }
})

const connectionStatusText = computed(() => {
    switch (websocketStatus.value) {
        case WsStatus.CONNECTED:
            return 'Connected'
        case WsStatus.CONNECTING:
            return 'Connecting'
        case WsStatus.ERROR:
            return 'Failed'
        default:
            return 'Disconnected'
    }
})

// 过滤后的消息
const filteredMessages = computed(() => {
    let messages = messageStore.sortedMessages

    // 根据 read/unread 过滤
    if (activeFilter.value === 'unread') {
        messages = messages.filter((msg: WebSocketMessage) => !msg.read)
    } else if (activeFilter.value === 'read') {
        messages = messages.filter((msg: WebSocketMessage) => msg.read)
    }

    // 搜索过滤
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        messages = messages.filter((msg: WebSocketMessage) =>
            msg.title.toLowerCase().includes(query) ||
            msg.content.toLowerCase().includes(query)
        )
    }

    return messages
})

// 按日期分组的消息
const groupedMessages = computed(() => {
    const groups: { [key: string]: WebSocketMessage[] } = {}
    filteredMessages.value.forEach((msg: WebSocketMessage) => {
        const date = new Date(msg.timestamp).toDateString()
        if (!groups[date]) {
            groups[date] = []
        }
        groups[date].push(msg)
    })
    return groups
})

// 方法
const onFilterChange = async (name: string) => {
    activeFilter.value = name
    // Read 传 1，Unread 传 0
    const readStatus = name === 'read' ? 1 : 0
    await messageStore.loadFromServer(1, 20, readStatus)
}

const onSearch = () => {
    // 搜索逻辑已在计算属性中处理
}

const onSearchClear = () => {
    searchQuery.value = ''
}

const onRefresh = async () => {
    refreshing.value = true
    try {
        // 根据当前选中的标签重新加载数据
        const readStatus = activeFilter.value === 'read' ? 1 : 0
        await messageStore.loadFromServer(1, 20, readStatus)
        
        // 重新连接WebSocket（如果断开）
        if (!isConnected.value) {
            await messageStore.initWebSocket()
        }
        showNotify({ type: 'success', message: '刷新成功' })
    } catch (error) {
        showNotify({ type: 'danger', message: '刷新失败' })
    } finally {
        refreshing.value = false
    }
}

const onLoad = () => {
    // 这里可以添加加载更多消息的逻辑
    loading.value = false
    finished.value = true
}

const onMessageClick = (message: WebSocketMessage) => {
    // 标记为已读
    if (!message.read) {
        messageStore.markAsRead(message.id)
    }
    
    // 显示消息详情
    showNotify({
        type: 'primary',
        message: `${message.title}\n${message.content}`
    })
}

const markAsReadSingle = async (message: WebSocketMessage) => {
    try {
        // 标记为已读
        messageStore.markAsRead(message.id)
        showNotify({ type: 'success', message: '已标记为已读' })
        
        // 重新加载数据
        const readStatus = activeFilter.value === 'read' ? 1 : 0
        await messageStore.loadFromServer(1, 20, readStatus)
    } catch (error) {
        showNotify({ type: 'danger', message: '标记失败' })
    }
}

const markAllAsRead = async () => {
    try {
        const userId = userStore.userInfo?.id
        if (!userId) {
            showNotify({ type: 'danger', message: '用户信息不存在' })
            return
        }

        // 标记所有未读消息为已读
        await markAllAsReadApi({ userId: Number(userId) })
        messageStore.markAllAsRead()
        showNotify({ type: 'success', message: '已标记全部为已读' })
        
        // 重新加载数据
        const readStatus = activeFilter.value === 'read' ? 1 : 0
        await messageStore.loadFromServer(1, 20, readStatus)
    } catch (error) {
        showNotify({ type: 'danger', message: '标记失败' })
    }
}

const clearReadMessages = async () => {
    try {
        const userId = userStore.userInfo?.id
        if (!userId) {
            showNotify({ type: 'danger', message: '用户信息不存在' })
            return
        }

        // 清空所有已读消息
        await showConfirmDialog({
            title: '确认清空',
            message: '确定要清空所有已读消息吗？'
        })
        
        // 直接调用清空已读消息接口
        await clearUserNotifications({ userId: Number(userId) })
        
        // 清空本地已读消息
        messageStore.clearReadMessages()
        showNotify({ type: 'success', message: '已清空已读消息' })
        
        // 重新加载数据
        const readStatus = activeFilter.value === 'read' ? 1 : 0
        await messageStore.loadFromServer(1, 20, readStatus)
    } catch (error) {
        // 用户取消或删除失败
        if (error) {
            showNotify({ type: 'danger', message: '操作失败' })
        }
    }
}

const removeMessage = async (messageId: string) => {
    try {
        await showConfirmDialog({
            title: '确认删除',
            message: '确定要删除这条消息吗？'
        })
        
        // 查找消息，获取后端 ID
        const message = messageStore.allMessages.find((msg: WebSocketMessage) => msg.id === messageId)
        const backendId = message?.data?.id
        
        // 如果有后端 ID，调用后端删除接口
        if (backendId) {
            await deleteNotificationRecord({ id: backendId })
        }
        
        // 从本地移除
        messageStore.removeMessage(messageId)
        showNotify({ type: 'success', message: '消息已删除' })
    } catch (error) {
        // 用户取消或删除失败
        if (error) {
            showNotify({ type: 'danger', message: '删除失败' })
        }
    }
}

const sendTestMessage = () => {
    messageStore.sendTestMessage(testMessageType.value, testMessagePriority.value)
    showTestMessageDialog.value = false
    showNotify({ type: 'success', message: '测试消息已发送' })
}

// 工具方法
const getMessageIcon = (type: string) => {
    const icons: { [key: string]: string } = {
        notification: 'bell',
        system: 'setting',
        device_update: 'desktop',
        maintenance_update: 'tool',
        borrow_update: 'exchange'
    }
    return icons[type] || 'bell'
}

const getMessageColor = (priority: string) => {
    const colors: { [key: string]: string } = {
        urgent: '#ee0a24',
        high: '#ff976a',
        normal: '#1989fa',
        low: '#07c160'
    }
    return colors[priority] || '#1989fa'
}

const getPriorityText = (priority: string) => {
    const texts: { [key: string]: string } = {
        urgent: '紧急',
        high: '重要',
        normal: '普通',
        low: '低'
    }
    return texts[priority] || '普通'
}

const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    
    if (date.toDateString() === today.toDateString()) {
        return '今天'
    } else if (date.toDateString() === yesterday.toDateString()) {
        return '昨天'
    } else {
        return date.toLocaleDateString('zh-CN', { 
            month: 'short', 
            day: 'numeric' 
        })
    }
}

const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit'
    })
}

// 滚动/可见性处理
let filterObserver: IntersectionObserver | null = null

const updateHeaderVisibility = () => {
    if (scrollContainer.value) {
        showHeaderActions.value = scrollContainer.value.scrollTop > 50
    }
}

const handleScroll = () => {
    updateHeaderVisibility()
}

const handleWindowScroll = () => {
    // 作为兜底：当使用的是窗口滚动时，根据窗口滚动位置判断
    if (!scrollContainer.value) {
        showHeaderActions.value = window.scrollY > 50
    } else {
        // 同时考虑筛选区域是否仍在视口内
        updateHeaderVisibility()
    }
}

// 生命周期
onMounted(async () => {
    try {
        // 先从后端加载历史消息（默认加载 Read 标签，readStatus=1）
        await messageStore.loadFromServer(1, 20, 1)
        // 再初始化 WebSocket 实时推送
        await messageStore.initWebSocket()
        
        // 通过 ref 添加滚动监听
        if (scrollContainer.value) {
            scrollContainer.value.addEventListener('scroll', handleScroll)
        }

        // 使用 IntersectionObserver，当筛选区域离开视口时显示操作区
        if ('IntersectionObserver' in window && filterRef.value) {
            filterObserver = new IntersectionObserver((entries) => {
                const entry = entries[0]
                // 当筛选区域不可见时，也显示头部按钮
                if (entry) {
                    showHeaderActions.value = !entry.isIntersecting || (scrollContainer.value ? scrollContainer.value.scrollTop > 50 : window.scrollY > 50)
                }
            }, {
                // 直接以视口为根，更稳健
                root: null,
                threshold: 1
            })
            filterObserver.observe(filterRef.value)
        }

        // 监听窗口滚动（兜底方案）
        window.addEventListener('scroll', handleWindowScroll, { passive: true })

        // 初始化一次可见性
        updateHeaderVisibility()
    } catch (error) {
        console.error('Failed to initialize WebSocket:', error)
        showNotify({ 
            type: 'warning', 
            message: 'WebSocket连接失败，消息可能无法实时更新' 
        })
    }
})

onUnmounted(() => {
    // 移除滚动监听
    if (scrollContainer.value) {
        scrollContainer.value.removeEventListener('scroll', handleScroll)
    }
    window.removeEventListener('scroll', handleWindowScroll)

    // 断开可见性观察
    if (filterObserver) {
        filterObserver.disconnect()
        filterObserver = null
    }
    
    // 注意：这里不主动断开连接，因为其他页面可能也需要使用
    // messageStore.disconnectWebSocket()
})

// 监听连接状态变化
watch(isConnected, (connected) => {
    if (connected) {
        showNotify({ type: 'success', message: '消息服务已连接' })
    } else {
        showNotify({ type: 'warning', message: '消息服务已断开' })
    }
})
</script>

<style scoped>
.message-box-page {
    height: 100vh;
    display: flex;
    flex-direction: column;
    background: linear-gradient(to bottom, #f5f7fa 0%, #ffffff 100%);
}

.page-header {
    padding: 20px 16px;
    background: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    position: sticky;
    top: 0;
    z-index: 100;
}

.header-content {
    display: flex;
    justify-content: center;
    align-items: center;
}

.header-actions {
    display: flex;
    gap: 10px;
}

/* 下拉滑入动画 */
.slide-down-enter-active,
.slide-down-leave-active {
    transition: all 0.3s ease;
}

.slide-down-enter-from {
    transform: translateY(-100%);
    opacity: 0;
}

.slide-down-leave-to {
    transform: translateY(-100%);
    opacity: 0;
}

.filter-section {
    background: white;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.filter-section :deep(.van-tabs__nav) {
    background: white;
}

.filter-section :deep(.van-tab) {
    font-size: 15px;
    font-weight: 500;
    color: #646566;
}

.filter-section :deep(.van-tab--active) {
    color: #667eea;
    font-weight: 600;
}

.filter-section :deep(.van-tabs__line) {
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
    height: 3px;
    border-radius: 3px;
}

.search-section {
    background: white;
    padding: 12px 16px;
    border-bottom: 1px solid #f0f0f0;
}

.search-section :deep(.van-search) {
    padding: 0;
}

.search-section :deep(.van-search__content) {
    background: #f5f7fa;
    border-radius: 20px;
}

.message-list {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
}

.date-group {
    margin-bottom: 8px;
}

.date-header {
    padding: 8px 16px;
}

.date-header :deep(.van-divider) {
    color: #969799;
    font-size: 13px;
    font-weight: 500;
}

.message-item {
    margin-bottom: 0;
}

.message-cell {
    padding: 16px;
    transition: all 0.3s ease;
    background: white;
    border-bottom: 1px solid #f0f0f0;
}

.message-cell.unread {
    background: linear-gradient(90deg, #f0f9ff 0%, #ffffff 100%);
    border-left: 4px solid #667eea;
    box-shadow: 0 1px 4px rgba(102, 126, 234, 0.1);
}

.message-cell:active {
    background-color: #f7f8fa;
    transform: scale(0.99);
}

.message-icon {
    margin-left: 10px;
    margin-right: 14px;
    display: flex;
    align-items: center;
}

.message-cell :deep(.van-cell__left-icon) {
    display: flex;
    align-items: center;
    gap: 0;
}

.message-title {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 6px;
}

.title-text {
    font-weight: 600;
    color: #1a1a1a;
    font-size: 15px;
}

.message-content {
    color: #646566;
    font-size: 14px;
    line-height: 1.5;
    margin-bottom: 8px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.message-time {
    color: #969799;
    font-size: 12px;
    font-weight: 500;
}

/* 左滑操作按钮样式 */
.swipe-actions {
    display: flex;
    height: 100%;
}

.swipe-button {
    height: 100%;
    display: flex;
    align-items: center;
    padding: 0 20px;
    font-size: 14px;
    font-weight: 500;
}

.swipe-button-read {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
}

.swipe-button-delete {
    background: linear-gradient(135deg, #ee0a24 0%, #ff6034 100%);
    border: none;
}

/* 按钮样式优化 */
:deep(.van-button--primary) {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    border-radius: 8px;
    font-weight: 600;
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

:deep(.van-button--default) {
    border-radius: 8px;
    border: 1px solid #e0e0e0;
    font-weight: 500;
}

/* 徽章样式 */
:deep(.van-badge) {
    font-weight: 600;
}

/* 空状态优化 */
:deep(.van-empty) {
    padding: 60px 0;
}

:deep(.van-empty__description) {
    color: #969799;
    font-size: 15px;
}

/* 浮动按钮优化 */
:deep(.van-floating-bubble) {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

/* 响应式设计 */
@media (max-width: 768px) {
    .header-actions {
        width: 100%;
        justify-content: center;
    }
}

/* 滚动条美化 */
.message-list :deep(*::-webkit-scrollbar) {
    width: 6px;
}

.message-list :deep(*::-webkit-scrollbar-track) {
    background: #f5f7fa;
}

.message-list :deep(*::-webkit-scrollbar-thumb) {
    background: #c8d1e0;
    border-radius: 3px;
}

.message-list :deep(*::-webkit-scrollbar-thumb:hover) {
    background: #a8b4c8;
}
</style>
