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
import { getDevice } from '../api/device'

const route = useRoute()
const router = useRouter()

const title = computed(() => (route.meta?.title as string) || 'SEBM')
const showScan = ref(false)
const hasCameraPermission = ref(true)

const onDetect = async (result: any) => {
    showScan.value = false
    const deviceId = result[0].rawValue
    console.log('Scanned device ID:', deviceId)
    
    // 验证设备ID是否为数字
    if (!/^\d+$/.test(deviceId)) {
        showNotify({ type: 'danger', message: 'Invalid device ID format' })
        return
    }
    
    try {
        // 获取设备信息
        const response = await getDevice({ id: parseInt(deviceId) })
        console.log('Device info response:', response)
        
        if (response) {
            const device = response as API.DeviceVo
            console.log('Device status:', device?.status)
            
            // 根据设备状态进行跳转
            switch (device?.status) {
                case 0: // 可用状态
                    showNotify({ type: 'success', message: `Device available: ${device?.deviceName}` })
                    router.push({
                        name: 'Borrow',
                        query: { deviceId: deviceId }
                    })
                    break
                case 1: // 借出状态
                    showNotify({ type: 'success', message: `Device borrowed: ${device?.deviceName}` })
                    router.push({
                        name: 'Return',
                        query: { deviceId: deviceId }
                    })
                    break
                case 2: // 维修中状态
                    showNotify({ type: 'warning', message: 'Device is under maintenance and cannot be borrowed' })
                    break
                default:
                    showNotify({ type: 'danger', message: 'Unknown device status' })
            }
        } else {
            showNotify({ type: 'danger', message: 'Device not found' })
        }
    } catch (error) {
        console.error('Failed to get device info:', error)
        showNotify({ type: 'danger', message: 'Failed to get device information' })
    }
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
