<!--
 * @Description: 
 * @version: v1.0.0
 * @Author: GaoMingze
 * @Date: 2025-09-12 17:12:14
 * @LastEditors: GaoMingze
 * @LastEditTime: 2025-09-12 20:59:36
-->
<template>
    <van-form @submit="onSubmit">
        <van-field
            v-model="form.username"
            label="用户名"
            placeholder="请输入用户名"
            :rules="[{ required: true, message: '请输入用户名' }]"
        />
        <van-field
            v-model="form.password"
            type="password"
            label="密码"
            placeholder="请输入密码"
            :rules="[{ required: true, message: '请输入密码' }]"
        />
        <div class="button-group">
            <van-button type="primary" block native-type="submit"
                >登录</van-button
            >
            <van-button
                type="plain"
                block
                @click="toRegister"
                style="margin-top: 4px"
                >注册</van-button
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
    if (!form.username || !form.password) {
        alert('请填写用户名和密码')
        return
    }
    // 这里可以调用 API 登录
    alert(`用户名: ${form.username}, 密码: ${form.password}`)
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
