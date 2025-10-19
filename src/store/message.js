/*
 * @Description: 消息存储管理
 * @version: v1.0.0
 * @Author: GaoMingze
 * @Date: 2025-01-27
 */
import { defineStore } from 'pinia';
import { WebSocketStatus, websocketManager } from '../utils/websocket';
import { listNotificationRecords } from '../api/notificationRecord';
import { useUserStore } from './user';
export const useMessageStore = defineStore('message', {
    state: () => ({
        messages: [],
        unreadCount: 0,
        websocketStatus: WebSocketStatus.DISCONNECTED,
        isConnected: false,
        lastMessageTime: 0
    }),
    getters: {
        // 获取所有消息
        allMessages: (state) => state.messages,
        // 获取未读消息数量
        unreadMessages: (state) => state.messages.filter(msg => !msg.read),
        // 获取未读消息数量
        unreadCount: (state) => state.messages.filter(msg => !msg.read).length,
        // 按类型过滤消息
        messagesByType: (state) => (type) => state.messages.filter(msg => msg.type === type),
        // 按优先级过滤消息
        messagesByPriority: (state) => (priority) => state.messages.filter(msg => msg.priority === priority),
        // 获取紧急消息
        urgentMessages: (state) => state.messages.filter(msg => msg.priority === 'urgent'),
        // 获取高优先级消息
        highPriorityMessages: (state) => state.messages.filter(msg => msg.priority === 'high'),
        // 按时间排序的消息
        sortedMessages: (state) => [...state.messages].sort((a, b) => b.timestamp - a.timestamp),
        // 最近的消息
        recentMessages: (state) => (limit = 10) => [...state.messages]
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, limit),
        // 按日期分组的消息
        messagesByDate: (state) => {
            const groups = {};
            state.messages.forEach(msg => {
                const date = new Date(msg.timestamp).toDateString();
                if (!groups[date]) {
                    groups[date] = [];
                }
                groups[date].push(msg);
            });
            return groups;
        }
    },
    actions: {
        // 从后端分页加载消息列表（首次进入或下拉刷新时）
        async loadFromServer(pageNumber = 1, pageSize = 20, readStatus) {
            const userStore = useUserStore();
            const userId = userStore.userInfo?.id;
            if (!userId)
                return;
            const query = {
                pageNumber,
                pageSize,
                userId: Number(userId),
                queryRole: 1,
            };
            if (readStatus !== undefined) {
                query.readStatus = readStatus;
            }
            const res = await listNotificationRecords(query);
            const page = res;
            const mapped = (page.records || []).map((r) => ({
                id: String(r.id ?? `rec_${Date.now()}`),
                type: 'notification',
                title: r.title || '通知',
                content: r.content || '',
                timestamp: r.createTime ? new Date(r.createTime).getTime() : Date.now(),
                priority: (r.status === 1 ? 'normal' : 'low'),
                read: r.readStatus === 1,
                data: r,
            }));
            // 合并策略：保留 WebSocket 实时消息（ID 以 msg_ 开头的临时消息）
            const realtimeMessages = this.messages.filter(msg => msg.id.startsWith('msg_'));
            const backendIds = new Set(mapped.map(m => m.id));
            const otherMessages = this.messages.filter(msg => !msg.id.startsWith('msg_') && !backendIds.has(msg.id));
            // 实时消息在最前面，然后是后端消息
            this.messages = [...realtimeMessages, ...mapped, ...otherMessages];
        },
        // 初始化WebSocket连接
        async initWebSocket() {
            try {
                // 添加消息处理器
                websocketManager.onMessage(this.handleWebSocketMessage);
                websocketManager.onStatusChange(this.handleWebSocketStatus);
                // 连接WebSocket
                await websocketManager.connect();
                console.log('WebSocket initialized successfully');
            }
            catch (error) {
                console.error('Failed to initialize WebSocket:', error);
                throw error;
            }
        },
        // 断开WebSocket连接
        disconnectWebSocket() {
            websocketManager.offMessage(this.handleWebSocketMessage);
            websocketManager.offStatusChange(this.handleWebSocketStatus);
            websocketManager.disconnect();
        },
        // 处理WebSocket消息
        handleWebSocketMessage(message) {
            // 检查是否已存在相同ID的消息
            const existingIndex = this.messages.findIndex(msg => msg.id === message.id);
            if (existingIndex > -1) {
                // 更新现有消息
                this.messages[existingIndex] = message;
            }
            else {
                // 添加新消息到开头
                this.messages.unshift(message);
            }
            // 更新最后消息时间
            this.lastMessageTime = message.timestamp;
            // 限制消息数量，避免内存溢出
            if (this.messages.length > 1000) {
                this.messages = this.messages.slice(0, 1000);
            }
        },
        // 处理WebSocket状态变化
        handleWebSocketStatus(status) {
            this.websocketStatus = status;
            this.isConnected = status === WebSocketStatus.CONNECTED;
        },
        // 添加消息
        addMessage(message) {
            this.handleWebSocketMessage(message);
        },
        // 标记消息为已读
        markAsRead(messageId) {
            const message = this.messages.find(msg => msg.id === messageId);
            if (message && !message.read) {
                message.read = true;
            }
        },
        // 标记所有消息为已读
        markAllAsRead() {
            this.messages.forEach(msg => {
                msg.read = true;
            });
        },
        // 删除消息
        removeMessage(messageId) {
            const index = this.messages.findIndex(msg => msg.id === messageId);
            if (index > -1) {
                this.messages.splice(index, 1);
            }
        },
        // 清空所有消息
        clearAllMessages() {
            this.messages = [];
            this.unreadCount = 0;
        },
        // 清空已读消息
        clearReadMessages() {
            this.messages = this.messages.filter(msg => !msg.read);
        },
        // 过滤消息
        filterMessages(filter) {
            return this.messages.filter(msg => {
                if (filter.type && msg.type !== filter.type)
                    return false;
                if (filter.priority && msg.priority !== filter.priority)
                    return false;
                if (filter.read !== undefined && msg.read !== filter.read)
                    return false;
                if (filter.dateRange) {
                    if (msg.timestamp < filter.dateRange.start || msg.timestamp > filter.dateRange.end) {
                        return false;
                    }
                }
                return true;
            });
        },
        // 搜索消息
        searchMessages(query) {
            const lowerQuery = query.toLowerCase();
            return this.messages.filter(msg => msg.title.toLowerCase().includes(lowerQuery) ||
                msg.content.toLowerCase().includes(lowerQuery));
        },
        // 获取消息统计
        getMessageStats() {
            const stats = {
                total: this.messages.length,
                unread: this.unreadCount,
                byType: {},
                byPriority: {}
            };
            this.messages.forEach(msg => {
                // 按类型统计
                stats.byType[msg.type] = (stats.byType[msg.type] || 0) + 1;
                // 按优先级统计
                stats.byPriority[msg.priority] = (stats.byPriority[msg.priority] || 0) + 1;
            });
            return stats;
        },
        // 发送测试消息（用于开发调试）
        sendTestMessage(type = 'notification', priority = 'normal') {
            const testMessage = {
                id: `test_${Date.now()}`,
                type: type,
                title: `测试消息 - ${type}`,
                content: `这是一条${priority}优先级的测试消息，发送时间：${new Date().toLocaleString()}`,
                timestamp: Date.now(),
                priority: priority,
                read: false
            };
            this.addMessage(testMessage);
        }
    },
    // 持久化配置
    persist: {
        key: 'message-store',
        storage: localStorage
    }
});
