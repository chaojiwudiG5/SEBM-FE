<!--
 * @Description: 
 * @version: v1.0.0
 * @Author: GaoMingze
 * @Date: 2025-09-12 17:12:14
 * @LastEditors: GaoMingze
 * @LastEditTime: 2025-09-21 23:41:30
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
                type="plain"
                block
                @click="toRegister"
                style="margin-top: 4px"
                >Register</van-button
            >
        </div>
    </van-form>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const form = reactive({
    username: '',
    password: '',
})

const onSubmit = () => {
    router.push('/sebm')
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
