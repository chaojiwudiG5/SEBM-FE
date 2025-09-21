<!--
 * @Description: 
 * @version: v1.0.0
 * @Author: GaoMingze
 * @Date: 2025-09-12 17:16:00
 * @LastEditors: GaoMingze
 * @LastEditTime: 2025-09-22 00:09:32
-->
<template>
    <div class="login-layout">
        <div class="logo">
            <van-image :src="logo" round width="6rem" height="6rem"></van-image>
        </div>
        <div class="login-container">
            <router-view />
            <!-- 渲染登录页面 -->
        </div>
    </div>
</template>

<script setup lang="ts">
import logo from '../assets/logo.svg'
</script>

<style scoped>
.login-layout {
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
}
</style>
