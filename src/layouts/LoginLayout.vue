<!--
 * @Description: 
 * @version: v1.0.0
 * @Author: GaoMingze
 * @Date: 2025-09-21 23:24:49
 * @LastEditors: GaoMingze
 * @LastEditTime: 2025-09-25 00:23:54
-->
<template>
    <div class="login-layout">
        <div class="logo">
            <van-image :src="logo" round width="6rem" height="6rem"></van-image>
            <h1 class="title">SEBM</h1>
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
    perspective: 1000px;
}

.title {
    font-size: 2.5rem;
    font-weight: bold;
    color: #333;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    margin: 1rem 0;
    letter-spacing: 2px;
}

.login-container {
    box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.3);
    padding: 16px;
    border-radius: 12px;
    background-color: white;
}
.logo {
    animation: rotate 6s linear infinite;
    filter: drop-shadow(0 0 5px rgba(0, 0, 0, 0.3));
}

@keyframes rotate {
    from {
        transform: rotateY(0deg);
        filter: drop-shadow(-5px 0 5px rgba(0, 0, 0, 0.3));
    }
    50% {
        filter: drop-shadow(5px 0 5px rgba(0, 0, 0, 0.3));
    }
    to {
        transform: rotateY(360deg);
        filter: drop-shadow(-5px 0 5px rgba(0, 0, 0, 0.3));
    }
}
</style>
