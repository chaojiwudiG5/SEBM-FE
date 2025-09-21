<!--
 * @Description: 用户注册页面
 * @version: v1.0.0
 * @Author: GaoMingze
 * @Date: 2025-09-12 17:57:44
 * @LastEditors: GaoMingze
 * @LastEditTime: 2025-09-21 23:40:59
-->
<template>
    <van-form @submit="onSubmit">
        <!-- 用户名 -->
        <van-field
            v-model="form.username"
            name="username"
            label="Username"
            placeholder="Please enter your username"
            required
            :rules="[
                { required: true, message: 'Please enter your username' },
                {
                    pattern: /^.{6,20}$/,
                    message: 'Username length should be between 6 and 20',
                },
            ]"
        />

        <!-- 密码 -->
        <van-field
            v-model="form.password"
            name="password"
            type="password"
            label="Password"
            placeholder="Please enter your password"
            required
            :rules="[
                { required: true, message: 'Please enter your password' },
                {
                    pattern: /^.{8,20}$/,
                    message: 'Password length should be between 8 and 20',
                },
            ]"
        />

        <!-- 确认密码 -->
        <van-field
            v-model="form.confirmPassword"
            name="confirmPassword"
            type="password"
            label="Confirm Password"
            placeholder="Please confirm your password"
            required
            :rules="[
                { required: true, message: 'Please confirm your password' },
                {
                    validator: validateConfirmPassword,
                    message: 'Passwords do not match',
                },
            ]"
        />

        <!-- 邮箱 -->
        <van-field
            v-model="form.email"
            name="email"
            label="Email"
            placeholder="Please enter your email"
            :rules="[
                { required: true, message: 'Please enter your email' },
                {
                    pattern: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                    message: 'Please enter a valid email address',
                },
            ]"
        />

        <div style="margin-top: 16px">
            <van-button type="primary" block native-type="submit"
                >Register</van-button
            >
            <van-button
                block
                type="danger"
                @click="$router.push('/login')"
                style="margin-top: 4px"
            >
                Return to Login
            </van-button>
        </div>
    </van-form>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { register } from '../api/user'

// 表单数据
const form = reactive({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
})

// 自定义校验规则：确认密码
const validateConfirmPassword = (val: string) => {
    return val === form.password
}

// 表单提交
const onSubmit = async () => {
    try {
        const res = await register({
            username: form.username,
            password: form.password,
            email: form.email,
        })
        alert('注册成功！')
        console.log(res)
        // this.$router.push('/login') 也可以加跳转
    } catch (err: any) {
        alert(err?.message || '注册失败')
    }
}
</script>

<style scoped>
/* 可以根据需求调整样式 */
</style>
