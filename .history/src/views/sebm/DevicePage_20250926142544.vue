<!--
 * @Description: 
 * @version: v1.0.0
 * @Author: GaoMingze
 * @Date: 2025-09-22 00:18:10
 * @LastEditors: GaoMingze
 * @LastEditTime: 2025-09-26 14:25:33
-->
<template>
    <div>
        <h1>Device Page</h1>
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
                :label="`${device.deviceType} | ${device.location}`"
            >
                <template #value>
                    <van-tag :type="device.status === 1 ? 'success' : 'danger'">
                        {{ device.status === 1 ? 'Active' : 'Inactive' }}
                    </van-tag>
                </template>
            </van-cell>
        </van-list>
        <van-loading v-if="initialLoading" size="24px">Loading...</van-loading>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { getDeviceList } from '@/api/device'
import type { DeviceVo } from '@/api/typings'

const initialLoading = ref(true)
const loading = ref(false)
const finished = ref(false)
const deviceList = ref<DeviceVo[]>([])
const currentPage = ref(1)
const pageSize = 10

const onLoad = async () => {
    try {
        const res = await getDeviceList({
            pageNumber: currentPage.value,
            pageSize: pageSize,
        })

        if (res.code === 200 && res.data) {
            deviceList.value = [...deviceList.value, ...res.data]
            currentPage.value++

            // Check if we've loaded all data
            if (res.data.length < pageSize) {
                finished.value = true
            }
        } else {
            finished.value = true
        }
    } catch (error) {
        console.error('Failed to fetch devices:', error)
        finished.value = true
    } finally {
        loading.value = false
        initialLoading.value = false
    }
}

// Initial load
onLoad()
</script>

<style scoped>
.van-list {
    margin-top: 20px;
}
</style>
