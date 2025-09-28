<template>
    <div class="edit-page">
        <van-form @submit="handleSubmit">
            <!-- Text input fields -->
            <van-field
                v-if="isTextField"
                v-model="editValue"
                :name="field"
                :label="fieldDisplayName"
                :placeholder="`Enter ${fieldDisplayName}`"
                :rules="[
                    {
                        required: true,
                        message: `${fieldDisplayName} is required`,
                    },
                ]"
            />

            <!-- Gender selector -->
            <van-field
                v-if="field === 'gender'"
                :name="field"
                :label="fieldDisplayName"
            >
                <template #input>
                    <van-radio-group v-model="editValue" direction="horizontal">
                        <van-radio name="1">Male</van-radio>
                        <van-radio name="0">Female</van-radio>
                    </van-radio-group>
                </template>
            </van-field>

            <div style="margin: 16px">
                <van-button round block type="primary" native-type="submit">
                    Submit
                </van-button>
            </div>
        </van-form>
    </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showNotify } from 'vant'
import { useUserStore } from '../../store/user'
import { updateUser } from '../../api/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const field = ref<string>(route.query.field as string)
const originalValue = ref<string>(route.query.value as string)
const editValue = ref<string>(originalValue.value)

const fieldDisplayName = computed(() => {
    const names: Record<string, string> = {
        username: 'Username',
        email: 'Email',
        phone: 'Phone',
        gender: 'Gender',
        age: 'Age',
    }
    return names[field.value] || field.value
})

const isTextField = computed(() => {
    return ['username', 'email', 'phone', 'age'].includes(field.value)
})

const handleSubmit = async () => {
    try {
        if (!userStore.userInfo) return

        const updateData: API.UpdateDto = {
            id: userStore.userInfo.id as string,
            username:
                field.value === 'username'
                    ? editValue.value
                    : (userStore.userInfo.username as string),
            email:
                field.value === 'email'
                    ? editValue.value
                    : userStore.userInfo.email || '',
            phone:
                field.value === 'phone'
                    ? editValue.value
                    : userStore.userInfo.phone || '',
            gender:
                field.value === 'gender'
                    ? Number(editValue.value)
                    : userStore.userInfo.gender || 0,
            age:
                field.value === 'age'
                    ? Number(editValue.value)
                    : userStore.userInfo.age || 0,
        }

        await updateUser(updateData)
        // Ensure data is refreshed before navigation
        showNotify({ type: 'success', message: 'Update successful' })
        // Replace navigation to force refresh
        router.replace({
            path: '/sebm/user/userinfo',
            query: { refresh: 'true' }
        })
    } catch (error) {
        showNotify({ type: 'danger', message: 'Update failed' })
    }
}
</script>

<style scoped>
.edit-page {
    padding-bottom: 60px;
}
</style>
