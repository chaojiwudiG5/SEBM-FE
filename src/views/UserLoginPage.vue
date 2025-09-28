<!--
 * @Description: 
 * @version: v1.0.0
 * @Author: GaoMingze
 * @Date: 2025-09-21 23:24:49
 * @LastEditors: GaoMingze
 * @LastEditTime: 2025-09-25 22:28:12
-->
<template>
    <van-form @submit="onSubmit">
        <van-field
            v-model="form.username"
            label="Username"
            placeholder="Please enter your username"
            :rules="[{ required: true, message: 'Please enter your username' }]"
        />
        <van-field
            label="Password"
            placeholder="Please enter your password"
            v-model="form.password"
            type="password"
            :rules="[{ required: true, message: 'Please enter your password' }]"
        />
        <div class="button-group">
            <van-button type="primary" block native-type="submit"
                >Login</van-button
            >
            <van-button
                type="default"
                block
                @click="toRegister"
                style="margin-top: 4px"
                >Register</van-button
            >
        </div>
    </van-form>
</template>
<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { userLogin } from '../api/user'
import { useUserStore } from '../store/user'
const router = useRouter()
const userStore = useUserStore()
const form: API.LoginDto = reactive({ username: '', password: '' })
const onSubmit = async () => {
    try {
        const userVo = await userLogin(form)
        console.log('Login response:', userVo)
        
        // 确保ID字段是字符串类型，避免精度丢失
        const processedUserVo: API.UserVo = {
            ...userVo,
            //@ts-ignore
            id: userVo.id ? String(userVo.id) : userVo.id,
            //@ts-ignore
            userId: userVo.userId ? String(userVo.userId) : userVo.userId
        }
        //@ts-ignore
        userStore.setUserInfo(processedUserVo)
        
        // 根据用户角色跳转
        if (userStore.userInfo?.userRole === 2) {
            // 技工
            router.push('/sebm/mechanic/tasks')
        } else if (userStore.userInfo?.userRole === 0) {
            // 普通用户
            router.push('/sebm/user/home')
        } else if (userStore.userInfo?.userRole === 1) {
            // 管理员 - 暂时跳转到用户页面，后续可以添加管理员页面
            router.push('/sebm/user/home')
        } else {
            // 未知角色
            console.error('Unknown user role:', userStore.userInfo?.userRole)
            router.push('/login')
        }
    } catch (error) {
        console.error('Login failed:', error)
    }
}
const toRegister = () => {
    // 跳转到注册页面
    router.push('/register')
}
</script>
<style scoped>
.button-group {
    margin-top: 16px;
    display: flex;
    flex-direction: column;
}
</style>
