import { computed } from 'vue';
import { useUserStore } from '../store/user';
import { useMessageStore } from '../store/message';
const userStore = useUserStore();
const messageStore = useMessageStore();
const userRole = computed(() => userStore.userInfo?.userRole);
const unreadCount = computed(() => messageStore.unreadCount);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
const __VLS_0 = {}.VanTabbar;
/** @type {[typeof __VLS_components.VanTabbar, typeof __VLS_components.vanTabbar, typeof __VLS_components.VanTabbar, typeof __VLS_components.vanTabbar, ]} */ ;
// @ts-ignore
VanTabbar;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    route: true,
}));
const __VLS_2 = __VLS_1({
    route: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_4 = {};
const { default: __VLS_5 } = __VLS_3.slots;
if (__VLS_ctx.userRole === 2) {
    // @ts-ignore
    [userRole,];
    const __VLS_6 = {}.VanTabbarItem;
    /** @type {[typeof __VLS_components.VanTabbarItem, typeof __VLS_components.vanTabbarItem, typeof __VLS_components.VanTabbarItem, typeof __VLS_components.vanTabbarItem, ]} */ ;
    // @ts-ignore
    VanTabbarItem;
    // @ts-ignore
    const __VLS_7 = __VLS_asFunctionalComponent(__VLS_6, new __VLS_6({
        replace: true,
        to: "/sebm/mechanic/tasks",
        icon: "todo-list-o",
    }));
    const __VLS_8 = __VLS_7({
        replace: true,
        to: "/sebm/mechanic/tasks",
        icon: "todo-list-o",
    }, ...__VLS_functionalComponentArgsRest(__VLS_7));
    const { default: __VLS_10 } = __VLS_9.slots;
    var __VLS_9;
    const __VLS_11 = {}.VanTabbarItem;
    /** @type {[typeof __VLS_components.VanTabbarItem, typeof __VLS_components.vanTabbarItem, typeof __VLS_components.VanTabbarItem, typeof __VLS_components.vanTabbarItem, ]} */ ;
    // @ts-ignore
    VanTabbarItem;
    // @ts-ignore
    const __VLS_12 = __VLS_asFunctionalComponent(__VLS_11, new __VLS_11({
        replace: true,
        to: "/sebm/mechanic/userinfo",
        icon: "user-o",
    }));
    const __VLS_13 = __VLS_12({
        replace: true,
        to: "/sebm/mechanic/userinfo",
        icon: "user-o",
    }, ...__VLS_functionalComponentArgsRest(__VLS_12));
    const { default: __VLS_15 } = __VLS_14.slots;
    var __VLS_14;
}
else {
    const __VLS_16 = {}.VanTabbarItem;
    /** @type {[typeof __VLS_components.VanTabbarItem, typeof __VLS_components.vanTabbarItem, typeof __VLS_components.VanTabbarItem, typeof __VLS_components.vanTabbarItem, ]} */ ;
    // @ts-ignore
    VanTabbarItem;
    // @ts-ignore
    const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
        replace: true,
        to: "/sebm/user/home",
        icon: "home-o",
    }));
    const __VLS_18 = __VLS_17({
        replace: true,
        to: "/sebm/user/home",
        icon: "home-o",
    }, ...__VLS_functionalComponentArgsRest(__VLS_17));
    const { default: __VLS_20 } = __VLS_19.slots;
    var __VLS_19;
    const __VLS_21 = {}.VanTabbarItem;
    /** @type {[typeof __VLS_components.VanTabbarItem, typeof __VLS_components.vanTabbarItem, typeof __VLS_components.VanTabbarItem, typeof __VLS_components.vanTabbarItem, ]} */ ;
    // @ts-ignore
    VanTabbarItem;
    // @ts-ignore
    const __VLS_22 = __VLS_asFunctionalComponent(__VLS_21, new __VLS_21({
        replace: true,
        to: "/sebm/user/device",
        icon: "desktop-o",
    }));
    const __VLS_23 = __VLS_22({
        replace: true,
        to: "/sebm/user/device",
        icon: "desktop-o",
    }, ...__VLS_functionalComponentArgsRest(__VLS_22));
    const { default: __VLS_25 } = __VLS_24.slots;
    var __VLS_24;
    const __VLS_26 = {}.VanTabbarItem;
    /** @type {[typeof __VLS_components.VanTabbarItem, typeof __VLS_components.vanTabbarItem, typeof __VLS_components.VanTabbarItem, typeof __VLS_components.vanTabbarItem, ]} */ ;
    // @ts-ignore
    VanTabbarItem;
    // @ts-ignore
    const __VLS_27 = __VLS_asFunctionalComponent(__VLS_26, new __VLS_26({
        replace: true,
        to: "/sebm/user/messagebox",
        icon: "chat-o",
        badge: (__VLS_ctx.unreadCount > 0 ? __VLS_ctx.unreadCount : undefined),
    }));
    const __VLS_28 = __VLS_27({
        replace: true,
        to: "/sebm/user/messagebox",
        icon: "chat-o",
        badge: (__VLS_ctx.unreadCount > 0 ? __VLS_ctx.unreadCount : undefined),
    }, ...__VLS_functionalComponentArgsRest(__VLS_27));
    const { default: __VLS_30 } = __VLS_29.slots;
    // @ts-ignore
    [unreadCount, unreadCount,];
    var __VLS_29;
    const __VLS_31 = {}.VanTabbarItem;
    /** @type {[typeof __VLS_components.VanTabbarItem, typeof __VLS_components.vanTabbarItem, typeof __VLS_components.VanTabbarItem, typeof __VLS_components.vanTabbarItem, ]} */ ;
    // @ts-ignore
    VanTabbarItem;
    // @ts-ignore
    const __VLS_32 = __VLS_asFunctionalComponent(__VLS_31, new __VLS_31({
        replace: true,
        to: "/sebm/user/userinfo",
        icon: "user-o",
    }));
    const __VLS_33 = __VLS_32({
        replace: true,
        to: "/sebm/user/userinfo",
        icon: "user-o",
    }, ...__VLS_functionalComponentArgsRest(__VLS_32));
    const { default: __VLS_35 } = __VLS_34.slots;
    var __VLS_34;
}
var __VLS_3;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup: () => ({
        userRole: userRole,
        unreadCount: unreadCount,
    }),
});
export default (await import('vue')).defineComponent({});
; /* PartiallyEnd: #4569/main.vue */
