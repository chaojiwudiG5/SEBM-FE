<!--
 * @Description: 设备借用页面
 * @version: v1.0.0
 * @Author: GaoMingze
 * @Date: 2025-09-27 13:02:06
 * @LastEditors: GaoMingze
 * @LastEditTime: 2025-09-27 13:02:58
-->
<template>
    <div class="borrow-page">
        <!-- 设备信息展示区 -->
        <div class="device-info-section">
            <van-card
                v-if="deviceInfo"
                :title="deviceInfo.deviceName"
                :desc="deviceInfo.description || 'No description'"
                :thumb="deviceInfo.image || 'https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg'"
                class="device-card"
            >
                <template #tags>
                    <van-tag :type="getStatusTagType(deviceInfo.status) as any" class="status-tag">
                        {{ getStatusText(deviceInfo.status) }}
                    </van-tag>
                    <van-tag type="primary" plain class="type-tag">
                        {{ deviceInfo.deviceType }}
                    </van-tag>
                    <van-tag type="default" plain class="location-tag">
                        📍 {{ deviceInfo.location }}
                    </van-tag>
                </template>
            </van-card>
            
            <!-- 设备不可借用提示 -->
            <van-notice-bar
                v-if="deviceInfo && deviceInfo.status !== 0"
                type="warning"
                text="This device is not available for borrowing"
                class="notice-bar"
            />
        </div>

        <!-- 借用表单区 -->
        <div class="form-section">
            <van-form @submit="handleSubmit">
                <!-- 借用日期选择 -->
                <van-cell-group title="Borrow Information" class="form-group">
                    <van-field
                        v-model="formData.borrowDate"
                        name="borrowDate"
                        label="Borrow Date"
                        placeholder="Select borrow date"
                        readonly
                        is-link
                        @click="showBorrowCalendar = true"
                        :rules="[{ required: true, message: 'Please select borrow date' }]"
                    />
                    
                    <!-- 借用日期日历 -->
                    <van-popup v-model:show="showBorrowCalendar" position="bottom" round>
                        <van-calendar
                            v-model:show="showBorrowCalendar"
                            type="single"
                            :min-date="minDate"
                            :max-date="maxDate"
                            :default-date="borrowDate"
                            @confirm="onBorrowDateConfirm"
                            @close="showBorrowCalendar = false"
                        />
                    </van-popup>
                </van-cell-group>

                <!-- 归还日期选择 -->
                <van-cell-group class="form-group">
                    <van-field
                        v-model="formData.dueDate"
                        name="dueDate"
                        label="Due Date"
                        placeholder="Select due date"
                        readonly
                        is-link
                        @click="showDueCalendar = true"
                        :rules="[{ required: true, message: 'Please select due date' }]"
                    />
                    
                    <!-- 归还日期日历 -->
                    <van-popup v-model:show="showDueCalendar" position="bottom" round>
                        <van-calendar
                            v-model:show="showDueCalendar"
                            type="single"
                            :min-date="minDate"
                            :max-date="maxDate"
                            :default-date="dueDate"
                            @confirm="onDueDateConfirm"
                            @close="showDueCalendar = false"
                        />
                    </van-popup>
                </van-cell-group>

                <!-- 备注 -->
                <van-cell-group class="form-group">
                    <van-field
                        v-model="formData.remarks"
                        name="remarks"
                        label="Remarks"
                        type="textarea"
                        placeholder="Optional remarks..."
                        rows="3"
                        autosize
                    />
                </van-cell-group>

                <!-- 提交按钮 -->
                <div class="submit-section">
                    <van-button
                        type="primary"
                        size="large"
                        native-type="submit"
                        :loading="submitting"
                        :disabled="!canSubmit"
                        class="submit-button"
                    >
                        {{ submitting ? 'Submitting...' : 'Submit Borrow Request' }}
                    </van-button>
                    
                    <van-button
                        type="default"
                        size="large"
                        @click="handleCancel"
                        class="cancel-button"
                    >
                        Cancel
                    </van-button>
                </div>
            </van-form>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '../../store/user'
import { getDevice } from '../../api/device'
import { borrowDevice } from '../../api/borrow'
import { showNotify, showConfirmDialog } from 'vant'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

// 设备信息
const deviceInfo = ref<API.DeviceVo | null>(null)
const deviceId = ref<string | null>(null)

// 表单数据
const formData = ref({
    borrowDate: '',
    dueDate: '',
    borrowTime: '',
    dueTime: '',
    remarks: ''
})

// 日历选择器相关
const showBorrowCalendar = ref(false)
const showDueCalendar = ref(false)
const borrowDate = ref<Date>(new Date())
const dueDate = ref<Date>(new Date())

// 日期范围限制（明天到七天后）
const minDate = ref(new Date())
const maxDate = ref(new Date())

// 提交状态
const submitting = ref(false)

// 计算属性
const canSubmit = computed(() => {
    return deviceInfo.value?.status === 0 && 
           formData.value.borrowDate && 
           formData.value.dueDate &&
           !submitting.value
})

// 获取设备状态文本
const getStatusText = (status?: number): string => {
    switch (status) {
        case 0: return 'Available'
        case 1: return 'Borrowed'
        case 2: return 'Repairing'
        case 3: return 'Reserved'
        default: return 'Unknown'
    }
}

// 获取设备状态标签类型
const getStatusTagType = (status?: number): string => {
    switch (status) {
        case 0: return 'success'
        case 1: return 'warning'
        case 2: return 'danger'
        case 3: return 'info'
        default: return 'default'
    }
}

// 格式化日期显示
const formatDateDisplay = (date: Date): string => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

// 创建带当前时间的完整日期时间
const createDateTimeWithCurrentTime = (date: Date): string => {
    const now = new Date()
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    const seconds = String(now.getSeconds()).padStart(2, '0')
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`
}

// 借用日期确认
const onBorrowDateConfirm = (value: Date) => {
    console.log('Borrow date selected:', value)
    borrowDate.value = value
    formData.value.borrowDate = formatDateDisplay(value)
    formData.value.borrowTime = createDateTimeWithCurrentTime(value)
    showBorrowCalendar.value = false
}

// 归还日期确认
const onDueDateConfirm = (value: Date) => {
    console.log('Due date selected:', value)
    dueDate.value = value
    formData.value.dueDate = formatDateDisplay(value)
    formData.value.dueTime = createDateTimeWithCurrentTime(value)
    showDueCalendar.value = false
}

// 获取设备信息
const fetchDeviceInfo = async (id: string) => {
    try {
        const response = await getDevice({ id: id as any })
        if (response) {
            deviceInfo.value = response
            console.log('Device info loaded:', response)
        } else {
            showNotify({ type: 'danger', message: 'Device not found' })
            router.push('/sebm/user/device')
        }
    } catch (error) {
        console.error('Failed to fetch device info:', error)
        showNotify({ type: 'danger', message: 'Failed to load device information' })
        router.push('/sebm/user/device')
    }
}

// 提交借用申请
const handleSubmit = async () => {
    if (!canSubmit.value) return
    
    try {
        await showConfirmDialog({
            title: 'Confirm Borrow Request',
            message: `Are you sure you want to borrow "${deviceInfo.value?.deviceName}"?`,
            confirmButtonText: 'Confirm',
            cancelButtonText: 'Cancel'
        })
        
        submitting.value = true
        
        const borrowData: API.BorrowRecordAddDto = {
            userId: userStore.userInfo!.id!,
            deviceId: deviceId.value! as any,
            borrowTime: formData.value.borrowTime,
            dueTime: formData.value.dueTime,
            remarks: formData.value.remarks || undefined
        }
        
        console.log('Submitting borrow request:', borrowData)
        
        const response = await borrowDevice(borrowData)
        
        if (response) {
            showNotify({ type: 'success', message: 'Borrow request submitted successfully!' })
            router.push('/sebm/user/device')
        }
    } catch (error) {
        console.error('Failed to submit borrow request:', error)
        showNotify({ type: 'danger', message: 'Failed to submit borrow request' })
    } finally {
        submitting.value = false
    }
}

// 取消借用
const handleCancel = () => {
    router.push('/sebm/user/home')
}

// 页面加载时获取设备信息
onMounted(async () => {
    const deviceIdParam = route.query.deviceId as string
    
    if (!deviceIdParam || !/^\d+$/.test(deviceIdParam)) {
        showNotify({ type: 'danger', message: 'Invalid device ID' })
        router.push('/sebm/user/device')
        return
    }
    
    deviceId.value = deviceIdParam
    await fetchDeviceInfo(deviceId.value)
    
    // 设置日期范围：明天到七天后
    const now = new Date()
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1) // 明天
    const weekLater = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7) // 7天后
    
    minDate.value = tomorrow
    maxDate.value = weekLater
    
    // 设置默认借用日期为明天
    borrowDate.value = tomorrow
    formData.value.borrowDate = formatDateDisplay(tomorrow)
    formData.value.borrowTime = createDateTimeWithCurrentTime(tomorrow)
    
    // 设置默认归还日期为3天后
    const defaultDueDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3)
    dueDate.value = defaultDueDate
    formData.value.dueDate = formatDateDisplay(defaultDueDate)
    formData.value.dueTime = createDateTimeWithCurrentTime(defaultDueDate)
})
</script>

<style scoped>
.borrow-page {
    background-color: #f7f8fa;
    min-height: 100vh;
    padding: 16px;
}

/* 设备信息区域 */
.device-info-section {
    margin-bottom: 16px;
}

.device-card {
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    margin-bottom: 12px;
}

.device-card :deep(.van-card__tags) {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    margin-top: 8px;
}

.status-tag {
    margin-right: 8px;
}

.type-tag {
    margin-right: 8px;
}

.location-tag {
    font-size: 12px;
    color: #969799;
}

.notice-bar {
    margin-top: 12px;
}

/* 表单区域 */
.form-section {
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    overflow: hidden;
}

.form-group {
    margin-bottom: 0;
}

.form-group :deep(.van-cell-group__title) {
    font-size: 16px;
    font-weight: 600;
    color: #1d1d1f;
    padding: 16px 16px 12px;
    background: #f8f9fa;
    border-bottom: 1px solid #ebedf0;
}

/* 提交按钮区域 */
.submit-section {
    padding: 20px 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.submit-button {
    border-radius: 8px;
    font-weight: 600;
}

.cancel-button {
    border-radius: 8px;
    font-weight: 500;
}

/* 响应式设计 */
@media (max-width: 375px) {
    .borrow-page {
        padding: 12px;
    }
    
    .submit-section {
        padding: 16px 12px;
    }
}
</style>
