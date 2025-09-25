<!--
 * @Description: 
 * @version: v1.0.0
 * @Author: GaoMingze
 * @Date: 2025-09-21 23:32:51
 * @LastEditors: GaoMingze
 * @LastEditTime: 2025-09-25 22:50:08
-->
<template>
    <van-nav-bar :title="title" fixed>
        <template #right>
            <van-icon name="search" size="18" />
        </template>
    </van-nav-bar>
</template>

<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const router = useRouter()

const title = computed(() => (route.meta?.title as string) || 'SEBM')
</script>

<style scoped></style>
