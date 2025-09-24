<!--
 * @Description: 
 * @version: v1.0.0
 * @Author: GaoMingze
 * @Date: 2025-09-21 23:24:49
 * @LastEditors: GaoMingze
 * @LastEditTime: 2025-09-25 00:18:06
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
            v-model="form.checkPassword"
            name="checkPassword"
            type="password"
            label="Check Password"
            placeholder="Please check your password"
            required
            :rules="[
                { required: true, message: 'Please check your password' },
                {
                    validator: validateConfirmPassword,
                    message: 'Passwords do not match',
                },
            ]"
        />
        <van-field
            v-model="form.phone"
            name="phone"
            label="Phone"
            placeholder="Please enter your phone number"
            :rules="[
                { required: true, message: 'Please enter your phone number' },
                {
                    pattern: /^1[3-9]\d{9}$/,
                    message: 'Please enter a valid phone number',
                },
            ]"
        />
        <div style="margin-top: 16px">
            <van-button type="primary" block native-type="submit"
                >Register</van-button
            >
            <van-button
                block
                type="default"
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
import { userRegister } from '../api/user'
import { showNotify } from 'vant'
import router from '../router'
// 表单数据
const form: API.RegisterDto = reactive({
    username: '',
    password: '',
    checkPassword: '',
    phone: '',
})
// 自定义校验规则：确认密码
const validateConfirmPassword = (val: string) => {
    return val === form.password
}
// 表单提交
const onSubmit = async () => {
    try {
        const res = await userRegister(form)
        if (res != null) {
            console.log(res)
            showNotify('注册成功')
            router.push('/login')
        }
    } catch (error) {
        console.log(error)
        showNotify('注册失败')
    }
}
</script>
<style scoped>
/* 可以根据需求调整样式 */
</style>
