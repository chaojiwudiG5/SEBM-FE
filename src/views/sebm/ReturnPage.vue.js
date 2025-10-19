import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { showNotify, showConfirmDialog } from 'vant';
import { useUserStore } from '../../store/user';
import { getDevice } from '../../api/device';
import { getBorrowRecordListWithStatus, returnDevice } from '../../api/borrow';
import { createMaintenanceRecord } from '../../api/userMaintenanceRecord';
import { getUploadUrl } from '../../api/ossController';
const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
// 响应式数据
const deviceInfo = ref(null);
const borrowRecord = ref(null);
const submitting = ref(false);
const locationLoading = ref(false);
// 位置相关数据
const currentLocation = ref(null);
const locationStatus = ref('Location not detected');
// 电子围栏配置 (示例坐标，实际应该从后端获取)
const fenceCenters = [
    { latitude: 1.278156, longitude: 103.787040 }, // 第一个坐标点
    { latitude: 1.292324, longitude: 103.776167 } // 第二个坐标点
];
const fenceRadius = 100; // 100米半径
// 表单数据
const formData = ref({
    returnTime: '',
    remarks: ''
});
// 报修相关数据
const needMaintenance = ref([]);
const maintenanceForm = ref({
    description: '',
    fileUrl: ''
});
// 文件上传相关数据
const fileList = ref([]);
const uploading = ref(false);
// 计算是否选择报修
const isMaintenanceSelected = computed(() => needMaintenance.value.includes('maintenance'));
// 计算属性
const isInFence = computed(() => {
    if (!currentLocation.value)
        return false;
    // 检查当前位置是否在任何一个围栏范围内
    return fenceCenters.some(center => {
        const distance = calculateDistance(currentLocation.value.latitude, currentLocation.value.longitude, center.latitude, center.longitude);
        return distance <= fenceRadius;
    });
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
// 获取借用记录
const fetchBorrowRecord = async (deviceId) => {
    try {
        const response = await getBorrowRecordListWithStatus({
            pageNumber: 1,
            pageSize: 10,
            userId: userStore.userInfo?.id || 0,
            status: 0 // 待归还状态
        });
        if (response && Array.isArray(response)) {
            // 查找当前设备的借用记录
            const record = response.find(r => r.deviceId === deviceId);
            if (record) {
                borrowRecord.value = record;
            }
            else {
                showNotify({ type: 'warning', message: 'No active borrow record found for this device' });
            }
        }
    }
    catch (error) {
        console.error('Failed to fetch borrow record:', error);
        showNotify({ type: 'danger', message: 'Failed to load borrow record' });
    }
};
// 获取当前位置
const getCurrentLocation = () => {
    locationLoading.value = true;
    if (!navigator.geolocation) {
        showNotify({ type: 'danger', message: 'Geolocation is not supported by this browser' });
        locationLoading.value = false;
        return;
    }
    navigator.geolocation.getCurrentPosition((position) => {
        currentLocation.value = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        };
        locationStatus.value = `${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`;
        locationLoading.value = false;
        if (isInFence.value) {
            showNotify({ type: 'success', message: 'You are in the return area' });
        }
        else {
            showNotify({ type: 'warning', message: 'You are outside the return area' });
        }
    }, (error) => {
        console.error('Geolocation error:', error);
        locationLoading.value = false;
        let message = 'Failed to get location';
        switch (error.code) {
            case error.PERMISSION_DENIED:
                message = 'Location access denied by user';
                break;
            case error.POSITION_UNAVAILABLE:
                message = 'Location information is unavailable';
                break;
            case error.TIMEOUT:
                message = 'Location request timed out';
                break;
        }
        showNotify({ type: 'danger', message });
    }, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
    });
};
// 计算两点间距离 (使用Haversine公式)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // 地球半径，单位：米
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // 距离，单位：米
};
// 格式化日期
const formatDate = (dateString) => {
    if (!dateString)
        return '';
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'UTC'
    });
};
// 处理文件上传
const handleFileUpload = async (file) => {
    uploading.value = true;
    try {
        // 生成文件名
        const timestamp = Date.now();
        const fileExtension = file.file.name.split('.').pop() || 'jpg';
        const filename = `${timestamp}-image.${fileExtension}`;
        console.log('filename', filename);
        // 获取上传URL
        const uploadUrlResponse = await getUploadUrl({
            filename: filename,
            contentType: file.file.type || 'image/jpeg'
        });
        console.log('uploadUrlResponse:', uploadUrlResponse);
        console.log('uploadUrlResponse.data:', uploadUrlResponse.data);
        console.log('uploadUrlResponse.data?.uploadUrl:', uploadUrlResponse.data?.uploadUrl);
        console.log('uploadUrlResponse.data?.fileUrl:', uploadUrlResponse.data?.fileUrl);
        if (!uploadUrlResponse || !uploadUrlResponse.uploadUrl || !uploadUrlResponse.fileUrl) {
            console.error('Missing upload URL or file URL:', {
                hasResponse: !!uploadUrlResponse,
                hasData: !!uploadUrlResponse,
                hasUploadUrl: !!uploadUrlResponse?.uploadUrl,
                hasFileUrl: !!uploadUrlResponse?.fileUrl
            });
            throw new Error('Failed to get upload URL');
        }
        const { uploadUrl, fileUrl } = uploadUrlResponse;
        console.log('uploadUrl:', uploadUrl);
        console.log('fileUrl:', fileUrl);
        console.log('file to upload:', file.file);
        // 上传文件到OSS
        const uploadResponse = await fetch(uploadUrl, {
            method: 'PUT',
            body: file.file,
            headers: {
                'Content-Type': file.file.type || 'image/jpeg'
            },
            mode: 'cors' // 明确指定CORS模式
        });
        console.log('uploadResponse:', uploadResponse);
        console.log('uploadResponse.ok:', uploadResponse.ok);
        console.log('uploadResponse.status:', uploadResponse.status);
        console.log('uploadResponse.statusText:', uploadResponse.statusText);
        if (!uploadResponse.ok) {
            let errorText = '';
            try {
                errorText = await uploadResponse.text();
            }
            catch (e) {
                errorText = 'Unable to read error response';
            }
            console.error('Upload failed:', {
                status: uploadResponse.status,
                statusText: uploadResponse.statusText,
                errorText: errorText,
                url: uploadUrl
            });
            throw new Error(`Upload failed: ${uploadResponse.status} ${uploadResponse.statusText} - ${errorText}`);
        }
        // 保存文件URL
        maintenanceForm.value.fileUrl = fileUrl;
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
            duration: 5000 // 显示更长时间以便用户阅读
        });
        fileList.value = [];
    }
    finally {
        uploading.value = false;
    }
    // 阻止默认上传行为
    return false;
};
// 删除文件
const handleFileDelete = () => {
    fileList.value = [];
    maintenanceForm.value.fileUrl = '';
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
// 处理表单提交
const handleSubmit = async () => {
    if (!isInFence.value) {
        showNotify({ type: 'warning', message: 'Please move to the designated return area' });
        return;
    }
    if (!borrowRecord.value) {
        showNotify({ type: 'danger', message: 'No borrow record found' });
        return;
    }
    if (!currentLocation.value) {
        showNotify({ type: 'warning', message: 'Please get your current location first' });
        return;
    }
    // 如果选择报修但没有填写描述，提示用户
    if (isMaintenanceSelected.value && !maintenanceForm.value.description.trim()) {
        showNotify({ type: 'warning', message: 'Please describe the device issue for maintenance report' });
        return;
    }
    try {
        const confirmMessage = isMaintenanceSelected.value
            ? `Are you sure you want to return ${deviceInfo.value?.deviceName} and submit a maintenance report?`
            : `Are you sure you want to return ${deviceInfo.value?.deviceName}?`;
        await showConfirmDialog({
            title: 'Confirm Return',
            message: confirmMessage,
        });
        submitting.value = true;
        // 归还设备
        const returnData = {
            id: borrowRecord.value.id,
            latitude: currentLocation.value.latitude.toString(),
            longitude: currentLocation.value.longitude.toString(),
            returnTime: new Date().toISOString(),
            remarks: formData.value.remarks
        };
        const returnResponse = await returnDevice(returnData);
        if (!returnResponse) {
            showNotify({ type: 'danger', message: 'Failed to return device' });
            return;
        }
        // 如果需要报修，则调用报修接口
        if (isMaintenanceSelected.value && maintenanceForm.value.description.trim()) {
            try {
                const maintenanceData = {
                    borrowRecordId: borrowRecord.value?.id,
                    description: maintenanceForm.value.description,
                    image: maintenanceForm.value.fileUrl || ''
                };
                await createMaintenanceRecord(maintenanceData);
                showNotify({ type: 'success', message: 'Device returned and maintenance report submitted successfully' });
            }
            catch (maintenanceError) {
                console.error('Failed to submit maintenance report:', maintenanceError);
                showNotify({ type: 'warning', message: 'Device returned successfully, but maintenance report submission failed' });
            }
        }
        else {
            showNotify({ type: 'success', message: 'Device returned successfully' });
        }
        await userStore.loadFromServer();
        router.push({ name: 'Home' });
    }
    finally {
        submitting.value = false;
    }
};
// 初始化当前时间
const initCurrentTime = () => {
    formData.value.returnTime = new Date().toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
};
// 页面加载时初始化
onMounted(async () => {
    const deviceId = route.query.deviceId;
    if (!deviceId || isNaN(Number(deviceId))) {
        showNotify({ type: 'danger', message: 'Invalid device ID' });
        router.back();
        return;
    }
    initCurrentTime();
    await Promise.all([
        fetchDeviceInfo(Number(deviceId)),
        fetchBorrowRecord(Number(deviceId))
    ]);
    // 自动获取位置
    getCurrentLocation();
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
    ...{ class: "return-page" },
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
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "borrow-time-tag-container" },
        });
        if (__VLS_ctx.borrowRecord) {
            // @ts-ignore
            [borrowRecord,];
            const __VLS_21 = {}.VanTag;
            /** @type {[typeof __VLS_components.VanTag, typeof __VLS_components.vanTag, typeof __VLS_components.VanTag, typeof __VLS_components.vanTag, ]} */ ;
            // @ts-ignore
            VanTag;
            // @ts-ignore
            const __VLS_22 = __VLS_asFunctionalComponent(__VLS_21, new __VLS_21({
                type: "primary",
                ...{ class: "borrow-time-tag" },
            }));
            const __VLS_23 = __VLS_22({
                type: "primary",
                ...{ class: "borrow-time-tag" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_22));
            const { default: __VLS_25 } = __VLS_24.slots;
            (__VLS_ctx.formatDate(__VLS_ctx.borrowRecord.borrowTime));
            // @ts-ignore
            [borrowRecord, formatDate,];
            var __VLS_24;
        }
        if (__VLS_ctx.borrowRecord) {
            // @ts-ignore
            [borrowRecord,];
            const __VLS_26 = {}.VanTag;
            /** @type {[typeof __VLS_components.VanTag, typeof __VLS_components.vanTag, typeof __VLS_components.VanTag, typeof __VLS_components.vanTag, ]} */ ;
            // @ts-ignore
            VanTag;
            // @ts-ignore
            const __VLS_27 = __VLS_asFunctionalComponent(__VLS_26, new __VLS_26({
                type: "danger",
                ...{ class: "due-time-tag" },
            }));
            const __VLS_28 = __VLS_27({
                type: "danger",
                ...{ class: "due-time-tag" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_27));
            const { default: __VLS_30 } = __VLS_29.slots;
            (__VLS_ctx.formatDate(__VLS_ctx.borrowRecord.dueTime));
            // @ts-ignore
            [borrowRecord, formatDate,];
            var __VLS_29;
        }
    }
    var __VLS_3;
}
if (__VLS_ctx.deviceInfo && __VLS_ctx.deviceInfo.status !== 1) {
    // @ts-ignore
    [deviceInfo, deviceInfo,];
    const __VLS_31 = {}.VanNoticeBar;
    /** @type {[typeof __VLS_components.VanNoticeBar, typeof __VLS_components.vanNoticeBar, ]} */ ;
    // @ts-ignore
    VanNoticeBar;
    // @ts-ignore
    const __VLS_32 = __VLS_asFunctionalComponent(__VLS_31, new __VLS_31({
        type: "warning",
        text: "This device is not currently borrowed and cannot be returned",
        ...{ class: "notice-bar" },
    }));
    const __VLS_33 = __VLS_32({
        type: "warning",
        text: "This device is not currently borrowed and cannot be returned",
        ...{ class: "notice-bar" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_32));
}
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "form-section" },
});
const __VLS_36 = {}.VanForm;
/** @type {[typeof __VLS_components.VanForm, typeof __VLS_components.vanForm, typeof __VLS_components.VanForm, typeof __VLS_components.vanForm, ]} */ ;
// @ts-ignore
VanForm;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
    ...{ 'onSubmit': {} },
}));
const __VLS_38 = __VLS_37({
    ...{ 'onSubmit': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
let __VLS_40;
let __VLS_41;
const __VLS_42 = ({ submit: {} },
    { onSubmit: (__VLS_ctx.handleSubmit) });
const { default: __VLS_43 } = __VLS_39.slots;
// @ts-ignore
[handleSubmit,];
const __VLS_44 = {}.VanCellGroup;
/** @type {[typeof __VLS_components.VanCellGroup, typeof __VLS_components.vanCellGroup, typeof __VLS_components.VanCellGroup, typeof __VLS_components.vanCellGroup, ]} */ ;
// @ts-ignore
VanCellGroup;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
    title: "Location Information",
    ...{ class: "form-group" },
}));
const __VLS_46 = __VLS_45({
    title: "Location Information",
    ...{ class: "form-group" },
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
const { default: __VLS_48 } = __VLS_47.slots;
const __VLS_49 = {}.VanCell;
/** @type {[typeof __VLS_components.VanCell, typeof __VLS_components.vanCell, ]} */ ;
// @ts-ignore
VanCell;
// @ts-ignore
const __VLS_50 = __VLS_asFunctionalComponent(__VLS_49, new __VLS_49({
    title: "Current Location",
    value: (__VLS_ctx.locationStatus),
}));
const __VLS_51 = __VLS_50({
    title: "Current Location",
    value: (__VLS_ctx.locationStatus),
}, ...__VLS_functionalComponentArgsRest(__VLS_50));
// @ts-ignore
[locationStatus,];
const __VLS_54 = {}.VanCell;
/** @type {[typeof __VLS_components.VanCell, typeof __VLS_components.vanCell, ]} */ ;
// @ts-ignore
VanCell;
// @ts-ignore
const __VLS_55 = __VLS_asFunctionalComponent(__VLS_54, new __VLS_54({
    title: "Location Check",
    value: (__VLS_ctx.isInFence ? '✅ In Range' : '❌ Out of Range!Please move to the designated return area'),
}));
const __VLS_56 = __VLS_55({
    title: "Location Check",
    value: (__VLS_ctx.isInFence ? '✅ In Range' : '❌ Out of Range!Please move to the designated return area'),
}, ...__VLS_functionalComponentArgsRest(__VLS_55));
// @ts-ignore
[isInFence,];
const __VLS_59 = {}.VanButton;
/** @type {[typeof __VLS_components.VanButton, typeof __VLS_components.vanButton, typeof __VLS_components.VanButton, typeof __VLS_components.vanButton, ]} */ ;
// @ts-ignore
VanButton;
// @ts-ignore
const __VLS_60 = __VLS_asFunctionalComponent(__VLS_59, new __VLS_59({
    ...{ 'onClick': {} },
    type: "primary",
    size: "small",
    loading: (__VLS_ctx.locationLoading),
    ...{ class: "location-btn" },
}));
const __VLS_61 = __VLS_60({
    ...{ 'onClick': {} },
    type: "primary",
    size: "small",
    loading: (__VLS_ctx.locationLoading),
    ...{ class: "location-btn" },
}, ...__VLS_functionalComponentArgsRest(__VLS_60));
let __VLS_63;
let __VLS_64;
const __VLS_65 = ({ click: {} },
    { onClick: (__VLS_ctx.getCurrentLocation) });
const { default: __VLS_66 } = __VLS_62.slots;
// @ts-ignore
[locationLoading, getCurrentLocation,];
var __VLS_62;
var __VLS_47;
const __VLS_67 = {}.VanCellGroup;
/** @type {[typeof __VLS_components.VanCellGroup, typeof __VLS_components.vanCellGroup, typeof __VLS_components.VanCellGroup, typeof __VLS_components.vanCellGroup, ]} */ ;
// @ts-ignore
VanCellGroup;
// @ts-ignore
const __VLS_68 = __VLS_asFunctionalComponent(__VLS_67, new __VLS_67({
    title: "Return Information",
    ...{ class: "form-group" },
}));
const __VLS_69 = __VLS_68({
    title: "Return Information",
    ...{ class: "form-group" },
}, ...__VLS_functionalComponentArgsRest(__VLS_68));
const { default: __VLS_71 } = __VLS_70.slots;
const __VLS_72 = {}.VanField;
/** @type {[typeof __VLS_components.VanField, typeof __VLS_components.vanField, ]} */ ;
// @ts-ignore
VanField;
// @ts-ignore
const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
    modelValue: (__VLS_ctx.formData.returnTime),
    name: "returnTime",
    label: "Return Time",
    placeholder: "Current time",
    readonly: true,
    rules: ([{ required: true, message: 'Return time is required' }]),
}));
const __VLS_74 = __VLS_73({
    modelValue: (__VLS_ctx.formData.returnTime),
    name: "returnTime",
    label: "Return Time",
    placeholder: "Current time",
    readonly: true,
    rules: ([{ required: true, message: 'Return time is required' }]),
}, ...__VLS_functionalComponentArgsRest(__VLS_73));
// @ts-ignore
[formData,];
var __VLS_70;
const __VLS_77 = {}.VanCellGroup;
/** @type {[typeof __VLS_components.VanCellGroup, typeof __VLS_components.vanCellGroup, typeof __VLS_components.VanCellGroup, typeof __VLS_components.vanCellGroup, ]} */ ;
// @ts-ignore
VanCellGroup;
// @ts-ignore
const __VLS_78 = __VLS_asFunctionalComponent(__VLS_77, new __VLS_77({
    ...{ class: "form-group" },
}));
const __VLS_79 = __VLS_78({
    ...{ class: "form-group" },
}, ...__VLS_functionalComponentArgsRest(__VLS_78));
const { default: __VLS_81 } = __VLS_80.slots;
const __VLS_82 = {}.VanField;
/** @type {[typeof __VLS_components.VanField, typeof __VLS_components.vanField, ]} */ ;
// @ts-ignore
VanField;
// @ts-ignore
const __VLS_83 = __VLS_asFunctionalComponent(__VLS_82, new __VLS_82({
    modelValue: (__VLS_ctx.formData.remarks),
    name: "remarks",
    label: "Remarks",
    type: "textarea",
    placeholder: "Optional remarks about the return",
    autosize: true,
    maxlength: "200",
    showWordLimit: true,
}));
const __VLS_84 = __VLS_83({
    modelValue: (__VLS_ctx.formData.remarks),
    name: "remarks",
    label: "Remarks",
    type: "textarea",
    placeholder: "Optional remarks about the return",
    autosize: true,
    maxlength: "200",
    showWordLimit: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_83));
// @ts-ignore
[formData,];
var __VLS_80;
const __VLS_87 = {}.VanCollapse;
/** @type {[typeof __VLS_components.VanCollapse, typeof __VLS_components.vanCollapse, typeof __VLS_components.VanCollapse, typeof __VLS_components.vanCollapse, ]} */ ;
// @ts-ignore
VanCollapse;
// @ts-ignore
const __VLS_88 = __VLS_asFunctionalComponent(__VLS_87, new __VLS_87({
    modelValue: (__VLS_ctx.needMaintenance),
    ...{ class: "maintenance-collapse" },
}));
const __VLS_89 = __VLS_88({
    modelValue: (__VLS_ctx.needMaintenance),
    ...{ class: "maintenance-collapse" },
}, ...__VLS_functionalComponentArgsRest(__VLS_88));
const { default: __VLS_91 } = __VLS_90.slots;
// @ts-ignore
[needMaintenance,];
const __VLS_92 = {}.VanCollapseItem;
/** @type {[typeof __VLS_components.VanCollapseItem, typeof __VLS_components.vanCollapseItem, typeof __VLS_components.VanCollapseItem, typeof __VLS_components.vanCollapseItem, ]} */ ;
// @ts-ignore
VanCollapseItem;
// @ts-ignore
const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
    title: "Device Maintenance Report",
    name: "maintenance",
    icon: "warning",
}));
const __VLS_94 = __VLS_93({
    title: "Device Maintenance Report",
    name: "maintenance",
    icon: "warning",
}, ...__VLS_functionalComponentArgsRest(__VLS_93));
const { default: __VLS_96 } = __VLS_95.slots;
const __VLS_97 = {}.VanForm;
/** @type {[typeof __VLS_components.VanForm, typeof __VLS_components.vanForm, typeof __VLS_components.VanForm, typeof __VLS_components.vanForm, ]} */ ;
// @ts-ignore
VanForm;
// @ts-ignore
const __VLS_98 = __VLS_asFunctionalComponent(__VLS_97, new __VLS_97({}));
const __VLS_99 = __VLS_98({}, ...__VLS_functionalComponentArgsRest(__VLS_98));
const { default: __VLS_101 } = __VLS_100.slots;
const __VLS_102 = {}.VanField;
/** @type {[typeof __VLS_components.VanField, typeof __VLS_components.vanField, ]} */ ;
// @ts-ignore
VanField;
// @ts-ignore
const __VLS_103 = __VLS_asFunctionalComponent(__VLS_102, new __VLS_102({
    modelValue: (__VLS_ctx.maintenanceForm.description),
    name: "maintenanceDescription",
    label: "Issue Description",
    type: "textarea",
    placeholder: "Please describe the device issues you encountered",
    autosize: true,
    maxlength: "500",
    showWordLimit: true,
    rules: (__VLS_ctx.isMaintenanceSelected ? [{ required: true, message: 'Please describe the issue' }] : []),
}));
const __VLS_104 = __VLS_103({
    modelValue: (__VLS_ctx.maintenanceForm.description),
    name: "maintenanceDescription",
    label: "Issue Description",
    type: "textarea",
    placeholder: "Please describe the device issues you encountered",
    autosize: true,
    maxlength: "500",
    showWordLimit: true,
    rules: (__VLS_ctx.isMaintenanceSelected ? [{ required: true, message: 'Please describe the issue' }] : []),
}, ...__VLS_functionalComponentArgsRest(__VLS_103));
// @ts-ignore
[maintenanceForm, isMaintenanceSelected,];
const __VLS_107 = {}.VanField;
/** @type {[typeof __VLS_components.VanField, typeof __VLS_components.vanField, typeof __VLS_components.VanField, typeof __VLS_components.vanField, ]} */ ;
// @ts-ignore
VanField;
// @ts-ignore
const __VLS_108 = __VLS_asFunctionalComponent(__VLS_107, new __VLS_107({
    name: "maintenanceImage",
    label: "Issue Image",
    placeholder: "Upload image (optional)",
}));
const __VLS_109 = __VLS_108({
    name: "maintenanceImage",
    label: "Issue Image",
    placeholder: "Upload image (optional)",
}, ...__VLS_functionalComponentArgsRest(__VLS_108));
const { default: __VLS_111 } = __VLS_110.slots;
{
    const { input: __VLS_112 } = __VLS_110.slots;
    const __VLS_113 = {}.VanUploader;
    /** @type {[typeof __VLS_components.VanUploader, typeof __VLS_components.vanUploader, ]} */ ;
    // @ts-ignore
    VanUploader;
    // @ts-ignore
    const __VLS_114 = __VLS_asFunctionalComponent(__VLS_113, new __VLS_113({
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
    const __VLS_115 = __VLS_114({
        modelValue: (__VLS_ctx.fileList),
        afterRead: (__VLS_ctx.handleFileUpload),
        beforeDelete: (__VLS_ctx.handleFileDelete),
        maxCount: (1),
        maxSize: (5 * 1024 * 1024),
        accept: "image/*",
        disabled: (__VLS_ctx.uploading),
        uploadText: "Upload Image",
        ...{ class: "maintenance-uploader" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_114));
    // @ts-ignore
    [fileList, handleFileUpload, handleFileDelete, uploading,];
}
var __VLS_110;
const __VLS_118 = {}.VanButton;
/** @type {[typeof __VLS_components.VanButton, typeof __VLS_components.vanButton, typeof __VLS_components.VanButton, typeof __VLS_components.vanButton, ]} */ ;
// @ts-ignore
VanButton;
// @ts-ignore
const __VLS_119 = __VLS_asFunctionalComponent(__VLS_118, new __VLS_118({
    ...{ 'onClick': {} },
    type: "default",
    size: "small",
    ...{ class: "cancel-maintenance-btn" },
}));
const __VLS_120 = __VLS_119({
    ...{ 'onClick': {} },
    type: "default",
    size: "small",
    ...{ class: "cancel-maintenance-btn" },
}, ...__VLS_functionalComponentArgsRest(__VLS_119));
let __VLS_122;
let __VLS_123;
const __VLS_124 = ({ click: {} },
    { onClick: (...[$event]) => {
            __VLS_ctx.needMaintenance = [];
            // @ts-ignore
            [needMaintenance,];
        } });
const { default: __VLS_125 } = __VLS_121.slots;
var __VLS_121;
var __VLS_100;
var __VLS_95;
var __VLS_90;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "submit-section" },
});
const __VLS_126 = {}.VanButton;
/** @type {[typeof __VLS_components.VanButton, typeof __VLS_components.vanButton, typeof __VLS_components.VanButton, typeof __VLS_components.vanButton, ]} */ ;
// @ts-ignore
VanButton;
// @ts-ignore
const __VLS_127 = __VLS_asFunctionalComponent(__VLS_126, new __VLS_126({
    type: "primary",
    size: "large",
    round: true,
    block: true,
    nativeType: "submit",
    loading: (__VLS_ctx.submitting),
    disabled: (!__VLS_ctx.isInFence),
    ...{ class: "submit-btn" },
}));
const __VLS_128 = __VLS_127({
    type: "primary",
    size: "large",
    round: true,
    block: true,
    nativeType: "submit",
    loading: (__VLS_ctx.submitting),
    disabled: (!__VLS_ctx.isInFence),
    ...{ class: "submit-btn" },
}, ...__VLS_functionalComponentArgsRest(__VLS_127));
const { default: __VLS_130 } = __VLS_129.slots;
// @ts-ignore
[isInFence, submitting,];
(__VLS_ctx.isInFence ? 'Return Device' : 'Please Move to Return Area');
// @ts-ignore
[isInFence,];
var __VLS_129;
var __VLS_39;
/** @type {__VLS_StyleScopedClasses['return-page']} */ ;
/** @type {__VLS_StyleScopedClasses['device-info-section']} */ ;
/** @type {__VLS_StyleScopedClasses['device-card']} */ ;
/** @type {__VLS_StyleScopedClasses['status-tag']} */ ;
/** @type {__VLS_StyleScopedClasses['type-tag']} */ ;
/** @type {__VLS_StyleScopedClasses['location-tag']} */ ;
/** @type {__VLS_StyleScopedClasses['borrow-time-tag-container']} */ ;
/** @type {__VLS_StyleScopedClasses['borrow-time-tag']} */ ;
/** @type {__VLS_StyleScopedClasses['due-time-tag']} */ ;
/** @type {__VLS_StyleScopedClasses['notice-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['form-section']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['location-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['maintenance-collapse']} */ ;
/** @type {__VLS_StyleScopedClasses['maintenance-uploader']} */ ;
/** @type {__VLS_StyleScopedClasses['cancel-maintenance-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['submit-section']} */ ;
/** @type {__VLS_StyleScopedClasses['submit-btn']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup: () => ({
        deviceInfo: deviceInfo,
        borrowRecord: borrowRecord,
        submitting: submitting,
        locationLoading: locationLoading,
        locationStatus: locationStatus,
        formData: formData,
        needMaintenance: needMaintenance,
        maintenanceForm: maintenanceForm,
        fileList: fileList,
        uploading: uploading,
        isMaintenanceSelected: isMaintenanceSelected,
        isInFence: isInFence,
        getCurrentLocation: getCurrentLocation,
        formatDate: formatDate,
        handleFileUpload: handleFileUpload,
        handleFileDelete: handleFileDelete,
        getStatusTagType: getStatusTagType,
        getStatusText: getStatusText,
        handleSubmit: handleSubmit,
    }),
});
export default (await import('vue')).defineComponent({});
; /* PartiallyEnd: #4569/main.vue */
