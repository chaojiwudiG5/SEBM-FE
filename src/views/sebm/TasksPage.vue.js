import { ref, onMounted } from 'vue';
import { useUserStore } from '../../store/user';
import { listMyTasks } from '../../api/mechanicanMaintenanceRecord';
const userStore = useUserStore();
// 任务数据
const inProgressTasks = ref([]);
const completedTasks = ref([]);
const inProgressLoading = ref(false);
const completedLoading = ref(false);
// 折叠面板控制
const activeCollapse = ref([]);
// 分页相关数据
const inProgressPage = ref(1);
const completedPage = ref(1);
const inProgressPageSize = 5;
const completedPageSize = 5;
const inProgressTotal = ref(0);
const completedTotal = ref(0);
// 计算哪些面板应该展开
const updateActiveCollapse = () => {
    const active = [];
    if (inProgressTasks.value.length > 0) {
        active.push('inProgress');
    }
    if (completedTasks.value.length > 0) {
        active.push('completed');
    }
    activeCollapse.value = active;
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
// 获取任务状态文本
const getTaskStatusText = (status) => {
    switch (status) {
        case 1: return 'In Progress';
        case 2: return 'Fixed';
        case 3: return 'Scrapped';
        default: return 'Unknown';
    }
};
// 获取任务状态标签类型
const getTaskStatusType = (status) => {
    switch (status) {
        case 1: return 'primary';
        case 2: return 'success';
        case 3: return 'danger';
        default: return 'default';
    }
};
// 获取处理中的任务列表
const fetchInProgressTasks = async (page = 1) => {
    if (!userStore.userInfo?.id) {
        console.log('User ID is not available for in-progress tasks:', userStore.userInfo);
        return;
    }
    inProgressLoading.value = true;
    try {
        console.log('Fetching in-progress tasks for page:', page);
        const response = await listMyTasks({
            pageNumber: page,
            pageSize: inProgressPageSize,
            deviceId: undefined,
            status: 1 // 处理中状态
        });
        console.log('In-progress tasks response:', response);
        if (response) {
            if (page === 1) {
                inProgressTasks.value = response.records || [];
            }
            else {
                inProgressTasks.value = [...inProgressTasks.value, ...(response.records || [])];
            }
            inProgressTotal.value = response.total || 0;
            inProgressPage.value = page;
            console.log('In-progress tasks set:', inProgressTasks.value);
        }
        else {
            console.log('API returned error or no data for in-progress tasks:', response);
        }
    }
    catch (error) {
        console.error('Failed to get in-progress tasks:', error);
    }
    finally {
        inProgressLoading.value = false;
        updateActiveCollapse();
    }
};
// 获取已完成的任务列表
const fetchCompletedTasks = async (page = 1) => {
    if (!userStore.userInfo?.id) {
        console.log('User ID is not available for completed tasks:', userStore.userInfo);
        return;
    }
    completedLoading.value = true;
    try {
        console.log('Fetching completed tasks for page:', page);
        // 获取状态为2（修复成功）或3（报废）的任务
        const response = await listMyTasks({
            pageNumber: page,
            pageSize: completedPageSize,
            deviceId: undefined,
            status: undefined // 获取所有状态，然后在前端过滤
        });
        console.log('All tasks response:', response);
        if (response) {
            // 过滤出状态为2或3的任务
            const completedRecords = (response.records || []).filter((task) => task.status === 2 || task.status === 3);
            if (page === 1) {
                completedTasks.value = completedRecords;
            }
            else {
                completedTasks.value = [...completedTasks.value, ...completedRecords];
            }
            completedTotal.value = completedRecords.length;
            completedPage.value = page;
            console.log('Completed tasks set:', completedTasks.value);
        }
        else {
            console.log('API returned error or no data for completed tasks:', response);
        }
    }
    catch (error) {
        console.error('Failed to get completed tasks:', error);
    }
    finally {
        completedLoading.value = false;
        updateActiveCollapse();
    }
};
// 处理分页变化
const handleInProgressPageChange = (page) => {
    fetchInProgressTasks(page);
};
const handleCompletedPageChange = (page) => {
    fetchCompletedTasks(page);
};
// 页面加载时获取数据
onMounted(async () => {
    console.log('TasksPage mounted, user info:', userStore.userInfo);
    // 确保用户信息已加载
    if (!userStore.userInfo?.id) {
        console.log('User info not available, trying to load from server...');
        await userStore.loadFromServer();
        console.log('User info after loading:', userStore.userInfo);
    }
    if (userStore.userInfo?.id) {
        await Promise.all([
            fetchInProgressTasks(1),
            fetchCompletedTasks(1)
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
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "tasks-page" },
});
if (__VLS_ctx.inProgressLoading) {
    // @ts-ignore
    [inProgressLoading,];
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
    const __VLS_0 = {}.VanCollapse;
    /** @type {[typeof __VLS_components.VanCollapse, typeof __VLS_components.vanCollapse, typeof __VLS_components.VanCollapse, typeof __VLS_components.vanCollapse, ]} */ ;
    // @ts-ignore
    VanCollapse;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        modelValue: (__VLS_ctx.activeCollapse),
        ...{ class: "task-collapse" },
    }));
    const __VLS_2 = __VLS_1({
        modelValue: (__VLS_ctx.activeCollapse),
        ...{ class: "task-collapse" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    const { default: __VLS_4 } = __VLS_3.slots;
    // @ts-ignore
    [activeCollapse,];
    const __VLS_5 = {}.VanCollapseItem;
    /** @type {[typeof __VLS_components.VanCollapseItem, typeof __VLS_components.vanCollapseItem, typeof __VLS_components.VanCollapseItem, typeof __VLS_components.vanCollapseItem, ]} */ ;
    // @ts-ignore
    VanCollapseItem;
    // @ts-ignore
    const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({
        title: "In Progress Tasks",
        name: "inProgress",
        disabled: (__VLS_ctx.inProgressTasks.length === 0),
    }));
    const __VLS_7 = __VLS_6({
        title: "In Progress Tasks",
        name: "inProgress",
        disabled: (__VLS_ctx.inProgressTasks.length === 0),
    }, ...__VLS_functionalComponentArgsRest(__VLS_6));
    const { default: __VLS_9 } = __VLS_8.slots;
    // @ts-ignore
    [inProgressTasks,];
    {
        const { title: __VLS_10 } = __VLS_8.slots;
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
        const __VLS_11 = {}.VanTag;
        /** @type {[typeof __VLS_components.VanTag, typeof __VLS_components.vanTag, typeof __VLS_components.VanTag, typeof __VLS_components.vanTag, ]} */ ;
        // @ts-ignore
        VanTag;
        // @ts-ignore
        const __VLS_12 = __VLS_asFunctionalComponent(__VLS_11, new __VLS_11({
            type: "primary",
            ...{ style: {} },
        }));
        const __VLS_13 = __VLS_12({
            type: "primary",
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_12));
        const { default: __VLS_15 } = __VLS_14.slots;
        (__VLS_ctx.inProgressTasks.length);
        // @ts-ignore
        [inProgressTasks,];
        var __VLS_14;
    }
    if (__VLS_ctx.inProgressTasks.length === 0) {
        // @ts-ignore
        [inProgressTasks,];
        const __VLS_16 = {}.VanEmpty;
        /** @type {[typeof __VLS_components.VanEmpty, typeof __VLS_components.vanEmpty, ]} */ ;
        // @ts-ignore
        VanEmpty;
        // @ts-ignore
        const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
            description: "No in progress tasks",
        }));
        const __VLS_18 = __VLS_17({
            description: "No in progress tasks",
        }, ...__VLS_functionalComponentArgsRest(__VLS_17));
    }
    else {
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({});
        for (const [task] of __VLS_getVForSourceType((__VLS_ctx.inProgressTasks))) {
            // @ts-ignore
            [inProgressTasks,];
            const __VLS_21 = {}.VanCard;
            /** @type {[typeof __VLS_components.VanCard, typeof __VLS_components.vanCard, typeof __VLS_components.VanCard, typeof __VLS_components.vanCard, ]} */ ;
            // @ts-ignore
            VanCard;
            // @ts-ignore
            const __VLS_22 = __VLS_asFunctionalComponent(__VLS_21, new __VLS_21({
                key: (task.id),
                title: (`Device ID: ${task.deviceId}`),
                desc: (task.description || 'No description'),
                thumb: (task.image || 'https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg'),
                ...{ class: "task-card in-progress-card" },
            }));
            const __VLS_23 = __VLS_22({
                key: (task.id),
                title: (`Device ID: ${task.deviceId}`),
                desc: (task.description || 'No description'),
                thumb: (task.image || 'https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg'),
                ...{ class: "task-card in-progress-card" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_22));
            const { default: __VLS_25 } = __VLS_24.slots;
            {
                const { footer: __VLS_26 } = __VLS_24.slots;
                const __VLS_27 = {}.VanTag;
                /** @type {[typeof __VLS_components.VanTag, typeof __VLS_components.vanTag, typeof __VLS_components.VanTag, typeof __VLS_components.vanTag, ]} */ ;
                // @ts-ignore
                VanTag;
                // @ts-ignore
                const __VLS_28 = __VLS_asFunctionalComponent(__VLS_27, new __VLS_27({
                    type: __VLS_ctx.getTaskStatusType(task.status),
                }));
                const __VLS_29 = __VLS_28({
                    type: __VLS_ctx.getTaskStatusType(task.status),
                }, ...__VLS_functionalComponentArgsRest(__VLS_28));
                const { default: __VLS_31 } = __VLS_30.slots;
                // @ts-ignore
                [getTaskStatusType,];
                (__VLS_ctx.getTaskStatusText(task.status));
                // @ts-ignore
                [getTaskStatusText,];
                var __VLS_30;
                __VLS_asFunctionalElement(__VLS_elements.br)({});
                const __VLS_32 = {}.VanTag;
                /** @type {[typeof __VLS_components.VanTag, typeof __VLS_components.vanTag, typeof __VLS_components.VanTag, typeof __VLS_components.vanTag, ]} */ ;
                // @ts-ignore
                VanTag;
                // @ts-ignore
                const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
                    type: "default",
                }));
                const __VLS_34 = __VLS_33({
                    type: "default",
                }, ...__VLS_functionalComponentArgsRest(__VLS_33));
                const { default: __VLS_36 } = __VLS_35.slots;
                (__VLS_ctx.formatDate(task.createTime));
                // @ts-ignore
                [formatDate,];
                var __VLS_35;
                __VLS_asFunctionalElement(__VLS_elements.br)({});
                if (task.updateTime) {
                    const __VLS_37 = {}.VanTag;
                    /** @type {[typeof __VLS_components.VanTag, typeof __VLS_components.vanTag, typeof __VLS_components.VanTag, typeof __VLS_components.vanTag, ]} */ ;
                    // @ts-ignore
                    VanTag;
                    // @ts-ignore
                    const __VLS_38 = __VLS_asFunctionalComponent(__VLS_37, new __VLS_37({
                        type: "default",
                    }));
                    const __VLS_39 = __VLS_38({
                        type: "default",
                    }, ...__VLS_functionalComponentArgsRest(__VLS_38));
                    const { default: __VLS_41 } = __VLS_40.slots;
                    (__VLS_ctx.formatDate(task.updateTime));
                    // @ts-ignore
                    [formatDate,];
                    var __VLS_40;
                }
            }
            var __VLS_24;
        }
        const __VLS_42 = {}.VanPagination;
        /** @type {[typeof __VLS_components.VanPagination, typeof __VLS_components.vanPagination, typeof __VLS_components.VanPagination, typeof __VLS_components.vanPagination, ]} */ ;
        // @ts-ignore
        VanPagination;
        // @ts-ignore
        const __VLS_43 = __VLS_asFunctionalComponent(__VLS_42, new __VLS_42({
            ...{ 'onChange': {} },
            modelValue: (__VLS_ctx.inProgressPage),
            totalItems: (__VLS_ctx.inProgressTotal),
            mode: "simple",
            itemsPerPage: (__VLS_ctx.inProgressPageSize),
            ...{ class: "pagination" },
        }));
        const __VLS_44 = __VLS_43({
            ...{ 'onChange': {} },
            modelValue: (__VLS_ctx.inProgressPage),
            totalItems: (__VLS_ctx.inProgressTotal),
            mode: "simple",
            itemsPerPage: (__VLS_ctx.inProgressPageSize),
            ...{ class: "pagination" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_43));
        let __VLS_46;
        let __VLS_47;
        const __VLS_48 = ({ change: {} },
            { onChange: (__VLS_ctx.handleInProgressPageChange) });
        const { default: __VLS_49 } = __VLS_45.slots;
        // @ts-ignore
        [inProgressPage, inProgressTotal, inProgressPageSize, handleInProgressPageChange,];
        {
            const { 'prev-text': __VLS_50 } = __VLS_45.slots;
            const __VLS_51 = {}.VanIcon;
            /** @type {[typeof __VLS_components.VanIcon, typeof __VLS_components.vanIcon, ]} */ ;
            // @ts-ignore
            VanIcon;
            // @ts-ignore
            const __VLS_52 = __VLS_asFunctionalComponent(__VLS_51, new __VLS_51({
                name: "arrow-left",
            }));
            const __VLS_53 = __VLS_52({
                name: "arrow-left",
            }, ...__VLS_functionalComponentArgsRest(__VLS_52));
        }
        {
            const { 'next-text': __VLS_56 } = __VLS_45.slots;
            const __VLS_57 = {}.VanIcon;
            /** @type {[typeof __VLS_components.VanIcon, typeof __VLS_components.vanIcon, ]} */ ;
            // @ts-ignore
            VanIcon;
            // @ts-ignore
            const __VLS_58 = __VLS_asFunctionalComponent(__VLS_57, new __VLS_57({
                name: "arrow",
            }));
            const __VLS_59 = __VLS_58({
                name: "arrow",
            }, ...__VLS_functionalComponentArgsRest(__VLS_58));
        }
        var __VLS_45;
    }
    var __VLS_8;
    var __VLS_3;
}
if (__VLS_ctx.completedLoading) {
    // @ts-ignore
    [completedLoading,];
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
    const __VLS_62 = {}.VanCollapse;
    /** @type {[typeof __VLS_components.VanCollapse, typeof __VLS_components.vanCollapse, typeof __VLS_components.VanCollapse, typeof __VLS_components.vanCollapse, ]} */ ;
    // @ts-ignore
    VanCollapse;
    // @ts-ignore
    const __VLS_63 = __VLS_asFunctionalComponent(__VLS_62, new __VLS_62({
        modelValue: (__VLS_ctx.activeCollapse),
        ...{ class: "task-collapse" },
    }));
    const __VLS_64 = __VLS_63({
        modelValue: (__VLS_ctx.activeCollapse),
        ...{ class: "task-collapse" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_63));
    const { default: __VLS_66 } = __VLS_65.slots;
    // @ts-ignore
    [activeCollapse,];
    const __VLS_67 = {}.VanCollapseItem;
    /** @type {[typeof __VLS_components.VanCollapseItem, typeof __VLS_components.vanCollapseItem, typeof __VLS_components.VanCollapseItem, typeof __VLS_components.vanCollapseItem, ]} */ ;
    // @ts-ignore
    VanCollapseItem;
    // @ts-ignore
    const __VLS_68 = __VLS_asFunctionalComponent(__VLS_67, new __VLS_67({
        title: "Completed Tasks",
        name: "completed",
        disabled: (__VLS_ctx.completedTasks.length === 0),
    }));
    const __VLS_69 = __VLS_68({
        title: "Completed Tasks",
        name: "completed",
        disabled: (__VLS_ctx.completedTasks.length === 0),
    }, ...__VLS_functionalComponentArgsRest(__VLS_68));
    const { default: __VLS_71 } = __VLS_70.slots;
    // @ts-ignore
    [completedTasks,];
    {
        const { title: __VLS_72 } = __VLS_70.slots;
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
        const __VLS_73 = {}.VanTag;
        /** @type {[typeof __VLS_components.VanTag, typeof __VLS_components.vanTag, typeof __VLS_components.VanTag, typeof __VLS_components.vanTag, ]} */ ;
        // @ts-ignore
        VanTag;
        // @ts-ignore
        const __VLS_74 = __VLS_asFunctionalComponent(__VLS_73, new __VLS_73({
            type: "success",
            ...{ style: {} },
        }));
        const __VLS_75 = __VLS_74({
            type: "success",
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_74));
        const { default: __VLS_77 } = __VLS_76.slots;
        (__VLS_ctx.completedTasks.length);
        // @ts-ignore
        [completedTasks,];
        var __VLS_76;
    }
    if (__VLS_ctx.completedTasks.length === 0) {
        // @ts-ignore
        [completedTasks,];
        const __VLS_78 = {}.VanEmpty;
        /** @type {[typeof __VLS_components.VanEmpty, typeof __VLS_components.vanEmpty, ]} */ ;
        // @ts-ignore
        VanEmpty;
        // @ts-ignore
        const __VLS_79 = __VLS_asFunctionalComponent(__VLS_78, new __VLS_78({
            description: "No completed tasks",
        }));
        const __VLS_80 = __VLS_79({
            description: "No completed tasks",
        }, ...__VLS_functionalComponentArgsRest(__VLS_79));
    }
    else {
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({});
        for (const [task] of __VLS_getVForSourceType((__VLS_ctx.completedTasks))) {
            // @ts-ignore
            [completedTasks,];
            const __VLS_83 = {}.VanCard;
            /** @type {[typeof __VLS_components.VanCard, typeof __VLS_components.vanCard, typeof __VLS_components.VanCard, typeof __VLS_components.vanCard, ]} */ ;
            // @ts-ignore
            VanCard;
            // @ts-ignore
            const __VLS_84 = __VLS_asFunctionalComponent(__VLS_83, new __VLS_83({
                key: (task.id),
                title: (`Device ID: ${task.deviceId}`),
                desc: (task.description || 'No description'),
                thumb: (task.image || 'https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg'),
                ...{ class: "task-card completed-card" },
            }));
            const __VLS_85 = __VLS_84({
                key: (task.id),
                title: (`Device ID: ${task.deviceId}`),
                desc: (task.description || 'No description'),
                thumb: (task.image || 'https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg'),
                ...{ class: "task-card completed-card" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_84));
            const { default: __VLS_87 } = __VLS_86.slots;
            {
                const { footer: __VLS_88 } = __VLS_86.slots;
                const __VLS_89 = {}.VanTag;
                /** @type {[typeof __VLS_components.VanTag, typeof __VLS_components.vanTag, typeof __VLS_components.VanTag, typeof __VLS_components.vanTag, ]} */ ;
                // @ts-ignore
                VanTag;
                // @ts-ignore
                const __VLS_90 = __VLS_asFunctionalComponent(__VLS_89, new __VLS_89({
                    type: __VLS_ctx.getTaskStatusType(task.status),
                }));
                const __VLS_91 = __VLS_90({
                    type: __VLS_ctx.getTaskStatusType(task.status),
                }, ...__VLS_functionalComponentArgsRest(__VLS_90));
                const { default: __VLS_93 } = __VLS_92.slots;
                // @ts-ignore
                [getTaskStatusType,];
                (__VLS_ctx.getTaskStatusText(task.status));
                // @ts-ignore
                [getTaskStatusText,];
                var __VLS_92;
                __VLS_asFunctionalElement(__VLS_elements.br)({});
                const __VLS_94 = {}.VanTag;
                /** @type {[typeof __VLS_components.VanTag, typeof __VLS_components.vanTag, typeof __VLS_components.VanTag, typeof __VLS_components.vanTag, ]} */ ;
                // @ts-ignore
                VanTag;
                // @ts-ignore
                const __VLS_95 = __VLS_asFunctionalComponent(__VLS_94, new __VLS_94({
                    type: "default",
                }));
                const __VLS_96 = __VLS_95({
                    type: "default",
                }, ...__VLS_functionalComponentArgsRest(__VLS_95));
                const { default: __VLS_98 } = __VLS_97.slots;
                (__VLS_ctx.formatDate(task.createTime));
                // @ts-ignore
                [formatDate,];
                var __VLS_97;
                __VLS_asFunctionalElement(__VLS_elements.br)({});
                if (task.updateTime) {
                    const __VLS_99 = {}.VanTag;
                    /** @type {[typeof __VLS_components.VanTag, typeof __VLS_components.vanTag, typeof __VLS_components.VanTag, typeof __VLS_components.vanTag, ]} */ ;
                    // @ts-ignore
                    VanTag;
                    // @ts-ignore
                    const __VLS_100 = __VLS_asFunctionalComponent(__VLS_99, new __VLS_99({
                        type: "default",
                    }));
                    const __VLS_101 = __VLS_100({
                        type: "default",
                    }, ...__VLS_functionalComponentArgsRest(__VLS_100));
                    const { default: __VLS_103 } = __VLS_102.slots;
                    (__VLS_ctx.formatDate(task.updateTime));
                    // @ts-ignore
                    [formatDate,];
                    var __VLS_102;
                }
            }
            var __VLS_86;
        }
        const __VLS_104 = {}.VanPagination;
        /** @type {[typeof __VLS_components.VanPagination, typeof __VLS_components.vanPagination, typeof __VLS_components.VanPagination, typeof __VLS_components.vanPagination, ]} */ ;
        // @ts-ignore
        VanPagination;
        // @ts-ignore
        const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({
            ...{ 'onChange': {} },
            modelValue: (__VLS_ctx.completedPage),
            totalItems: (__VLS_ctx.completedTotal),
            mode: "simple",
            itemsPerPage: (__VLS_ctx.completedPageSize),
            ...{ class: "pagination" },
        }));
        const __VLS_106 = __VLS_105({
            ...{ 'onChange': {} },
            modelValue: (__VLS_ctx.completedPage),
            totalItems: (__VLS_ctx.completedTotal),
            mode: "simple",
            itemsPerPage: (__VLS_ctx.completedPageSize),
            ...{ class: "pagination" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_105));
        let __VLS_108;
        let __VLS_109;
        const __VLS_110 = ({ change: {} },
            { onChange: (__VLS_ctx.handleCompletedPageChange) });
        const { default: __VLS_111 } = __VLS_107.slots;
        // @ts-ignore
        [completedPage, completedTotal, completedPageSize, handleCompletedPageChange,];
        {
            const { 'prev-text': __VLS_112 } = __VLS_107.slots;
            const __VLS_113 = {}.VanIcon;
            /** @type {[typeof __VLS_components.VanIcon, typeof __VLS_components.vanIcon, ]} */ ;
            // @ts-ignore
            VanIcon;
            // @ts-ignore
            const __VLS_114 = __VLS_asFunctionalComponent(__VLS_113, new __VLS_113({
                name: "arrow-left",
            }));
            const __VLS_115 = __VLS_114({
                name: "arrow-left",
            }, ...__VLS_functionalComponentArgsRest(__VLS_114));
        }
        {
            const { 'next-text': __VLS_118 } = __VLS_107.slots;
            const __VLS_119 = {}.VanIcon;
            /** @type {[typeof __VLS_components.VanIcon, typeof __VLS_components.vanIcon, ]} */ ;
            // @ts-ignore
            VanIcon;
            // @ts-ignore
            const __VLS_120 = __VLS_asFunctionalComponent(__VLS_119, new __VLS_119({
                name: "arrow",
            }));
            const __VLS_121 = __VLS_120({
                name: "arrow",
            }, ...__VLS_functionalComponentArgsRest(__VLS_120));
        }
        var __VLS_107;
    }
    var __VLS_70;
    var __VLS_65;
}
/** @type {__VLS_StyleScopedClasses['tasks-page']} */ ;
/** @type {__VLS_StyleScopedClasses['skeleton-container']} */ ;
/** @type {__VLS_StyleScopedClasses['skeleton-card']} */ ;
/** @type {__VLS_StyleScopedClasses['skeleton-thumb']} */ ;
/** @type {__VLS_StyleScopedClasses['skeleton-content']} */ ;
/** @type {__VLS_StyleScopedClasses['skeleton-title']} */ ;
/** @type {__VLS_StyleScopedClasses['skeleton-desc']} */ ;
/** @type {__VLS_StyleScopedClasses['skeleton-footer']} */ ;
/** @type {__VLS_StyleScopedClasses['skeleton-tag']} */ ;
/** @type {__VLS_StyleScopedClasses['skeleton-time']} */ ;
/** @type {__VLS_StyleScopedClasses['task-collapse']} */ ;
/** @type {__VLS_StyleScopedClasses['task-card']} */ ;
/** @type {__VLS_StyleScopedClasses['in-progress-card']} */ ;
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
/** @type {__VLS_StyleScopedClasses['task-collapse']} */ ;
/** @type {__VLS_StyleScopedClasses['task-card']} */ ;
/** @type {__VLS_StyleScopedClasses['completed-card']} */ ;
/** @type {__VLS_StyleScopedClasses['pagination']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup: () => ({
        inProgressTasks: inProgressTasks,
        completedTasks: completedTasks,
        inProgressLoading: inProgressLoading,
        completedLoading: completedLoading,
        activeCollapse: activeCollapse,
        inProgressPage: inProgressPage,
        completedPage: completedPage,
        inProgressPageSize: inProgressPageSize,
        completedPageSize: completedPageSize,
        inProgressTotal: inProgressTotal,
        completedTotal: completedTotal,
        formatDate: formatDate,
        getTaskStatusText: getTaskStatusText,
        getTaskStatusType: getTaskStatusType,
        handleInProgressPageChange: handleInProgressPageChange,
        handleCompletedPageChange: handleCompletedPageChange,
    }),
});
export default (await import('vue')).defineComponent({});
; /* PartiallyEnd: #4569/main.vue */
