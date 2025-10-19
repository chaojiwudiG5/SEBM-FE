import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { showNotify, showConfirmDialog } from 'vant';
import { useUserStore } from '../../store/user';
import { getDevice } from '../../api/device';
import { updateTaskStatus, getRecordDetail } from '../../api/mechanicanMaintenanceRecord';
import { getUploadUrl } from '../../api/ossController';
const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
// 响应式数据
const deviceInfo = ref(null);
const maintenanceRecord = ref(null);
const submitting = ref(false);
const uploading = ref(false);
// 表单数据
const formData = ref({
    maintenanceResult: '',
    description: ''
});
// 文件上传相关数据
const fileList = ref([]);
// 计算属性
const canSubmit = computed(() => {
    return deviceInfo.value?.status === 2 &&
        formData.value.maintenanceResult &&
        formData.value.description.trim();
});
// 获取设备信息
const fetchDeviceInfo = async (deviceId) => {
    try {
        const response = await getDevice({ id: deviceId });
        if (response) {
            deviceInfo.value = response;
        }
        else {
            showNotify({ type: 'danger', message: 'Device not found' });
            router.back();
        }
    }
    catch (error) {
        console.error('Failed to fetch device info:', error);
        showNotify({ type: 'danger', message: 'Failed to load device information' });
        router.back();
    }
};
// 获取维修记录
const fetchMaintenanceRecord = async (deviceId) => {
    try {
        const response = await getRecordDetail({
            deviceId: deviceId,
            status: 1 // 获取状态为1（处理中）的记录
        });
        console.log('Maintenance record detail response:', response);
        if (response) {
            maintenanceRecord.value = response;
            console.log('Found maintenance record:', response);
        }
        else {
            showNotify({ type: 'warning', message: 'No active maintenance record found for this device' });
        }
    }
    catch (error) {
        console.error('Failed to fetch maintenance record:', error);
        showNotify({ type: 'danger', message: 'Failed to load maintenance record' });
    }
};
// 处理文件上传
const handleFileUpload = async (file) => {
    uploading.value = true;
    try {
        // 生成文件名
        const timestamp = Date.now();
        const fileExtension = file.file.name.split('.').pop() || 'jpg';
        const filename = `${timestamp}-maintenance.${fileExtension}`;
        // 获取上传URL
        const uploadUrlResponse = await getUploadUrl({
            filename: filename,
            contentType: file.file.type || 'image/jpeg'
        });
        if (!uploadUrlResponse || !uploadUrlResponse.uploadUrl || !uploadUrlResponse.fileUrl) {
            throw new Error('Failed to get upload URL');
        }
        const { uploadUrl, fileUrl } = uploadUrlResponse;
        // 上传文件到OSS
        const uploadResponse = await fetch(uploadUrl, {
            method: 'PUT',
            body: file.file,
            headers: {
                'Content-Type': file.file.type || 'image/jpeg'
            },
            mode: 'cors'
        });
        if (!uploadResponse.ok) {
            throw new Error('Upload failed');
        }
        // 更新文件列表显示
        fileList.value = [{
                url: fileUrl,
                name: file.file.name,
                status: 'done'
            }];
        showNotify({ type: 'success', message: 'Image uploaded successfully' });
    }
    catch (error) {
        console.error('Upload error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        showNotify({
            type: 'danger',
            message: `Failed to upload image: ${errorMessage}`,
            duration: 5000
        });
        fileList.value = [];
    }
    finally {
        uploading.value = false;
    }
    return false;
};
// 删除文件
const handleFileDelete = () => {
    fileList.value = [];
};
// 获取设备状态标签类型
const getStatusTagType = (status) => {
    switch (status) {
        case 0: return 'success';
        case 1: return 'warning';
        case 2: return 'danger';
        default: return 'default';
    }
};
// 获取设备状态文本
const getStatusText = (status) => {
    switch (status) {
        case 0: return 'Available';
        case 1: return 'Borrowed';
        case 2: return 'Maintenance';
        default: return 'Unknown';
    }
};
// 获取提交按钮文本
const getSubmitButtonText = () => {
    if (!canSubmit.value) {
        if (deviceInfo.value?.status !== 2) {
            return 'Device Not Under Maintenance';
        }
        return 'Please Fill All Fields';
    }
    return `Mark as ${formData.value.maintenanceResult === 'fixed' ? 'Fixed' : 'Scrapped'}`;
};
// 处理表单提交
const handleSubmit = async () => {
    if (!canSubmit.value) {
        if (deviceInfo.value?.status !== 2) {
            showNotify({ type: 'warning', message: 'This device is not currently under maintenance' });
            return;
        }
        showNotify({ type: 'warning', message: 'Please fill all required fields' });
        return;
    }
    try {
        const resultText = formData.value.maintenanceResult === 'fixed' ? 'fixed' : 'scrapped';
        const confirmMessage = `Are you sure you want to mark this device as ${resultText}?`;
        await showConfirmDialog({
            title: 'Confirm Maintenance',
            message: confirmMessage,
        });
        submitting.value = true;
        // 检查是否有维修记录
        if (!maintenanceRecord.value) {
            showNotify({ type: 'warning', message: 'No active maintenance record found for this device' });
            return;
        }
        // 构建更新数据
        const updateData = {
            id: maintenanceRecord.value.id,
            status: formData.value.maintenanceResult === 'fixed' ? 2 : 3, // 2: 修复成功, 3: 报废
            description: formData.value.description,
            image: fileList.value.length > 0 ? fileList.value[0].url : '',
            userMaintenanceRecordId: maintenanceRecord.value.userMaintenanceRecordId || 0
        };
        const response = await updateTaskStatus(updateData);
        if (response) {
            showNotify({ type: 'success', message: `Device marked as ${resultText} successfully` });
            router.push({ name: 'Tasks' });
        }
        else {
            showNotify({ type: 'danger', message: 'Failed to update maintenance status' });
        }
    }
    finally {
        submitting.value = false;
    }
};
// 页面加载时初始化
onMounted(async () => {
    const deviceId = route.query.deviceId;
    if (!deviceId || isNaN(Number(deviceId))) {
        showNotify({ type: 'danger', message: 'Invalid device ID' });
        router.back();
        return;
    }
    await Promise.all([
        fetchDeviceInfo(Number(deviceId)),
        fetchMaintenanceRecord(Number(deviceId))
    ]);
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "maintenance-complete-page" },
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
if (__VLS_ctx.deviceInfo && __VLS_ctx.deviceInfo.status !== 2) {
    // @ts-ignore
    [deviceInfo, deviceInfo,];
    const __VLS_21 = {}.VanNoticeBar;
    /** @type {[typeof __VLS_components.VanNoticeBar, typeof __VLS_components.vanNoticeBar, ]} */ ;
    // @ts-ignore
    VanNoticeBar;
    // @ts-ignore
    const __VLS_22 = __VLS_asFunctionalComponent(__VLS_21, new __VLS_21({
        type: "warning",
        text: "This device is not currently under maintenance",
        ...{ class: "notice-bar" },
    }));
    const __VLS_23 = __VLS_22({
        type: "warning",
        text: "This device is not currently under maintenance",
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
    title: "Maintenance Result",
    ...{ class: "form-group" },
}));
const __VLS_36 = __VLS_35({
    title: "Maintenance Result",
    ...{ class: "form-group" },
}, ...__VLS_functionalComponentArgsRest(__VLS_35));
const { default: __VLS_38 } = __VLS_37.slots;
const __VLS_39 = {}.VanField;
/** @type {[typeof __VLS_components.VanField, typeof __VLS_components.vanField, typeof __VLS_components.VanField, typeof __VLS_components.vanField, ]} */ ;
// @ts-ignore
VanField;
// @ts-ignore
const __VLS_40 = __VLS_asFunctionalComponent(__VLS_39, new __VLS_39({
    name: "maintenanceResult",
    label: "Result",
}));
const __VLS_41 = __VLS_40({
    name: "maintenanceResult",
    label: "Result",
}, ...__VLS_functionalComponentArgsRest(__VLS_40));
const { default: __VLS_43 } = __VLS_42.slots;
{
    const { input: __VLS_44 } = __VLS_42.slots;
    const __VLS_45 = {}.VanRadioGroup;
    /** @type {[typeof __VLS_components.VanRadioGroup, typeof __VLS_components.vanRadioGroup, typeof __VLS_components.VanRadioGroup, typeof __VLS_components.vanRadioGroup, ]} */ ;
    // @ts-ignore
    VanRadioGroup;
    // @ts-ignore
    const __VLS_46 = __VLS_asFunctionalComponent(__VLS_45, new __VLS_45({
        modelValue: (__VLS_ctx.formData.maintenanceResult),
        direction: "horizontal",
    }));
    const __VLS_47 = __VLS_46({
        modelValue: (__VLS_ctx.formData.maintenanceResult),
        direction: "horizontal",
    }, ...__VLS_functionalComponentArgsRest(__VLS_46));
    const { default: __VLS_49 } = __VLS_48.slots;
    // @ts-ignore
    [formData,];
    const __VLS_50 = {}.VanRadio;
    /** @type {[typeof __VLS_components.VanRadio, typeof __VLS_components.vanRadio, typeof __VLS_components.VanRadio, typeof __VLS_components.vanRadio, ]} */ ;
    // @ts-ignore
    VanRadio;
    // @ts-ignore
    const __VLS_51 = __VLS_asFunctionalComponent(__VLS_50, new __VLS_50({
        name: "fixed",
    }));
    const __VLS_52 = __VLS_51({
        name: "fixed",
    }, ...__VLS_functionalComponentArgsRest(__VLS_51));
    const { default: __VLS_54 } = __VLS_53.slots;
    var __VLS_53;
    const __VLS_55 = {}.VanRadio;
    /** @type {[typeof __VLS_components.VanRadio, typeof __VLS_components.vanRadio, typeof __VLS_components.VanRadio, typeof __VLS_components.vanRadio, ]} */ ;
    // @ts-ignore
    VanRadio;
    // @ts-ignore
    const __VLS_56 = __VLS_asFunctionalComponent(__VLS_55, new __VLS_55({
        name: "scrapped",
    }));
    const __VLS_57 = __VLS_56({
        name: "scrapped",
    }, ...__VLS_functionalComponentArgsRest(__VLS_56));
    const { default: __VLS_59 } = __VLS_58.slots;
    var __VLS_58;
    var __VLS_48;
}
var __VLS_42;
var __VLS_37;
const __VLS_60 = {}.VanCellGroup;
/** @type {[typeof __VLS_components.VanCellGroup, typeof __VLS_components.vanCellGroup, typeof __VLS_components.VanCellGroup, typeof __VLS_components.vanCellGroup, ]} */ ;
// @ts-ignore
VanCellGroup;
// @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
    title: "Maintenance Details",
    ...{ class: "form-group" },
}));
const __VLS_62 = __VLS_61({
    title: "Maintenance Details",
    ...{ class: "form-group" },
}, ...__VLS_functionalComponentArgsRest(__VLS_61));
const { default: __VLS_64 } = __VLS_63.slots;
const __VLS_65 = {}.VanField;
/** @type {[typeof __VLS_components.VanField, typeof __VLS_components.vanField, ]} */ ;
// @ts-ignore
VanField;
// @ts-ignore
const __VLS_66 = __VLS_asFunctionalComponent(__VLS_65, new __VLS_65({
    modelValue: (__VLS_ctx.formData.description),
    name: "description",
    label: "Description",
    type: "textarea",
    placeholder: "Please describe the maintenance work performed",
    autosize: true,
    maxlength: "500",
    showWordLimit: true,
    rules: ([{ required: true, message: 'Description is required' }]),
}));
const __VLS_67 = __VLS_66({
    modelValue: (__VLS_ctx.formData.description),
    name: "description",
    label: "Description",
    type: "textarea",
    placeholder: "Please describe the maintenance work performed",
    autosize: true,
    maxlength: "500",
    showWordLimit: true,
    rules: ([{ required: true, message: 'Description is required' }]),
}, ...__VLS_functionalComponentArgsRest(__VLS_66));
// @ts-ignore
[formData,];
var __VLS_63;
const __VLS_70 = {}.VanCellGroup;
/** @type {[typeof __VLS_components.VanCellGroup, typeof __VLS_components.vanCellGroup, typeof __VLS_components.VanCellGroup, typeof __VLS_components.vanCellGroup, ]} */ ;
// @ts-ignore
VanCellGroup;
// @ts-ignore
const __VLS_71 = __VLS_asFunctionalComponent(__VLS_70, new __VLS_70({
    ...{ class: "form-group" },
}));
const __VLS_72 = __VLS_71({
    ...{ class: "form-group" },
}, ...__VLS_functionalComponentArgsRest(__VLS_71));
const { default: __VLS_74 } = __VLS_73.slots;
const __VLS_75 = {}.VanField;
/** @type {[typeof __VLS_components.VanField, typeof __VLS_components.vanField, typeof __VLS_components.VanField, typeof __VLS_components.vanField, ]} */ ;
// @ts-ignore
VanField;
// @ts-ignore
const __VLS_76 = __VLS_asFunctionalComponent(__VLS_75, new __VLS_75({
    name: "maintenanceImage",
    label: "Maintenance Image",
    placeholder: "Upload maintenance result image (optional)",
}));
const __VLS_77 = __VLS_76({
    name: "maintenanceImage",
    label: "Maintenance Image",
    placeholder: "Upload maintenance result image (optional)",
}, ...__VLS_functionalComponentArgsRest(__VLS_76));
const { default: __VLS_79 } = __VLS_78.slots;
{
    const { input: __VLS_80 } = __VLS_78.slots;
    const __VLS_81 = {}.VanUploader;
    /** @type {[typeof __VLS_components.VanUploader, typeof __VLS_components.vanUploader, ]} */ ;
    // @ts-ignore
    VanUploader;
    // @ts-ignore
    const __VLS_82 = __VLS_asFunctionalComponent(__VLS_81, new __VLS_81({
        modelValue: (__VLS_ctx.fileList),
        afterRead: (__VLS_ctx.handleFileUpload),
        beforeDelete: (__VLS_ctx.handleFileDelete),
        maxCount: (1),
        maxSize: (5 * 1024 * 1024),
        accept: "image/*",
        disabled: (__VLS_ctx.uploading),
        uploadText: "Upload Image",
        ...{ class: "maintenance-uploader" },
    }));
    const __VLS_83 = __VLS_82({
        modelValue: (__VLS_ctx.fileList),
        afterRead: (__VLS_ctx.handleFileUpload),
        beforeDelete: (__VLS_ctx.handleFileDelete),
        maxCount: (1),
        maxSize: (5 * 1024 * 1024),
        accept: "image/*",
        disabled: (__VLS_ctx.uploading),
        uploadText: "Upload Image",
        ...{ class: "maintenance-uploader" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_82));
    // @ts-ignore
    [fileList, handleFileUpload, handleFileDelete, uploading,];
}
var __VLS_78;
var __VLS_73;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "submit-section" },
});
const __VLS_86 = {}.VanButton;
/** @type {[typeof __VLS_components.VanButton, typeof __VLS_components.vanButton, typeof __VLS_components.VanButton, typeof __VLS_components.vanButton, ]} */ ;
// @ts-ignore
VanButton;
// @ts-ignore
const __VLS_87 = __VLS_asFunctionalComponent(__VLS_86, new __VLS_86({
    type: "primary",
    size: "large",
    round: true,
    block: true,
    nativeType: "submit",
    loading: (__VLS_ctx.submitting),
    disabled: (!__VLS_ctx.canSubmit),
    ...{ class: "submit-btn" },
}));
const __VLS_88 = __VLS_87({
    type: "primary",
    size: "large",
    round: true,
    block: true,
    nativeType: "submit",
    loading: (__VLS_ctx.submitting),
    disabled: (!__VLS_ctx.canSubmit),
    ...{ class: "submit-btn" },
}, ...__VLS_functionalComponentArgsRest(__VLS_87));
const { default: __VLS_90 } = __VLS_89.slots;
// @ts-ignore
[submitting, canSubmit,];
(__VLS_ctx.getSubmitButtonText());
// @ts-ignore
[getSubmitButtonText,];
var __VLS_89;
var __VLS_29;
/** @type {__VLS_StyleScopedClasses['maintenance-complete-page']} */ ;
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
/** @type {__VLS_StyleScopedClasses['maintenance-uploader']} */ ;
/** @type {__VLS_StyleScopedClasses['submit-section']} */ ;
/** @type {__VLS_StyleScopedClasses['submit-btn']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup: () => ({
        deviceInfo: deviceInfo,
        submitting: submitting,
        uploading: uploading,
        formData: formData,
        fileList: fileList,
        canSubmit: canSubmit,
        handleFileUpload: handleFileUpload,
        handleFileDelete: handleFileDelete,
        getStatusTagType: getStatusTagType,
        getStatusText: getStatusText,
        getSubmitButtonText: getSubmitButtonText,
        handleSubmit: handleSubmit,
    }),
});
export default (await import('vue')).defineComponent({});
; /* PartiallyEnd: #4569/main.vue */
