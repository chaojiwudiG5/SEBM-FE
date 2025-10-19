import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useMessageStore } from '../../store/message';
import { WebSocketStatus as WsStatus } from '../../utils/websocket';
import { showNotify, showConfirmDialog } from 'vant';
import { deleteNotificationRecord, markAllAsRead as markAllAsReadApi, clearUserNotifications } from '../../api/notificationRecord';
import { useUserStore } from '../../store/user';
const messageStore = useMessageStore();
const userStore = useUserStore();
// 响应式数据
const activeFilter = ref('read');
const searchQuery = ref('');
const refreshing = ref(false);
const loading = ref(false);
const finished = ref(false);
const showTestMessageDialog = ref(false);
const testMessageType = ref('notification');
const testMessagePriority = ref('normal');
const showHeaderActions = ref(false); // 控制头部按钮显示
const scrollContainer = ref(null);
const filterRef = ref(null);
// 开发环境标识
const isDev = import.meta.env.DEV;
// 计算属性
const unreadCount = computed(() => messageStore.unreadCount);
const websocketStatus = computed(() => messageStore.websocketStatus);
const isConnected = computed(() => messageStore.isConnected);
// 连接状态相关
const connectionStatusType = computed(() => {
    switch (websocketStatus.value) {
        case WsStatus.CONNECTED:
            return 'success';
        case WsStatus.CONNECTING:
            return 'warning';
        case WsStatus.ERROR:
            return 'danger';
        default:
            return 'default';
    }
});
const connectionIcon = computed(() => {
    switch (websocketStatus.value) {
        case WsStatus.CONNECTED:
            return 'success';
        case WsStatus.CONNECTING:
            return 'clock';
        case WsStatus.ERROR:
            return 'warning';
        default:
            return 'close';
    }
});
const connectionStatusText = computed(() => {
    switch (websocketStatus.value) {
        case WsStatus.CONNECTED:
            return 'Connected';
        case WsStatus.CONNECTING:
            return 'Connecting';
        case WsStatus.ERROR:
            return 'Failed';
        default:
            return 'Disconnected';
    }
});
// 过滤后的消息
const filteredMessages = computed(() => {
    let messages = messageStore.sortedMessages;
    // 根据 read/unread 过滤
    if (activeFilter.value === 'unread') {
        messages = messages.filter((msg) => !msg.read);
    }
    else if (activeFilter.value === 'read') {
        messages = messages.filter((msg) => msg.read);
    }
    // 搜索过滤
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        messages = messages.filter((msg) => msg.title.toLowerCase().includes(query) ||
            msg.content.toLowerCase().includes(query));
    }
    return messages;
});
// 按日期分组的消息
const groupedMessages = computed(() => {
    const groups = {};
    filteredMessages.value.forEach((msg) => {
        const date = new Date(msg.timestamp).toDateString();
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(msg);
    });
    return groups;
});
// 方法
const onFilterChange = async (name) => {
    activeFilter.value = name;
    // Read 传 1，Unread 传 0
    const readStatus = name === 'read' ? 1 : 0;
    await messageStore.loadFromServer(1, 20, readStatus);
};
const onSearch = () => {
    // 搜索逻辑已在计算属性中处理
};
const onSearchClear = () => {
    searchQuery.value = '';
};
const onRefresh = async () => {
    refreshing.value = true;
    try {
        // 根据当前选中的标签重新加载数据
        const readStatus = activeFilter.value === 'read' ? 1 : 0;
        await messageStore.loadFromServer(1, 20, readStatus);
        // 重新连接WebSocket（如果断开）
        if (!isConnected.value) {
            await messageStore.initWebSocket();
        }
        showNotify({ type: 'success', message: '刷新成功' });
    }
    catch (error) {
        showNotify({ type: 'danger', message: '刷新失败' });
    }
    finally {
        refreshing.value = false;
    }
};
const onLoad = () => {
    // 这里可以添加加载更多消息的逻辑
    loading.value = false;
    finished.value = true;
};
const onMessageClick = (message) => {
    // 标记为已读
    if (!message.read) {
        messageStore.markAsRead(message.id);
    }
    // 显示消息详情
    showNotify({
        type: 'primary',
        message: `${message.title}\n${message.content}`
    });
};
const markAsReadSingle = async (message) => {
    try {
        // 标记为已读
        messageStore.markAsRead(message.id);
        showNotify({ type: 'success', message: '已标记为已读' });
        // 重新加载数据
        const readStatus = activeFilter.value === 'read' ? 1 : 0;
        await messageStore.loadFromServer(1, 20, readStatus);
    }
    catch (error) {
        showNotify({ type: 'danger', message: '标记失败' });
    }
};
const markAllAsRead = async () => {
    try {
        const userId = userStore.userInfo?.id;
        if (!userId) {
            showNotify({ type: 'danger', message: '用户信息不存在' });
            return;
        }
        // 标记所有未读消息为已读
        await markAllAsReadApi({ userId: Number(userId) });
        messageStore.markAllAsRead();
        showNotify({ type: 'success', message: '已标记全部为已读' });
        // 重新加载数据
        const readStatus = activeFilter.value === 'read' ? 1 : 0;
        await messageStore.loadFromServer(1, 20, readStatus);
    }
    catch (error) {
        showNotify({ type: 'danger', message: '标记失败' });
    }
};
const clearReadMessages = async () => {
    try {
        const userId = userStore.userInfo?.id;
        if (!userId) {
            showNotify({ type: 'danger', message: '用户信息不存在' });
            return;
        }
        // 清空所有已读消息
        await showConfirmDialog({
            title: '确认清空',
            message: '确定要清空所有已读消息吗？'
        });
        // 直接调用清空已读消息接口
        await clearUserNotifications({ userId: Number(userId) });
        // 清空本地已读消息
        messageStore.clearReadMessages();
        showNotify({ type: 'success', message: '已清空已读消息' });
        // 重新加载数据
        const readStatus = activeFilter.value === 'read' ? 1 : 0;
        await messageStore.loadFromServer(1, 20, readStatus);
    }
    catch (error) {
        // 用户取消或删除失败
        if (error) {
            showNotify({ type: 'danger', message: '操作失败' });
        }
    }
};
const removeMessage = async (messageId) => {
    try {
        await showConfirmDialog({
            title: '确认删除',
            message: '确定要删除这条消息吗？'
        });
        // 查找消息，获取后端 ID
        const message = messageStore.allMessages.find((msg) => msg.id === messageId);
        const backendId = message?.data?.id;
        // 如果有后端 ID，调用后端删除接口
        if (backendId) {
            await deleteNotificationRecord({ id: backendId });
        }
        // 从本地移除
        messageStore.removeMessage(messageId);
        showNotify({ type: 'success', message: '消息已删除' });
    }
    catch (error) {
        // 用户取消或删除失败
        if (error) {
            showNotify({ type: 'danger', message: '删除失败' });
        }
    }
};
const sendTestMessage = () => {
    messageStore.sendTestMessage(testMessageType.value, testMessagePriority.value);
    showTestMessageDialog.value = false;
    showNotify({ type: 'success', message: '测试消息已发送' });
};
// 工具方法
const getMessageIcon = (type) => {
    const icons = {
        notification: 'bell',
        system: 'setting',
        device_update: 'desktop',
        maintenance_update: 'tool',
        borrow_update: 'exchange'
    };
    return icons[type] || 'bell';
};
const getMessageColor = (priority) => {
    const colors = {
        urgent: '#ee0a24',
        high: '#ff976a',
        normal: '#1989fa',
        low: '#07c160'
    };
    return colors[priority] || '#1989fa';
};
const getPriorityText = (priority) => {
    const texts = {
        urgent: '紧急',
        high: '重要',
        normal: '普通',
        low: '低'
    };
    return texts[priority] || '普通';
};
const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === today.toDateString()) {
        return '今天';
    }
    else if (date.toDateString() === yesterday.toDateString()) {
        return '昨天';
    }
    else {
        return date.toLocaleDateString('zh-CN', {
            month: 'short',
            day: 'numeric'
        });
    }
};
const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit'
    });
};
// 滚动/可见性处理
let filterObserver = null;
const updateHeaderVisibility = () => {
    if (scrollContainer.value) {
        showHeaderActions.value = scrollContainer.value.scrollTop > 50;
    }
};
const handleScroll = () => {
    updateHeaderVisibility();
};
const handleWindowScroll = () => {
    // 作为兜底：当使用的是窗口滚动时，根据窗口滚动位置判断
    if (!scrollContainer.value) {
        showHeaderActions.value = window.scrollY > 50;
    }
    else {
        // 同时考虑筛选区域是否仍在视口内
        updateHeaderVisibility();
    }
};
// 生命周期
onMounted(async () => {
    try {
        // 先从后端加载历史消息（默认加载 Read 标签，readStatus=1）
        await messageStore.loadFromServer(1, 20, 1);
        // 再初始化 WebSocket 实时推送
        await messageStore.initWebSocket();
        // 通过 ref 添加滚动监听
        if (scrollContainer.value) {
            scrollContainer.value.addEventListener('scroll', handleScroll);
        }
        // 使用 IntersectionObserver，当筛选区域离开视口时显示操作区
        if ('IntersectionObserver' in window && filterRef.value) {
            filterObserver = new IntersectionObserver((entries) => {
                const entry = entries[0];
                // 当筛选区域不可见时，也显示头部按钮
                if (entry) {
                    showHeaderActions.value = !entry.isIntersecting || (scrollContainer.value ? scrollContainer.value.scrollTop > 50 : window.scrollY > 50);
                }
            }, {
                // 直接以视口为根，更稳健
                root: null,
                threshold: 1
            });
            filterObserver.observe(filterRef.value);
        }
        // 监听窗口滚动（兜底方案）
        window.addEventListener('scroll', handleWindowScroll, { passive: true });
        // 初始化一次可见性
        updateHeaderVisibility();
    }
    catch (error) {
        console.error('Failed to initialize WebSocket:', error);
        showNotify({
            type: 'warning',
            message: 'WebSocket连接失败，消息可能无法实时更新'
        });
    }
});
onUnmounted(() => {
    // 移除滚动监听
    if (scrollContainer.value) {
        scrollContainer.value.removeEventListener('scroll', handleScroll);
    }
    window.removeEventListener('scroll', handleWindowScroll);
    // 断开可见性观察
    if (filterObserver) {
        filterObserver.disconnect();
        filterObserver = null;
    }
    // 注意：这里不主动断开连接，因为其他页面可能也需要使用
    // messageStore.disconnectWebSocket()
});
// 监听连接状态变化
watch(isConnected, (connected) => {
    if (connected) {
        showNotify({ type: 'success', message: '消息服务已连接' });
    }
    else {
        showNotify({ type: 'warning', message: '消息服务已断开' });
    }
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['filter-section']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-section']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-section']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-section']} */ ;
/** @type {__VLS_StyleScopedClasses['search-section']} */ ;
/** @type {__VLS_StyleScopedClasses['search-section']} */ ;
/** @type {__VLS_StyleScopedClasses['date-header']} */ ;
/** @type {__VLS_StyleScopedClasses['message-cell']} */ ;
/** @type {__VLS_StyleScopedClasses['message-cell']} */ ;
/** @type {__VLS_StyleScopedClasses['message-cell']} */ ;
/** @type {__VLS_StyleScopedClasses['header-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['message-list']} */ ;
/** @type {__VLS_StyleScopedClasses['message-list']} */ ;
/** @type {__VLS_StyleScopedClasses['message-list']} */ ;
/** @type {__VLS_StyleScopedClasses['message-list']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "message-box-page" },
});
const __VLS_0 = {}.transition;
/** @type {[typeof __VLS_components.Transition, typeof __VLS_components.transition, typeof __VLS_components.Transition, typeof __VLS_components.transition, ]} */ ;
// @ts-ignore
Transition;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    name: "slide-down",
    persisted: true,
}));
const __VLS_2 = __VLS_1({
    name: "slide-down",
    persisted: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
const { default: __VLS_4 } = __VLS_3.slots;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "page-header" },
});
__VLS_asFunctionalDirective(__VLS_directives.vShow)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.showHeaderActions) }, null, null);
// @ts-ignore
[showHeaderActions,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "header-content" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "header-actions" },
});
const __VLS_5 = {}.VanButton;
/** @type {[typeof __VLS_components.VanButton, typeof __VLS_components.vanButton, typeof __VLS_components.VanButton, typeof __VLS_components.vanButton, ]} */ ;
// @ts-ignore
VanButton;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({
    ...{ 'onClick': {} },
    size: "small",
    type: "primary",
    disabled: (__VLS_ctx.unreadCount === 0),
}));
const __VLS_7 = __VLS_6({
    ...{ 'onClick': {} },
    size: "small",
    type: "primary",
    disabled: (__VLS_ctx.unreadCount === 0),
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
let __VLS_9;
let __VLS_10;
const __VLS_11 = ({ click: {} },
    { onClick: (__VLS_ctx.markAllAsRead) });
const { default: __VLS_12 } = __VLS_8.slots;
// @ts-ignore
[unreadCount, markAllAsRead,];
var __VLS_8;
const __VLS_13 = {}.VanButton;
/** @type {[typeof __VLS_components.VanButton, typeof __VLS_components.vanButton, typeof __VLS_components.VanButton, typeof __VLS_components.vanButton, ]} */ ;
// @ts-ignore
VanButton;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
    ...{ 'onClick': {} },
    size: "small",
    type: "default",
}));
const __VLS_15 = __VLS_14({
    ...{ 'onClick': {} },
    size: "small",
    type: "default",
}, ...__VLS_functionalComponentArgsRest(__VLS_14));
let __VLS_17;
let __VLS_18;
const __VLS_19 = ({ click: {} },
    { onClick: (__VLS_ctx.clearReadMessages) });
const { default: __VLS_20 } = __VLS_16.slots;
// @ts-ignore
[clearReadMessages,];
var __VLS_16;
var __VLS_3;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "filter-section" },
    ref: "filterRef",
});
/** @type {typeof __VLS_ctx.filterRef} */ ;
// @ts-ignore
[filterRef,];
const __VLS_21 = {}.VanTabs;
/** @type {[typeof __VLS_components.VanTabs, typeof __VLS_components.vanTabs, typeof __VLS_components.VanTabs, typeof __VLS_components.vanTabs, ]} */ ;
// @ts-ignore
VanTabs;
// @ts-ignore
const __VLS_22 = __VLS_asFunctionalComponent(__VLS_21, new __VLS_21({
    ...{ 'onChange': {} },
    active: (__VLS_ctx.activeFilter),
}));
const __VLS_23 = __VLS_22({
    ...{ 'onChange': {} },
    active: (__VLS_ctx.activeFilter),
}, ...__VLS_functionalComponentArgsRest(__VLS_22));
let __VLS_25;
let __VLS_26;
const __VLS_27 = ({ change: {} },
    { onChange: (__VLS_ctx.onFilterChange) });
const { default: __VLS_28 } = __VLS_24.slots;
// @ts-ignore
[activeFilter, onFilterChange,];
const __VLS_29 = {}.VanTab;
/** @type {[typeof __VLS_components.VanTab, typeof __VLS_components.vanTab, ]} */ ;
// @ts-ignore
VanTab;
// @ts-ignore
const __VLS_30 = __VLS_asFunctionalComponent(__VLS_29, new __VLS_29({
    title: "Read",
    name: "read",
}));
const __VLS_31 = __VLS_30({
    title: "Read",
    name: "read",
}, ...__VLS_functionalComponentArgsRest(__VLS_30));
const __VLS_34 = {}.VanTab;
/** @type {[typeof __VLS_components.VanTab, typeof __VLS_components.vanTab, ]} */ ;
// @ts-ignore
VanTab;
// @ts-ignore
const __VLS_35 = __VLS_asFunctionalComponent(__VLS_34, new __VLS_34({
    title: "Unread",
    name: "unread",
}));
const __VLS_36 = __VLS_35({
    title: "Unread",
    name: "unread",
}, ...__VLS_functionalComponentArgsRest(__VLS_35));
var __VLS_24;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "search-section" },
});
const __VLS_39 = {}.VanSearch;
/** @type {[typeof __VLS_components.VanSearch, typeof __VLS_components.vanSearch, ]} */ ;
// @ts-ignore
VanSearch;
// @ts-ignore
const __VLS_40 = __VLS_asFunctionalComponent(__VLS_39, new __VLS_39({
    ...{ 'onSearch': {} },
    ...{ 'onClear': {} },
    modelValue: (__VLS_ctx.searchQuery),
    placeholder: "Search messages...",
}));
const __VLS_41 = __VLS_40({
    ...{ 'onSearch': {} },
    ...{ 'onClear': {} },
    modelValue: (__VLS_ctx.searchQuery),
    placeholder: "Search messages...",
}, ...__VLS_functionalComponentArgsRest(__VLS_40));
let __VLS_43;
let __VLS_44;
const __VLS_45 = ({ search: {} },
    { onSearch: (__VLS_ctx.onSearch) });
const __VLS_46 = ({ clear: {} },
    { onClear: (__VLS_ctx.onSearchClear) });
// @ts-ignore
[searchQuery, onSearch, onSearchClear,];
var __VLS_42;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "message-list" },
    ref: "scrollContainer",
});
/** @type {typeof __VLS_ctx.scrollContainer} */ ;
// @ts-ignore
[scrollContainer,];
const __VLS_48 = {}.VanPullRefresh;
/** @type {[typeof __VLS_components.VanPullRefresh, typeof __VLS_components.vanPullRefresh, typeof __VLS_components.VanPullRefresh, typeof __VLS_components.vanPullRefresh, ]} */ ;
// @ts-ignore
VanPullRefresh;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
    ...{ 'onRefresh': {} },
    modelValue: (__VLS_ctx.refreshing),
}));
const __VLS_50 = __VLS_49({
    ...{ 'onRefresh': {} },
    modelValue: (__VLS_ctx.refreshing),
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
let __VLS_52;
let __VLS_53;
const __VLS_54 = ({ refresh: {} },
    { onRefresh: (__VLS_ctx.onRefresh) });
const { default: __VLS_55 } = __VLS_51.slots;
// @ts-ignore
[refreshing, onRefresh,];
const __VLS_56 = {}.VanList;
/** @type {[typeof __VLS_components.VanList, typeof __VLS_components.vanList, typeof __VLS_components.VanList, typeof __VLS_components.vanList, ]} */ ;
// @ts-ignore
VanList;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
    ...{ 'onLoad': {} },
    loading: (__VLS_ctx.loading),
    finished: (__VLS_ctx.finished),
    finishedText: "No more messages",
}));
const __VLS_58 = __VLS_57({
    ...{ 'onLoad': {} },
    loading: (__VLS_ctx.loading),
    finished: (__VLS_ctx.finished),
    finishedText: "No more messages",
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
let __VLS_60;
let __VLS_61;
const __VLS_62 = ({ load: {} },
    { onLoad: (__VLS_ctx.onLoad) });
const { default: __VLS_63 } = __VLS_59.slots;
// @ts-ignore
[loading, finished, onLoad,];
for (const [messages, date] of __VLS_getVForSourceType((__VLS_ctx.groupedMessages))) {
    // @ts-ignore
    [groupedMessages,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        key: (date),
        ...{ class: "date-group" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "date-header" },
    });
    const __VLS_64 = {}.VanDivider;
    /** @type {[typeof __VLS_components.VanDivider, typeof __VLS_components.vanDivider, typeof __VLS_components.VanDivider, typeof __VLS_components.vanDivider, ]} */ ;
    // @ts-ignore
    VanDivider;
    // @ts-ignore
    const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({}));
    const __VLS_66 = __VLS_65({}, ...__VLS_functionalComponentArgsRest(__VLS_65));
    const { default: __VLS_68 } = __VLS_67.slots;
    (__VLS_ctx.formatDate(String(date)));
    // @ts-ignore
    [formatDate,];
    var __VLS_67;
    for (const [message] of __VLS_getVForSourceType((messages))) {
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            key: (message.id),
            ...{ class: "message-item" },
        });
        const __VLS_69 = {}.VanSwipeCell;
        /** @type {[typeof __VLS_components.VanSwipeCell, typeof __VLS_components.vanSwipeCell, typeof __VLS_components.VanSwipeCell, typeof __VLS_components.vanSwipeCell, ]} */ ;
        // @ts-ignore
        VanSwipeCell;
        // @ts-ignore
        const __VLS_70 = __VLS_asFunctionalComponent(__VLS_69, new __VLS_69({}));
        const __VLS_71 = __VLS_70({}, ...__VLS_functionalComponentArgsRest(__VLS_70));
        const { default: __VLS_73 } = __VLS_72.slots;
        const __VLS_74 = {}.VanCell;
        /** @type {[typeof __VLS_components.VanCell, typeof __VLS_components.vanCell, typeof __VLS_components.VanCell, typeof __VLS_components.vanCell, ]} */ ;
        // @ts-ignore
        VanCell;
        // @ts-ignore
        const __VLS_75 = __VLS_asFunctionalComponent(__VLS_74, new __VLS_74({
            ...{ 'onClick': {} },
            ...{ class: (['message-cell', { 'unread': !message.read }]) },
        }));
        const __VLS_76 = __VLS_75({
            ...{ 'onClick': {} },
            ...{ class: (['message-cell', { 'unread': !message.read }]) },
        }, ...__VLS_functionalComponentArgsRest(__VLS_75));
        let __VLS_78;
        let __VLS_79;
        const __VLS_80 = ({ click: {} },
            { onClick: (...[$event]) => {
                    __VLS_ctx.onMessageClick(message);
                    // @ts-ignore
                    [onMessageClick,];
                } });
        const { default: __VLS_81 } = __VLS_77.slots;
        {
            const { icon: __VLS_82 } = __VLS_77.slots;
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
                ...{ class: "message-icon" },
            });
            const __VLS_83 = {}.VanIcon;
            /** @type {[typeof __VLS_components.VanIcon, typeof __VLS_components.vanIcon, ]} */ ;
            // @ts-ignore
            VanIcon;
            // @ts-ignore
            const __VLS_84 = __VLS_asFunctionalComponent(__VLS_83, new __VLS_83({
                name: (__VLS_ctx.getMessageIcon(message.type)),
                color: (__VLS_ctx.getMessageColor(message.priority)),
                size: "20",
            }));
            const __VLS_85 = __VLS_84({
                name: (__VLS_ctx.getMessageIcon(message.type)),
                color: (__VLS_ctx.getMessageColor(message.priority)),
                size: "20",
            }, ...__VLS_functionalComponentArgsRest(__VLS_84));
            // @ts-ignore
            [getMessageIcon, getMessageColor,];
        }
        {
            const { title: __VLS_88 } = __VLS_77.slots;
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
                ...{ class: "message-title" },
            });
            __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
                ...{ class: "title-text" },
            });
            (message.title);
            if (message.priority === 'urgent' || message.priority === 'high') {
                const __VLS_89 = {}.VanTag;
                /** @type {[typeof __VLS_components.VanTag, typeof __VLS_components.vanTag, typeof __VLS_components.VanTag, typeof __VLS_components.vanTag, ]} */ ;
                // @ts-ignore
                VanTag;
                // @ts-ignore
                const __VLS_90 = __VLS_asFunctionalComponent(__VLS_89, new __VLS_89({
                    type: (message.priority === 'urgent' ? 'danger' : 'warning'),
                }));
                const __VLS_91 = __VLS_90({
                    type: (message.priority === 'urgent' ? 'danger' : 'warning'),
                }, ...__VLS_functionalComponentArgsRest(__VLS_90));
                const { default: __VLS_93 } = __VLS_92.slots;
                (__VLS_ctx.getPriorityText(message.priority));
                // @ts-ignore
                [getPriorityText,];
                var __VLS_92;
            }
        }
        {
            const { label: __VLS_94 } = __VLS_77.slots;
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
                ...{ class: "message-content" },
            });
            (message.content);
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
                ...{ class: "message-time" },
            });
            (__VLS_ctx.formatTime(message.timestamp));
            // @ts-ignore
            [formatTime,];
        }
        var __VLS_77;
        {
            const { right: __VLS_95 } = __VLS_72.slots;
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
                ...{ class: "swipe-actions" },
            });
            if (__VLS_ctx.activeFilter === 'unread') {
                // @ts-ignore
                [activeFilter,];
                const __VLS_96 = {}.VanButton;
                /** @type {[typeof __VLS_components.VanButton, typeof __VLS_components.vanButton, ]} */ ;
                // @ts-ignore
                VanButton;
                // @ts-ignore
                const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
                    ...{ 'onClick': {} },
                    square: true,
                    type: "primary",
                    text: "标为已读",
                    ...{ class: "swipe-button swipe-button-read" },
                }));
                const __VLS_98 = __VLS_97({
                    ...{ 'onClick': {} },
                    square: true,
                    type: "primary",
                    text: "标为已读",
                    ...{ class: "swipe-button swipe-button-read" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_97));
                let __VLS_100;
                let __VLS_101;
                const __VLS_102 = ({ click: {} },
                    { onClick: (...[$event]) => {
                            if (!(__VLS_ctx.activeFilter === 'unread'))
                                return;
                            __VLS_ctx.markAsReadSingle(message);
                            // @ts-ignore
                            [markAsReadSingle,];
                        } });
                var __VLS_99;
                const __VLS_104 = {}.VanButton;
                /** @type {[typeof __VLS_components.VanButton, typeof __VLS_components.vanButton, ]} */ ;
                // @ts-ignore
                VanButton;
                // @ts-ignore
                const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({
                    ...{ 'onClick': {} },
                    square: true,
                    type: "danger",
                    text: "删除",
                    ...{ class: "swipe-button swipe-button-delete" },
                }));
                const __VLS_106 = __VLS_105({
                    ...{ 'onClick': {} },
                    square: true,
                    type: "danger",
                    text: "删除",
                    ...{ class: "swipe-button swipe-button-delete" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_105));
                let __VLS_108;
                let __VLS_109;
                const __VLS_110 = ({ click: {} },
                    { onClick: (...[$event]) => {
                            if (!(__VLS_ctx.activeFilter === 'unread'))
                                return;
                            __VLS_ctx.removeMessage(message.id);
                            // @ts-ignore
                            [removeMessage,];
                        } });
                var __VLS_107;
            }
            else {
                const __VLS_112 = {}.VanButton;
                /** @type {[typeof __VLS_components.VanButton, typeof __VLS_components.vanButton, ]} */ ;
                // @ts-ignore
                VanButton;
                // @ts-ignore
                const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
                    ...{ 'onClick': {} },
                    square: true,
                    type: "danger",
                    text: "删除",
                    ...{ class: "swipe-button swipe-button-delete" },
                }));
                const __VLS_114 = __VLS_113({
                    ...{ 'onClick': {} },
                    square: true,
                    type: "danger",
                    text: "删除",
                    ...{ class: "swipe-button swipe-button-delete" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_113));
                let __VLS_116;
                let __VLS_117;
                const __VLS_118 = ({ click: {} },
                    { onClick: (...[$event]) => {
                            if (!!(__VLS_ctx.activeFilter === 'unread'))
                                return;
                            __VLS_ctx.removeMessage(message.id);
                            // @ts-ignore
                            [removeMessage,];
                        } });
                var __VLS_115;
            }
        }
        var __VLS_72;
    }
}
if (!__VLS_ctx.loading && __VLS_ctx.filteredMessages.length === 0) {
    // @ts-ignore
    [loading, filteredMessages,];
    const __VLS_120 = {}.VanEmpty;
    /** @type {[typeof __VLS_components.VanEmpty, typeof __VLS_components.vanEmpty, ]} */ ;
    // @ts-ignore
    VanEmpty;
    // @ts-ignore
    const __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120({
        image: "search",
        description: "No messages",
    }));
    const __VLS_122 = __VLS_121({
        image: "search",
        description: "No messages",
    }, ...__VLS_functionalComponentArgsRest(__VLS_121));
}
var __VLS_59;
var __VLS_51;
if (__VLS_ctx.isDev) {
    // @ts-ignore
    [isDev,];
    const __VLS_125 = {}.VanFloatingBubble;
    /** @type {[typeof __VLS_components.VanFloatingBubble, typeof __VLS_components.vanFloatingBubble, ]} */ ;
    // @ts-ignore
    VanFloatingBubble;
    // @ts-ignore
    const __VLS_126 = __VLS_asFunctionalComponent(__VLS_125, new __VLS_125({
        ...{ 'onClick': {} },
        axis: "xy",
        icon: "plus",
    }));
    const __VLS_127 = __VLS_126({
        ...{ 'onClick': {} },
        axis: "xy",
        icon: "plus",
    }, ...__VLS_functionalComponentArgsRest(__VLS_126));
    let __VLS_129;
    let __VLS_130;
    const __VLS_131 = ({ click: {} },
        { onClick: (...[$event]) => {
                if (!(__VLS_ctx.isDev))
                    return;
                __VLS_ctx.showTestMessageDialog = true;
                // @ts-ignore
                [showTestMessageDialog,];
            } });
    var __VLS_128;
}
const __VLS_133 = {}.VanDialog;
/** @type {[typeof __VLS_components.VanDialog, typeof __VLS_components.vanDialog, typeof __VLS_components.VanDialog, typeof __VLS_components.vanDialog, ]} */ ;
// @ts-ignore
VanDialog;
// @ts-ignore
const __VLS_134 = __VLS_asFunctionalComponent(__VLS_133, new __VLS_133({
    ...{ 'onConfirm': {} },
    show: (__VLS_ctx.showTestMessageDialog),
    title: "Send Test Message",
    showCancelButton: true,
}));
const __VLS_135 = __VLS_134({
    ...{ 'onConfirm': {} },
    show: (__VLS_ctx.showTestMessageDialog),
    title: "Send Test Message",
    showCancelButton: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_134));
let __VLS_137;
let __VLS_138;
const __VLS_139 = ({ confirm: {} },
    { onConfirm: (__VLS_ctx.sendTestMessage) });
const { default: __VLS_140 } = __VLS_136.slots;
// @ts-ignore
[showTestMessageDialog, sendTestMessage,];
const __VLS_141 = {}.VanForm;
/** @type {[typeof __VLS_components.VanForm, typeof __VLS_components.vanForm, typeof __VLS_components.VanForm, typeof __VLS_components.vanForm, ]} */ ;
// @ts-ignore
VanForm;
// @ts-ignore
const __VLS_142 = __VLS_asFunctionalComponent(__VLS_141, new __VLS_141({}));
const __VLS_143 = __VLS_142({}, ...__VLS_functionalComponentArgsRest(__VLS_142));
const { default: __VLS_145 } = __VLS_144.slots;
const __VLS_146 = {}.VanField;
/** @type {[typeof __VLS_components.VanField, typeof __VLS_components.vanField, ]} */ ;
// @ts-ignore
VanField;
// @ts-ignore
const __VLS_147 = __VLS_asFunctionalComponent(__VLS_146, new __VLS_146({
    modelValue: (__VLS_ctx.testMessageType),
    label: "Type",
    placeholder: "notification",
}));
const __VLS_148 = __VLS_147({
    modelValue: (__VLS_ctx.testMessageType),
    label: "Type",
    placeholder: "notification",
}, ...__VLS_functionalComponentArgsRest(__VLS_147));
// @ts-ignore
[testMessageType,];
const __VLS_151 = {}.VanField;
/** @type {[typeof __VLS_components.VanField, typeof __VLS_components.vanField, ]} */ ;
// @ts-ignore
VanField;
// @ts-ignore
const __VLS_152 = __VLS_asFunctionalComponent(__VLS_151, new __VLS_151({
    modelValue: (__VLS_ctx.testMessagePriority),
    label: "Priority",
    placeholder: "normal",
}));
const __VLS_153 = __VLS_152({
    modelValue: (__VLS_ctx.testMessagePriority),
    label: "Priority",
    placeholder: "normal",
}, ...__VLS_functionalComponentArgsRest(__VLS_152));
// @ts-ignore
[testMessagePriority,];
var __VLS_144;
var __VLS_136;
/** @type {__VLS_StyleScopedClasses['message-box-page']} */ ;
/** @type {__VLS_StyleScopedClasses['page-header']} */ ;
/** @type {__VLS_StyleScopedClasses['header-content']} */ ;
/** @type {__VLS_StyleScopedClasses['header-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-section']} */ ;
/** @type {__VLS_StyleScopedClasses['search-section']} */ ;
/** @type {__VLS_StyleScopedClasses['message-list']} */ ;
/** @type {__VLS_StyleScopedClasses['date-group']} */ ;
/** @type {__VLS_StyleScopedClasses['date-header']} */ ;
/** @type {__VLS_StyleScopedClasses['message-item']} */ ;
/** @type {__VLS_StyleScopedClasses['message-cell']} */ ;
/** @type {__VLS_StyleScopedClasses['unread']} */ ;
/** @type {__VLS_StyleScopedClasses['message-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['message-title']} */ ;
/** @type {__VLS_StyleScopedClasses['title-text']} */ ;
/** @type {__VLS_StyleScopedClasses['message-content']} */ ;
/** @type {__VLS_StyleScopedClasses['message-time']} */ ;
/** @type {__VLS_StyleScopedClasses['swipe-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['swipe-button']} */ ;
/** @type {__VLS_StyleScopedClasses['swipe-button-read']} */ ;
/** @type {__VLS_StyleScopedClasses['swipe-button']} */ ;
/** @type {__VLS_StyleScopedClasses['swipe-button-delete']} */ ;
/** @type {__VLS_StyleScopedClasses['swipe-button']} */ ;
/** @type {__VLS_StyleScopedClasses['swipe-button-delete']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup: () => ({
        activeFilter: activeFilter,
        searchQuery: searchQuery,
        refreshing: refreshing,
        loading: loading,
        finished: finished,
        showTestMessageDialog: showTestMessageDialog,
        testMessageType: testMessageType,
        testMessagePriority: testMessagePriority,
        showHeaderActions: showHeaderActions,
        scrollContainer: scrollContainer,
        filterRef: filterRef,
        isDev: isDev,
        unreadCount: unreadCount,
        filteredMessages: filteredMessages,
        groupedMessages: groupedMessages,
        onFilterChange: onFilterChange,
        onSearch: onSearch,
        onSearchClear: onSearchClear,
        onRefresh: onRefresh,
        onLoad: onLoad,
        onMessageClick: onMessageClick,
        markAsReadSingle: markAsReadSingle,
        markAllAsRead: markAllAsRead,
        clearReadMessages: clearReadMessages,
        removeMessage: removeMessage,
        sendTestMessage: sendTestMessage,
        getMessageIcon: getMessageIcon,
        getMessageColor: getMessageColor,
        getPriorityText: getPriorityText,
        formatDate: formatDate,
        formatTime: formatTime,
    }),
});
export default (await import('vue')).defineComponent({});
; /* PartiallyEnd: #4569/main.vue */
