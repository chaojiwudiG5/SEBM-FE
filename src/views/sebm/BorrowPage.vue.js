import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '../../store/user';
import { getDevice } from '../../api/device';
import { borrowDevice } from '../../api/borrow';
import { showNotify, showConfirmDialog } from 'vant';
const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
// 设备信息
const deviceInfo = ref(null);
const deviceId = ref(null);
// 表单数据
const formData = ref({
    borrowDate: '',
    dueDate: '',
    borrowTime: '',
    dueTime: '',
    remarks: ''
});
// 日历选择器相关
const showBorrowCalendar = ref(false);
const showDueCalendar = ref(false);
const borrowDate = ref(new Date());
const dueDate = ref(new Date());
// 日期范围限制（明天到七天后）
const minDate = ref(new Date());
const maxDate = ref(new Date());
// 提交状态
const submitting = ref(false);
// 计算属性
const canSubmit = computed(() => {
    return deviceInfo.value?.status === 0 &&
        formData.value.borrowDate &&
        formData.value.dueDate &&
        !submitting.value;
});
// 获取设备状态文本
const getStatusText = (status) => {
    switch (status) {
        case 0: return 'Available';
        case 1: return 'Borrowed';
        case 2: return 'Repairing';
        case 3: return 'Reserved';
        default: return 'Unknown';
    }
};
// 获取设备状态标签类型
const getStatusTagType = (status) => {
    switch (status) {
        case 0: return 'success';
        case 1: return 'warning';
        case 2: return 'danger';
        case 3: return 'info';
        default: return 'default';
    }
};
// 格式化日期显示
const formatDateDisplay = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};
// 创建带当前时间的完整日期时间
const createDateTimeWithCurrentTime = (date) => {
    const now = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};
// 借用日期确认
const onBorrowDateConfirm = (value) => {
    console.log('Borrow date selected:', value);
    borrowDate.value = value;
    formData.value.borrowDate = formatDateDisplay(value);
    formData.value.borrowTime = createDateTimeWithCurrentTime(value);
    showBorrowCalendar.value = false;
};
// 归还日期确认
const onDueDateConfirm = (value) => {
    console.log('Due date selected:', value);
    dueDate.value = value;
    formData.value.dueDate = formatDateDisplay(value);
    formData.value.dueTime = createDateTimeWithCurrentTime(value);
    showDueCalendar.value = false;
};
// 获取设备信息
const fetchDeviceInfo = async (id) => {
    try {
        const response = await getDevice({ id: id });
        if (response) {
            deviceInfo.value = response;
            console.log('Device info loaded:', response);
        }
        else {
            showNotify({ type: 'danger', message: 'Device not found' });
            router.push('/sebm/user/device');
        }
    }
    catch (error) {
        console.error('Failed to fetch device info:', error);
        showNotify({ type: 'danger', message: 'Failed to load device information' });
        router.push('/sebm/user/device');
    }
};
// 提交借用申请
const handleSubmit = async () => {
    if (!canSubmit.value)
        return;
    try {
        await showConfirmDialog({
            title: 'Confirm Borrow Request',
            message: `Are you sure you want to borrow "${deviceInfo.value?.deviceName}"?`,
            confirmButtonText: 'Confirm',
            cancelButtonText: 'Cancel'
        });
        submitting.value = true;
        const borrowData = {
            deviceId: deviceId.value,
            borrowTime: formData.value.borrowTime,
            dueTime: formData.value.dueTime,
            remarks: formData.value.remarks || undefined
        };
        console.log('Submitting borrow request:', borrowData);
        const response = await borrowDevice(borrowData);
        if (response) {
            showNotify({ type: 'success', message: 'Borrow request submitted successfully!' });
            userStore.loadFromServer();
            router.push('/sebm/user/device');
        }
    }
    finally {
        submitting.value = false;
    }
};
// 取消借用
const handleCancel = () => {
    router.push('/sebm/user/home');
};
// 页面加载时获取设备信息
onMounted(async () => {
    const deviceIdParam = route.query.deviceId;
    if (!deviceIdParam || !/^\d+$/.test(deviceIdParam)) {
        showNotify({ type: 'danger', message: 'Invalid device ID' });
        router.push('/sebm/user/device');
        return;
    }
    deviceId.value = deviceIdParam;
    await fetchDeviceInfo(deviceId.value);
    // 设置日期范围：今天到七天后
    const now = new Date();
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1); // 明天
    const weekLater = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7); // 7天后
    minDate.value = now; // 允许从今天开始借用
    maxDate.value = weekLater;
    // 设置默认借用日期为今天
    borrowDate.value = now;
    formData.value.borrowDate = formatDateDisplay(now);
    formData.value.borrowTime = createDateTimeWithCurrentTime(now);
    // 设置默认归还日期为3天后
    const defaultDueDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3);
    dueDate.value = defaultDueDate;
    formData.value.dueDate = formatDateDisplay(defaultDueDate);
    formData.value.dueTime = createDateTimeWithCurrentTime(defaultDueDate);
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['device-card']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['borrow-page']} */ ;
/** @type {__VLS_StyleScopedClasses['submit-section']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "borrow-page" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "device-info-section" },
});
if (__VLS_ctx.deviceInfo) {
    // @ts-ignore
    [deviceInfo,];
    const __VLS_0 = {}.VanCard;
    /** @type {[typeof __VLS_components.VanCard, typeof __VLS_components.vanCard, typeof __VLS_components.VanCard, typeof __VLS_components.vanCard, ]} */ ;
    // @ts-ignore
    VanCard;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        title: (__VLS_ctx.deviceInfo.deviceName),
        desc: (__VLS_ctx.deviceInfo.description || 'No description'),
        thumb: (__VLS_ctx.deviceInfo.image || 'https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg'),
        ...{ class: "device-card" },
    }));
    const __VLS_2 = __VLS_1({
        title: (__VLS_ctx.deviceInfo.deviceName),
        desc: (__VLS_ctx.deviceInfo.description || 'No description'),
        thumb: (__VLS_ctx.deviceInfo.image || 'https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg'),
        ...{ class: "device-card" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    const { default: __VLS_4 } = __VLS_3.slots;
    // @ts-ignore
    [deviceInfo, deviceInfo, deviceInfo,];
    {
        const { tags: __VLS_5 } = __VLS_3.slots;
        const __VLS_6 = {}.VanTag;
        /** @type {[typeof __VLS_components.VanTag, typeof __VLS_components.vanTag, typeof __VLS_components.VanTag, typeof __VLS_components.vanTag, ]} */ ;
        // @ts-ignore
        VanTag;
        // @ts-ignore
        const __VLS_7 = __VLS_asFunctionalComponent(__VLS_6, new __VLS_6({
            type: __VLS_ctx.getStatusTagType(__VLS_ctx.deviceInfo.status),
            ...{ class: "status-tag" },
        }));
        const __VLS_8 = __VLS_7({
            type: __VLS_ctx.getStatusTagType(__VLS_ctx.deviceInfo.status),
            ...{ class: "status-tag" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_7));
        const { default: __VLS_10 } = __VLS_9.slots;
        // @ts-ignore
        [deviceInfo, getStatusTagType,];
        (__VLS_ctx.getStatusText(__VLS_ctx.deviceInfo.status));
        // @ts-ignore
        [deviceInfo, getStatusText,];
        var __VLS_9;
        const __VLS_11 = {}.VanTag;
        /** @type {[typeof __VLS_components.VanTag, typeof __VLS_components.vanTag, typeof __VLS_components.VanTag, typeof __VLS_components.vanTag, ]} */ ;
        // @ts-ignore
        VanTag;
        // @ts-ignore
        const __VLS_12 = __VLS_asFunctionalComponent(__VLS_11, new __VLS_11({
            type: "primary",
            plain: true,
            ...{ class: "type-tag" },
        }));
        const __VLS_13 = __VLS_12({
            type: "primary",
            plain: true,
            ...{ class: "type-tag" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_12));
        const { default: __VLS_15 } = __VLS_14.slots;
        (__VLS_ctx.deviceInfo.deviceType);
        // @ts-ignore
        [deviceInfo,];
        var __VLS_14;
        const __VLS_16 = {}.VanTag;
        /** @type {[typeof __VLS_components.VanTag, typeof __VLS_components.vanTag, typeof __VLS_components.VanTag, typeof __VLS_components.vanTag, ]} */ ;
        // @ts-ignore
        VanTag;
        // @ts-ignore
        const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
            type: "default",
            plain: true,
            ...{ class: "location-tag" },
        }));
        const __VLS_18 = __VLS_17({
            type: "default",
            plain: true,
            ...{ class: "location-tag" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_17));
        const { default: __VLS_20 } = __VLS_19.slots;
        (__VLS_ctx.deviceInfo.location);
        // @ts-ignore
        [deviceInfo,];
        var __VLS_19;
    }
    var __VLS_3;
}
if (__VLS_ctx.deviceInfo && __VLS_ctx.deviceInfo.status !== 0) {
    // @ts-ignore
    [deviceInfo, deviceInfo,];
    const __VLS_21 = {}.VanNoticeBar;
    /** @type {[typeof __VLS_components.VanNoticeBar, typeof __VLS_components.vanNoticeBar, ]} */ ;
    // @ts-ignore
    VanNoticeBar;
    // @ts-ignore
    const __VLS_22 = __VLS_asFunctionalComponent(__VLS_21, new __VLS_21({
        type: "warning",
        text: "This device is not available for borrowing",
        ...{ class: "notice-bar" },
    }));
    const __VLS_23 = __VLS_22({
        type: "warning",
        text: "This device is not available for borrowing",
        ...{ class: "notice-bar" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_22));
}
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "form-section" },
});
const __VLS_26 = {}.VanForm;
/** @type {[typeof __VLS_components.VanForm, typeof __VLS_components.vanForm, typeof __VLS_components.VanForm, typeof __VLS_components.vanForm, ]} */ ;
// @ts-ignore
VanForm;
// @ts-ignore
const __VLS_27 = __VLS_asFunctionalComponent(__VLS_26, new __VLS_26({
    ...{ 'onSubmit': {} },
}));
const __VLS_28 = __VLS_27({
    ...{ 'onSubmit': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_27));
let __VLS_30;
let __VLS_31;
const __VLS_32 = ({ submit: {} },
    { onSubmit: (__VLS_ctx.handleSubmit) });
const { default: __VLS_33 } = __VLS_29.slots;
// @ts-ignore
[handleSubmit,];
const __VLS_34 = {}.VanCellGroup;
/** @type {[typeof __VLS_components.VanCellGroup, typeof __VLS_components.vanCellGroup, typeof __VLS_components.VanCellGroup, typeof __VLS_components.vanCellGroup, ]} */ ;
// @ts-ignore
VanCellGroup;
// @ts-ignore
const __VLS_35 = __VLS_asFunctionalComponent(__VLS_34, new __VLS_34({
    title: "Borrow Information",
    ...{ class: "form-group" },
}));
const __VLS_36 = __VLS_35({
    title: "Borrow Information",
    ...{ class: "form-group" },
}, ...__VLS_functionalComponentArgsRest(__VLS_35));
const { default: __VLS_38 } = __VLS_37.slots;
const __VLS_39 = {}.VanField;
/** @type {[typeof __VLS_components.VanField, typeof __VLS_components.vanField, ]} */ ;
// @ts-ignore
VanField;
// @ts-ignore
const __VLS_40 = __VLS_asFunctionalComponent(__VLS_39, new __VLS_39({
    ...{ 'onClick': {} },
    modelValue: (__VLS_ctx.formData.borrowDate),
    name: "borrowDate",
    label: "Borrow Date",
    placeholder: "Select borrow date",
    readonly: true,
    isLink: true,
    rules: ([{ required: true, message: 'Please select borrow date' }]),
}));
const __VLS_41 = __VLS_40({
    ...{ 'onClick': {} },
    modelValue: (__VLS_ctx.formData.borrowDate),
    name: "borrowDate",
    label: "Borrow Date",
    placeholder: "Select borrow date",
    readonly: true,
    isLink: true,
    rules: ([{ required: true, message: 'Please select borrow date' }]),
}, ...__VLS_functionalComponentArgsRest(__VLS_40));
let __VLS_43;
let __VLS_44;
const __VLS_45 = ({ click: {} },
    { onClick: (...[$event]) => {
            __VLS_ctx.showBorrowCalendar = true;
            // @ts-ignore
            [formData, showBorrowCalendar,];
        } });
var __VLS_42;
const __VLS_47 = {}.VanPopup;
/** @type {[typeof __VLS_components.VanPopup, typeof __VLS_components.vanPopup, typeof __VLS_components.VanPopup, typeof __VLS_components.vanPopup, ]} */ ;
// @ts-ignore
VanPopup;
// @ts-ignore
const __VLS_48 = __VLS_asFunctionalComponent(__VLS_47, new __VLS_47({
    show: (__VLS_ctx.showBorrowCalendar),
    position: "bottom",
    round: true,
}));
const __VLS_49 = __VLS_48({
    show: (__VLS_ctx.showBorrowCalendar),
    position: "bottom",
    round: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_48));
const { default: __VLS_51 } = __VLS_50.slots;
// @ts-ignore
[showBorrowCalendar,];
const __VLS_52 = {}.VanCalendar;
/** @type {[typeof __VLS_components.VanCalendar, typeof __VLS_components.vanCalendar, ]} */ ;
// @ts-ignore
VanCalendar;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
    ...{ 'onConfirm': {} },
    ...{ 'onClose': {} },
    show: (__VLS_ctx.showBorrowCalendar),
    type: "single",
    minDate: (__VLS_ctx.minDate),
    maxDate: (__VLS_ctx.maxDate),
    defaultDate: (__VLS_ctx.borrowDate),
}));
const __VLS_54 = __VLS_53({
    ...{ 'onConfirm': {} },
    ...{ 'onClose': {} },
    show: (__VLS_ctx.showBorrowCalendar),
    type: "single",
    minDate: (__VLS_ctx.minDate),
    maxDate: (__VLS_ctx.maxDate),
    defaultDate: (__VLS_ctx.borrowDate),
}, ...__VLS_functionalComponentArgsRest(__VLS_53));
let __VLS_56;
let __VLS_57;
const __VLS_58 = ({ confirm: {} },
    { onConfirm: (__VLS_ctx.onBorrowDateConfirm) });
const __VLS_59 = ({ close: {} },
    { onClose: (...[$event]) => {
            __VLS_ctx.showBorrowCalendar = false;
            // @ts-ignore
            [showBorrowCalendar, showBorrowCalendar, minDate, maxDate, borrowDate, onBorrowDateConfirm,];
        } });
var __VLS_55;
var __VLS_50;
var __VLS_37;
const __VLS_61 = {}.VanCellGroup;
/** @type {[typeof __VLS_components.VanCellGroup, typeof __VLS_components.vanCellGroup, typeof __VLS_components.VanCellGroup, typeof __VLS_components.vanCellGroup, ]} */ ;
// @ts-ignore
VanCellGroup;
// @ts-ignore
const __VLS_62 = __VLS_asFunctionalComponent(__VLS_61, new __VLS_61({
    ...{ class: "form-group" },
}));
const __VLS_63 = __VLS_62({
    ...{ class: "form-group" },
}, ...__VLS_functionalComponentArgsRest(__VLS_62));
const { default: __VLS_65 } = __VLS_64.slots;
const __VLS_66 = {}.VanField;
/** @type {[typeof __VLS_components.VanField, typeof __VLS_components.vanField, ]} */ ;
// @ts-ignore
VanField;
// @ts-ignore
const __VLS_67 = __VLS_asFunctionalComponent(__VLS_66, new __VLS_66({
    ...{ 'onClick': {} },
    modelValue: (__VLS_ctx.formData.dueDate),
    name: "dueDate",
    label: "Due Date",
    placeholder: "Select due date",
    readonly: true,
    isLink: true,
    rules: ([{ required: true, message: 'Please select due date' }]),
}));
const __VLS_68 = __VLS_67({
    ...{ 'onClick': {} },
    modelValue: (__VLS_ctx.formData.dueDate),
    name: "dueDate",
    label: "Due Date",
    placeholder: "Select due date",
    readonly: true,
    isLink: true,
    rules: ([{ required: true, message: 'Please select due date' }]),
}, ...__VLS_functionalComponentArgsRest(__VLS_67));
let __VLS_70;
let __VLS_71;
const __VLS_72 = ({ click: {} },
    { onClick: (...[$event]) => {
            __VLS_ctx.showDueCalendar = true;
            // @ts-ignore
            [formData, showDueCalendar,];
        } });
var __VLS_69;
const __VLS_74 = {}.VanPopup;
/** @type {[typeof __VLS_components.VanPopup, typeof __VLS_components.vanPopup, typeof __VLS_components.VanPopup, typeof __VLS_components.vanPopup, ]} */ ;
// @ts-ignore
VanPopup;
// @ts-ignore
const __VLS_75 = __VLS_asFunctionalComponent(__VLS_74, new __VLS_74({
    show: (__VLS_ctx.showDueCalendar),
    position: "bottom",
    round: true,
}));
const __VLS_76 = __VLS_75({
    show: (__VLS_ctx.showDueCalendar),
    position: "bottom",
    round: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_75));
const { default: __VLS_78 } = __VLS_77.slots;
// @ts-ignore
[showDueCalendar,];
const __VLS_79 = {}.VanCalendar;
/** @type {[typeof __VLS_components.VanCalendar, typeof __VLS_components.vanCalendar, ]} */ ;
// @ts-ignore
VanCalendar;
// @ts-ignore
const __VLS_80 = __VLS_asFunctionalComponent(__VLS_79, new __VLS_79({
    ...{ 'onConfirm': {} },
    ...{ 'onClose': {} },
    show: (__VLS_ctx.showDueCalendar),
    type: "single",
    minDate: (__VLS_ctx.minDate),
    maxDate: (__VLS_ctx.maxDate),
    defaultDate: (__VLS_ctx.dueDate),
}));
const __VLS_81 = __VLS_80({
    ...{ 'onConfirm': {} },
    ...{ 'onClose': {} },
    show: (__VLS_ctx.showDueCalendar),
    type: "single",
    minDate: (__VLS_ctx.minDate),
    maxDate: (__VLS_ctx.maxDate),
    defaultDate: (__VLS_ctx.dueDate),
}, ...__VLS_functionalComponentArgsRest(__VLS_80));
let __VLS_83;
let __VLS_84;
const __VLS_85 = ({ confirm: {} },
    { onConfirm: (__VLS_ctx.onDueDateConfirm) });
const __VLS_86 = ({ close: {} },
    { onClose: (...[$event]) => {
            __VLS_ctx.showDueCalendar = false;
            // @ts-ignore
            [minDate, maxDate, showDueCalendar, showDueCalendar, dueDate, onDueDateConfirm,];
        } });
var __VLS_82;
var __VLS_77;
var __VLS_64;
const __VLS_88 = {}.VanCellGroup;
/** @type {[typeof __VLS_components.VanCellGroup, typeof __VLS_components.vanCellGroup, typeof __VLS_components.VanCellGroup, typeof __VLS_components.vanCellGroup, ]} */ ;
// @ts-ignore
VanCellGroup;
// @ts-ignore
const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
    ...{ class: "form-group" },
}));
const __VLS_90 = __VLS_89({
    ...{ class: "form-group" },
}, ...__VLS_functionalComponentArgsRest(__VLS_89));
const { default: __VLS_92 } = __VLS_91.slots;
const __VLS_93 = {}.VanField;
/** @type {[typeof __VLS_components.VanField, typeof __VLS_components.vanField, ]} */ ;
// @ts-ignore
VanField;
// @ts-ignore
const __VLS_94 = __VLS_asFunctionalComponent(__VLS_93, new __VLS_93({
    modelValue: (__VLS_ctx.formData.remarks),
    name: "remarks",
    label: "Remarks",
    type: "textarea",
    placeholder: "Optional remarks...",
    rows: "3",
    autosize: true,
}));
const __VLS_95 = __VLS_94({
    modelValue: (__VLS_ctx.formData.remarks),
    name: "remarks",
    label: "Remarks",
    type: "textarea",
    placeholder: "Optional remarks...",
    rows: "3",
    autosize: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_94));
// @ts-ignore
[formData,];
var __VLS_91;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "submit-section" },
});
const __VLS_98 = {}.VanButton;
/** @type {[typeof __VLS_components.VanButton, typeof __VLS_components.vanButton, typeof __VLS_components.VanButton, typeof __VLS_components.vanButton, ]} */ ;
// @ts-ignore
VanButton;
// @ts-ignore
const __VLS_99 = __VLS_asFunctionalComponent(__VLS_98, new __VLS_98({
    type: "primary",
    size: "large",
    nativeType: "submit",
    loading: (__VLS_ctx.submitting),
    disabled: (!__VLS_ctx.canSubmit),
    ...{ class: "submit-button" },
}));
const __VLS_100 = __VLS_99({
    type: "primary",
    size: "large",
    nativeType: "submit",
    loading: (__VLS_ctx.submitting),
    disabled: (!__VLS_ctx.canSubmit),
    ...{ class: "submit-button" },
}, ...__VLS_functionalComponentArgsRest(__VLS_99));
const { default: __VLS_102 } = __VLS_101.slots;
// @ts-ignore
[submitting, canSubmit,];
(__VLS_ctx.submitting ? 'Submitting...' : 'Submit Borrow Request');
// @ts-ignore
[submitting,];
var __VLS_101;
const __VLS_103 = {}.VanButton;
/** @type {[typeof __VLS_components.VanButton, typeof __VLS_components.vanButton, typeof __VLS_components.VanButton, typeof __VLS_components.vanButton, ]} */ ;
// @ts-ignore
VanButton;
// @ts-ignore
const __VLS_104 = __VLS_asFunctionalComponent(__VLS_103, new __VLS_103({
    ...{ 'onClick': {} },
    type: "default",
    size: "large",
    ...{ class: "cancel-button" },
}));
const __VLS_105 = __VLS_104({
    ...{ 'onClick': {} },
    type: "default",
    size: "large",
    ...{ class: "cancel-button" },
}, ...__VLS_functionalComponentArgsRest(__VLS_104));
let __VLS_107;
let __VLS_108;
const __VLS_109 = ({ click: {} },
    { onClick: (__VLS_ctx.handleCancel) });
const { default: __VLS_110 } = __VLS_106.slots;
// @ts-ignore
[handleCancel,];
var __VLS_106;
var __VLS_29;
/** @type {__VLS_StyleScopedClasses['borrow-page']} */ ;
/** @type {__VLS_StyleScopedClasses['device-info-section']} */ ;
/** @type {__VLS_StyleScopedClasses['device-card']} */ ;
/** @type {__VLS_StyleScopedClasses['status-tag']} */ ;
/** @type {__VLS_StyleScopedClasses['type-tag']} */ ;
/** @type {__VLS_StyleScopedClasses['location-tag']} */ ;
/** @type {__VLS_StyleScopedClasses['notice-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['form-section']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['submit-section']} */ ;
/** @type {__VLS_StyleScopedClasses['submit-button']} */ ;
/** @type {__VLS_StyleScopedClasses['cancel-button']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup: () => ({
        deviceInfo: deviceInfo,
        formData: formData,
        showBorrowCalendar: showBorrowCalendar,
        showDueCalendar: showDueCalendar,
        borrowDate: borrowDate,
        dueDate: dueDate,
        minDate: minDate,
        maxDate: maxDate,
        submitting: submitting,
        canSubmit: canSubmit,
        getStatusText: getStatusText,
        getStatusTagType: getStatusTagType,
        onBorrowDateConfirm: onBorrowDateConfirm,
        onDueDateConfirm: onDueDateConfirm,
        handleSubmit: handleSubmit,
        handleCancel: handleCancel,
    }),
});
export default (await import('vue')).defineComponent({});
; /* PartiallyEnd: #4569/main.vue */
