<!--
 * @Description: 
 * @version: v1.0.0
 * @Author: GaoMingze
 * @Date: 2025-09-22 00:18:10
 * @LastEditors: GaoMingze
 * @LastEditTime: 2025-09-26 14:50:24
-->
<template>
    <div class="device-page">
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
            <van-list
                v-model:loading="loading"
                :finished="finished"
                finished-text="No more devices"
                @load="onLoad"
            >
                <van-cell
                    v-for="device in deviceList"
                    :key="device.id"
                    :title="device.deviceName"
                    :label="`Type: ${device.deviceType} | Status: ${device.status}`"
                />
            </van-list>
        </van-pull-refresh>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { getDeviceList } from '../../api/device'

interface Device {
    id: number
    deviceName: string
    deviceType: string
    status: number
    location: string
    description?: string
}

const deviceList = ref<Device[]>([])
const loading = ref(false)
const finished = ref(false)
const refreshing = ref(false)
const pageParams = ref({
    pageNumber: 1,
    pageSize: 10,
})

const loadDevices = async () => {
    try {
        const res: any = await getDeviceList({
            pageNumber: pageParams.value.pageNumber,
            pageSize: pageParams.value.pageSize,
        })

        if (refreshing.value) {
            deviceList.value = res
            refreshing.value = false
        } else {
            deviceList.value.push(...res)
        }

        // Check if no more data
        if (res.length === 0 || res.length < pageParams.value.pageSize) {
            finished.value = true
        } else {
            pageParams.value.pageNumber++
        }
    } finally {
        loading.value = false
    }
}

const onLoad = () => {
    if (!refreshing.value) {
        loadDevices()
    }
}

const onRefresh = () => {
    // Reset state
    finished.value = false
    loading.value = true
    pageParams.value.pageNumber = 1
    refreshing.value = true

    // Reload data
    loadDevices()
}
</script>

<style scoped></style>
