import { reactive } from 'vue';
import { userRegister } from '../api/user';
import { showNotify } from 'vant';
import router from '../router';
// 表单数据
const form = reactive({
    username: '',
    password: '',
    checkPassword: '',
    phone: '',
});
// 自定义校验规则：确认密码
const validateConfirmPassword = (val) => {
    return val === form.password;
};
// 表单提交
const onSubmit = async () => {
    try {
        const res = await userRegister(form);
        if (res != null) {
            console.log(res);
            showNotify('注册成功');
            router.push('/login');
        }
    }
    catch (error) {
        console.log(error);
        showNotify('注册失败');
    }
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
    name: "username",
    label: "Username",
    placeholder: "Please enter your username",
    required: true,
    rules: ([
        { required: true, message: 'Please enter your username' },
        {
            pattern: /^.{6,20}$/,
            message: 'Username length should be between 6 and 20',
        },
    ]),
}));
const __VLS_11 = __VLS_10({
    modelValue: (__VLS_ctx.form.username),
    name: "username",
    label: "Username",
    placeholder: "Please enter your username",
    required: true,
    rules: ([
        { required: true, message: 'Please enter your username' },
        {
            pattern: /^.{6,20}$/,
            message: 'Username length should be between 6 and 20',
        },
    ]),
}, ...__VLS_functionalComponentArgsRest(__VLS_10));
// @ts-ignore
[form,];
const __VLS_14 = {}.VanField;
/** @type {[typeof __VLS_components.VanField, typeof __VLS_components.vanField, ]} */ ;
// @ts-ignore
VanField;
// @ts-ignore
const __VLS_15 = __VLS_asFunctionalComponent(__VLS_14, new __VLS_14({
    modelValue: (__VLS_ctx.form.password),
    name: "password",
    type: "password",
    label: "Password",
    placeholder: "Please enter your password",
    required: true,
    rules: ([
        { required: true, message: 'Please enter your password' },
        {
            pattern: /^.{8,20}$/,
            message: 'Password length should be between 8 and 20',
        },
    ]),
}));
const __VLS_16 = __VLS_15({
    modelValue: (__VLS_ctx.form.password),
    name: "password",
    type: "password",
    label: "Password",
    placeholder: "Please enter your password",
    required: true,
    rules: ([
        { required: true, message: 'Please enter your password' },
        {
            pattern: /^.{8,20}$/,
            message: 'Password length should be between 8 and 20',
        },
    ]),
}, ...__VLS_functionalComponentArgsRest(__VLS_15));
// @ts-ignore
[form,];
const __VLS_19 = {}.VanField;
/** @type {[typeof __VLS_components.VanField, typeof __VLS_components.vanField, ]} */ ;
// @ts-ignore
VanField;
// @ts-ignore
const __VLS_20 = __VLS_asFunctionalComponent(__VLS_19, new __VLS_19({
    modelValue: (__VLS_ctx.form.checkPassword),
    name: "checkPassword",
    type: "password",
    label: "Check Password",
    placeholder: "Please check your password",
    required: true,
    rules: ([
        { required: true, message: 'Please check your password' },
        {
            validator: __VLS_ctx.validateConfirmPassword,
            message: 'Passwords do not match',
        },
    ]),
}));
const __VLS_21 = __VLS_20({
    modelValue: (__VLS_ctx.form.checkPassword),
    name: "checkPassword",
    type: "password",
    label: "Check Password",
    placeholder: "Please check your password",
    required: true,
    rules: ([
        { required: true, message: 'Please check your password' },
        {
            validator: __VLS_ctx.validateConfirmPassword,
            message: 'Passwords do not match',
        },
    ]),
}, ...__VLS_functionalComponentArgsRest(__VLS_20));
// @ts-ignore
[form, validateConfirmPassword,];
const __VLS_24 = {}.VanField;
/** @type {[typeof __VLS_components.VanField, typeof __VLS_components.vanField, ]} */ ;
// @ts-ignore
VanField;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
    modelValue: (__VLS_ctx.form.phone),
    name: "phone",
    label: "Phone",
    placeholder: "Please enter your phone number",
    rules: ([
        { required: true, message: 'Please enter your phone number' },
        {
            pattern: /^1[3-9]\d{9}$/,
            message: 'Please enter a valid phone number',
        },
    ]),
}));
const __VLS_26 = __VLS_25({
    modelValue: (__VLS_ctx.form.phone),
    name: "phone",
    label: "Phone",
    placeholder: "Please enter your phone number",
    rules: ([
        { required: true, message: 'Please enter your phone number' },
        {
            pattern: /^1[3-9]\d{9}$/,
            message: 'Please enter a valid phone number',
        },
    ]),
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
// @ts-ignore
[form,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ style: {} },
});
const __VLS_29 = {}.VanButton;
/** @type {[typeof __VLS_components.VanButton, typeof __VLS_components.vanButton, typeof __VLS_components.VanButton, typeof __VLS_components.vanButton, ]} */ ;
// @ts-ignore
VanButton;
// @ts-ignore
const __VLS_30 = __VLS_asFunctionalComponent(__VLS_29, new __VLS_29({
    type: "primary",
    block: true,
    nativeType: "submit",
}));
const __VLS_31 = __VLS_30({
    type: "primary",
    block: true,
    nativeType: "submit",
}, ...__VLS_functionalComponentArgsRest(__VLS_30));
const { default: __VLS_33 } = __VLS_32.slots;
var __VLS_32;
const __VLS_34 = {}.VanButton;
/** @type {[typeof __VLS_components.VanButton, typeof __VLS_components.vanButton, typeof __VLS_components.VanButton, typeof __VLS_components.vanButton, ]} */ ;
// @ts-ignore
VanButton;
// @ts-ignore
const __VLS_35 = __VLS_asFunctionalComponent(__VLS_34, new __VLS_34({
    ...{ 'onClick': {} },
    block: true,
    type: "default",
    ...{ style: {} },
}));
const __VLS_36 = __VLS_35({
    ...{ 'onClick': {} },
    block: true,
    type: "default",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_35));
let __VLS_38;
let __VLS_39;
const __VLS_40 = ({ click: {} },
    { onClick: (...[$event]) => {
            __VLS_ctx.$router.push('/login');
            // @ts-ignore
            [$router,];
        } });
const { default: __VLS_41 } = __VLS_37.slots;
var __VLS_37;
var __VLS_3;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup: () => ({
        form: form,
        validateConfirmPassword: validateConfirmPassword,
        onSubmit: onSubmit,
    }),
});
export default (await import('vue')).defineComponent({});
; /* PartiallyEnd: #4569/main.vue */
