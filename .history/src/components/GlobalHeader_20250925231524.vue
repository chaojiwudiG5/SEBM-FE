<!--
 * @Description: 
 * @version: v1.0.0
 * @Author: GaoMingze
 * @Date: 2025-09-21 23:32:51
 * @LastEditors: GaoMingze
 * @LastEditTime: 2025-09-25 23:15:23
-->
<template>
    <van-nav-bar :title="title" fixed>
        <template #right>
            <van-icon name="scan" size="18" @click="showScan = true" />
        </template>
    </van-nav-bar>

    <van-popup v-model:show="showScan" round position="top" style="height: 80%">
        <div class="scan-container">
            <qrcode-stream @detect="onDetect" @init="onInit" v-if="showScan" />
            <div class="scan-tip" v-if="!hasCameraPermission">
                请允许摄像头权限
            </div>
        </div>
    </van-popup>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { computed, ref } from 'vue'
import { showNotify } from 'vant'
import { QrcodeStream } from 'vue-qrcode-reader'

const route = useRoute()

const title = computed(() => (route.meta?.title as string) || 'SEBM')
const showScan = ref(false)
const hasCameraPermission = ref(true)

const onDetect = (result: any) => {
    showScan.value = false
    showNotify({ type: 'success', message: `扫描结果: ${result[0].rawValue}` })
    // 这里可以添加对扫描结果的处理逻辑
    // 例如跳转到对应页面或执行其他操作
}

const onInit = async (promise: Promise<any>) => {
    try {
        await promise
        hasCameraPermission.value = true
    } catch (error) {
        hasCameraPermission.value = false
        showNotify({ type: 'danger', message: '摄像头权限被拒绝' })
    }
}
</script>

<style scoped>
.scan-container {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.scan-tip {
    margin-top: 20px;
    color: #969799;
    font-size: 14px;
}
</style>
