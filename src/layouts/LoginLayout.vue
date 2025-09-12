<!--
 * @Description: 
 * @version: v1.0.0
 * @Author: GaoMingze
 * @Date: 2025-09-12 17:16:00
 * @LastEditors: GaoMingze
 * @LastEditTime: 2025-09-12 20:39:49
-->
<template>
    <div class="login-layout">
        <van-image :src="logo" round width="6rem" height="6rem"></van-image>
        <div class="login-container">
            <router-view />
            <!-- 渲染登录页面 -->
        </div>
    </div>
</template>

<script setup lang="ts">
import logo from '../assets/logo.svg'
</script>

<style scoped></style>
