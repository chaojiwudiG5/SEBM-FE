import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { userLogin } from '../api/user';
import { useUserStore } from '../store/user';
const router = useRouter();
const userStore = useUserStore();
const form = reactive({ username: '', password: '' });
const onSubmit = async () => {
    try {
        const userVo = await userLogin(form);
        console.log('Login response:', userVo);
        // 确保ID字段是字符串类型，避免精度丢失
        const processedUserVo = {
            ...userVo,
            //@ts-ignore
            id: userVo.id ? String(userVo.id) : userVo.id,
            //@ts-ignore
            userId: userVo.userId ? String(userVo.userId) : userVo.userId
        };
        //@ts-ignore
        userStore.setUserInfo(processedUserVo);
        // 根据用户角色跳转
        if (userStore.userInfo?.userRole === 2) {
            // 技工
            router.push('/sebm/mechanic/tasks');
        }
        else if (userStore.userInfo?.userRole === 0) {
            // 普通用户
            router.push('/sebm/user/home');
        }
        else if (userStore.userInfo?.userRole === 1) {
            // 管理员 - 暂时跳转到用户页面，后续可以添加管理员页面
            router.push('/sebm/user/home');
        }
        else {
            // 未知角色
            console.error('Unknown user role:', userStore.userInfo?.userRole);
            router.push('/login');
        }
    }
    catch (error) {
        console.error('Login failed:', error);
    }
};
const toRegister = () => {
    // 跳转到注册页面
    router.push('/register');
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
const __VLS_0 = {}.VanForm;
/** @type {[typeof __VLS_components.VanForm, typeof __VLS_components.vanForm, typeof __VLS_components.VanForm, typeof __VLS_components.vanForm, ]} */ ;
// @ts-ignore
VanForm;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ 'onSubmit': {} },
}));
const __VLS_2 = __VLS_1({
    ...{ 'onSubmit': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_4;
let __VLS_5;
const __VLS_6 = ({ submit: {} },
    { onSubmit: (__VLS_ctx.onSubmit) });
var __VLS_7 = {};
const { default: __VLS_8 } = __VLS_3.slots;
// @ts-ignore
[onSubmit,];
const __VLS_9 = {}.VanField;
/** @type {[typeof __VLS_components.VanField, typeof __VLS_components.vanField, ]} */ ;
// @ts-ignore
VanField;
// @ts-ignore
const __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({
    modelValue: (__VLS_ctx.form.username),
    label: "Username",
    placeholder: "Please enter your username",
    rules: ([{ required: true, message: 'Please enter your username' }]),
}));
const __VLS_11 = __VLS_10({
    modelValue: (__VLS_ctx.form.username),
    label: "Username",
    placeholder: "Please enter your username",
    rules: ([{ required: true, message: 'Please enter your username' }]),
}, ...__VLS_functionalComponentArgsRest(__VLS_10));
// @ts-ignore
[form,];
const __VLS_14 = {}.VanField;
/** @type {[typeof __VLS_components.VanField, typeof __VLS_components.vanField, ]} */ ;
// @ts-ignore
VanField;
// @ts-ignore
const __VLS_15 = __VLS_asFunctionalComponent(__VLS_14, new __VLS_14({
    label: "Password",
    placeholder: "Please enter your password",
    modelValue: (__VLS_ctx.form.password),
    type: "password",
    rules: ([{ required: true, message: 'Please enter your password' }]),
}));
const __VLS_16 = __VLS_15({
    label: "Password",
    placeholder: "Please enter your password",
    modelValue: (__VLS_ctx.form.password),
    type: "password",
    rules: ([{ required: true, message: 'Please enter your password' }]),
}, ...__VLS_functionalComponentArgsRest(__VLS_15));
// @ts-ignore
[form,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "button-group" },
});
const __VLS_19 = {}.VanButton;
/** @type {[typeof __VLS_components.VanButton, typeof __VLS_components.vanButton, typeof __VLS_components.VanButton, typeof __VLS_components.vanButton, ]} */ ;
// @ts-ignore
VanButton;
// @ts-ignore
const __VLS_20 = __VLS_asFunctionalComponent(__VLS_19, new __VLS_19({
    type: "primary",
    block: true,
    nativeType: "submit",
}));
const __VLS_21 = __VLS_20({
    type: "primary",
    block: true,
    nativeType: "submit",
}, ...__VLS_functionalComponentArgsRest(__VLS_20));
const { default: __VLS_23 } = __VLS_22.slots;
var __VLS_22;
const __VLS_24 = {}.VanButton;
/** @type {[typeof __VLS_components.VanButton, typeof __VLS_components.vanButton, typeof __VLS_components.VanButton, typeof __VLS_components.vanButton, ]} */ ;
// @ts-ignore
VanButton;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
    ...{ 'onClick': {} },
    type: "default",
    block: true,
    ...{ style: {} },
}));
const __VLS_26 = __VLS_25({
    ...{ 'onClick': {} },
    type: "default",
    block: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
let __VLS_28;
let __VLS_29;
const __VLS_30 = ({ click: {} },
    { onClick: (__VLS_ctx.toRegister) });
const { default: __VLS_31 } = __VLS_27.slots;
// @ts-ignore
[toRegister,];
var __VLS_27;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['button-group']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup: () => ({
        form: form,
        onSubmit: onSubmit,
        toRegister: toRegister,
    }),
});
export default (await import('vue')).defineComponent({});
; /* PartiallyEnd: #4569/main.vue */
