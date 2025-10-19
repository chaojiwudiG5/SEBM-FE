import { ref, onMounted, computed, watch } from 'vue';
import { getDeviceList } from '../../api/device';
// 筛选参数
const filterParams = ref({
    deviceType: '',
    status: '',
    location: '',
    keyword: ''
});
// 分页参数
const currentPage = ref(1);
const pageSize = 10;
const totalDevices = ref(0);
// 数据状态
const deviceList = ref([]);
const loading = ref(false);
// 构建查询DTO
const buildQueryDto = (page = 1) => {
    const dto = {
        pageNumber: page,
        pageSize: pageSize
    };
    // 添加筛选条件
    if (filterParams.value.deviceType) {
        dto.deviceType = filterParams.value.deviceType;
    }
    if (filterParams.value.status !== '') {
        dto.status = parseInt(filterParams.value.status);
    }
    if (filterParams.value.location) {
        dto.location = filterParams.value.location;
    }
    if (filterParams.value.keyword) {
        dto.deviceName = filterParams.value.keyword;
    }
    return dto;
};
// 设备类型选项
const deviceTypeOptions = ref([
    { text: 'All Types', value: '' },
    { text: 'Laptop', value: 'Laptop' },
    { text: 'Tablet', value: 'Tablet' },
    { text: 'Phone', value: 'Phone' },
    { text: 'Camera', value: 'Camera' },
    { text: 'Other', value: 'Other' }
]);
// 状态选项
const statusOptions = ref([
    { text: 'All Status', value: '' },
    { text: 'Available', value: '0' },
    { text: 'Borrowed', value: '1' },
    { text: 'Repairing', value: '2' }
]);
// 位置选项（这里可以根据实际数据动态生成）
const locationOptions = ref([
    { text: 'All Locations', value: '' },
    { text: '1-A', value: '1-A' },
    { text: '1-B', value: '1-B' },
    { text: '1-C', value: '1-C' },
    { text: '2-A', value: '2-A' },
    { text: '2-B', value: '2-B' },
    { text: '2-C', value: '2-C' },
    { text: '2-D', value: '2-D' },
    { text: '3-A', value: '3-A' },
    { text: '3-B', value: '3-B' },
    { text: '3-C', value: '3-C' },
    { text: '3-D', value: '3-D' },
]);
// 状态统计
const statusCounts = ref([0, 0, 0]); // [available, borrowed, repairing]
// 计算统计比例
const statsRate = computed(() => {
    if (totalDevices.value === 0)
        return 0;
    return Math.round((statusCounts.value[0] / totalDevices.value) * 100);
});
// 获取状态文本
const getStatusText = (status) => {
    switch (status) {
        case 0: return 'Available';
        case 1: return 'Borrowed';
        case 2: return 'Repairing';
        default: return 'Unknown';
    }
};
// 获取状态标签类型
const getStatusTagType = (status) => {
    switch (status) {
        case 0: return 'success';
        case 1: return 'warning';
        case 2: return 'danger';
        case 3: return 'info';
        default: return 'default';
    }
};
// 获取设备列表
const fetchDevices = async (page = 1) => {
    if (loading.value)
        return;
    loading.value = true;
    try {
        const queryDto = buildQueryDto(page);
        console.log('Fetching devices for page:', page, 'Query DTO:', queryDto);
        const response = await getDeviceList(queryDto);
        if (response && Array.isArray(response)) {
            deviceList.value = response;
            console.log('Devices loaded for page', page, ':', response.length, 'devices');
        }
    }
    catch (error) {
        console.error('Failed to fetch devices:', error);
    }
    finally {
        loading.value = false;
    }
};
// 获取设备统计信息
const fetchDeviceStats = async () => {
    try {
        // 构建统计查询DTO（不包含分页，获取所有匹配的设备）
        const statsDto = {
            pageNumber: 1,
            pageSize: 1000 // 获取大量数据来统计
        };
        // 添加筛选条件（与设备列表使用相同的筛选条件）
        if (filterParams.value.deviceType) {
            statsDto.deviceType = filterParams.value.deviceType;
        }
        if (filterParams.value.status !== '') {
            statsDto.status = parseInt(filterParams.value.status);
        }
        if (filterParams.value.location) {
            statsDto.location = filterParams.value.location;
        }
        if (filterParams.value.keyword) {
            statsDto.deviceName = filterParams.value.keyword;
        }
        console.log('Stats Query DTO:', statsDto);
        const response = await getDeviceList(statsDto);
        if (response && Array.isArray(response)) {
            totalDevices.value = response.length;
            // 统计各状态数量
            const counts = [0, 0, 0, 0];
            response.forEach(device => {
                if (device.status !== undefined && device.status >= 0 && device.status <= 3) {
                    counts[device.status]++;
                }
            });
            statusCounts.value = counts;
            console.log('Device stats updated:', { total: totalDevices.value, counts: statusCounts.value });
        }
    }
    catch (error) {
        console.error('Failed to fetch device stats:', error);
    }
};
// 处理搜索
const handleSearch = () => {
    currentPage.value = 1;
    // 同时更新设备列表和统计数据
    Promise.all([
        fetchDevices(1),
        fetchDeviceStats()
    ]);
};
// 处理分页变化
const handlePageChange = (page) => {
    console.log('Page changed to:', page);
    currentPage.value = page;
    fetchDevices(page);
};
// 监听筛选参数变化（排除keyword，避免实时搜索）
watch(() => ({
    deviceType: filterParams.value.deviceType,
    status: filterParams.value.status,
    location: filterParams.value.location
}), () => {
    handleSearch();
}, { deep: true });
// 页面加载时获取数据
onMounted(async () => {
    await Promise.all([
        fetchDevices(1),
        fetchDeviceStats()
    ]);
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['value']} */ ;
/** @type {__VLS_StyleScopedClasses['value']} */ ;
/** @type {__VLS_StyleScopedClasses['value']} */ ;
/** @type {__VLS_StyleScopedClasses['device-card']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "device-page" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "filter-section" },
});
const __VLS_0 = {}.VanDropdownMenu;
/** @type {[typeof __VLS_components.VanDropdownMenu, typeof __VLS_components.vanDropdownMenu, typeof __VLS_components.VanDropdownMenu, typeof __VLS_components.vanDropdownMenu, ]} */ ;
// @ts-ignore
VanDropdownMenu;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({}));
const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
const { default: __VLS_4 } = __VLS_3.slots;
const __VLS_5 = {}.VanDropdownItem;
/** @type {[typeof __VLS_components.VanDropdownItem, typeof __VLS_components.vanDropdownItem, ]} */ ;
// @ts-ignore
VanDropdownItem;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({
    modelValue: (__VLS_ctx.filterParams.deviceType),
    options: (__VLS_ctx.deviceTypeOptions),
    title: "Device Type",
}));
const __VLS_7 = __VLS_6({
    modelValue: (__VLS_ctx.filterParams.deviceType),
    options: (__VLS_ctx.deviceTypeOptions),
    title: "Device Type",
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
// @ts-ignore
[filterParams, deviceTypeOptions,];
const __VLS_10 = {}.VanDropdownItem;
/** @type {[typeof __VLS_components.VanDropdownItem, typeof __VLS_components.vanDropdownItem, ]} */ ;
// @ts-ignore
VanDropdownItem;
// @ts-ignore
const __VLS_11 = __VLS_asFunctionalComponent(__VLS_10, new __VLS_10({
    modelValue: (__VLS_ctx.filterParams.status),
    options: (__VLS_ctx.statusOptions),
    title: "Status",
}));
const __VLS_12 = __VLS_11({
    modelValue: (__VLS_ctx.filterParams.status),
    options: (__VLS_ctx.statusOptions),
    title: "Status",
}, ...__VLS_functionalComponentArgsRest(__VLS_11));
// @ts-ignore
[filterParams, statusOptions,];
const __VLS_15 = {}.VanDropdownItem;
/** @type {[typeof __VLS_components.VanDropdownItem, typeof __VLS_components.vanDropdownItem, ]} */ ;
// @ts-ignore
VanDropdownItem;
// @ts-ignore
const __VLS_16 = __VLS_asFunctionalComponent(__VLS_15, new __VLS_15({
    modelValue: (__VLS_ctx.filterParams.location),
    options: (__VLS_ctx.locationOptions),
    title: "Location",
}));
const __VLS_17 = __VLS_16({
    modelValue: (__VLS_ctx.filterParams.location),
    options: (__VLS_ctx.locationOptions),
    title: "Location",
}, ...__VLS_functionalComponentArgsRest(__VLS_16));
// @ts-ignore
[filterParams, locationOptions,];
var __VLS_3;
const __VLS_20 = {}.VanSearch;
/** @type {[typeof __VLS_components.VanSearch, typeof __VLS_components.vanSearch, ]} */ ;
// @ts-ignore
VanSearch;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
    ...{ 'onSearch': {} },
    ...{ 'onClear': {} },
    modelValue: (__VLS_ctx.filterParams.keyword),
    placeholder: "Search devices...",
    showAction: true,
    actionText: "Clear",
}));
const __VLS_22 = __VLS_21({
    ...{ 'onSearch': {} },
    ...{ 'onClear': {} },
    modelValue: (__VLS_ctx.filterParams.keyword),
    placeholder: "Search devices...",
    showAction: true,
    actionText: "Clear",
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
let __VLS_24;
let __VLS_25;
const __VLS_26 = ({ search: {} },
    { onSearch: (__VLS_ctx.handleSearch) });
const __VLS_27 = ({ clear: {} },
    { onClear: (__VLS_ctx.handleSearch) });
// @ts-ignore
[filterParams, handleSearch, handleSearch,];
var __VLS_23;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "stats-section" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "stats-circle" },
});
const __VLS_29 = {}.VanCircle;
/** @type {[typeof __VLS_components.VanCircle, typeof __VLS_components.vanCircle, ]} */ ;
// @ts-ignore
VanCircle;
// @ts-ignore
const __VLS_30 = __VLS_asFunctionalComponent(__VLS_29, new __VLS_29({
    rate: (__VLS_ctx.statsRate),
    speed: (100),
    text: (`${__VLS_ctx.totalDevices}`),
    currentRate: (__VLS_ctx.statsRate),
    strokeWidth: "32",
    layerColor: "#f0f0f0",
    color: "#1989fa",
    size: "80",
}));
const __VLS_31 = __VLS_30({
    rate: (__VLS_ctx.statsRate),
    speed: (100),
    text: (`${__VLS_ctx.totalDevices}`),
    currentRate: (__VLS_ctx.statsRate),
    strokeWidth: "32",
    layerColor: "#f0f0f0",
    color: "#1989fa",
    size: "80",
}, ...__VLS_functionalComponentArgsRest(__VLS_30));
// @ts-ignore
[statsRate, statsRate, totalDevices,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "circle-label" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "stats-info" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "stats-item" },
});
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ class: "label" },
});
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ class: "value available" },
});
(__VLS_ctx.statusCounts[0]);
// @ts-ignore
[statusCounts,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "stats-item" },
});
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ class: "label" },
});
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ class: "value borrowed" },
});
(__VLS_ctx.statusCounts[1]);
// @ts-ignore
[statusCounts,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "stats-item" },
});
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ class: "label" },
});
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ class: "value repairing" },
});
(__VLS_ctx.statusCounts[2]);
// @ts-ignore
[statusCounts,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "device-list-section" },
});
if (__VLS_ctx.loading) {
    // @ts-ignore
    [loading,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "skeleton-container" },
    });
    for (const [n] of __VLS_getVForSourceType((5))) {
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            key: (n),
            ...{ class: "skeleton-card" },
        });
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "skeleton-thumb" },
        });
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "skeleton-content" },
        });
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "skeleton-title" },
        });
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "skeleton-desc" },
        });
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "skeleton-footer" },
        });
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "skeleton-tag" },
        });
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "skeleton-tag" },
        });
    }
}
else {
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({});
    if (__VLS_ctx.deviceList.length === 0) {
        // @ts-ignore
        [deviceList,];
        const __VLS_34 = {}.VanEmpty;
        /** @type {[typeof __VLS_components.VanEmpty, typeof __VLS_components.vanEmpty, ]} */ ;
        // @ts-ignore
        VanEmpty;
        // @ts-ignore
        const __VLS_35 = __VLS_asFunctionalComponent(__VLS_34, new __VLS_34({
            description: "No devices found",
        }));
        const __VLS_36 = __VLS_35({
            description: "No devices found",
        }, ...__VLS_functionalComponentArgsRest(__VLS_35));
    }
    else {
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({});
        for (const [device] of __VLS_getVForSourceType((__VLS_ctx.deviceList))) {
            // @ts-ignore
            [deviceList,];
            const __VLS_39 = {}.VanCard;
            /** @type {[typeof __VLS_components.VanCard, typeof __VLS_components.vanCard, typeof __VLS_components.VanCard, typeof __VLS_components.vanCard, ]} */ ;
            // @ts-ignore
            VanCard;
            // @ts-ignore
            const __VLS_40 = __VLS_asFunctionalComponent(__VLS_39, new __VLS_39({
                key: (device.id),
                title: (device.deviceName),
                thumb: (device.image || 'https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg'),
                ...{ class: "device-card" },
            }));
            const __VLS_41 = __VLS_40({
                key: (device.id),
                title: (device.deviceName),
                thumb: (device.image || 'https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg'),
                ...{ class: "device-card" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_40));
            const { default: __VLS_43 } = __VLS_42.slots;
            {
                const { desc: __VLS_44 } = __VLS_42.slots;
                __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
                    ...{ class: "device-desc" },
                });
                (device.description);
            }
            {
                const { tags: __VLS_45 } = __VLS_42.slots;
                const __VLS_46 = {}.VanTag;
                /** @type {[typeof __VLS_components.VanTag, typeof __VLS_components.vanTag, typeof __VLS_components.VanTag, typeof __VLS_components.vanTag, ]} */ ;
                // @ts-ignore
                VanTag;
                // @ts-ignore
                const __VLS_47 = __VLS_asFunctionalComponent(__VLS_46, new __VLS_46({
                    type: __VLS_ctx.getStatusTagType(device.status),
                    ...{ class: "status-tag" },
                }));
                const __VLS_48 = __VLS_47({
                    type: __VLS_ctx.getStatusTagType(device.status),
                    ...{ class: "status-tag" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_47));
                const { default: __VLS_50 } = __VLS_49.slots;
                // @ts-ignore
                [getStatusTagType,];
                (__VLS_ctx.getStatusText(device.status));
                // @ts-ignore
                [getStatusText,];
                var __VLS_49;
                const __VLS_51 = {}.VanTag;
                /** @type {[typeof __VLS_components.VanTag, typeof __VLS_components.vanTag, typeof __VLS_components.VanTag, typeof __VLS_components.vanTag, ]} */ ;
                // @ts-ignore
                VanTag;
                // @ts-ignore
                const __VLS_52 = __VLS_asFunctionalComponent(__VLS_51, new __VLS_51({
                    type: "primary",
                    plain: true,
                    ...{ class: "type-tag" },
                }));
                const __VLS_53 = __VLS_52({
                    type: "primary",
                    plain: true,
                    ...{ class: "type-tag" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_52));
                const { default: __VLS_55 } = __VLS_54.slots;
                (device.deviceType);
                var __VLS_54;
                const __VLS_56 = {}.VanTag;
                /** @type {[typeof __VLS_components.VanTag, typeof __VLS_components.vanTag, typeof __VLS_components.VanTag, typeof __VLS_components.vanTag, ]} */ ;
                // @ts-ignore
                VanTag;
                // @ts-ignore
                const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
                    type: "default",
                    plain: true,
                    ...{ class: "location-info" },
                }));
                const __VLS_58 = __VLS_57({
                    type: "default",
                    plain: true,
                    ...{ class: "location-info" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_57));
                const { default: __VLS_60 } = __VLS_59.slots;
                (device.location);
                var __VLS_59;
            }
            var __VLS_42;
        }
        const __VLS_61 = {}.VanPagination;
        /** @type {[typeof __VLS_components.VanPagination, typeof __VLS_components.vanPagination, typeof __VLS_components.VanPagination, typeof __VLS_components.vanPagination, ]} */ ;
        // @ts-ignore
        VanPagination;
        // @ts-ignore
        const __VLS_62 = __VLS_asFunctionalComponent(__VLS_61, new __VLS_61({
            ...{ 'onChange': {} },
            modelValue: (__VLS_ctx.currentPage),
            totalItems: (__VLS_ctx.totalDevices),
            itemsPerPage: (10),
            mode: "simple",
            ...{ class: "pagination" },
        }));
        const __VLS_63 = __VLS_62({
            ...{ 'onChange': {} },
            modelValue: (__VLS_ctx.currentPage),
            totalItems: (__VLS_ctx.totalDevices),
            itemsPerPage: (10),
            mode: "simple",
            ...{ class: "pagination" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_62));
        let __VLS_65;
        let __VLS_66;
        const __VLS_67 = ({ change: {} },
            { onChange: (__VLS_ctx.handlePageChange) });
        const { default: __VLS_68 } = __VLS_64.slots;
        // @ts-ignore
        [totalDevices, currentPage, handlePageChange,];
        {
            const { 'prev-text': __VLS_69 } = __VLS_64.slots;
            const __VLS_70 = {}.VanIcon;
            /** @type {[typeof __VLS_components.VanIcon, typeof __VLS_components.vanIcon, ]} */ ;
            // @ts-ignore
            VanIcon;
            // @ts-ignore
            const __VLS_71 = __VLS_asFunctionalComponent(__VLS_70, new __VLS_70({
                name: "arrow-left",
            }));
            const __VLS_72 = __VLS_71({
                name: "arrow-left",
            }, ...__VLS_functionalComponentArgsRest(__VLS_71));
        }
        {
            const { 'next-text': __VLS_75 } = __VLS_64.slots;
            const __VLS_76 = {}.VanIcon;
            /** @type {[typeof __VLS_components.VanIcon, typeof __VLS_components.vanIcon, ]} */ ;
            // @ts-ignore
            VanIcon;
            // @ts-ignore
            const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
                name: "arrow",
            }));
            const __VLS_78 = __VLS_77({
                name: "arrow",
            }, ...__VLS_functionalComponentArgsRest(__VLS_77));
        }
        var __VLS_64;
    }
}
/** @type {__VLS_StyleScopedClasses['device-page']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-section']} */ ;
/** @type {__VLS_StyleScopedClasses['stats-section']} */ ;
/** @type {__VLS_StyleScopedClasses['stats-circle']} */ ;
/** @type {__VLS_StyleScopedClasses['circle-label']} */ ;
/** @type {__VLS_StyleScopedClasses['stats-info']} */ ;
/** @type {__VLS_StyleScopedClasses['stats-item']} */ ;
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['value']} */ ;
/** @type {__VLS_StyleScopedClasses['available']} */ ;
/** @type {__VLS_StyleScopedClasses['stats-item']} */ ;
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['value']} */ ;
/** @type {__VLS_StyleScopedClasses['borrowed']} */ ;
/** @type {__VLS_StyleScopedClasses['stats-item']} */ ;
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['value']} */ ;
/** @type {__VLS_StyleScopedClasses['repairing']} */ ;
/** @type {__VLS_StyleScopedClasses['device-list-section']} */ ;
/** @type {__VLS_StyleScopedClasses['skeleton-container']} */ ;
/** @type {__VLS_StyleScopedClasses['skeleton-card']} */ ;
/** @type {__VLS_StyleScopedClasses['skeleton-thumb']} */ ;
/** @type {__VLS_StyleScopedClasses['skeleton-content']} */ ;
/** @type {__VLS_StyleScopedClasses['skeleton-title']} */ ;
/** @type {__VLS_StyleScopedClasses['skeleton-desc']} */ ;
/** @type {__VLS_StyleScopedClasses['skeleton-footer']} */ ;
/** @type {__VLS_StyleScopedClasses['skeleton-tag']} */ ;
/** @type {__VLS_StyleScopedClasses['skeleton-tag']} */ ;
/** @type {__VLS_StyleScopedClasses['device-card']} */ ;
/** @type {__VLS_StyleScopedClasses['device-desc']} */ ;
/** @type {__VLS_StyleScopedClasses['status-tag']} */ ;
/** @type {__VLS_StyleScopedClasses['type-tag']} */ ;
/** @type {__VLS_StyleScopedClasses['location-info']} */ ;
/** @type {__VLS_StyleScopedClasses['pagination']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup: () => ({
        filterParams: filterParams,
        currentPage: currentPage,
        totalDevices: totalDevices,
        deviceList: deviceList,
        loading: loading,
        deviceTypeOptions: deviceTypeOptions,
        statusOptions: statusOptions,
        locationOptions: locationOptions,
        statusCounts: statusCounts,
        statsRate: statsRate,
        getStatusText: getStatusText,
        getStatusTagType: getStatusTagType,
        handleSearch: handleSearch,
        handlePageChange: handlePageChange,
    }),
});
export default (await import('vue')).defineComponent({});
; /* PartiallyEnd: #4569/main.vue */
