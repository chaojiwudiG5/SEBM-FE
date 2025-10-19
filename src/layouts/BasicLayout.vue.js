import GlobalHeader from '../components/GlobalHeader.vue';
import GlobalMenu from '../components/GlobalMenu.vue';
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "basic-layout" },
});
/** @type {[typeof GlobalHeader, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(GlobalHeader, new GlobalHeader({}));
const __VLS_1 = __VLS_0({}, ...__VLS_functionalComponentArgsRest(__VLS_0));
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "content" },
});
const __VLS_4 = {}.RouterView;
/** @type {[typeof __VLS_components.RouterView, typeof __VLS_components.routerView, typeof __VLS_components.RouterView, typeof __VLS_components.routerView, ]} */ ;
// @ts-ignore
RouterView;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({}));
const __VLS_6 = __VLS_5({}, ...__VLS_functionalComponentArgsRest(__VLS_5));
/** @type {[typeof GlobalMenu, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(GlobalMenu, new GlobalMenu({}));
const __VLS_10 = __VLS_9({}, ...__VLS_functionalComponentArgsRest(__VLS_9));
/** @type {__VLS_StyleScopedClasses['basic-layout']} */ ;
/** @type {__VLS_StyleScopedClasses['content']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup: () => ({
        GlobalHeader: GlobalHeader,
        GlobalMenu: GlobalMenu,
    }),
});
export default (await import('vue')).defineComponent({});
; /* PartiallyEnd: #4569/main.vue */
