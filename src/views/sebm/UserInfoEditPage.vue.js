import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { showNotify } from 'vant';
import { useUserStore } from '../../store/user';
import { updateUser } from '../../api/user';
const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const field = ref(route.query.field);
const originalValue = ref(route.query.value);
const editValue = ref(originalValue.value);
const fieldDisplayName = computed(() => {
    const names = {
        username: 'Username',
        email: 'Email',
        phone: 'Phone',
        gender: 'Gender',
        age: 'Age',
    };
    return names[field.value] || field.value;
});
const isTextField = computed(() => {
    return ['username', 'email', 'phone', 'age'].includes(field.value);
});
const handleSubmit = async () => {
    try {
        if (!userStore.userInfo)
            return;
        const updateData = {
            id: userStore.userInfo.id,
            username: field.value === 'username'
                ? editValue.value
                : userStore.userInfo.username,
            email: field.value === 'email'
                ? editValue.value
                : userStore.userInfo.email || '',
            phone: field.value === 'phone'
                ? editValue.value
                : userStore.userInfo.phone || '',
            gender: field.value === 'gender'
                ? Number(editValue.value)
                : userStore.userInfo.gender || 0,
            age: field.value === 'age'
                ? Number(editValue.value)
                : userStore.userInfo.age || 0,
        };
        await updateUser(updateData);
        // Ensure data is refreshed before navigation
        showNotify({ type: 'success', message: 'Update successful' });
        // Replace navigation to force refresh
        router.replace({
            path: '/sebm/user/userinfo',
            query: { refresh: 'true' }
        });
    }
    catch (error) {
        showNotify({ type: 'danger', message: 'Update failed' });
    }
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "edit-page" },
});
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
    { onSubmit: (__VLS_ctx.handleSubmit) });
const { default: __VLS_7 } = __VLS_3.slots;
// @ts-ignore
[handleSubmit,];
if (__VLS_ctx.isTextField) {
    // @ts-ignore
    [isTextField,];
    const __VLS_8 = {}.VanField;
    /** @type {[typeof __VLS_components.VanField, typeof __VLS_components.vanField, ]} */ ;
    // @ts-ignore
    VanField;
    // @ts-ignore
    const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
        modelValue: (__VLS_ctx.editValue),
        name: (__VLS_ctx.field),
        label: (__VLS_ctx.fieldDisplayName),
        placeholder: (`Enter ${__VLS_ctx.fieldDisplayName}`),
        rules: ([
            {
                required: true,
                message: `${__VLS_ctx.fieldDisplayName} is required`,
            },
        ]),
    }));
    const __VLS_10 = __VLS_9({
        modelValue: (__VLS_ctx.editValue),
        name: (__VLS_ctx.field),
        label: (__VLS_ctx.fieldDisplayName),
        placeholder: (`Enter ${__VLS_ctx.fieldDisplayName}`),
        rules: ([
            {
                required: true,
                message: `${__VLS_ctx.fieldDisplayName} is required`,
            },
        ]),
    }, ...__VLS_functionalComponentArgsRest(__VLS_9));
    // @ts-ignore
    [editValue, field, fieldDisplayName, fieldDisplayName, fieldDisplayName,];
}
if (__VLS_ctx.field === 'gender') {
    // @ts-ignore
    [field,];
    const __VLS_13 = {}.VanField;
    /** @type {[typeof __VLS_components.VanField, typeof __VLS_components.vanField, typeof __VLS_components.VanField, typeof __VLS_components.vanField, ]} */ ;
    // @ts-ignore
    VanField;
    // @ts-ignore
    const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
        name: (__VLS_ctx.field),
        label: (__VLS_ctx.fieldDisplayName),
    }));
    const __VLS_15 = __VLS_14({
        name: (__VLS_ctx.field),
        label: (__VLS_ctx.fieldDisplayName),
    }, ...__VLS_functionalComponentArgsRest(__VLS_14));
    const { default: __VLS_17 } = __VLS_16.slots;
    // @ts-ignore
    [field, fieldDisplayName,];
    {
        const { input: __VLS_18 } = __VLS_16.slots;
        const __VLS_19 = {}.VanRadioGroup;
        /** @type {[typeof __VLS_components.VanRadioGroup, typeof __VLS_components.vanRadioGroup, typeof __VLS_components.VanRadioGroup, typeof __VLS_components.vanRadioGroup, ]} */ ;
        // @ts-ignore
        VanRadioGroup;
        // @ts-ignore
        const __VLS_20 = __VLS_asFunctionalComponent(__VLS_19, new __VLS_19({
            modelValue: (__VLS_ctx.editValue),
            direction: "horizontal",
        }));
        const __VLS_21 = __VLS_20({
            modelValue: (__VLS_ctx.editValue),
            direction: "horizontal",
        }, ...__VLS_functionalComponentArgsRest(__VLS_20));
        const { default: __VLS_23 } = __VLS_22.slots;
        // @ts-ignore
        [editValue,];
        const __VLS_24 = {}.VanRadio;
        /** @type {[typeof __VLS_components.VanRadio, typeof __VLS_components.vanRadio, typeof __VLS_components.VanRadio, typeof __VLS_components.vanRadio, ]} */ ;
        // @ts-ignore
        VanRadio;
        // @ts-ignore
        const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
            name: "1",
        }));
        const __VLS_26 = __VLS_25({
            name: "1",
        }, ...__VLS_functionalComponentArgsRest(__VLS_25));
        const { default: __VLS_28 } = __VLS_27.slots;
        var __VLS_27;
        const __VLS_29 = {}.VanRadio;
        /** @type {[typeof __VLS_components.VanRadio, typeof __VLS_components.vanRadio, typeof __VLS_components.VanRadio, typeof __VLS_components.vanRadio, ]} */ ;
        // @ts-ignore
        VanRadio;
        // @ts-ignore
        const __VLS_30 = __VLS_asFunctionalComponent(__VLS_29, new __VLS_29({
            name: "0",
        }));
        const __VLS_31 = __VLS_30({
            name: "0",
        }, ...__VLS_functionalComponentArgsRest(__VLS_30));
        const { default: __VLS_33 } = __VLS_32.slots;
        var __VLS_32;
        var __VLS_22;
    }
    var __VLS_16;
}
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ style: {} },
});
const __VLS_34 = {}.VanButton;
/** @type {[typeof __VLS_components.VanButton, typeof __VLS_components.vanButton, typeof __VLS_components.VanButton, typeof __VLS_components.vanButton, ]} */ ;
// @ts-ignore
VanButton;
// @ts-ignore
const __VLS_35 = __VLS_asFunctionalComponent(__VLS_34, new __VLS_34({
    round: true,
    block: true,
    type: "primary",
    nativeType: "submit",
}));
const __VLS_36 = __VLS_35({
    round: true,
    block: true,
    type: "primary",
    nativeType: "submit",
}, ...__VLS_functionalComponentArgsRest(__VLS_35));
const { default: __VLS_38 } = __VLS_37.slots;
var __VLS_37;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['edit-page']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup: () => ({
        field: field,
        editValue: editValue,
        fieldDisplayName: fieldDisplayName,
        isTextField: isTextField,
        handleSubmit: handleSubmit,
    }),
});
export default (await import('vue')).defineComponent({});
; /* PartiallyEnd: #4569/main.vue */
