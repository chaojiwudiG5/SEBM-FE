<!--
 * @Description: 
 * @version: v1.0.0
 * @Author: GaoMingze
 * @Date: 2025-09-21 23:24:49
 * @LastEditors: GaoMingze
 * @LastEditTime: 2025-09-25 00:18:16
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
    const userVo = await userLogin(form)
    console.log(userVo) //@ts-ignore
    userStore.setUserInfo(userVo as API.UserVo)
    router.push('/sebm/home')
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
