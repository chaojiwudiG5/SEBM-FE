/*
 * @Description: WebSocket 工具类
 * @version: v1.0.0
 * @Author: GaoMingze
 * @Date: 2025-01-27
 */
import { showNotify } from 'vant';
// WebSocket 连接状态
export var WebSocketStatus;
(function (WebSocketStatus) {
    WebSocketStatus["CONNECTING"] = "connecting";
    WebSocketStatus["CONNECTED"] = "connected";
    WebSocketStatus["DISCONNECTED"] = "disconnected";
    WebSocketStatus["ERROR"] = "error";
})(WebSocketStatus || (WebSocketStatus = {}));
class WebSocketManager {
    ws = null;
    url;
    reconnectAttempts = 0;
    maxReconnectAttempts = 5;
    reconnectInterval = 3000;
    heartbeatInterval = null;
    status = WebSocketStatus.DISCONNECTED;
    messageHandlers = [];
    statusHandlers = [];
    constructor() {
        // 根据环境选择WebSocket URL
        this.url = this.getWebSocketURL();
    }
    getWebSocketURL() {
        // 从用户store获取userId
        const userStore = JSON.parse(localStorage.getItem('user') || '{}');
        const userId = userStore.userInfo?.id;
        if (!userId) {
            throw new Error('No user ID found');
        }
        // 根据环境选择WebSocket地址
        // 后端 WebSocket 端点：/ws/notification（配置在 WebSocketConfig.java）
        if (import.meta.env.DEV) {
            // 开发环境 - 连接本地后端
            return `ws://localhost:29578/ws/notification?userId=${userId}`;
        }
        else {
            // 生产环境 - 使用 wss 安全连接
            return `wss://sebm-production.up.railway.app/ws/notification?userId=${userId}`;
        }
    }
    // 连接WebSocket
    connect() {
        return new Promise((resolve, reject) => {
            try {
                this.ws = new WebSocket(this.url);
                this.status = WebSocketStatus.CONNECTING;
                this.ws.onopen = () => {
                    console.log('WebSocket connected');
                    this.status = WebSocketStatus.CONNECTED;
                    this.reconnectAttempts = 0;
                    this.startHeartbeat();
                    this.notifyStatusHandlers();
                    resolve();
                };
                this.ws.onmessage = (event) => {
                    try {
                        const rawMessage = JSON.parse(event.data);
                        // 适配后端消息格式
                        const message = this.adaptBackendMessage(rawMessage);
                        this.handleMessage(message);
                    }
                    catch (error) {
                        console.error('Failed to parse WebSocket message:', error);
                    }
                };
                this.ws.onclose = (event) => {
                    console.log('WebSocket disconnected:', event.code, event.reason);
                    this.status = WebSocketStatus.DISCONNECTED;
                    this.stopHeartbeat();
                    this.notifyStatusHandlers();
                    // 如果不是主动关闭，尝试重连
                    if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
                        this.scheduleReconnect();
                    }
                };
                this.ws.onerror = (error) => {
                    console.error('WebSocket error:', error);
                    this.status = WebSocketStatus.ERROR;
                    this.notifyStatusHandlers();
                    reject(error);
                };
            }
            catch (error) {
                console.error('Failed to create WebSocket connection:', error);
                this.status = WebSocketStatus.ERROR;
                this.notifyStatusHandlers();
                reject(error);
            }
        });
    }
    // 断开连接
    disconnect() {
        if (this.ws) {
            this.ws.close(1000, 'User disconnected');
            this.ws = null;
        }
        this.stopHeartbeat();
        this.status = WebSocketStatus.DISCONNECTED;
        this.notifyStatusHandlers();
    }
    // 发送消息
    send(message) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(message));
        }
        else {
            console.warn('WebSocket is not connected');
        }
    }
    // 适配后端消息格式
    adaptBackendMessage(rawMessage) {
        // 处理pong响应（心跳）
        if (rawMessage.type === 'pong') {
            console.log('Received pong from server');
            // 返回一个空消息，不处理
            return {
                id: `pong_${Date.now()}`,
                type: 'system',
                title: '',
                content: '',
                timestamp: rawMessage.timestamp || Date.now(),
                priority: 'low',
                read: true,
                data: rawMessage
            };
        }
        // 适配后端的消息格式
        return {
            id: rawMessage.id || `msg_${Date.now()}`,
            type: this.mapBackendType(rawMessage.type, rawMessage.notificationType),
            title: rawMessage.subject || rawMessage.title || '新消息',
            content: rawMessage.content || '',
            timestamp: this.parseTimestamp(rawMessage.timestamp),
            priority: this.inferPriority(rawMessage.notificationType, rawMessage.type),
            read: false,
            data: rawMessage
        };
    }
    // 映射后端消息类型到前端类型
    mapBackendType(type, notificationType) {
        // 如果是notification类型，根据notificationType细分
        if (type === 'notification' && notificationType) {
            const typeMap = {
                'DEVICE_UPDATE': 'device_update',
                'MAINTENANCE_UPDATE': 'maintenance_update',
                'BORROW_UPDATE': 'borrow_update',
                'USER_UPDATE': 'user_update',
                'SECURITY_ALERT': 'security_alert',
                'SYSTEM_MAINTENANCE': 'system_maintenance'
            };
            return typeMap[notificationType] || 'notification';
        }
        // 直接类型映射
        return type === 'system' ? 'system' : 'notification';
    }
    // 解析时间戳
    parseTimestamp(timestamp) {
        if (typeof timestamp === 'number') {
            return timestamp;
        }
        if (typeof timestamp === 'string') {
            // 尝试解析日期字符串 "yyyy-MM-dd HH:mm:ss"
            const date = new Date(timestamp.replace(' ', 'T'));
            return date.getTime();
        }
        return Date.now();
    }
    // 根据通知类型推断优先级
    inferPriority(notificationType, type) {
        if (!notificationType) {
            return type === 'system' ? 'normal' : 'normal';
        }
        const highPriorityTypes = ['SECURITY_ALERT', 'SYSTEM_MAINTENANCE'];
        const urgentTypes = ['SECURITY_ALERT'];
        if (urgentTypes.includes(notificationType)) {
            return 'urgent';
        }
        if (highPriorityTypes.includes(notificationType)) {
            return 'high';
        }
        return 'normal';
    }
    // 处理接收到的消息
    handleMessage(message) {
        // 忽略pong消息和空标题消息
        if (message.type === 'system' && !message.title) {
            return;
        }
        console.log('Received WebSocket message:', message);
        // 通知所有消息处理器
        this.messageHandlers.forEach(handler => {
            try {
                handler(message);
            }
            catch (error) {
                console.error('Error in message handler:', error);
            }
        });
        // 根据消息类型显示通知
        this.showNotification(message);
    }
    // 显示通知
    showNotification(message) {
        const notificationType = this.getNotificationType(message.priority);
        showNotify({
            type: notificationType,
            message: `${message.title}\n${message.content}`,
            duration: this.getNotificationDuration(message.priority)
        });
    }
    // 获取通知类型
    getNotificationType(priority) {
        switch (priority) {
            case 'urgent':
                return 'danger';
            case 'high':
                return 'warning';
            case 'normal':
                return 'primary';
            case 'low':
                return 'success';
            default:
                return 'primary';
        }
    }
    // 获取通知持续时间
    getNotificationDuration(priority) {
        switch (priority) {
            case 'urgent':
                return 0; // 不自动关闭
            case 'high':
                return 5000;
            case 'normal':
                return 3000;
            case 'low':
                return 2000;
            default:
                return 3000;
        }
    }
    // 心跳检测
    startHeartbeat() {
        this.heartbeatInterval = window.setInterval(() => {
            if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                this.send({ type: 'ping' });
            }
        }, 30000); // 每30秒发送一次心跳
    }
    stopHeartbeat() {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
            this.heartbeatInterval = null;
        }
    }
    // 重连机制
    scheduleReconnect() {
        this.reconnectAttempts++;
        const delay = this.reconnectInterval * Math.pow(2, this.reconnectAttempts - 1);
        console.log(`Scheduling reconnect attempt ${this.reconnectAttempts} in ${delay}ms`);
        setTimeout(() => {
            if (this.status === WebSocketStatus.DISCONNECTED) {
                this.connect().catch(error => {
                    console.error('Reconnect failed:', error);
                });
            }
        }, delay);
    }
    // 添加消息处理器
    onMessage(handler) {
        this.messageHandlers.push(handler);
    }
    // 移除消息处理器
    offMessage(handler) {
        const index = this.messageHandlers.indexOf(handler);
        if (index > -1) {
            this.messageHandlers.splice(index, 1);
        }
    }
    // 添加状态变化处理器
    onStatusChange(handler) {
        this.statusHandlers.push(handler);
    }
    // 移除状态变化处理器
    offStatusChange(handler) {
        const index = this.statusHandlers.indexOf(handler);
        if (index > -1) {
            this.statusHandlers.splice(index, 1);
        }
    }
    // 通知状态处理器
    notifyStatusHandlers() {
        this.statusHandlers.forEach(handler => {
            try {
                handler(this.status);
            }
            catch (error) {
                console.error('Error in status handler:', error);
            }
        });
    }
    // 获取连接状态
    getStatus() {
        return this.status;
    }
    // 检查是否已连接
    isConnected() {
        return this.status === WebSocketStatus.CONNECTED;
    }
}
// 创建单例实例
export const websocketManager = new WebSocketManager();
