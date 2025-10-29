<!--
 * @Description: 设备管理页面
 * @version: v1.0.0
 * @Author: GaoMingze
 * @Date: 2025-09-22 00:18:10
 * @LastEditors: GaoMingze
 * @LastEditTime: 2025-09-26 15:29:55
-->
<template>
    <div class="device-page">
        <!-- 设备条件筛选区 -->
        <div class="filter-section">
            <van-dropdown-menu>
                <van-dropdown-item v-model="filterParams.deviceType" :options="deviceTypeOptions" title="Device Type" />
                <van-dropdown-item v-model="filterParams.status" :options="statusOptions" title="Status" />
                <van-dropdown-item v-model="filterParams.location" :options="locationOptions" title="Location" />
            </van-dropdown-menu>
            <van-search
                v-model="filterParams.keyword"
                placeholder="Search devices..."
                @search="handleSearch"
                @clear="handleSearch"
                show-action
                action-text="Clear"
            />
        </div>

        <!-- 设备统计区 -->
        <div class="stats-section">
            <div class="stats-circle">
                <van-circle
                    :rate="statsRate"
                    :speed="100"
                    :text="`${totalDevices}`"
                    :current-rate="statsRate"
                    stroke-width="32"
                    layer-color="#f0f0f0"
                    color="#1989fa"
                    size="80"
                />
                <div class="circle-label">Total</div>
            </div>
            <div class="stats-info">
                <div class="stats-item">
                    <span class="label">Available:</span>
                    <span class="value available">{{ statusCounts[0] }}</span>
                </div>
                <div class="stats-item">
                    <span class="label">Borrowed:</span>
                    <span class="value borrowed">{{ statusCounts[1] }}</span>
                </div>
                <div class="stats-item">
                    <span class="label">Repairing:</span>
                    <span class="value repairing">{{ statusCounts[2] }}</span>
                </div>
            </div>
        </div>

        <!-- 设备列表区 -->
        <div class="device-list-section">
            <!-- 骨架屏 -->
            <div v-if="loading" class="skeleton-container">
                <div v-for="n in 5" :key="n" class="skeleton-card">
                    <div class="skeleton-thumb"></div>
                    <div class="skeleton-content">
                        <div class="skeleton-title"></div>
                        <div class="skeleton-desc"></div>
                        <div class="skeleton-footer">
                            <div class="skeleton-tag"></div>
                            <div class="skeleton-tag"></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- 设备列表 -->
            <div v-else>
                <van-empty v-if="deviceList.length === 0" description="No devices found" />
                <div v-else>
                    <van-card
                        v-for="device in deviceList"
                        :key="device.id"
                        :title="device.deviceName"
                        :thumb="ensureHttps(device.image) || 'https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg'"
                        class="device-card"
                    >
                        <template #desc>
                            <div class="device-desc">{{ device.description }}</div>
                        </template>
                        <template #tags>
                            <van-tag :type="getStatusTagType(device.status) as any" class="status-tag">
                                {{ getStatusText(device.status) }}
                            </van-tag>
                            <van-tag type="primary" plain class="type-tag">
                                {{ device.deviceType }}
                            </van-tag>
                            <van-tag type="default" plain class="location-info">
                                📍 {{ device.location }}
                            </van-tag>
                        </template>
                    </van-card>
                                        <!-- 分页组件 -->
                                        <van-pagination
                        v-model="currentPage"
                        :total-items="totalDevices"
                        :items-per-page="10"
                        mode="simple"
                        @change="handlePageChange"
                        class="pagination"
                    >
                        <template #prev-text>
                            <van-icon name="arrow-left" />
                        </template>
                        <template #next-text>
                            <van-icon name="arrow" />
                        </template>
                    </van-pagination>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, watch } from 'vue'
import { getDeviceList } from '../../api/device'
import { ensureHttps } from '../../utils/url'

// 筛选参数
const filterParams = ref({
    deviceType: '',
    status: '',
    location: '',
    keyword: ''
})

// 分页参数
const currentPage = ref(1)
const pageSize = 10
const totalDevices = ref(0)

// 数据状态
const deviceList = ref<API.DeviceVo[]>([])
const loading = ref(false)

// 构建查询DTO
const buildQueryDto = (page: number = 1): API.DeviceQueryDto => {
    const dto: API.DeviceQueryDto = {
        pageNumber: page,
        pageSize: pageSize
    }
    
    // 添加筛选条件
    if (filterParams.value.deviceType) {
        dto.deviceType = filterParams.value.deviceType
    }
    
    if (filterParams.value.status !== '') {
        dto.status = parseInt(filterParams.value.status)
    }
    
    if (filterParams.value.location) {
        dto.location = filterParams.value.location
    }
    
    if (filterParams.value.keyword) {
        dto.deviceName = filterParams.value.keyword
    }
    
    return dto
}

// 设备类型选项
const deviceTypeOptions = ref([
    { text: 'All Types', value: '' },
    { text: 'Laptop', value: 'Laptop' },
    { text: 'Tablet', value: 'Tablet' },
    { text: 'Phone', value: 'Phone' },
    { text: 'Camera', value: 'Camera' },
    { text: 'Other', value: 'Other' }
])

// 状态选项
const statusOptions = ref([
    { text: 'All Status', value: '' },
    { text: 'Available', value: '0' },
    { text: 'Borrowed', value: '1' },
    { text: 'Repairing', value: '2' }
])

// 位置选项（这里可以根据实际数据动态生成）
const locationOptions = ref([
    { text: 'All Locations', value: '' },
    { text: '1-A', value: '1-A' },
    { text: '1-B', value: '1-B' },
    { text: '1-C', value: '1-C' },
    { text: '2-A', value: '2-A' },
    { text: '2-B', value: '2-B' },
    { text: '2-C', value: '2-C' },
    { text: '2-D', value: '2-D' },
    { text: '3-A', value: '3-A' },
    { text: '3-B', value: '3-B' },
    { text: '3-C', value: '3-C' },
    { text: '3-D', value: '3-D' },
])

// 状态统计
const statusCounts = ref([0, 0, 0]) // [available, borrowed, repairing]

// 计算统计比例
const statsRate = computed(() => {
    if (totalDevices.value === 0) return 0
    return Math.round((statusCounts.value[0] / totalDevices.value) * 100)
})

// 获取状态文本
const getStatusText = (status?: number): string => {
    switch (status) {
        case 0: return 'Available'
        case 1: return 'Borrowed'
        case 2: return 'Repairing'
        default: return 'Unknown'
    }
}

// 获取状态标签类型
const getStatusTagType = (status?: number): string => {
    switch (status) {
        case 0: return 'success'
        case 1: return 'warning'
        case 2: return 'danger'
        case 3: return 'info'
        default: return 'default'
    }
}

// 获取设备列表
const fetchDevices = async (page: number = 1) => {
    if (loading.value) return
    
    loading.value = true
    try {
        const queryDto = buildQueryDto(page)
        console.log('Fetching devices for page:', page, 'Query DTO:', queryDto)
        
        const response = await getDeviceList(queryDto)
        
        if (response && Array.isArray(response)) {
            deviceList.value = response
            console.log('Devices loaded for page', page, ':', response.length, 'devices')
        }
    } catch (error) {
        console.error('Failed to fetch devices:', error)
    } finally {
        loading.value = false
    }
}

// 获取设备统计信息
const fetchDeviceStats = async () => {
    try {
        // 构建统计查询DTO（不包含分页，获取所有匹配的设备）
        const statsDto: API.DeviceQueryDto = {
            pageNumber: 1,
            pageSize: 1000 // 获取大量数据来统计
        }
        
        // 添加筛选条件（与设备列表使用相同的筛选条件）
        if (filterParams.value.deviceType) {
            statsDto.deviceType = filterParams.value.deviceType
        }
        
        if (filterParams.value.status !== '') {
            statsDto.status = parseInt(filterParams.value.status)
        }
        
        if (filterParams.value.location) {
            statsDto.location = filterParams.value.location
        }
        
        if (filterParams.value.keyword) {
            statsDto.deviceName = filterParams.value.keyword
        }
        
        console.log('Stats Query DTO:', statsDto)
        
        const response = await getDeviceList(statsDto)
        
        if (response && Array.isArray(response)) {
            totalDevices.value = response.length
            
            // 统计各状态数量
            const counts = [0, 0, 0, 0]
            response.forEach(device => {
                if (device.status !== undefined && device.status >= 0 && device.status <= 3) {
                    counts[device.status]++
                }
            })
            statusCounts.value = counts
            console.log('Device stats updated:', { total: totalDevices.value, counts: statusCounts.value })
        }
    } catch (error) {
        console.error('Failed to fetch device stats:', error)
    }
}

// 处理搜索
const handleSearch = () => {
    currentPage.value = 1
    // 同时更新设备列表和统计数据
    Promise.all([
        fetchDevices(1),
        fetchDeviceStats()
    ])
}

// 处理分页变化
const handlePageChange = (page: number) => {
    console.log('Page changed to:', page)
    currentPage.value = page
    fetchDevices(page)
}

// 监听筛选参数变化（排除keyword，避免实时搜索）
watch(() => ({
    deviceType: filterParams.value.deviceType,
    status: filterParams.value.status,
    location: filterParams.value.location
}), () => {
    handleSearch()
}, { deep: true })

// 页面加载时获取数据
onMounted(async () => {
    await Promise.all([
        fetchDevices(1),
        fetchDeviceStats()
    ])
})
</script>

<style scoped>
.device-page {
    background-color: white;
    min-height: 100vh;
}

/* 筛选区域样式 */
.filter-section {
    background: white;
    margin-bottom: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

/* 统计区域样式 */
.stats-section {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    margin-bottom: 8px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    gap: 16px;
}

.stats-circle {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-shrink: 0;
}

.circle-label {
    margin-top: 4px;
    font-size: 12px;
    color: #646566;
    font-weight: 500;
}

.stats-info {
    flex: 1;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
}

.stats-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4px 0;
}

.label {
    font-size: 12px;
    color: #646566;
    font-weight: 500;
}

.value {
    font-size: 12px;
    font-weight: 600;
}

.value.available { color: #07c160; }
.value.borrowed { color: #ff9500; }
.value.repairing { color: #ee0a24; }

/* 设备列表区域样式 */
.device-list-section {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    overflow: hidden;
}

.device-card {
    margin-bottom: 8px;
    background-color: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.device-card :deep(.van-card__footer) {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
}
.device-desc {
    min-height: 50px;
    max-height: 50px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.status-tag {
    margin-right: 8px;
}

.type-tag {
    margin-right: 8px;
}

.location-info {
    font-size: 12px;
    color: #969799;
}

/* 骨架屏样式 */
.skeleton-container {
    padding: 16px;
}

.skeleton-card {
    display: flex;
    align-items: flex-start;
    margin-bottom: 16px;
    padding: 16px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.skeleton-thumb {
    width: 60px;
    height: 60px;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    border-radius: 8px;
    margin-right: 12px;
    animation: skeleton-loading 1.5s infinite;
}

.skeleton-content {
    flex: 1;
}

.skeleton-title {
    width: 60%;
    height: 16px;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    border-radius: 4px;
    margin-bottom: 8px;
    animation: skeleton-loading 1.5s infinite;
}

.skeleton-desc {
    width: 80%;
    height: 14px;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    border-radius: 4px;
    margin-bottom: 12px;
    animation: skeleton-loading 1.5s infinite;
}

.skeleton-footer {
    display: flex;
    align-items: center;
    gap: 8px;
}

.skeleton-tag {
    width: 50px;
    height: 20px;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    border-radius: 10px;
    animation: skeleton-loading 1.5s infinite;
}

@keyframes skeleton-loading {
    0% {
        background-position: -200% 0;
    }
    100% {
        background-position: 200% 0;
    }
}

/* 分页样式 */
.pagination {
    margin: 16px;
    display: flex;
    justify-content: center;
}
</style>
