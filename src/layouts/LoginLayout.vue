<!--
 * @Description: 
 * @version: v1.0.0
 * @Author: GaoMingze
 * @Date: 2025-09-12 17:16:00
 * @LastEditors: GaoMingze
 * @LastEditTime: 2025-09-12 17:44:33
-->
<template>
    <div class="login-layout">
        <div class="login-container">
            <router-view />
            <!-- 渲染登录页面 -->
        </div>
    </div>
</template>

<script>
export default {
    name: 'LoginLayout',
}
</script>

<style scoped></style>
