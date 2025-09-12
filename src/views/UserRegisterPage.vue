<!--
 * @Description: 
 * @version: v1.0.0
 * @Author: GaoMingze
 * @Date: 2025-09-12 17:57:44
 * @LastEditors: GaoMingze
 * @LastEditTime: 2025-09-12 17:59:14
-->
<template>
    <van-form @submit="onSubmit">
        <van-field
            v-model="form.username"
            label="用户名"
            placeholder="请输入用户名"
            required
        />
        <van-field
            v-model="form.password"
            type="password"
            label="密码"
            placeholder="请输入密码"
            required
        />
        <van-field
            v-model="form.confirmPassword"
            type="password"
            label="确认密码"
            placeholder="请再次输入密码"
            required
        />
        <van-field
            v-model="form.email"
            type="email"
            label="邮箱"
            placeholder="请输入邮箱"
        />
        <div style="margin: 16px">
            <van-button type="primary" block native-type="submit"
                >注册</van-button
            >
        </div>
    </van-form>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { register } from '../api/user' // 假设你已经有 auth.ts 的 register 方法

// 表单数据
const form = reactive({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
})

// 表单提交
const onSubmit = async () => {
    if (!form.username || !form.password || !form.confirmPassword) {
        alert('用户名和密码不能为空')
        return
    }
    if (form.password !== form.confirmPassword) {
        alert('两次输入的密码不一致')
        return
    }

    try {
        const res = await register({
            username: form.username,
            password: form.password,
            email: form.email,
        })
        alert('注册成功！')
        console.log(res)
        // 可以跳转到登录页
    } catch (err: any) {
        alert(err?.message || '注册失败')
    }
}
</script>

<style scoped>
/* 可根据需求自定义样式 */
</style>
