<template>
    <div class="tasks-page">
        <!-- 处理中的任务列表 -->
        <!-- 骨架屏 -->
        <div v-if="inProgressLoading" class="skeleton-container">
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
        <van-collapse v-else v-model="activeCollapse" class="task-collapse">
            <van-collapse-item title="In Progress Tasks" name="inProgress" :disabled="inProgressTasks.length === 0">
                <template #title>
                    <span>In Progress Tasks</span>
                    <van-tag type="primary" style="margin-left: 8px;">{{ inProgressTasks.length }}</van-tag>
                </template>
                <van-empty v-if="inProgressTasks.length === 0" description="No in progress tasks" />
                <div v-else>
                    <van-card
                        v-for="task in inProgressTasks"
                        :key="task.id"
                        :title="`Device ID: ${task.deviceId}`"
                        :desc="task.description || 'No description'"
                        :thumb="task.image || 'https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg'"
                        class="task-card in-progress-card"
                    >
                        <template #footer>
                            <van-tag :type="getTaskStatusType(task.status) as any">
                                {{ getTaskStatusText(task.status) }}
                            </van-tag><br>
                            <van-tag type="default">Created: {{ formatDate(task.createTime) }}</van-tag><br>
                            <van-tag v-if="task.updateTime" type="default">
                                Updated: {{ formatDate(task.updateTime) }}
                            </van-tag>
                        </template>
                    </van-card>
                    <!-- 分页组件 -->
                    <van-pagination
                        v-model="inProgressPage"
                        :total-items="inProgressTotal"
                        mode="simple"
                        :items-per-page="inProgressPageSize"
                        @change="handleInProgressPageChange"
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

        <!-- 已完成的任务列表 -->
        <!-- 骨架屏 -->
        <div v-if="completedLoading" class="skeleton-container">
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
        <van-collapse v-else v-model="activeCollapse" class="task-collapse">
            <van-collapse-item title="Completed Tasks" name="completed" :disabled="completedTasks.length === 0">
                <template #title>
                    <span>Completed Tasks</span>
                    <van-tag type="success" style="margin-left: 8px;">{{ completedTasks.length }}</van-tag>
                </template>
                <van-empty v-if="completedTasks.length === 0" description="No completed tasks" />
                <div v-else>
                    <van-card
                        v-for="task in completedTasks"
                :key="task.id"
                        :title="`Device ID: ${task.deviceId}`"
                        :desc="task.description || 'No description'"
                        :thumb="task.image || 'https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg'"
                        class="task-card completed-card"
                    >
                        <template #footer>
                            <van-tag :type="getTaskStatusType(task.status) as any">
                                {{ getTaskStatusText(task.status) }}
                            </van-tag><br>
                            <van-tag type="default">Created: {{ formatDate(task.createTime) }}</van-tag><br>
                            <van-tag v-if="task.updateTime" type="default">
                                Updated: {{ formatDate(task.updateTime) }}
                            </van-tag>
                        </template>
                    </van-card>
                    <!-- 分页组件 -->
                    <van-pagination
                        v-model="completedPage"
                        :total-items="completedTotal"
                        mode="simple"
                        :items-per-page="completedPageSize"
                        @change="handleCompletedPageChange"
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
import { listMyTasks } from '../../api/mechanicanMaintenanceRecord'

const userStore = useUserStore()

// 任务数据
const inProgressTasks = ref<API.MechanicanMaintenanceRecordVo[]>([])
const completedTasks = ref<API.MechanicanMaintenanceRecordVo[]>([])
const inProgressLoading = ref(false)
const completedLoading = ref(false)

// 折叠面板控制
const activeCollapse = ref<string[]>([])

// 分页相关数据
const inProgressPage = ref(1)
const completedPage = ref(1)
const inProgressPageSize = 5
const completedPageSize = 5
const inProgressTotal = ref(0)
const completedTotal = ref(0)

// 计算哪些面板应该展开
const updateActiveCollapse = () => {
    const active: string[] = []
    if (inProgressTasks.value.length > 0) {
        active.push('inProgress')
    }
    if (completedTasks.value.length > 0) {
        active.push('completed')
    }
    activeCollapse.value = active
}

// 格式化日期
const formatDate = (dateString?: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    
    return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'UTC'
    })
}

// 获取任务状态文本
const getTaskStatusText = (status?: number) => {
    switch (status) {
        case 1: return 'In Progress'
        case 2: return 'Fixed'
        case 3: return 'Scrapped'
        default: return 'Unknown'
    }
}

// 获取任务状态标签类型
const getTaskStatusType = (status?: number) => {
    switch (status) {
        case 1: return 'primary'
        case 2: return 'success'
        case 3: return 'danger'
        default: return 'default'
    }
}

// 获取处理中的任务列表
const fetchInProgressTasks = async (page: number = 1) => {
    if (!userStore.userInfo?.id) {
        console.log('User ID is not available for in-progress tasks:', userStore.userInfo)
        return
    }
    
    inProgressLoading.value = true
    try {
        console.log('Fetching in-progress tasks for page:', page)
        const response : any = await listMyTasks({
            pageNumber: page,
            pageSize: inProgressPageSize,
            deviceId: undefined,
            status: 1 // 处理中状态
        })
        
        console.log('In-progress tasks response:', response)
        
        if (response) {
            if (page === 1) {
                inProgressTasks.value = response.records || []
            } else {
                inProgressTasks.value = [...inProgressTasks.value, ...(response.records || [])]
            }
            inProgressTotal.value = response.total || 0
            inProgressPage.value = page
            console.log('In-progress tasks set:', inProgressTasks.value)
        } else {
            console.log('API returned error or no data for in-progress tasks:', response)
        }
    } catch (error) {
        console.error('Failed to get in-progress tasks:', error)
    } finally {
        inProgressLoading.value = false
        updateActiveCollapse()
    }
}

// 获取已完成的任务列表
const fetchCompletedTasks = async (page: number = 1) => {
    if (!userStore.userInfo?.id) {
        console.log('User ID is not available for completed tasks:', userStore.userInfo)
        return
    }
    
    completedLoading.value = true
    try {
        console.log('Fetching completed tasks for page:', page)
        // 获取状态为2（修复成功）或3（报废）的任务
        const response : any = await listMyTasks({
            pageNumber: page,
            pageSize: completedPageSize,
            deviceId: undefined,
            status: undefined // 获取所有状态，然后在前端过滤
        })
        
        console.log('All tasks response:', response)
        
        if (response) {
            // 过滤出状态为2或3的任务
            const completedRecords = (response.records || []).filter(
                (task: API.MechanicanMaintenanceRecordVo) => task.status === 2 || task.status === 3
            )
            
            if (page === 1) {
                completedTasks.value = completedRecords
            } else {
                completedTasks.value = [...completedTasks.value, ...completedRecords]
            }
            completedTotal.value = completedRecords.length
            completedPage.value = page
            console.log('Completed tasks set:', completedTasks.value)
        } else {
            console.log('API returned error or no data for completed tasks:', response)
        }
    } catch (error) {
        console.error('Failed to get completed tasks:', error)
    } finally {
        completedLoading.value = false
        updateActiveCollapse()
    }
}

// 处理分页变化
const handleInProgressPageChange = (page: number) => {
    fetchInProgressTasks(page)
}

const handleCompletedPageChange = (page: number) => {
    fetchCompletedTasks(page)
}

// 页面加载时获取数据
onMounted(async () => {
    console.log('TasksPage mounted, user info:', userStore.userInfo)
    
    // 确保用户信息已加载
    if (!userStore.userInfo?.id) {
        console.log('User info not available, trying to load from server...')
        await (userStore as any).loadFromServer()
        console.log('User info after loading:', userStore.userInfo)
    }
    
    if (userStore.userInfo?.id) {
        await Promise.all([
            fetchInProgressTasks(1),
            fetchCompletedTasks(1)
        ])
    } else {
        console.log('Still no user info available')
    }
})
</script>

<style scoped>
.tasks-page {
    background-color: white;
    padding-bottom: 20px;
}

.task-collapse {
    margin-bottom: 12px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    overflow: hidden;
}

.task-card {
    margin: 8px 0;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    background-color: white;
}

.in-progress-card {
    border-left: 4px solid #1989fa;
}

.completed-card {
    border-left: 4px solid #07c160;
}

.pagination {
    margin: 16px 0;
    display: flex;
    justify-content: center;
}

/* 骨架屏样式 */
.skeleton-container {
    margin: 16px;
}

.skeleton-card {
    display: flex;
    align-items: center;
    padding: 16px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    margin-bottom: 12px;
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
    height: 20px;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    border-radius: 4px;
    margin-bottom: 8px;
    animation: skeleton-loading 1.5s infinite;
}

.skeleton-desc {
    height: 16px;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    border-radius: 4px;
    margin-bottom: 12px;
    animation: skeleton-loading 1.5s infinite;
}

.skeleton-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.skeleton-tag {
    width: 60px;
    height: 20px;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    border-radius: 10px;
    animation: skeleton-loading 1.5s infinite;
}

.skeleton-time {
    width: 100px;
    height: 16px;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    border-radius: 4px;
    animation: skeleton-loading 1.5s infinite;
}

@keyframes skeleton-loading {
    0% {
        background-position: 200% 0;
    }
    100% {
        background-position: -200% 0;
    }
}

/* 覆盖Vant样式 */
:deep(.van-cell-group__title) {
    color: #1d1d1f;
    padding: 16px 16px 12px;
    background: white;
    border-bottom: 1px solid #ebedf0;
}

:deep(.van-cell) {
    padding: 12px 16px;
}

:deep(.van-field__label) {
    font-weight: 500;
    color: #323233;
}

:deep(.van-field__control) {
    color: #646566;
}

:deep(.van-card__footer) {
    padding: 12px 16px;
    border-top: 1px solid #ebedf0;
}
</style>
