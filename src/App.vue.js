import { onMounted, onUnmounted, watch } from 'vue';
import { useUserStore } from './store/user';
import { useMessageStore } from './store/message';
import { useRoute } from 'vue-router';
const userStore = useUserStore();
const messageStore = useMessageStore();
const route = useRoute();
// 在用户登录后初始化WebSocket
onMounted(async () => {
    // 如果用户已登录，初始化WebSocket
    if (userStore.userInfo) {
        await initializeWebSocket();
    }
});
// 监听用户登录状态变化
watch(() => userStore.userInfo, async (newUserInfo, oldUserInfo) => {
    if (newUserInfo && !oldUserInfo) {
        // 用户刚登录，初始化WebSocket
        await initializeWebSocket();
    }
    else if (!newUserInfo && oldUserInfo) {
        // 用户登出，断开WebSocket
        messageStore.disconnectWebSocket();
    }
});
// 初始化WebSocket连接
async function initializeWebSocket() {
    try {
        // 确保不在登录页面
        if (route.path !== '/login' && route.path !== '/register') {
            console.log('🚀 正在初始化WebSocket连接...');
            await messageStore.initWebSocket();
            console.log('✅ WebSocket连接初始化成功');
        }
    }
    catch (error) {
        console.error('❌ WebSocket初始化失败:', error);
        // 不显示错误提示，避免干扰用户体验
    }
}
// 组件卸载时清理
onUnmounted(() => {
    // 注意：这里不主动断开WebSocket，因为可能是页面切换
    // WebSocket会在用户登出时自动断开
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
const __VLS_0 = {}.RouterView;
/** @type {[typeof __VLS_components.RouterView, typeof __VLS_components.routerView, ]} */ ;
// @ts-ignore
RouterView;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({}));
const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_4 = {};
var __VLS_3;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup: () => ({}),
});
export default (await import('vue')).defineComponent({});
; /* PartiallyEnd: #4569/main.vue */
