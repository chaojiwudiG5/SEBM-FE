import { useRoute, useRouter } from 'vue-router';
import { computed, ref } from 'vue';
import { showNotify } from 'vant';
import { QrcodeStream } from 'vue-qrcode-reader';
import { getDevice } from '../api/device';
import { useUserStore } from '../store/user';
import { useMessageStore } from '../store/message';
const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const messageStore = useMessageStore();
const title = computed(() => route.meta?.title || 'SEBM');
const showScan = ref(false);
const hasCameraPermission = ref(true);
// 判断当前用户是否为技工 (userRole为2表示技工)
const isMechanic = computed(() => userStore.userInfo?.userRole === 2);
// 判断是否在消息页面
const isMessagePage = computed(() => route.name === 'MessageBox');
// 未读消息数量
const unreadCount = computed(() => messageStore.unreadCount);
// 跳转到消息页面
const goToMessages = () => {
    router.push('/sebm/user/messagebox');
};
const onDetect = async (result) => {
    showScan.value = false;
    const deviceId = result[0].rawValue;
    console.log('Scanned device ID:', deviceId);
    // 验证设备ID是否为数字
    if (!/^\d+$/.test(deviceId)) {
        showNotify({ type: 'danger', message: 'Invalid device ID format' });
        return;
    }
    try {
        // 获取设备信息
        const response = await getDevice({ id: parseInt(deviceId) });
        console.log('Device info response:', response);
        if (response) {
            const device = response;
            console.log('Device status:', device?.status);
            // 根据用户角色和设备状态进行跳转
            if (isMechanic.value) {
                // 技工扫码逻辑
                switch (device?.status) {
                    case 2: // 维修中状态
                        showNotify({ type: 'success', message: `Device under maintenance: ${device?.deviceName}` });
                        router.push({
                            name: 'MaintenanceComplete',
                            query: { deviceId: deviceId }
                        });
                        break;
                    case 0: // 可用状态
                        showNotify({ type: 'warning', message: 'Device is available, no maintenance needed' });
                        break;
                    case 1: // 借出状态
                        showNotify({ type: 'warning', message: 'Device is borrowed, not under maintenance' });
                        break;
                    default:
                        showNotify({ type: 'danger', message: 'Unknown device status' });
                }
            }
            else {
                // 普通用户扫码逻辑
                switch (device?.status) {
                    case 0: // 可用状态
                        showNotify({ type: 'success', message: `Device available: ${device?.deviceName}` });
                        router.push({
                            name: 'Borrow',
                            query: { deviceId: deviceId }
                        });
                        break;
                    case 1: // 借出状态
                        showNotify({ type: 'success', message: `Device borrowed: ${device?.deviceName}` });
                        router.push({
                            name: 'Return',
                            query: { deviceId: deviceId }
                        });
                        break;
                    case 2: // 维修中状态
                        showNotify({ type: 'warning', message: 'Device is under maintenance and cannot be borrowed' });
                        break;
                    default:
                        showNotify({ type: 'danger', message: 'Unknown device status' });
                }
            }
        }
        else {
            showNotify({ type: 'danger', message: 'Device not found' });
        }
    }
    catch (error) {
        console.error('Failed to get device info:', error);
        showNotify({ type: 'danger', message: 'Failed to get device information' });
    }
};
const onInit = async (promise) => {
    try {
        await promise;
        hasCameraPermission.value = true;
    }
    catch (error) {
        hasCameraPermission.value = false;
        showNotify({ type: 'danger', message: 'Camera permission denied' });
    }
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['message-badge']} */ ;
// CSS variable injection 
// CSS variable injection end 
const __VLS_0 = {}.VanNavBar;
/** @type {[typeof __VLS_components.VanNavBar, typeof __VLS_components.vanNavBar, typeof __VLS_components.VanNavBar, typeof __VLS_components.vanNavBar, ]} */ ;
// @ts-ignore
VanNavBar;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    title: (__VLS_ctx.title),
    fixed: true,
}));
const __VLS_2 = __VLS_1({
    title: (__VLS_ctx.title),
    fixed: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
const { default: __VLS_4 } = __VLS_3.slots;
// @ts-ignore
[title,];
{
    const { right: __VLS_5 } = __VLS_3.slots;
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "header-right" },
    });
    if (!__VLS_ctx.isMechanic && !__VLS_ctx.isMessagePage) {
        // @ts-ignore
        [isMechanic, isMessagePage,];
        const __VLS_6 = {}.VanBadge;
        /** @type {[typeof __VLS_components.VanBadge, typeof __VLS_components.vanBadge, typeof __VLS_components.VanBadge, typeof __VLS_components.vanBadge, ]} */ ;
        // @ts-ignore
        VanBadge;
        // @ts-ignore
        const __VLS_7 = __VLS_asFunctionalComponent(__VLS_6, new __VLS_6({
            ...{ 'onClick': {} },
            content: (__VLS_ctx.unreadCount > 0 ? __VLS_ctx.unreadCount : ''),
            dot: (__VLS_ctx.unreadCount > 0),
            ...{ class: "message-badge" },
        }));
        const __VLS_8 = __VLS_7({
            ...{ 'onClick': {} },
            content: (__VLS_ctx.unreadCount > 0 ? __VLS_ctx.unreadCount : ''),
            dot: (__VLS_ctx.unreadCount > 0),
            ...{ class: "message-badge" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_7));
        let __VLS_10;
        let __VLS_11;
        const __VLS_12 = ({ click: {} },
            { onClick: (__VLS_ctx.goToMessages) });
        const { default: __VLS_13 } = __VLS_9.slots;
        // @ts-ignore
        [unreadCount, unreadCount, unreadCount, goToMessages,];
        const __VLS_14 = {}.VanIcon;
        /** @type {[typeof __VLS_components.VanIcon, typeof __VLS_components.vanIcon, ]} */ ;
        // @ts-ignore
        VanIcon;
        // @ts-ignore
        const __VLS_15 = __VLS_asFunctionalComponent(__VLS_14, new __VLS_14({
            name: "chat-o",
            size: "18",
        }));
        const __VLS_16 = __VLS_15({
            name: "chat-o",
            size: "18",
        }, ...__VLS_functionalComponentArgsRest(__VLS_15));
        var __VLS_9;
    }
    const __VLS_19 = {}.VanIcon;
    /** @type {[typeof __VLS_components.VanIcon, typeof __VLS_components.vanIcon, ]} */ ;
    // @ts-ignore
    VanIcon;
    // @ts-ignore
    const __VLS_20 = __VLS_asFunctionalComponent(__VLS_19, new __VLS_19({
        ...{ 'onClick': {} },
        name: "scan",
        size: "18",
    }));
    const __VLS_21 = __VLS_20({
        ...{ 'onClick': {} },
        name: "scan",
        size: "18",
    }, ...__VLS_functionalComponentArgsRest(__VLS_20));
    let __VLS_23;
    let __VLS_24;
    const __VLS_25 = ({ click: {} },
        { onClick: (...[$event]) => {
                __VLS_ctx.showScan = true;
                // @ts-ignore
                [showScan,];
            } });
    var __VLS_22;
}
var __VLS_3;
const __VLS_27 = {}.VanPopup;
/** @type {[typeof __VLS_components.VanPopup, typeof __VLS_components.vanPopup, typeof __VLS_components.VanPopup, typeof __VLS_components.vanPopup, ]} */ ;
// @ts-ignore
VanPopup;
// @ts-ignore
const __VLS_28 = __VLS_asFunctionalComponent(__VLS_27, new __VLS_27({
    show: (__VLS_ctx.showScan),
    round: true,
    position: "top",
    ...{ style: {} },
}));
const __VLS_29 = __VLS_28({
    show: (__VLS_ctx.showScan),
    round: true,
    position: "top",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_28));
const { default: __VLS_31 } = __VLS_30.slots;
// @ts-ignore
[showScan,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "scan-container" },
});
if (__VLS_ctx.showScan) {
    // @ts-ignore
    [showScan,];
    const __VLS_32 = {}.QrcodeStream;
    /** @type {[typeof __VLS_components.QrcodeStream, typeof __VLS_components.qrcodeStream, ]} */ ;
    // @ts-ignore
    QrcodeStream;
    // @ts-ignore
    const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
        ...{ 'onDetect': {} },
        ...{ 'onInit': {} },
    }));
    const __VLS_34 = __VLS_33({
        ...{ 'onDetect': {} },
        ...{ 'onInit': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_33));
    let __VLS_36;
    let __VLS_37;
    const __VLS_38 = ({ detect: {} },
        { onDetect: (__VLS_ctx.onDetect) });
    const __VLS_39 = ({ init: {} },
        { onInit: (__VLS_ctx.onInit) });
    // @ts-ignore
    [onDetect, onInit,];
    var __VLS_35;
}
if (!__VLS_ctx.hasCameraPermission) {
    // @ts-ignore
    [hasCameraPermission,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "scan-tip" },
    });
}
var __VLS_30;
/** @type {__VLS_StyleScopedClasses['header-right']} */ ;
/** @type {__VLS_StyleScopedClasses['message-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['scan-container']} */ ;
/** @type {__VLS_StyleScopedClasses['scan-tip']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup: () => ({
        QrcodeStream: QrcodeStream,
        title: title,
        showScan: showScan,
        hasCameraPermission: hasCameraPermission,
        isMechanic: isMechanic,
        isMessagePage: isMessagePage,
        unreadCount: unreadCount,
        goToMessages: goToMessages,
        onDetect: onDetect,
        onInit: onInit,
    }),
});
export default (await import('vue')).defineComponent({});
; /* PartiallyEnd: #4569/main.vue */
