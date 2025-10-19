import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useMessageStore } from '../store/message';
import { WebSocketStatus } from '../utils/websocket';
const router = useRouter();
const messageStore = useMessageStore();
// 连接状态
const websocketStatus = computed(() => messageStore.websocketStatus);
const unreadCount = computed(() => messageStore.unreadCount);
// 状态样式
const statusType = computed(() => {
    switch (websocketStatus.value) {
        case WebSocketStatus.CONNECTED:
            return 'success';
        case WebSocketStatus.CONNECTING:
            return 'warning';
        case WebSocketStatus.ERROR:
            return 'danger';
        default:
            return 'default';
    }
});
const statusColor = computed(() => {
    switch (websocketStatus.value) {
        case WebSocketStatus.CONNECTED:
            return '#07c160';
        case WebSocketStatus.CONNECTING:
            return '#ff976a';
        case WebSocketStatus.ERROR:
            return '#ee0a24';
        default:
            return '#969799';
    }
});
const statusIcon = computed(() => {
    switch (websocketStatus.value) {
        case WebSocketStatus.CONNECTED:
            return 'success';
        case WebSocketStatus.CONNECTING:
            return 'clock';
        case WebSocketStatus.ERROR:
            return 'warning';
        default:
            return 'close';
    }
});
const statusText = computed(() => {
    switch (websocketStatus.value) {
        case WebSocketStatus.CONNECTED:
            return '已连接';
        case WebSocketStatus.CONNECTING:
            return '连接中';
        case WebSocketStatus.ERROR:
            return '连接失败';
        default:
            return '未连接';
    }
});
// 跳转到消息页面
const goToMessages = () => {
    router.push('/message');
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['message-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['message-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['message-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['message-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['van-icon']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "websocket-status" },
});
const __VLS_0 = {}.VanTag;
/** @type {[typeof __VLS_components.VanTag, typeof __VLS_components.vanTag, typeof __VLS_components.VanTag, typeof __VLS_components.vanTag, ]} */ ;
// @ts-ignore
VanTag;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    type: (__VLS_ctx.statusType),
    color: (__VLS_ctx.statusColor),
    size: "medium",
    round: true,
}));
const __VLS_2 = __VLS_1({
    type: (__VLS_ctx.statusType),
    color: (__VLS_ctx.statusColor),
    size: "medium",
    round: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
const { default: __VLS_4 } = __VLS_3.slots;
// @ts-ignore
[statusType, statusColor,];
const __VLS_5 = {}.VanIcon;
/** @type {[typeof __VLS_components.VanIcon, typeof __VLS_components.vanIcon, ]} */ ;
// @ts-ignore
VanIcon;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({
    name: (__VLS_ctx.statusIcon),
    size: "12",
    ...{ class: "status-icon" },
}));
const __VLS_7 = __VLS_6({
    name: (__VLS_ctx.statusIcon),
    size: "12",
    ...{ class: "status-icon" },
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
// @ts-ignore
[statusIcon,];
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ class: "status-text" },
});
(__VLS_ctx.statusText);
// @ts-ignore
[statusText,];
var __VLS_3;
if (__VLS_ctx.unreadCount > 0) {
    // @ts-ignore
    [unreadCount,];
    const __VLS_10 = {}.VanBadge;
    /** @type {[typeof __VLS_components.VanBadge, typeof __VLS_components.vanBadge, typeof __VLS_components.VanBadge, typeof __VLS_components.vanBadge, ]} */ ;
    // @ts-ignore
    VanBadge;
    // @ts-ignore
    const __VLS_11 = __VLS_asFunctionalComponent(__VLS_10, new __VLS_10({
        ...{ 'onClick': {} },
        content: (__VLS_ctx.unreadCount > 99 ? '99+' : __VLS_ctx.unreadCount),
        ...{ class: "message-badge" },
    }));
    const __VLS_12 = __VLS_11({
        ...{ 'onClick': {} },
        content: (__VLS_ctx.unreadCount > 99 ? '99+' : __VLS_ctx.unreadCount),
        ...{ class: "message-badge" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_11));
    let __VLS_14;
    let __VLS_15;
    const __VLS_16 = ({ click: {} },
        { onClick: (__VLS_ctx.goToMessages) });
    const { default: __VLS_17 } = __VLS_13.slots;
    // @ts-ignore
    [unreadCount, unreadCount, goToMessages,];
    const __VLS_18 = {}.VanIcon;
    /** @type {[typeof __VLS_components.VanIcon, typeof __VLS_components.vanIcon, ]} */ ;
    // @ts-ignore
    VanIcon;
    // @ts-ignore
    const __VLS_19 = __VLS_asFunctionalComponent(__VLS_18, new __VLS_18({
        name: "bell",
        size: "20",
    }));
    const __VLS_20 = __VLS_19({
        name: "bell",
        size: "20",
    }, ...__VLS_functionalComponentArgsRest(__VLS_19));
    var __VLS_13;
}
/** @type {__VLS_StyleScopedClasses['websocket-status']} */ ;
/** @type {__VLS_StyleScopedClasses['status-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['status-text']} */ ;
/** @type {__VLS_StyleScopedClasses['message-badge']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup: () => ({
        unreadCount: unreadCount,
        statusType: statusType,
        statusColor: statusColor,
        statusIcon: statusIcon,
        statusText: statusText,
        goToMessages: goToMessages,
    }),
});
export default (await import('vue')).defineComponent({});
; /* PartiallyEnd: #4569/main.vue */
