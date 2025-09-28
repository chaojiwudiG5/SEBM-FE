<!--
 * @Description: 
 * @version: v1.0.0
 * @Author: GaoMingze
 * @Date: 2025-09-22 00:18:10
 * @LastEditors: GaoMingze
 * @LastEditTime: 2025-09-26 15:14:41
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
                >
                    <template #icon>
                        <van-image
                            width="60"
                            height="60"
                            :src="
                                device.imageUrl ||
                                'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'
                            "
                            fit="cover"
                        />
                    </template>
                    <template #label>
                        <div class="tags-container">
                            <van-tag plain type="primary" class="type-tag">
                                {{ device.deviceType }}
                            </van-tag>
                            <van-tag
                                :type="getStatusTagType(device.status)"
                                class="status-tag"
                            >
                                {{ getStatusText(device.status) }}
                            </van-tag>
                        </div>
                    </template>
                </van-cell>
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
    imageUrl: string
    description?: string
}

const getStatusText = (status: number): string => {
    switch (status) {
        case 0:
            return 'Available'
        case 1:
            return 'Borrowed'
        case 2:
            return 'Repairing'
        default:
            return 'Unknown'
    }
}

const getStatusTagType = (status: number): string => {
    switch (status) {
        case 0:
            return 'success'
        case 1:
            return 'warning'
        case 2:
            return 'danger'
        default:
            return 'default'
    }
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

<style scoped>
.device-page {
    padding: 10px;
}

.van-cell {
    display: flex;
    align-items: center;
    padding: 12px 16px;
}

.van-cell__value {
    margin-left: 12px;
}

.tags-container {
    display: flex;
    gap: 8px;
    margin-top: 6px;
}

.type-tag {
    color: var(--van-primary-color);
    background: var(--van-primary-color-1);
}

.status-tag {
    margin-left: 4px;
}
</style>
