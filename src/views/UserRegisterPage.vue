<!--
 * @Description: 用户注册页面
 * @version: v1.0.0
 * @Author: GaoMingze
 * @Date: 2025-09-12 17:57:44
 * @LastEditors: GaoMingze
 * @LastEditTime: 2025-09-12 20:57:53
-->
<template>
    <van-form @submit="onSubmit">
        <!-- 用户名 -->
        <van-field
            v-model="form.username"
            name="username"
            label="用户名"
            placeholder="请输入用户名"
            required
            :rules="[
                { required: true, message: '请输入用户名' },
                { pattern: /^.{6,20}$/, message: '用户名长度应在 6-20 位之间' },
            ]"
        />

        <!-- 密码 -->
        <van-field
            v-model="form.password"
            name="password"
            type="password"
            label="密码"
            placeholder="请输入密码"
            required
            :rules="[
                { required: true, message: '请输入密码' },
                { pattern: /^.{8,20}$/, message: '密码长度应该在 8-20 位间' },
            ]"
        />

        <!-- 确认密码 -->
        <van-field
            v-model="form.confirmPassword"
            name="confirmPassword"
            type="password"
            label="确认密码"
            placeholder="请再次输入密码"
            required
            :rules="[
                { required: true, message: '请确认密码' },
                {
                    validator: validateConfirmPassword,
                    message: '两次输入的密码不一致',
                },
            ]"
        />

        <!-- 邮箱 -->
        <van-field
            v-model="form.email"
            name="email"
            type="email"
            label="邮箱"
            placeholder="请输入邮箱"
            :rules="[
                { required: true, message: '请输入邮箱' },
                {
                    pattern: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                    message: '请输入正确的邮箱地址',
                },
            ]"
        />

        <div style="margin-top: 16px">
            <van-button type="primary" block native-type="submit"
                >注册</van-button
            >
            <van-button
                block
                type="danger"
                @click="$router.push('/login')"
                style="margin-top: 4px"
            >
                返回登录
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
