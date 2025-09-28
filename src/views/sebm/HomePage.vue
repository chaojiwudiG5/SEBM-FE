<!--
 * @Description: 用户设备借用信息展示页面
 * @version: v1.0.0
 * @Author: GaoMingze
 * @Date: 2025-09-22 00:17:17
 * @LastEditors: GaoMingze
 * @LastEditTime: 2025-09-22 01:30:52
-->
<template>
    <div class="home-page">
        <!-- 借还状态概览 -->
        <div class="borrow-overview">
            <div class="circles-section">
                <div class="circle-item">
                    <van-circle
                        :rate="100"
                        :speed="30"
                        :text="`${usingCount}/${MaxBorrowedCount}`"
                        :current-rate="borrowRate"
                        stroke-width="24"
                        color="#1989fa"
                        layer-color="#f0f0f0"
                        size="100"
                    />
                    <div class="circle-label">Borrowed</div>
                </div>
                <div class="circle-item">
                    <van-circle
                        :rate="100"
                        :speed="30"
                        :text="`${reservedCount}/${MaxReservedCount}`"
                        :current-rate="reservedRate"
                        stroke-width="24"
                        color="#ff6b35"
                        layer-color="#f0f0f0"
                        size="100"
                    />
                    <div class="circle-label">Reserved</div>
                </div>
            </div>
            <div class="info-section">
                <div class="info-title">Device Status Overview</div>
                <div class="info-content">
                    <div class="info-row">
                        <div class="info-item">
                            <span class="label">Current Borrowed:</span>
                            <span class="value">{{ usingCount }}</span>
                        </div>
                        <div class="info-item">
                            <span class="label">Max Borrowed:</span>
                            <span class="value">{{ MaxBorrowedCount }}</span>
                        </div>
                    </div>
                    <div class="info-row">
                        <div class="info-item">
                            <span class="label">Current Reserved:</span>
                            <span class="value-reserved">{{ reservedCount }}</span>
                        </div>
                        <div class="info-item">
                            <span class="label">Max Reserved:</span>
                            <span class="value-reserved">{{ MaxReservedCount }}</span>
                        </div>
                    </div>
                    <div class="info-row">
                        <div class="info-item">
                            <span class="label">Remaining Borrow:</span>
                            <span class="value">{{ MaxBorrowedCount - usingCount }}</span>
                        </div>
                        <div class="info-item">
                            <span class="label">Overdue Times:</span>
                            <span class="value-overdue">{{ overdueCount }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 待归还设备列表 -->
        <!-- 骨架屏 -->
        <div v-if="usingLoading" class="skeleton-container">
            <div v-for="n in 3" :key="n" class="skeleton-card">
                <div class="skeleton-thumb"></div>
                <div class="skeleton-content">
                    <div class="skeleton-title"></div>
                    <div class="skeleton-desc"></div>
                    <div class="skeleton-footer">
                        <div class="skeleton-tag"></div>
                        <div class="skeleton-time"></div>
                    </div>
                </div>
            </div>
        </div>
        <van-collapse v-else v-model="activeCollapse" class="device-collapse">
            <van-collapse-item title="Using Devices" name="using" :disabled="usingRecords.length === 0">
                <template #title>
                    <span>Using Devices</span>
                    <van-tag type="warning" style="margin-left: 8px;">{{ usingRecords.length }}</van-tag>
                </template>
                <van-empty v-if="usingRecords.length === 0" description="No using devices" />
                <div v-else>
        <van-card
                        v-for="record in usingRecords"
                        :key="record.id"
                        :title="record.deviceName"
                        :thumb="record.image"
                        class="device-card"
                    >
                        <template #footer>
                            <van-tag type="warning">Using</van-tag><br>
                            <van-tag type="primary">Borrow Time: {{ formatDate(record.borrowTime) }}</van-tag><br>
                            <van-tag type="danger">Due Time: {{ formatDate(record.dueTime) }}</van-tag>
                        </template>
                    </van-card>
                </div>
            </van-collapse-item>
        </van-collapse>

        <!-- 最近归还记录 -->
        <!-- 骨架屏 -->
        <div v-if="returnedLoading" class="skeleton-container">
            <div v-for="n in 3" :key="n" class="skeleton-card">
                <div class="skeleton-thumb"></div>
                <div class="skeleton-content">
                    <div class="skeleton-title"></div>
                    <div class="skeleton-desc"></div>
                    <div class="skeleton-footer">
                        <div class="skeleton-tag"></div>
                        <div class="skeleton-time"></div>
                    </div>
                </div>
            </div>
        </div>
        <van-collapse v-else v-model="activeCollapse" class="device-collapse">
            <van-collapse-item title="Recent Returned Records" name="returned" :disabled="returnedRecords.length === 0">
                <template #title>
                    <span>Recent Returned Records</span>
                    <van-tag type="success" style="margin-left: 8px;">{{ returnedRecords.length }}</van-tag>
                </template>
                <van-empty v-if="returnedRecords.length === 0" description="No returned records" />
                <div v-else>
        <van-card
                        v-for="record in returnedRecords"
                        :key="record.id"
                        :title="record.deviceName"
                        :thumb="record.image"
                        class="device-card"
                    >
                        <template #footer>
                            <van-tag type="success">Returned</van-tag><br>
                            <van-tag type="primary">Borrow Time: {{ formatDate(record.borrowTime) }}</van-tag><br>
                            <van-tag type="primary">Return Time: {{ formatDate(record.returnTime) }}</van-tag>
                        </template>
                    </van-card>
                    <!-- 分页组件 -->
                    <van-pagination
                        v-model="currentPage"
                        :total-items="totalReturnedRecords"
                        mode="simple"
                        :items-per-page="5"
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
            </van-collapse-item>
        </van-collapse>

    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { useUserStore } from '../../store/user'
import { getBorrowRecordListWithStatus } from '../../api/borrow'

const userStore = useUserStore()

// 常量定义：用户最大借用数量和最大预约数量
const MaxBorrowedCount = ref(userStore.userInfo?.maxBorrowedDeviceCount || 3)
const MaxReservedCount = ref(userStore.userInfo?.maxReservedDeviceCount || 2)
const overdueCount = ref(userStore.userInfo?.overdueTimes || 0)
const usingCount = ref(userStore.userInfo?.borrowedDeviceCount || 0)
const reservedCount = ref(userStore.userInfo?.reservedDeviceCount || 0)

// 借用记录数据
const usingRecords = ref<API.BorrowRecordVo[]>([])
const returnedRecords = ref<API.BorrowRecordVo[]>([])
const usingLoading = ref(false)
const returnedLoading = ref(false)

// 折叠面板控制 - 根据数据动态设置
const activeCollapse = ref<string[]>([])

// 计算哪些面板应该展开
const updateActiveCollapse = () => {
    const active: string[] = []
    if (usingRecords.value.length > 0) {
        active.push('using')
    }
    if (returnedRecords.value.length > 0) {
        active.push('returned')
    }
    activeCollapse.value = active
}

// 分页相关数据
const currentPage = ref(1)
const totalReturnedRecords = ref(0)
const pageSize = 5

// 计算借用比例（百分比）
const borrowRate = computed(() => {
    const rate = Math.round((usingCount.value / MaxBorrowedCount.value) * 100)
    console.log('Borrow rate calculated:', rate, 'usingCount:', usingCount.value, 'MaxBorrowedCount:', MaxBorrowedCount.value)
    return rate
})

// 计算预约比例（百分比）
const reservedRate = computed(() => {
    const rate = Math.round((reservedCount.value / MaxReservedCount.value) * 100)
    console.log('Reserved rate calculated:', rate, 'reservedCount:', reservedCount.value, 'MaxReservedCount:', MaxReservedCount.value)
    return rate
})

// 格式化日期
const formatDate = (dateString?: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    
    // 使用toLocaleString来包含时间，并指定时区为UTC
    return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'UTC' // 保持UTC时间，不进行本地时区转换
    })
}

// 获取待归还设备列表
const fetchUsingRecords = async () => {
    if (!userStore.userInfo?.id) {
        console.log('User ID is not available:', userStore.userInfo)
        return
    }
    
    usingLoading.value = true
    try {
        const response = await getBorrowRecordListWithStatus({
            pageNumber: 1,
            pageSize: 5,
            userId: userStore.userInfo.id,
            status: 0 // 0表示待归还
        })
        
        console.log('Using records response:', response)
        
        if (response && Array.isArray(response)) {
            usingRecords.value = response
        } else {
            console.log('API returned error or no data:', response)
        }
    } finally {
        usingLoading.value = false
        updateActiveCollapse() // 更新折叠面板状态
    }
}

// 获取已归还设备列表（分页）
const fetchReturnedRecords = async (page: number = 1) => {
    if (!userStore.userInfo?.id) {
        console.log('User ID is not available for returned records:', userStore.userInfo)
        return
    }
    
    returnedLoading.value = true
    try {
        console.log('Fetching returned records for user:', userStore.userInfo.id, 'page:', page)
        const response = await getBorrowRecordListWithStatus({
            pageNumber: page,
            pageSize: pageSize,
            userId: userStore.userInfo.id,
            status: 1 // 1表示已归还
        })
        
        console.log('Returned records response:', response)
        
        if (response && Array.isArray(response)) {
            // 按归还时间降序排序
            returnedRecords.value = response.sort((a: API.BorrowRecordVo, b: API.BorrowRecordVo) => {
                if (!a.returnTime || !b.returnTime) return 0
                return new Date(b.returnTime).getTime() - new Date(a.returnTime).getTime()
            })
            console.log('Returned records set:', returnedRecords.value)
        } else {
            console.log('API returned error or no data for returned records:', response)
        }
    } catch (error) {
        console.error('Failed to get returned records:', error)
    } finally {
        returnedLoading.value = false
        updateActiveCollapse() // 更新折叠面板状态
    }
}

// 获取归还记录总数（用于分页）
const fetchReturnedRecordsTotal = async () => {
    if (!userStore.userInfo?.id) return
    
    try {
        // 获取总数，使用大的pageSize来获取所有记录数
        const response = await getBorrowRecordListWithStatus({
            pageNumber: 1,
            pageSize: 1000, // 获取大量数据来统计总数
            userId: userStore.userInfo.id,
            status: 1
        })
        
        if (response && Array.isArray(response)) {
            totalReturnedRecords.value = response.length
        }
    } catch (error) {
        console.error('Failed to get returned records total:', error)
    }
}

// 处理分页变化
const handlePageChange = (page: number) => {
    currentPage.value = page
    fetchReturnedRecords(page)
}

// 页面加载时获取数据
onMounted(async () => {
    console.log('HomePage mounted, user info:', userStore.userInfo)
    
    // 确保用户信息已加载
    if (!userStore.userInfo?.id) {
        console.log('User info not available, trying to load from server...')
        await (userStore as any).loadFromServer()
        console.log('User info after loading:', userStore.userInfo)
    }
    
    if (userStore.userInfo?.id) {
        await Promise.all([
            fetchUsingRecords(),
            fetchReturnedRecords(1), // 获取第一页数据
            fetchReturnedRecordsTotal() // 获取总数
        ])
    } else {
        console.log('Still no user info available')
    }
})
</script>

<style scoped>
.home-page {
    background-color: white;
}

.swipe-container {
    margin-bottom: 12px;
}

.swipe-container img {
    width: 100%;
    height: auto;
    display: block;
}

.borrow-overview {
    display: flex;
    align-items: flex-start;
    padding: 20px;
    margin-bottom: 12px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    gap: 20px;
}

.circles-section {
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
}

.circle-item {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.circle-label {
    margin-top: 8px;
    font-size: 12px;
    color: #646566;
    font-weight: 500;
}

.info-section {
    flex: 1;
    padding-left: 8px;
}

.device-card{
    background-color: white;
}

/* /* 折叠面板样式 */
.device-collapse {
    margin-bottom: 12px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    overflow: hidden;
}


/* 分页样式 */
.pagination {
    margin-top: 16px;
    display: flex;
    justify-content: center;
}

.info-title {
    font-size: 16px;
    font-weight: 600;
    color: #1d1d1f;
    margin-bottom: 16px;
    text-align: center;
}

.info-content {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.info-row {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    border-bottom: 2px solid #f0f0f0;
}

.info-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 0;
    flex: 1;
}

.info-item:last-child {
    border-bottom: none;
}

.label {
    font-size: 14px;
    color: #646566;
    font-weight: 500;
}

.value {
    font-size: 14px;
    color: #1989fa;
    font-weight: 600;
}
.value-overdue {
    font-size: 14px;
    color: #ff4d4f;
    font-weight: 600;
}

.value-reserved {
    font-size: 14px;
    color: #ff6b35;
    font-weight: 600;
}
/* Cell Group 标题样式优化 */
.section :deep(.van-cell-group__title) {
    font-size: 16px;
    font-weight: 600;
    color: #1d1d1f;
    padding: 16px 16px 12px;
    background: #f8f9fa;
    border-bottom: 1px solid #ebedf0;
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
    justify-content: space-between;
}

.skeleton-tag {
    width: 50px;
    height: 20px;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    border-radius: 10px;
    animation: skeleton-loading 1.5s infinite;
}

.skeleton-time {
    width: 120px;
    height: 14px;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    border-radius: 4px;
    animation: skeleton-loading 1.5s infinite;
}
::v-deep(.van-cell-group__title) {
    color: #1d1d1f;
  /* font-size: 18px; */
  font-weight: bold;
}
@keyframes skeleton-loading {
    0% {
        background-position: -200% 0;
    }
    100% {
        background-position: 200% 0;
    }
}
</style>
