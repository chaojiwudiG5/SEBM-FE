import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { showNotify } from 'vant';
import { useUserStore } from '../../store/user';
const router = useRouter();
const userStore = useUserStore();
const userInfo = ref(null);
import { useRoute } from 'vue-router';
const route = useRoute();
onMounted(async () => {
    if (route.query.refresh === 'true') {
        //@ts-ignore
        await userStore.loadFromServer();
    }
    userInfo.value = userStore.userInfo;
});
const formatGender = (gender) => {
    if (gender === undefined)
        return 'N/A';
    return gender === 1 ? 'Male' : 'Female';
};
const formatStatus = (status) => {
    if (status === undefined)
        return 'N/A';
    return status === 0 ? 'Active' : 'Inactive';
};
const handleLogout = () => {
    try {
        //@ts-ignore
        userStore.clearUserInfo();
        router.push('/login');
    }
    catch (error) {
        showNotify('Logout failed');
    }
};
const navigateToEdit = (field, value) => {
    if (field === 'status')
        return;
    router.push({
        path: '/sebm/user/userinfoedit',
        query: {
            field,
            value: value?.toString() || '',
        },
    });
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "user-info-page" },
});
const __VLS_0 = {}.VanSkeleton;
/** @type {[typeof __VLS_components.VanSkeleton, typeof __VLS_components.vanSkeleton, ]} */ ;
// @ts-ignore
VanSkeleton;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    title: true,
    avatar: true,
    row: (5),
    loading: (!__VLS_ctx.userInfo),
}));
const __VLS_2 = __VLS_1({
    title: true,
    avatar: true,
    row: (5),
    loading: (!__VLS_ctx.userInfo),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
// @ts-ignore
[userInfo,];
if (__VLS_ctx.userInfo) {
    // @ts-ignore
    [userInfo,];
    const __VLS_5 = {}.VanCellGroup;
    /** @type {[typeof __VLS_components.VanCellGroup, typeof __VLS_components.vanCellGroup, typeof __VLS_components.VanCellGroup, typeof __VLS_components.vanCellGroup, ]} */ ;
    // @ts-ignore
    VanCellGroup;
    // @ts-ignore
    const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({
        inset: true,
    }));
    const __VLS_7 = __VLS_6({
        inset: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_6));
    const { default: __VLS_9 } = __VLS_8.slots;
    const __VLS_10 = {}.VanCell;
    /** @type {[typeof __VLS_components.VanCell, typeof __VLS_components.vanCell, typeof __VLS_components.VanCell, typeof __VLS_components.vanCell, ]} */ ;
    // @ts-ignore
    VanCell;
    // @ts-ignore
    const __VLS_11 = __VLS_asFunctionalComponent(__VLS_10, new __VLS_10({
        center: true,
    }));
    const __VLS_12 = __VLS_11({
        center: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_11));
    const { default: __VLS_14 } = __VLS_13.slots;
    {
        const { 'right-icon': __VLS_15 } = __VLS_13.slots;
        const __VLS_16 = {}.VanImage;
        /** @type {[typeof __VLS_components.VanImage, typeof __VLS_components.vanImage, ]} */ ;
        // @ts-ignore
        VanImage;
        // @ts-ignore
        const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
            round: true,
            width: "80",
            height: "80",
            src: (__VLS_ctx.userInfo.avatarUrl ||
                'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'),
            ...{ style: {} },
        }));
        const __VLS_18 = __VLS_17({
            round: true,
            width: "80",
            height: "80",
            src: (__VLS_ctx.userInfo.avatarUrl ||
                'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'),
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_17));
        // @ts-ignore
        [userInfo,];
    }
    var __VLS_13;
    const __VLS_21 = {}.VanCell;
    /** @type {[typeof __VLS_components.VanCell, typeof __VLS_components.vanCell, ]} */ ;
    // @ts-ignore
    VanCell;
    // @ts-ignore
    const __VLS_22 = __VLS_asFunctionalComponent(__VLS_21, new __VLS_21({
        ...{ 'onClick': {} },
        title: "Username",
        value: (__VLS_ctx.userInfo.username),
        isLink: true,
    }));
    const __VLS_23 = __VLS_22({
        ...{ 'onClick': {} },
        title: "Username",
        value: (__VLS_ctx.userInfo.username),
        isLink: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_22));
    let __VLS_25;
    let __VLS_26;
    const __VLS_27 = ({ click: {} },
        { onClick: (...[$event]) => {
                if (!(__VLS_ctx.userInfo))
                    return;
                __VLS_ctx.navigateToEdit('username', __VLS_ctx.userInfo.username);
                // @ts-ignore
                [userInfo, userInfo, navigateToEdit,];
            } });
    var __VLS_24;
    const __VLS_29 = {}.VanCell;
    /** @type {[typeof __VLS_components.VanCell, typeof __VLS_components.vanCell, ]} */ ;
    // @ts-ignore
    VanCell;
    // @ts-ignore
    const __VLS_30 = __VLS_asFunctionalComponent(__VLS_29, new __VLS_29({
        ...{ 'onClick': {} },
        title: "Email",
        value: (__VLS_ctx.userInfo.email || 'N/A'),
        isLink: true,
    }));
    const __VLS_31 = __VLS_30({
        ...{ 'onClick': {} },
        title: "Email",
        value: (__VLS_ctx.userInfo.email || 'N/A'),
        isLink: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_30));
    let __VLS_33;
    let __VLS_34;
    const __VLS_35 = ({ click: {} },
        { onClick: (...[$event]) => {
                if (!(__VLS_ctx.userInfo))
                    return;
                __VLS_ctx.navigateToEdit('email', __VLS_ctx.userInfo.email);
                // @ts-ignore
                [userInfo, userInfo, navigateToEdit,];
            } });
    var __VLS_32;
    const __VLS_37 = {}.VanCell;
    /** @type {[typeof __VLS_components.VanCell, typeof __VLS_components.vanCell, ]} */ ;
    // @ts-ignore
    VanCell;
    // @ts-ignore
    const __VLS_38 = __VLS_asFunctionalComponent(__VLS_37, new __VLS_37({
        ...{ 'onClick': {} },
        title: "Phone",
        value: (__VLS_ctx.userInfo.phone || 'N/A'),
        isLink: true,
    }));
    const __VLS_39 = __VLS_38({
        ...{ 'onClick': {} },
        title: "Phone",
        value: (__VLS_ctx.userInfo.phone || 'N/A'),
        isLink: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_38));
    let __VLS_41;
    let __VLS_42;
    const __VLS_43 = ({ click: {} },
        { onClick: (...[$event]) => {
                if (!(__VLS_ctx.userInfo))
                    return;
                __VLS_ctx.navigateToEdit('phone', __VLS_ctx.userInfo.phone);
                // @ts-ignore
                [userInfo, userInfo, navigateToEdit,];
            } });
    var __VLS_40;
    const __VLS_45 = {}.VanCell;
    /** @type {[typeof __VLS_components.VanCell, typeof __VLS_components.vanCell, ]} */ ;
    // @ts-ignore
    VanCell;
    // @ts-ignore
    const __VLS_46 = __VLS_asFunctionalComponent(__VLS_45, new __VLS_45({
        ...{ 'onClick': {} },
        title: "Gender",
        value: (__VLS_ctx.formatGender(__VLS_ctx.userInfo.gender)),
        isLink: true,
    }));
    const __VLS_47 = __VLS_46({
        ...{ 'onClick': {} },
        title: "Gender",
        value: (__VLS_ctx.formatGender(__VLS_ctx.userInfo.gender)),
        isLink: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_46));
    let __VLS_49;
    let __VLS_50;
    const __VLS_51 = ({ click: {} },
        { onClick: (...[$event]) => {
                if (!(__VLS_ctx.userInfo))
                    return;
                __VLS_ctx.navigateToEdit('gender', __VLS_ctx.userInfo.gender);
                // @ts-ignore
                [userInfo, userInfo, navigateToEdit, formatGender,];
            } });
    var __VLS_48;
    const __VLS_53 = {}.VanCell;
    /** @type {[typeof __VLS_components.VanCell, typeof __VLS_components.vanCell, ]} */ ;
    // @ts-ignore
    VanCell;
    // @ts-ignore
    const __VLS_54 = __VLS_asFunctionalComponent(__VLS_53, new __VLS_53({
        ...{ 'onClick': {} },
        title: "Age",
        value: (__VLS_ctx.userInfo.age || 'N/A'),
        isLink: true,
    }));
    const __VLS_55 = __VLS_54({
        ...{ 'onClick': {} },
        title: "Age",
        value: (__VLS_ctx.userInfo.age || 'N/A'),
        isLink: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_54));
    let __VLS_57;
    let __VLS_58;
    const __VLS_59 = ({ click: {} },
        { onClick: (...[$event]) => {
                if (!(__VLS_ctx.userInfo))
                    return;
                __VLS_ctx.navigateToEdit('age', __VLS_ctx.userInfo.age);
                // @ts-ignore
                [userInfo, userInfo, navigateToEdit,];
            } });
    var __VLS_56;
    const __VLS_61 = {}.VanCell;
    /** @type {[typeof __VLS_components.VanCell, typeof __VLS_components.vanCell, ]} */ ;
    // @ts-ignore
    VanCell;
    // @ts-ignore
    const __VLS_62 = __VLS_asFunctionalComponent(__VLS_61, new __VLS_61({
        title: "Status",
        value: (__VLS_ctx.formatStatus(__VLS_ctx.userInfo.userStatus)),
    }));
    const __VLS_63 = __VLS_62({
        title: "Status",
        value: (__VLS_ctx.formatStatus(__VLS_ctx.userInfo.userStatus)),
    }, ...__VLS_functionalComponentArgsRest(__VLS_62));
    // @ts-ignore
    [userInfo, formatStatus,];
    var __VLS_8;
}
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "action-buttons" },
});
const __VLS_66 = {}.VanButton;
/** @type {[typeof __VLS_components.VanButton, typeof __VLS_components.vanButton, typeof __VLS_components.VanButton, typeof __VLS_components.vanButton, ]} */ ;
// @ts-ignore
VanButton;
// @ts-ignore
const __VLS_67 = __VLS_asFunctionalComponent(__VLS_66, new __VLS_66({
    ...{ 'onClick': {} },
    type: "danger",
    block: true,
    round: true,
    size: "large",
    ...{ class: "logout-btn" },
}));
const __VLS_68 = __VLS_67({
    ...{ 'onClick': {} },
    type: "danger",
    block: true,
    round: true,
    size: "large",
    ...{ class: "logout-btn" },
}, ...__VLS_functionalComponentArgsRest(__VLS_67));
let __VLS_70;
let __VLS_71;
const __VLS_72 = ({ click: {} },
    { onClick: (__VLS_ctx.handleLogout) });
const { default: __VLS_73 } = __VLS_69.slots;
// @ts-ignore
[handleLogout,];
var __VLS_69;
/** @type {__VLS_StyleScopedClasses['user-info-page']} */ ;
/** @type {__VLS_StyleScopedClasses['action-buttons']} */ ;
/** @type {__VLS_StyleScopedClasses['logout-btn']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup: () => ({
        userInfo: userInfo,
        formatGender: formatGender,
        formatStatus: formatStatus,
        handleLogout: handleLogout,
        navigateToEdit: navigateToEdit,
    }),
});
export default (await import('vue')).defineComponent({});
; /* PartiallyEnd: #4569/main.vue */
