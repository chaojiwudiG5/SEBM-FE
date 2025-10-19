/*
 * @Description: 通知类型定义
 * @version: v1.0.0
 * @Author: GaoMingze
 * @Date: 2025-01-27
 */
// 通知类型枚举
export var NotificationType;
(function (NotificationType) {
    NotificationType["NOTIFICATION"] = "notification";
    NotificationType["SYSTEM"] = "system";
    NotificationType["DEVICE_UPDATE"] = "device_update";
    NotificationType["MAINTENANCE_UPDATE"] = "maintenance_update";
    NotificationType["BORROW_UPDATE"] = "borrow_update";
    NotificationType["USER_UPDATE"] = "user_update";
    NotificationType["SECURITY_ALERT"] = "security_alert";
    NotificationType["SYSTEM_MAINTENANCE"] = "system_maintenance"; // 系统维护
})(NotificationType || (NotificationType = {}));
// 通知优先级枚举
export var NotificationPriority;
(function (NotificationPriority) {
    NotificationPriority["LOW"] = "low";
    NotificationPriority["NORMAL"] = "normal";
    NotificationPriority["HIGH"] = "high";
    NotificationPriority["URGENT"] = "urgent"; // 紧急优先级
})(NotificationPriority || (NotificationPriority = {}));
// 通知状态枚举
export var NotificationStatus;
(function (NotificationStatus) {
    NotificationStatus["UNREAD"] = "unread";
    NotificationStatus["READ"] = "read";
    NotificationStatus["ARCHIVED"] = "archived"; // 已归档
})(NotificationStatus || (NotificationStatus = {}));
// 通知动作类型
export var NotificationAction;
(function (NotificationAction) {
    NotificationAction["VIEW"] = "view";
    NotificationAction["APPROVE"] = "approve";
    NotificationAction["REJECT"] = "reject";
    NotificationAction["COMPLETE"] = "complete";
    NotificationAction["CANCEL"] = "cancel";
    NotificationAction["DETAIL"] = "detail"; // 详情
})(NotificationAction || (NotificationAction = {}));
// 预定义的通知模板
export const NOTIFICATION_TEMPLATES = {
    // 设备相关通知
    DEVICE_AVAILABLE: {
        id: 'device_available',
        type: NotificationType.DEVICE_UPDATE,
        title: '设备可用',
        content: '设备 {deviceName} 现在可以借用',
        priority: NotificationPriority.NORMAL,
        icon: 'desktop',
        color: '#07c160',
        actions: [
            { id: 'view', label: '查看设备', action: NotificationAction.VIEW, type: 'primary' },
            { id: 'borrow', label: '立即借用', action: NotificationAction.APPROVE, type: 'default' }
        ]
    },
    DEVICE_MAINTENANCE_REQUIRED: {
        id: 'device_maintenance_required',
        type: NotificationType.MAINTENANCE_UPDATE,
        title: '设备需要维修',
        content: '设备 {deviceName} 需要维修，请安排技工处理',
        priority: NotificationPriority.HIGH,
        icon: 'tool',
        color: '#ff976a',
        actions: [
            { id: 'view', label: '查看详情', action: NotificationAction.DETAIL, type: 'primary' },
            { id: 'assign', label: '分配技工', action: NotificationAction.APPROVE, type: 'default' }
        ]
    },
    DEVICE_MAINTENANCE_COMPLETED: {
        id: 'device_maintenance_completed',
        type: NotificationType.MAINTENANCE_UPDATE,
        title: '维修完成',
        content: '设备 {deviceName} 维修已完成，可以正常使用',
        priority: NotificationPriority.NORMAL,
        icon: 'success',
        color: '#07c160',
        actions: [
            { id: 'view', label: '查看报告', action: NotificationAction.DETAIL, type: 'primary' }
        ]
    },
    // 借用相关通知
    BORROW_REQUEST: {
        id: 'borrow_request',
        type: NotificationType.BORROW_UPDATE,
        title: '借用申请',
        content: '用户 {userName} 申请借用设备 {deviceName}',
        priority: NotificationPriority.NORMAL,
        icon: 'exchange',
        color: '#1989fa',
        actions: [
            { id: 'approve', label: '批准', action: NotificationAction.APPROVE, type: 'primary' },
            { id: 'reject', label: '拒绝', action: NotificationAction.REJECT, type: 'danger' },
            { id: 'view', label: '查看详情', action: NotificationAction.DETAIL, type: 'default' }
        ]
    },
    BORROW_APPROVED: {
        id: 'borrow_approved',
        type: NotificationType.BORROW_UPDATE,
        title: '借用申请已批准',
        content: '您的设备 {deviceName} 借用申请已获得批准',
        priority: NotificationPriority.NORMAL,
        icon: 'success',
        color: '#07c160',
        actions: [
            { id: 'view', label: '查看详情', action: NotificationAction.DETAIL, type: 'primary' }
        ]
    },
    BORROW_REJECTED: {
        id: 'borrow_rejected',
        type: NotificationType.BORROW_UPDATE,
        title: '借用申请被拒绝',
        content: '您的设备 {deviceName} 借用申请被拒绝，原因：{reason}',
        priority: NotificationPriority.NORMAL,
        icon: 'close',
        color: '#ee0a24',
        actions: [
            { id: 'view', label: '查看详情', action: NotificationAction.DETAIL, type: 'default' }
        ]
    },
    BORROW_OVERDUE: {
        id: 'borrow_overdue',
        type: NotificationType.BORROW_UPDATE,
        title: '借用逾期提醒',
        content: '您借用的设备 {deviceName} 已逾期，请尽快归还',
        priority: NotificationPriority.HIGH,
        icon: 'warning',
        color: '#ff976a',
        actions: [
            { id: 'return', label: '立即归还', action: NotificationAction.COMPLETE, type: 'primary' },
            { id: 'extend', label: '申请延期', action: NotificationAction.APPROVE, type: 'default' }
        ]
    },
    // 系统相关通知
    SYSTEM_MAINTENANCE: {
        id: 'system_maintenance',
        type: NotificationType.SYSTEM_MAINTENANCE,
        title: '系统维护通知',
        content: '系统将于 {startTime} 进行维护，预计持续 {duration}',
        priority: NotificationPriority.HIGH,
        icon: 'setting',
        color: '#ff976a',
        actions: [
            { id: 'view', label: '查看详情', action: NotificationAction.DETAIL, type: 'default' }
        ]
    },
    SECURITY_ALERT: {
        id: 'security_alert',
        type: NotificationType.SECURITY_ALERT,
        title: '安全警报',
        content: '检测到异常登录活动，请检查您的账户安全',
        priority: NotificationPriority.URGENT,
        icon: 'warning',
        color: '#ee0a24',
        actions: [
            { id: 'view', label: '查看详情', action: NotificationAction.DETAIL, type: 'primary' },
            { id: 'secure', label: '立即安全', action: NotificationAction.APPROVE, type: 'danger' }
        ]
    },
    // 用户相关通知
    USER_ROLE_CHANGED: {
        id: 'user_role_changed',
        type: NotificationType.USER_UPDATE,
        title: '角色变更通知',
        content: '您的用户角色已变更为 {newRole}',
        priority: NotificationPriority.NORMAL,
        icon: 'user',
        color: '#1989fa',
        actions: [
            { id: 'view', label: '查看详情', action: NotificationAction.DETAIL, type: 'default' }
        ]
    },
    // 通用通知
    GENERAL_NOTIFICATION: {
        id: 'general_notification',
        type: NotificationType.NOTIFICATION,
        title: '系统通知',
        content: '{message}',
        priority: NotificationPriority.NORMAL,
        icon: 'bell',
        color: '#1989fa',
        actions: [
            { id: 'view', label: '查看详情', action: NotificationAction.DETAIL, type: 'default' }
        ]
    }
};
// 通知工厂类
export class NotificationFactory {
    // 创建设备可用通知
    static createDeviceAvailableNotification(deviceName, deviceId) {
        const template = NOTIFICATION_TEMPLATES.DEVICE_AVAILABLE;
        return {
            id: `device_available_${deviceId}_${Date.now()}`,
            type: template.type,
            title: template.title,
            content: template.content.replace('{deviceName}', deviceName),
            priority: template.priority,
            timestamp: Date.now(),
            read: false,
            data: { deviceId, deviceName }
        };
    }
    // 创建设备维修通知
    static createDeviceMaintenanceNotification(deviceName, deviceId, issue) {
        const template = NOTIFICATION_TEMPLATES.DEVICE_MAINTENANCE_REQUIRED;
        return {
            id: `device_maintenance_${deviceId}_${Date.now()}`,
            type: template.type,
            title: template.title,
            content: template.content.replace('{deviceName}', deviceName),
            priority: template.priority,
            timestamp: Date.now(),
            read: false,
            data: { deviceId, deviceName, issue }
        };
    }
    // 创建借用申请通知
    static createBorrowRequestNotification(userName, deviceName, requestId) {
        const template = NOTIFICATION_TEMPLATES.BORROW_REQUEST;
        return {
            id: `borrow_request_${requestId}_${Date.now()}`,
            type: template.type,
            title: template.title,
            content: template.content.replace('{userName}', userName).replace('{deviceName}', deviceName),
            priority: template.priority,
            timestamp: Date.now(),
            read: false,
            data: { requestId, userName, deviceName }
        };
    }
    // 创建借用批准通知
    static createBorrowApprovedNotification(deviceName, requestId) {
        const template = NOTIFICATION_TEMPLATES.BORROW_APPROVED;
        return {
            id: `borrow_approved_${requestId}_${Date.now()}`,
            type: template.type,
            title: template.title,
            content: template.content.replace('{deviceName}', deviceName),
            priority: template.priority,
            timestamp: Date.now(),
            read: false,
            data: { requestId, deviceName }
        };
    }
    // 创建借用拒绝通知
    static createBorrowRejectedNotification(deviceName, reason, requestId) {
        const template = NOTIFICATION_TEMPLATES.BORROW_REJECTED;
        return {
            id: `borrow_rejected_${requestId}_${Date.now()}`,
            type: template.type,
            title: template.title,
            content: template.content.replace('{deviceName}', deviceName).replace('{reason}', reason),
            priority: template.priority,
            timestamp: Date.now(),
            read: false,
            data: { requestId, deviceName, reason }
        };
    }
    // 创建逾期提醒通知
    static createBorrowOverdueNotification(deviceName, daysOverdue, borrowId) {
        const template = NOTIFICATION_TEMPLATES.BORROW_OVERDUE;
        return {
            id: `borrow_overdue_${borrowId}_${Date.now()}`,
            type: template.type,
            title: template.title,
            content: template.content.replace('{deviceName}', deviceName),
            priority: template.priority,
            timestamp: Date.now(),
            read: false,
            data: { borrowId, deviceName, daysOverdue }
        };
    }
    // 创建系统维护通知
    static createSystemMaintenanceNotification(startTime, duration) {
        const template = NOTIFICATION_TEMPLATES.SYSTEM_MAINTENANCE;
        return {
            id: `system_maintenance_${Date.now()}`,
            type: template.type,
            title: template.title,
            content: template.content.replace('{startTime}', startTime).replace('{duration}', duration),
            priority: template.priority,
            timestamp: Date.now(),
            read: false,
            data: { startTime, duration }
        };
    }
    // 创建安全警报通知
    static createSecurityAlertNotification(alertType, details) {
        const template = NOTIFICATION_TEMPLATES.SECURITY_ALERT;
        return {
            id: `security_alert_${Date.now()}`,
            type: template.type,
            title: template.title,
            content: template.content,
            priority: template.priority,
            timestamp: Date.now(),
            read: false,
            data: { alertType, details }
        };
    }
    // 创建通用通知
    static createGeneralNotification(title, content, priority = NotificationPriority.NORMAL) {
        return {
            id: `general_${Date.now()}`,
            type: NotificationType.NOTIFICATION,
            title,
            content,
            priority,
            timestamp: Date.now(),
            read: false,
            data: {}
        };
    }
}
