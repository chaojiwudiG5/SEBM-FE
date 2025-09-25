<template>
    <div class="user-info-page">
        <van-skeleton title avatar :row="5" :loading="!userInfo" />
        <van-cell-group inset v-if="userInfo">
            <van-cell center>
                <template #right-icon>
                    <van-image
                        round
                        width="80"
                        height="80"
                        :src="
                            userInfo.avatarUrl ||
                            'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'
                        "
                        style="display: block; margin: 0 auto"
                    />
                </template>
            </van-cell>

            <van-cell
                title="Username"
                :value="userInfo.username"
                is-link
                @click="navigateToEdit('username', userInfo.username)"
            />
            <van-cell
                title="Email"
                :value="userInfo.email || 'N/A'"
                is-link
                @click="navigateToEdit('email', userInfo.email)"
            />
            <van-cell
                title="Phone"
                :value="userInfo.phone || 'N/A'"
                is-link
                @click="navigateToEdit('phone', userInfo.phone)"
            />
            <van-cell
                title="Gender"
                :value="formatGender(userInfo.gender)"
                is-link
                @click="navigateToEdit('gender', userInfo.gender)"
            />
            <van-cell
                title="Age"
                :value="userInfo.age || 'N/A'"
                is-link
                @click="navigateToEdit('age', userInfo.age)"
            />
            <van-cell
                title="Status"
                :value="formatStatus(userInfo.userStatus)"
            />
        </van-cell-group>

        <div class="action-buttons">
            <van-button
                type="danger"
                block
                round
                size="large"
                @click="handleLogout"
                class="logout-btn"
            >
                Logout
            </van-button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showNotify } from 'vant'
import { useUserStore } from '../../store/user'
import { userLogout } from '../../api/user'

const router = useRouter()
const userStore = useUserStore()
const userInfo = ref<API.UserVo | null>(null)

import { useRoute } from 'vue-router'

const route = useRoute()

onMounted(async () => {
    if (route.query.refresh === 'true') {
        //@ts-ignore
        await userStore.loadFromServer()
    }
    userInfo.value = userStore.userInfo
})

const formatGender = (gender: number | undefined) => {
    if (gender === undefined) return 'N/A'
    return gender === 1 ? 'Male' : 'Female'
}

const formatStatus = (status: number | undefined) => {
    if (status === undefined) return 'N/A'
    return status === 0 ? 'Active' : 'Inactive'
}

const handleLogout = async () => {
    try {
        await userLogout()
        //@ts-ignore
        userStore.clearUserInfo()
        router.push('/login')
    } catch (error) {
        showNotify('Logout failed')
    }
}

const navigateToEdit = (field: string, value: any) => {
    if (field === 'status') return
    router.push({
        path: '/sebm/userinfoedit',
        query: {
            field,
            value: value?.toString() || '',
        },
    })
}
</script>

<style scoped>
.action-buttons {
    margin-top: 20px;
}
</style>
