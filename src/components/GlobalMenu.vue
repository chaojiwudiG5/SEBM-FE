<!--
 * @Description: 
 * @version: v1.0.0
 * @Author: GaoMingze
 * @Date: 2025-09-21 23:33:48
 * @LastEditors: GaoMingze
 * @LastEditTime: 2025-09-22 01:15:05
-->
<template>
    <van-tabbar route>
        <template v-if="userRole === 2">
            <van-tabbar-item replace to="/sebm/mechanic/tasks" icon="todo-list-o"
                >Tasks</van-tabbar-item
            >
            <van-tabbar-item replace to="/sebm/mechanic/userinfo" icon="user-o"
                >User</van-tabbar-item
            >
        </template>
        <template v-else>
            <van-tabbar-item replace to="/sebm/user/home" icon="home-o"
                >Home</van-tabbar-item
            >
            <van-tabbar-item replace to="/sebm/user/device" icon="desktop-o"
                >Device</van-tabbar-item
            >
            <van-tabbar-item replace to="/sebm/user/messagebox" icon="chat-o"
                >Message</van-tabbar-item
            >
            <van-tabbar-item replace to="/sebm/user/userinfo" icon="user-o"
                >User</van-tabbar-item
            >
        </template>
    </van-tabbar>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useUserStore } from '../store/user'

const userStore = useUserStore()
const userRole = computed(() => userStore.userInfo?.userRole)
</script>

<style scoped></style>
