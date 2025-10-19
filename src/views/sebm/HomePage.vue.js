import { ref, onMounted, computed } from 'vue';
import { useUserStore } from '../../store/user';
import { getBorrowRecordListWithStatus } from '../../api/borrow';
import { listMyRecords } from '../../api/userMaintenanceRecord';
const userStore = useUserStore();
// 常量定义：用户最大借用数量
const MaxBorrowedCount = ref(userStore.userInfo?.maxBorrowedDeviceCount || 3);
const overdueCount = ref(userStore.userInfo?.overdueTimes || 0);
const usingCount = ref(userStore.userInfo?.borrowedDeviceCount || 0);
// 借用记录数据
const usingRecords = ref([]);
const returnedRecords = ref([]);
const usingLoading = ref(false);
const returnedLoading = ref(false);
// 维修报单数据
const maintenanceRecords = ref([]);
const maintenanceLoading = ref(false);
// 折叠面板控制 - 根据数据动态设置
const activeCollapse = ref([]);
// 计算哪些面板应该展开
const updateActiveCollapse = () => {
    const active = [];
    if (usingRecords.value.length > 0) {
        active.push('using');
    }
    if (returnedRecords.value.length > 0) {
        active.push('returned');
    }
    if (maintenanceRecords.value.length > 0) {
        active.push('maintenance');
    }
    activeCollapse.value = active;
};
// 分页相关数据
const currentPage = ref(1);
const totalReturnedRecords = ref(0);
const pageSize = 5;
// 计算借用比例（百分比）
const borrowRate = computed(() => {
    const rate = Math.round((usingCount.value / MaxBorrowedCount.value) * 100);
    console.log('Borrow rate calculated:', rate, 'usingCount:', usingCount.value, 'MaxBorrowedCount:', MaxBorrowedCount.value);
    return rate;
});
// 格式化日期
const formatDate = (dateString) => {
    if (!dateString)
        return '';
    const date = new Date(dateString);
    // 使用toLocaleString来包含时间，并指定时区为UTC
    return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'UTC' // 保持UTC时间，不进行本地时区转换
    });
};
// 获取维修状态文本
const getMaintenanceStatusText = (status) => {
    switch (status) {
        case 0: return 'In Progress';
        case 1: return 'Completed';
        default: return 'Unknown';
    }
};
// 获取维修状态标签类型
const getMaintenanceStatusType = (status) => {
    switch (status) {
        case 0: return 'warning';
        case 1: return 'success';
        default: return 'default';
    }
};
// 获取待归还设备列表
const fetchUsingRecords = async () => {
    if (!userStore.userInfo?.id) {
        console.log('User ID is not available:', userStore.userInfo);
        return;
    }
    usingLoading.value = true;
    try {
        const response = await getBorrowRecordListWithStatus({
            pageNumber: 1,
            pageSize: 5,
            userId: userStore.userInfo.id,
            status: 0 // 0表示待归还
        });
        console.log('Using records response:', response);
        if (response && Array.isArray(response)) {
            usingRecords.value = response;
        }
        else {
            console.log('API returned error or no data:', response);
        }
    }
    finally {
        usingLoading.value = false;
        updateActiveCollapse(); // 更新折叠面板状态
    }
};
// 获取已归还设备列表（分页）
const fetchReturnedRecords = async (page = 1) => {
    if (!userStore.userInfo?.id) {
        console.log('User ID is not available for returned records:', userStore.userInfo);
        return;
    }
    returnedLoading.value = true;
    try {
        console.log('Fetching returned records for user:', userStore.userInfo.id, 'page:', page);
        const response = await getBorrowRecordListWithStatus({
            pageNumber: page,
            pageSize: pageSize,
            userId: userStore.userInfo.id,
            status: 1 // 1表示已归还
        });
        console.log('Returned records response:', response);
        if (response && Array.isArray(response)) {
            // 按归还时间降序排序
            returnedRecords.value = response.sort((a, b) => {
                if (!a.returnTime || !b.returnTime)
                    return 0;
                return new Date(b.returnTime).getTime() - new Date(a.returnTime).getTime();
            });
            console.log('Returned records set:', returnedRecords.value);
        }
        else {
            console.log('API returned error or no data for returned records:', response);
        }
    }
    catch (error) {
        console.error('Failed to get returned records:', error);
    }
    finally {
        returnedLoading.value = false;
        updateActiveCollapse(); // 更新折叠面板状态
    }
};
// 获取归还记录总数（用于分页）
const fetchReturnedRecordsTotal = async () => {
    if (!userStore.userInfo?.id)
        return;
    try {
        // 获取总数，使用大的pageSize来获取所有记录数
        const response = await getBorrowRecordListWithStatus({
            pageNumber: 1,
            pageSize: 1000, // 获取大量数据来统计总数
            userId: userStore.userInfo.id,
            status: 1
        });
        if (response && Array.isArray(response)) {
            totalReturnedRecords.value = response.length;
        }
    }
    catch (error) {
        console.error('Failed to get returned records total:', error);
    }
};
// 获取维修报单列表
const fetchMaintenanceRecords = async () => {
    if (!userStore.userInfo?.id) {
        console.log('User ID is not available for maintenance records:', userStore.userInfo);
        return;
    }
    maintenanceLoading.value = true;
    try {
        console.log('Fetching maintenance records for user:', userStore.userInfo.id);
        const response = await listMyRecords({
            pageNumber: 1,
            pageSize: 10,
            status: undefined // 获取所有状态的维修记录
        });
        console.log('Maintenance records response:', response);
        if (response && Array.isArray(response)) {
            // 按创建时间降序排序
            maintenanceRecords.value = response.sort((a, b) => {
                if (!a.createTime || !b.createTime)
                    return 0;
                return new Date(b.createTime).getTime() - new Date(a.createTime).getTime();
            });
            console.log('Maintenance records set:', maintenanceRecords.value);
        }
        else {
            console.log('API returned error or no data for maintenance records:', response);
        }
    }
    catch (error) {
        console.error('Failed to get maintenance records:', error);
    }
    finally {
        maintenanceLoading.value = false;
        updateActiveCollapse(); // 更新折叠面板状态
    }
};
// 处理分页变化
const handlePageChange = (page) => {
    currentPage.value = page;
    fetchReturnedRecords(page);
};
// 页面加载时获取数据
onMounted(async () => {
    console.log('HomePage mounted, user info:', userStore.userInfo);
    // 确保用户信息已加载
    if (!userStore.userInfo?.id) {
        console.log('User info not available, trying to load from server...');
        await userStore.loadFromServer();
        console.log('User info after loading:', userStore.userInfo);
    }
    if (userStore.userInfo?.id) {
        await Promise.all([
            fetchUsingRecords(),
            fetchReturnedRecords(1), // 获取第一页数据
            fetchReturnedRecordsTotal(), // 获取总数
            fetchMaintenanceRecords() // 获取维修报单
        ]);
    }
    else {
        console.log('Still no user info available');
    }
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['swipe-container']} */ ;
/** @type {__VLS_StyleScopedClasses['info-item']} */ ;
/** @type {__VLS_StyleScopedClasses['van-cell-group__title']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "home-page" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "borrow-overview" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "circles-section" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "circle-item" },
});
const __VLS_0 = {}.VanCircle;
/** @type {[typeof __VLS_components.VanCircle, typeof __VLS_components.vanCircle, ]} */ ;
// @ts-ignore
VanCircle;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    rate: (100),
    speed: (30),
    text: (`${__VLS_ctx.usingCount}/${__VLS_ctx.MaxBorrowedCount}`),
    currentRate: (__VLS_ctx.borrowRate),
    strokeWidth: "24",
    color: "#1989fa",
    layerColor: "#f0f0f0",
    size: "100",
}));
const __VLS_2 = __VLS_1({
    rate: (100),
    speed: (30),
    text: (`${__VLS_ctx.usingCount}/${__VLS_ctx.MaxBorrowedCount}`),
    currentRate: (__VLS_ctx.borrowRate),
    strokeWidth: "24",
    color: "#1989fa",
    layerColor: "#f0f0f0",
    size: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
// @ts-ignore
[usingCount, MaxBorrowedCount, borrowRate,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "circle-label" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "info-section" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "info-title" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "info-content" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "info-row" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "info-item" },
});
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ class: "label" },
});
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ class: "value" },
});
(__VLS_ctx.usingCount);
// @ts-ignore
[usingCount,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "info-item" },
});
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ class: "label" },
});
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ class: "value" },
});
(__VLS_ctx.MaxBorrowedCount);
// @ts-ignore
[MaxBorrowedCount,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "info-row" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "info-item" },
});
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ class: "label" },
});
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ class: "value" },
});
(__VLS_ctx.MaxBorrowedCount - __VLS_ctx.usingCount);
// @ts-ignore
[usingCount, MaxBorrowedCount,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "info-item" },
});
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ class: "label" },
});
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ class: "value-overdue" },
});
(__VLS_ctx.overdueCount);
// @ts-ignore
[overdueCount,];
if (__VLS_ctx.usingLoading) {
    // @ts-ignore
    [usingLoading,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "skeleton-container" },
    });
    for (const [n] of __VLS_getVForSourceType((3))) {
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
            ...{ class: "skeleton-time" },
        });
    }
}
else {
    const __VLS_5 = {}.VanCollapse;
    /** @type {[typeof __VLS_components.VanCollapse, typeof __VLS_components.vanCollapse, typeof __VLS_components.VanCollapse, typeof __VLS_components.vanCollapse, ]} */ ;
    // @ts-ignore
    VanCollapse;
    // @ts-ignore
    const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({
        modelValue: (__VLS_ctx.activeCollapse),
        ...{ class: "device-collapse" },
    }));
    const __VLS_7 = __VLS_6({
        modelValue: (__VLS_ctx.activeCollapse),
        ...{ class: "device-collapse" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_6));
    const { default: __VLS_9 } = __VLS_8.slots;
    // @ts-ignore
    [activeCollapse,];
    const __VLS_10 = {}.VanCollapseItem;
    /** @type {[typeof __VLS_components.VanCollapseItem, typeof __VLS_components.vanCollapseItem, typeof __VLS_components.VanCollapseItem, typeof __VLS_components.vanCollapseItem, ]} */ ;
    // @ts-ignore
    VanCollapseItem;
    // @ts-ignore
    const __VLS_11 = __VLS_asFunctionalComponent(__VLS_10, new __VLS_10({
        title: "Using Devices",
        name: "using",
        disabled: (__VLS_ctx.usingRecords.length === 0),
    }));
    const __VLS_12 = __VLS_11({
        title: "Using Devices",
        name: "using",
        disabled: (__VLS_ctx.usingRecords.length === 0),
    }, ...__VLS_functionalComponentArgsRest(__VLS_11));
    const { default: __VLS_14 } = __VLS_13.slots;
    // @ts-ignore
    [usingRecords,];
    {
        const { title: __VLS_15 } = __VLS_13.slots;
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
        const __VLS_16 = {}.VanTag;
        /** @type {[typeof __VLS_components.VanTag, typeof __VLS_components.vanTag, typeof __VLS_components.VanTag, typeof __VLS_components.vanTag, ]} */ ;
        // @ts-ignore
        VanTag;
        // @ts-ignore
        const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
            type: "warning",
            ...{ style: {} },
        }));
        const __VLS_18 = __VLS_17({
            type: "warning",
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_17));
        const { default: __VLS_20 } = __VLS_19.slots;
        (__VLS_ctx.usingRecords.length);
        // @ts-ignore
        [usingRecords,];
        var __VLS_19;
    }
    if (__VLS_ctx.usingRecords.length === 0) {
        // @ts-ignore
        [usingRecords,];
        const __VLS_21 = {}.VanEmpty;
        /** @type {[typeof __VLS_components.VanEmpty, typeof __VLS_components.vanEmpty, ]} */ ;
        // @ts-ignore
        VanEmpty;
        // @ts-ignore
        const __VLS_22 = __VLS_asFunctionalComponent(__VLS_21, new __VLS_21({
            description: "No using devices",
        }));
        const __VLS_23 = __VLS_22({
            description: "No using devices",
        }, ...__VLS_functionalComponentArgsRest(__VLS_22));
    }
    else {
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({});
        for (const [record] of __VLS_getVForSourceType((__VLS_ctx.usingRecords))) {
            // @ts-ignore
            [usingRecords,];
            const __VLS_26 = {}.VanCard;
            /** @type {[typeof __VLS_components.VanCard, typeof __VLS_components.vanCard, typeof __VLS_components.VanCard, typeof __VLS_components.vanCard, ]} */ ;
            // @ts-ignore
            VanCard;
            // @ts-ignore
            const __VLS_27 = __VLS_asFunctionalComponent(__VLS_26, new __VLS_26({
                key: (record.id),
                title: (record.deviceName),
                thumb: (record.image),
                ...{ class: "device-card" },
            }));
            const __VLS_28 = __VLS_27({
                key: (record.id),
                title: (record.deviceName),
                thumb: (record.image),
                ...{ class: "device-card" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_27));
            const { default: __VLS_30 } = __VLS_29.slots;
            {
                const { footer: __VLS_31 } = __VLS_29.slots;
                const __VLS_32 = {}.VanTag;
                /** @type {[typeof __VLS_components.VanTag, typeof __VLS_components.vanTag, typeof __VLS_components.VanTag, typeof __VLS_components.vanTag, ]} */ ;
                // @ts-ignore
                VanTag;
                // @ts-ignore
                const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
                    type: "warning",
                }));
                const __VLS_34 = __VLS_33({
                    type: "warning",
                }, ...__VLS_functionalComponentArgsRest(__VLS_33));
                const { default: __VLS_36 } = __VLS_35.slots;
                var __VLS_35;
                __VLS_asFunctionalElement(__VLS_elements.br)({});
                const __VLS_37 = {}.VanTag;
                /** @type {[typeof __VLS_components.VanTag, typeof __VLS_components.vanTag, typeof __VLS_components.VanTag, typeof __VLS_components.vanTag, ]} */ ;
                // @ts-ignore
                VanTag;
                // @ts-ignore
                const __VLS_38 = __VLS_asFunctionalComponent(__VLS_37, new __VLS_37({
                    type: "primary",
                }));
                const __VLS_39 = __VLS_38({
                    type: "primary",
                }, ...__VLS_functionalComponentArgsRest(__VLS_38));
                const { default: __VLS_41 } = __VLS_40.slots;
                (__VLS_ctx.formatDate(record.borrowTime));
                // @ts-ignore
                [formatDate,];
                var __VLS_40;
                __VLS_asFunctionalElement(__VLS_elements.br)({});
                const __VLS_42 = {}.VanTag;
                /** @type {[typeof __VLS_components.VanTag, typeof __VLS_components.vanTag, typeof __VLS_components.VanTag, typeof __VLS_components.vanTag, ]} */ ;
                // @ts-ignore
                VanTag;
                // @ts-ignore
                const __VLS_43 = __VLS_asFunctionalComponent(__VLS_42, new __VLS_42({
                    type: "danger",
                }));
                const __VLS_44 = __VLS_43({
                    type: "danger",
                }, ...__VLS_functionalComponentArgsRest(__VLS_43));
                const { default: __VLS_46 } = __VLS_45.slots;
                (__VLS_ctx.formatDate(record.dueTime));
                // @ts-ignore
                [formatDate,];
                var __VLS_45;
            }
            var __VLS_29;
        }
    }
    var __VLS_13;
    var __VLS_8;
}
if (__VLS_ctx.returnedLoading) {
    // @ts-ignore
    [returnedLoading,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "skeleton-container" },
    });
    for (const [n] of __VLS_getVForSourceType((3))) {
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
            ...{ class: "skeleton-time" },
        });
    }
}
else {
    const __VLS_47 = {}.VanCollapse;
    /** @type {[typeof __VLS_components.VanCollapse, typeof __VLS_components.vanCollapse, typeof __VLS_components.VanCollapse, typeof __VLS_components.vanCollapse, ]} */ ;
    // @ts-ignore
    VanCollapse;
    // @ts-ignore
    const __VLS_48 = __VLS_asFunctionalComponent(__VLS_47, new __VLS_47({
        modelValue: (__VLS_ctx.activeCollapse),
        ...{ class: "device-collapse" },
    }));
    const __VLS_49 = __VLS_48({
        modelValue: (__VLS_ctx.activeCollapse),
        ...{ class: "device-collapse" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_48));
    const { default: __VLS_51 } = __VLS_50.slots;
    // @ts-ignore
    [activeCollapse,];
    const __VLS_52 = {}.VanCollapseItem;
    /** @type {[typeof __VLS_components.VanCollapseItem, typeof __VLS_components.vanCollapseItem, typeof __VLS_components.VanCollapseItem, typeof __VLS_components.vanCollapseItem, ]} */ ;
    // @ts-ignore
    VanCollapseItem;
    // @ts-ignore
    const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
        title: "Recent Returned Records",
        name: "returned",
        disabled: (__VLS_ctx.returnedRecords.length === 0),
    }));
    const __VLS_54 = __VLS_53({
        title: "Recent Returned Records",
        name: "returned",
        disabled: (__VLS_ctx.returnedRecords.length === 0),
    }, ...__VLS_functionalComponentArgsRest(__VLS_53));
    const { default: __VLS_56 } = __VLS_55.slots;
    // @ts-ignore
    [returnedRecords,];
    {
        const { title: __VLS_57 } = __VLS_55.slots;
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
        const __VLS_58 = {}.VanTag;
        /** @type {[typeof __VLS_components.VanTag, typeof __VLS_components.vanTag, typeof __VLS_components.VanTag, typeof __VLS_components.vanTag, ]} */ ;
        // @ts-ignore
        VanTag;
        // @ts-ignore
        const __VLS_59 = __VLS_asFunctionalComponent(__VLS_58, new __VLS_58({
            type: "success",
            ...{ style: {} },
        }));
        const __VLS_60 = __VLS_59({
            type: "success",
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_59));
        const { default: __VLS_62 } = __VLS_61.slots;
        (__VLS_ctx.returnedRecords.length);
        // @ts-ignore
        [returnedRecords,];
        var __VLS_61;
    }
    if (__VLS_ctx.returnedRecords.length === 0) {
        // @ts-ignore
        [returnedRecords,];
        const __VLS_63 = {}.VanEmpty;
        /** @type {[typeof __VLS_components.VanEmpty, typeof __VLS_components.vanEmpty, ]} */ ;
        // @ts-ignore
        VanEmpty;
        // @ts-ignore
        const __VLS_64 = __VLS_asFunctionalComponent(__VLS_63, new __VLS_63({
            description: "No returned records",
        }));
        const __VLS_65 = __VLS_64({
            description: "No returned records",
        }, ...__VLS_functionalComponentArgsRest(__VLS_64));
    }
    else {
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({});
        for (const [record] of __VLS_getVForSourceType((__VLS_ctx.returnedRecords))) {
            // @ts-ignore
            [returnedRecords,];
            const __VLS_68 = {}.VanCard;
            /** @type {[typeof __VLS_components.VanCard, typeof __VLS_components.vanCard, typeof __VLS_components.VanCard, typeof __VLS_components.vanCard, ]} */ ;
            // @ts-ignore
            VanCard;
            // @ts-ignore
            const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
                key: (record.id),
                title: (record.deviceName),
                thumb: (record.image),
                ...{ class: "device-card" },
            }));
            const __VLS_70 = __VLS_69({
                key: (record.id),
                title: (record.deviceName),
                thumb: (record.image),
                ...{ class: "device-card" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_69));
            const { default: __VLS_72 } = __VLS_71.slots;
            {
                const { footer: __VLS_73 } = __VLS_71.slots;
                const __VLS_74 = {}.VanTag;
                /** @type {[typeof __VLS_components.VanTag, typeof __VLS_components.vanTag, typeof __VLS_components.VanTag, typeof __VLS_components.vanTag, ]} */ ;
                // @ts-ignore
                VanTag;
                // @ts-ignore
                const __VLS_75 = __VLS_asFunctionalComponent(__VLS_74, new __VLS_74({
                    type: "success",
                }));
                const __VLS_76 = __VLS_75({
                    type: "success",
                }, ...__VLS_functionalComponentArgsRest(__VLS_75));
                const { default: __VLS_78 } = __VLS_77.slots;
                var __VLS_77;
                __VLS_asFunctionalElement(__VLS_elements.br)({});
                const __VLS_79 = {}.VanTag;
                /** @type {[typeof __VLS_components.VanTag, typeof __VLS_components.vanTag, typeof __VLS_components.VanTag, typeof __VLS_components.vanTag, ]} */ ;
                // @ts-ignore
                VanTag;
                // @ts-ignore
                const __VLS_80 = __VLS_asFunctionalComponent(__VLS_79, new __VLS_79({
                    type: "primary",
                }));
                const __VLS_81 = __VLS_80({
                    type: "primary",
                }, ...__VLS_functionalComponentArgsRest(__VLS_80));
                const { default: __VLS_83 } = __VLS_82.slots;
                (__VLS_ctx.formatDate(record.borrowTime));
                // @ts-ignore
                [formatDate,];
                var __VLS_82;
                __VLS_asFunctionalElement(__VLS_elements.br)({});
                const __VLS_84 = {}.VanTag;
                /** @type {[typeof __VLS_components.VanTag, typeof __VLS_components.vanTag, typeof __VLS_components.VanTag, typeof __VLS_components.vanTag, ]} */ ;
                // @ts-ignore
                VanTag;
                // @ts-ignore
                const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
                    type: "primary",
                }));
                const __VLS_86 = __VLS_85({
                    type: "primary",
                }, ...__VLS_functionalComponentArgsRest(__VLS_85));
                const { default: __VLS_88 } = __VLS_87.slots;
                (__VLS_ctx.formatDate(record.returnTime));
                // @ts-ignore
                [formatDate,];
                var __VLS_87;
            }
            var __VLS_71;
        }
        const __VLS_89 = {}.VanPagination;
        /** @type {[typeof __VLS_components.VanPagination, typeof __VLS_components.vanPagination, typeof __VLS_components.VanPagination, typeof __VLS_components.vanPagination, ]} */ ;
        // @ts-ignore
        VanPagination;
        // @ts-ignore
        const __VLS_90 = __VLS_asFunctionalComponent(__VLS_89, new __VLS_89({
            ...{ 'onChange': {} },
            modelValue: (__VLS_ctx.currentPage),
            totalItems: (__VLS_ctx.totalReturnedRecords),
            mode: "simple",
            itemsPerPage: (5),
            ...{ class: "pagination" },
        }));
        const __VLS_91 = __VLS_90({
            ...{ 'onChange': {} },
            modelValue: (__VLS_ctx.currentPage),
            totalItems: (__VLS_ctx.totalReturnedRecords),
            mode: "simple",
            itemsPerPage: (5),
            ...{ class: "pagination" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_90));
        let __VLS_93;
        let __VLS_94;
        const __VLS_95 = ({ change: {} },
            { onChange: (__VLS_ctx.handlePageChange) });
        const { default: __VLS_96 } = __VLS_92.slots;
        // @ts-ignore
        [currentPage, totalReturnedRecords, handlePageChange,];
        {
            const { 'prev-text': __VLS_97 } = __VLS_92.slots;
            const __VLS_98 = {}.VanIcon;
            /** @type {[typeof __VLS_components.VanIcon, typeof __VLS_components.vanIcon, ]} */ ;
            // @ts-ignore
            VanIcon;
            // @ts-ignore
            const __VLS_99 = __VLS_asFunctionalComponent(__VLS_98, new __VLS_98({
                name: "arrow-left",
            }));
            const __VLS_100 = __VLS_99({
                name: "arrow-left",
            }, ...__VLS_functionalComponentArgsRest(__VLS_99));
        }
        {
            const { 'next-text': __VLS_103 } = __VLS_92.slots;
            const __VLS_104 = {}.VanIcon;
            /** @type {[typeof __VLS_components.VanIcon, typeof __VLS_components.vanIcon, ]} */ ;
            // @ts-ignore
            VanIcon;
            // @ts-ignore
            const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({
                name: "arrow",
            }));
            const __VLS_106 = __VLS_105({
                name: "arrow",
            }, ...__VLS_functionalComponentArgsRest(__VLS_105));
        }
        var __VLS_92;
    }
    var __VLS_55;
    var __VLS_50;
}
if (__VLS_ctx.maintenanceLoading) {
    // @ts-ignore
    [maintenanceLoading,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "skeleton-container" },
    });
    for (const [n] of __VLS_getVForSourceType((3))) {
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
            ...{ class: "skeleton-time" },
        });
    }
}
else {
    const __VLS_109 = {}.VanCollapse;
    /** @type {[typeof __VLS_components.VanCollapse, typeof __VLS_components.vanCollapse, typeof __VLS_components.VanCollapse, typeof __VLS_components.vanCollapse, ]} */ ;
    // @ts-ignore
    VanCollapse;
    // @ts-ignore
    const __VLS_110 = __VLS_asFunctionalComponent(__VLS_109, new __VLS_109({
        modelValue: (__VLS_ctx.activeCollapse),
        ...{ class: "device-collapse" },
    }));
    const __VLS_111 = __VLS_110({
        modelValue: (__VLS_ctx.activeCollapse),
        ...{ class: "device-collapse" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_110));
    const { default: __VLS_113 } = __VLS_112.slots;
    // @ts-ignore
    [activeCollapse,];
    const __VLS_114 = {}.VanCollapseItem;
    /** @type {[typeof __VLS_components.VanCollapseItem, typeof __VLS_components.vanCollapseItem, typeof __VLS_components.VanCollapseItem, typeof __VLS_components.vanCollapseItem, ]} */ ;
    // @ts-ignore
    VanCollapseItem;
    // @ts-ignore
    const __VLS_115 = __VLS_asFunctionalComponent(__VLS_114, new __VLS_114({
        title: "Maintenance Reports",
        name: "maintenance",
        disabled: (__VLS_ctx.maintenanceRecords.length === 0),
    }));
    const __VLS_116 = __VLS_115({
        title: "Maintenance Reports",
        name: "maintenance",
        disabled: (__VLS_ctx.maintenanceRecords.length === 0),
    }, ...__VLS_functionalComponentArgsRest(__VLS_115));
    const { default: __VLS_118 } = __VLS_117.slots;
    // @ts-ignore
    [maintenanceRecords,];
    {
        const { title: __VLS_119 } = __VLS_117.slots;
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
        const __VLS_120 = {}.VanTag;
        /** @type {[typeof __VLS_components.VanTag, typeof __VLS_components.vanTag, typeof __VLS_components.VanTag, typeof __VLS_components.vanTag, ]} */ ;
        // @ts-ignore
        VanTag;
        // @ts-ignore
        const __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120({
            type: "warning",
            ...{ style: {} },
        }));
        const __VLS_122 = __VLS_121({
            type: "warning",
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_121));
        const { default: __VLS_124 } = __VLS_123.slots;
        (__VLS_ctx.maintenanceRecords.length);
        // @ts-ignore
        [maintenanceRecords,];
        var __VLS_123;
    }
    if (__VLS_ctx.maintenanceRecords.length === 0) {
        // @ts-ignore
        [maintenanceRecords,];
        const __VLS_125 = {}.VanEmpty;
        /** @type {[typeof __VLS_components.VanEmpty, typeof __VLS_components.vanEmpty, ]} */ ;
        // @ts-ignore
        VanEmpty;
        // @ts-ignore
        const __VLS_126 = __VLS_asFunctionalComponent(__VLS_125, new __VLS_125({
            description: "No maintenance reports",
        }));
        const __VLS_127 = __VLS_126({
            description: "No maintenance reports",
        }, ...__VLS_functionalComponentArgsRest(__VLS_126));
    }
    else {
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({});
        for (const [record] of __VLS_getVForSourceType((__VLS_ctx.maintenanceRecords))) {
            // @ts-ignore
            [maintenanceRecords,];
            const __VLS_130 = {}.VanCard;
            /** @type {[typeof __VLS_components.VanCard, typeof __VLS_components.vanCard, typeof __VLS_components.VanCard, typeof __VLS_components.vanCard, ]} */ ;
            // @ts-ignore
            VanCard;
            // @ts-ignore
            const __VLS_131 = __VLS_asFunctionalComponent(__VLS_130, new __VLS_130({
                key: (record.id),
                title: (record.deviceName || 'Unknown Device'),
                desc: (record.description || 'No description'),
                thumb: (record.image || 'https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg'),
                ...{ class: "device-card maintenance-card" },
            }));
            const __VLS_132 = __VLS_131({
                key: (record.id),
                title: (record.deviceName || 'Unknown Device'),
                desc: (record.description || 'No description'),
                thumb: (record.image || 'https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg'),
                ...{ class: "device-card maintenance-card" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_131));
            const { default: __VLS_134 } = __VLS_133.slots;
            {
                const { footer: __VLS_135 } = __VLS_133.slots;
                const __VLS_136 = {}.VanTag;
                /** @type {[typeof __VLS_components.VanTag, typeof __VLS_components.vanTag, typeof __VLS_components.VanTag, typeof __VLS_components.vanTag, ]} */ ;
                // @ts-ignore
                VanTag;
                // @ts-ignore
                const __VLS_137 = __VLS_asFunctionalComponent(__VLS_136, new __VLS_136({
                    type: __VLS_ctx.getMaintenanceStatusType(record.status),
                }));
                const __VLS_138 = __VLS_137({
                    type: __VLS_ctx.getMaintenanceStatusType(record.status),
                }, ...__VLS_functionalComponentArgsRest(__VLS_137));
                const { default: __VLS_140 } = __VLS_139.slots;
                // @ts-ignore
                [getMaintenanceStatusType,];
                (__VLS_ctx.getMaintenanceStatusText(record.status));
                // @ts-ignore
                [getMaintenanceStatusText,];
                var __VLS_139;
                __VLS_asFunctionalElement(__VLS_elements.br)({});
                const __VLS_141 = {}.VanTag;
                /** @type {[typeof __VLS_components.VanTag, typeof __VLS_components.vanTag, typeof __VLS_components.VanTag, typeof __VLS_components.vanTag, ]} */ ;
                // @ts-ignore
                VanTag;
                // @ts-ignore
                const __VLS_142 = __VLS_asFunctionalComponent(__VLS_141, new __VLS_141({
                    type: "default",
                }));
                const __VLS_143 = __VLS_142({
                    type: "default",
                }, ...__VLS_functionalComponentArgsRest(__VLS_142));
                const { default: __VLS_145 } = __VLS_144.slots;
                (__VLS_ctx.formatDate(record.createTime));
                // @ts-ignore
                [formatDate,];
                var __VLS_144;
                __VLS_asFunctionalElement(__VLS_elements.br)({});
                if (record.updateTime) {
                    const __VLS_146 = {}.VanTag;
                    /** @type {[typeof __VLS_components.VanTag, typeof __VLS_components.vanTag, typeof __VLS_components.VanTag, typeof __VLS_components.vanTag, ]} */ ;
                    // @ts-ignore
                    VanTag;
                    // @ts-ignore
                    const __VLS_147 = __VLS_asFunctionalComponent(__VLS_146, new __VLS_146({
                        type: "default",
                    }));
                    const __VLS_148 = __VLS_147({
                        type: "default",
                    }, ...__VLS_functionalComponentArgsRest(__VLS_147));
                    const { default: __VLS_150 } = __VLS_149.slots;
                    (__VLS_ctx.formatDate(record.updateTime));
                    // @ts-ignore
                    [formatDate,];
                    var __VLS_149;
                }
            }
            var __VLS_133;
        }
    }
    var __VLS_117;
    var __VLS_112;
}
/** @type {__VLS_StyleScopedClasses['home-page']} */ ;
/** @type {__VLS_StyleScopedClasses['borrow-overview']} */ ;
/** @type {__VLS_StyleScopedClasses['circles-section']} */ ;
/** @type {__VLS_StyleScopedClasses['circle-item']} */ ;
/** @type {__VLS_StyleScopedClasses['circle-label']} */ ;
/** @type {__VLS_StyleScopedClasses['info-section']} */ ;
/** @type {__VLS_StyleScopedClasses['info-title']} */ ;
/** @type {__VLS_StyleScopedClasses['info-content']} */ ;
/** @type {__VLS_StyleScopedClasses['info-row']} */ ;
/** @type {__VLS_StyleScopedClasses['info-item']} */ ;
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['value']} */ ;
/** @type {__VLS_StyleScopedClasses['info-item']} */ ;
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['value']} */ ;
/** @type {__VLS_StyleScopedClasses['info-row']} */ ;
/** @type {__VLS_StyleScopedClasses['info-item']} */ ;
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['value']} */ ;
/** @type {__VLS_StyleScopedClasses['info-item']} */ ;
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['value-overdue']} */ ;
/** @type {__VLS_StyleScopedClasses['skeleton-container']} */ ;
/** @type {__VLS_StyleScopedClasses['skeleton-card']} */ ;
/** @type {__VLS_StyleScopedClasses['skeleton-thumb']} */ ;
/** @type {__VLS_StyleScopedClasses['skeleton-content']} */ ;
/** @type {__VLS_StyleScopedClasses['skeleton-title']} */ ;
/** @type {__VLS_StyleScopedClasses['skeleton-desc']} */ ;
/** @type {__VLS_StyleScopedClasses['skeleton-footer']} */ ;
/** @type {__VLS_StyleScopedClasses['skeleton-tag']} */ ;
/** @type {__VLS_StyleScopedClasses['skeleton-time']} */ ;
/** @type {__VLS_StyleScopedClasses['device-collapse']} */ ;
/** @type {__VLS_StyleScopedClasses['device-card']} */ ;
/** @type {__VLS_StyleScopedClasses['skeleton-container']} */ ;
/** @type {__VLS_StyleScopedClasses['skeleton-card']} */ ;
/** @type {__VLS_StyleScopedClasses['skeleton-thumb']} */ ;
/** @type {__VLS_StyleScopedClasses['skeleton-content']} */ ;
/** @type {__VLS_StyleScopedClasses['skeleton-title']} */ ;
/** @type {__VLS_StyleScopedClasses['skeleton-desc']} */ ;
/** @type {__VLS_StyleScopedClasses['skeleton-footer']} */ ;
/** @type {__VLS_StyleScopedClasses['skeleton-tag']} */ ;
/** @type {__VLS_StyleScopedClasses['skeleton-time']} */ ;
/** @type {__VLS_StyleScopedClasses['device-collapse']} */ ;
/** @type {__VLS_StyleScopedClasses['device-card']} */ ;
/** @type {__VLS_StyleScopedClasses['pagination']} */ ;
/** @type {__VLS_StyleScopedClasses['skeleton-container']} */ ;
/** @type {__VLS_StyleScopedClasses['skeleton-card']} */ ;
/** @type {__VLS_StyleScopedClasses['skeleton-thumb']} */ ;
/** @type {__VLS_StyleScopedClasses['skeleton-content']} */ ;
/** @type {__VLS_StyleScopedClasses['skeleton-title']} */ ;
/** @type {__VLS_StyleScopedClasses['skeleton-desc']} */ ;
/** @type {__VLS_StyleScopedClasses['skeleton-footer']} */ ;
/** @type {__VLS_StyleScopedClasses['skeleton-tag']} */ ;
/** @type {__VLS_StyleScopedClasses['skeleton-time']} */ ;
/** @type {__VLS_StyleScopedClasses['device-collapse']} */ ;
/** @type {__VLS_StyleScopedClasses['device-card']} */ ;
/** @type {__VLS_StyleScopedClasses['maintenance-card']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup: () => ({
        MaxBorrowedCount: MaxBorrowedCount,
        overdueCount: overdueCount,
        usingCount: usingCount,
        usingRecords: usingRecords,
        returnedRecords: returnedRecords,
        usingLoading: usingLoading,
        returnedLoading: returnedLoading,
        maintenanceRecords: maintenanceRecords,
        maintenanceLoading: maintenanceLoading,
        activeCollapse: activeCollapse,
        currentPage: currentPage,
        totalReturnedRecords: totalReturnedRecords,
        borrowRate: borrowRate,
        formatDate: formatDate,
        getMaintenanceStatusText: getMaintenanceStatusText,
        getMaintenanceStatusType: getMaintenanceStatusType,
        handlePageChange: handlePageChange,
    }),
});
export default (await import('vue')).defineComponent({});
; /* PartiallyEnd: #4569/main.vue */
