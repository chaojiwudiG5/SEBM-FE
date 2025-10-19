import logo from '../assets/logo.svg';
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "login-layout" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "logo" },
});
const __VLS_0 = {}.VanImage;
/** @type {[typeof __VLS_components.VanImage, typeof __VLS_components.vanImage, typeof __VLS_components.VanImage, typeof __VLS_components.vanImage, ]} */ ;
// @ts-ignore
VanImage;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    src: (__VLS_ctx.logo),
    round: true,
    width: "6rem",
    height: "6rem",
}));
const __VLS_2 = __VLS_1({
    src: (__VLS_ctx.logo),
    round: true,
    width: "6rem",
    height: "6rem",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
// @ts-ignore
[logo,];
__VLS_asFunctionalElement(__VLS_elements.h1, __VLS_elements.h1)({
    ...{ class: "title" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "login-container" },
});
const __VLS_5 = {}.RouterView;
/** @type {[typeof __VLS_components.RouterView, typeof __VLS_components.routerView, ]} */ ;
// @ts-ignore
RouterView;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({}));
const __VLS_7 = __VLS_6({}, ...__VLS_functionalComponentArgsRest(__VLS_6));
/** @type {__VLS_StyleScopedClasses['login-layout']} */ ;
/** @type {__VLS_StyleScopedClasses['logo']} */ ;
/** @type {__VLS_StyleScopedClasses['title']} */ ;
/** @type {__VLS_StyleScopedClasses['login-container']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup: () => ({
        logo: logo,
    }),
});
export default (await import('vue')).defineComponent({});
; /* PartiallyEnd: #4569/main.vue */
