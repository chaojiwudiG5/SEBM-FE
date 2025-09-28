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
import { useRoute, useRouter } from 'vue-router'
import { computed, ref } from 'vue'
import { showNotify } from 'vant'
import { QrcodeStream } from 'vue-qrcode-reader'

const route = useRoute()
const router = useRouter()

const title = computed(() => (route.meta?.title as string) || 'SEBM')
const showScan = ref(false)
const hasCameraPermission = ref(true)

const onDetect = (result: any) => {
    showScan.value = false
    const deviceId = result[0].rawValue
    console.log('Scanned device ID:', deviceId)
    
    // 验证设备ID是否为数字
    if (!/^\d+$/.test(deviceId)) {
        showNotify({ type: 'danger', message: 'Invalid device ID format' })
        return
    }
    
    showNotify({ type: 'success', message: `Device ID: ${deviceId}` })
    
    // 跳转到借用页面，传递设备ID
    router.push({
        name: 'Borrow',
        query: { deviceId: deviceId }
    })
}

const onInit = async (promise: Promise<any>) => {
    try {
        await promise
        hasCameraPermission.value = true
    } catch (error) {
        hasCameraPermission.value = false
        showNotify({ type: 'danger', message: 'Camera permission denied' })
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
