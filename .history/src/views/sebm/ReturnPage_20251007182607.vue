<!--
 * @Description: 设备归还页面
 * @version: v1.0.0
 * @Author: GaoMingze
 * @Date: 2025-01-27 00:00:00
 * @LastEditors: GaoMingze
 * @LastEditTime: 2025-01-27 00:00:00
-->
<template>
    <div class="return-page">
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
                                    <!-- 借用时间信息 -->
                    <div class="borrow-time-tag-container">
                        <van-tag v-if="borrowRecord" type="primary" class="borrow-time-tag">
                        Borrow: {{ formatDate(borrowRecord.borrowTime) }}
                        </van-tag>
                        <van-tag v-if="borrowRecord" type="danger" class="due-time-tag">
                            Due: {{ formatDate(borrowRecord.dueTime) }}
                        </van-tag>
                    </div>
                </template>
            </van-card>
            
            <!-- 设备不可归还提示 -->
            <van-notice-bar
                v-if="deviceInfo && deviceInfo.status !== 1"
                type="warning"
                text="This device is not currently borrowed and cannot be returned"
                class="notice-bar"
            />
        </div>

        <!-- 归还表单区 -->
        <div class="form-section">
            <van-form @submit="handleSubmit">
                <!-- 位置信息 -->
                <van-cell-group title="Location Information" class="form-group">
                    <van-cell title="Current Location" :value="locationStatus" />
                    <van-cell 
                        title="Location Check" 
                        :value="isInFence ? '✅ In Range' : '❌ Out of Range!Please move to the designated return area'"
                    />
                    <van-button 
                        type="primary" 
                        size="small" 
                        @click="getCurrentLocation"
                        :loading="locationLoading"
                        class="location-btn"
                    >
                        Refresh Location
                    </van-button>
                </van-cell-group>

                <!-- 归还时间 -->
                <van-cell-group title="Return Information" class="form-group">
                    <van-field
                        v-model="formData.returnTime"
                        name="returnTime"
                        label="Return Time"
                        placeholder="Current time"
                        readonly
                        :rules="[{ required: true, message: 'Return time is required' }]"
                    />
                </van-cell-group>

                <!-- 备注 -->
                <van-cell-group class="form-group">
                    <van-field
                        v-model="formData.remarks"
                        name="remarks"
                        label="Remarks"
                        type="textarea"
                        placeholder="Optional remarks about the return"
                        autosize
                        maxlength="200"
                        show-word-limit
                    />
                </van-cell-group>

                <!-- 设备报修折叠面板 -->
                <van-collapse v-model="needMaintenance" class="maintenance-collapse">
                    <van-collapse-item title="Device Maintenance Report" name="maintenance" icon="warning">
                        <van-form>
                            <van-field
                                v-model="maintenanceForm.description"
                                name="maintenanceDescription"
                                label="Issue Description"
                                type="textarea"
                                placeholder="Please describe the device issues you encountered"
                                autosize
                                maxlength="500"
                                show-word-limit
                                :rules="isMaintenanceSelected ? [{ required: true, message: 'Please describe the issue' }] : []"
                            />
                            <van-field
                                name="maintenanceImage"
                                label="Issue Image"
                                placeholder="Upload image (optional)"
                            >
                                <template #input>
                                    <van-uploader
                                        v-model="fileList"
                                        :after-read="handleFileUpload"
                                        :before-delete="handleFileDelete"
                                        :max-count="1"
                                        :max-size="5 * 1024 * 1024"
                                        accept="image/*"
                                        :disabled="uploading"
                                        upload-text="Upload Image"
                                        class="maintenance-uploader"
                                    />
                                </template>
                            </van-field>
                            <van-button 
                                type="default" 
                                size="small" 
                                @click="needMaintenance = []"
                                class="cancel-maintenance-btn"
                            >
                                Cancel Maintenance Report
                            </van-button>
                        </van-form>
                    </van-collapse-item>
                </van-collapse>

                <!-- 提交按钮 -->
                <div class="submit-section">
                    <van-button
                        type="primary"
                        size="large"
                        round
                        block
                        native-type="submit"
                        :loading="submitting"
                        :disabled="!isInFence"
                        class="submit-btn"
                    >
                        {{ isInFence ? 'Return Device' : 'Please Move to Return Area' }}
                    </van-button>
                </div>
            </van-form>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showNotify, showConfirmDialog } from 'vant'
import { useUserStore } from '../../store/user'
import { getDevice } from '../../api/device'
import { getBorrowRecordListWithStatus, returnDevice } from '../../api/borrow'
import { createMaintenanceRecord } from '../../api/userMaintenanceRecord'
import { getUploadUrl } from '../../api/ossController'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

// 响应式数据
const deviceInfo = ref<API.DeviceVo | null>(null)
const borrowRecord = ref<API.BorrowRecordVo | null>(null)
const submitting = ref(false)
const locationLoading = ref(false)

// 位置相关数据
const currentLocation = ref<{ latitude: number; longitude: number } | null>(null)
const locationStatus = ref('Location not detected')

// 电子围栏配置 (示例坐标，实际应该从后端获取)
const fenceCenters = [
    { latitude: 1.278156, longitude: 103.787040 }, // 第一个坐标点
    { latitude: 1.292324, longitude: 103.776167 }  // 第二个坐标点
]
const fenceRadius = 100 // 100米半径

// 表单数据
const formData = ref({
    returnTime: '',
    remarks: ''
})

// 报修相关数据
const needMaintenance = ref<string[]>([])
const maintenanceForm = ref({
    description: '',
    fileUrl: ''
})

// 文件上传相关数据
const fileList = ref<any[]>([])
const uploading = ref(false)

// 计算是否选择报修
const isMaintenanceSelected = computed(() => needMaintenance.value.includes('maintenance'))

// 计算属性
const isInFence = computed(() => {
    if (!currentLocation.value) return false
    
    // 检查当前位置是否在任何一个围栏范围内
    return fenceCenters.some(center => {
        const distance = calculateDistance(
            currentLocation.value!.latitude,
            currentLocation.value!.longitude,
            center.latitude,
            center.longitude
        )
        return distance <= fenceRadius
    })
})

// 获取设备信息
const fetchDeviceInfo = async (deviceId: number) => {
    try {
        const response = await getDevice({ id: deviceId })
        if (response) {
            deviceInfo.value = response
        } else {
            showNotify({ type: 'danger', message: 'Device not found' })
            router.back()
        }
    } catch (error) {
        console.error('Failed to fetch device info:', error)
        showNotify({ type: 'danger', message: 'Failed to load device information' })
        router.back()
    }
}

// 获取借用记录
const fetchBorrowRecord = async (deviceId: number) => {
    try {
        const response = await getBorrowRecordListWithStatus({
            pageNumber: 1,
            pageSize: 10,
            userId: userStore.userInfo?.id || 0,
            status: 0 // 待归还状态
        })
        
        if (response && Array.isArray(response)) {
            // 查找当前设备的借用记录
            const record = response.find(r => r.deviceId === deviceId)
            if (record) {
                borrowRecord.value = record
            } else {
                showNotify({ type: 'warning', message: 'No active borrow record found for this device' })
            }
        }
    } catch (error) {
        console.error('Failed to fetch borrow record:', error)
        showNotify({ type: 'danger', message: 'Failed to load borrow record' })
    }
}

// 获取当前位置
const getCurrentLocation = () => {
    locationLoading.value = true
    
    if (!navigator.geolocation) {
        showNotify({ type: 'danger', message: 'Geolocation is not supported by this browser' })
        locationLoading.value = false
        return
    }
    
    navigator.geolocation.getCurrentPosition(
        (position) => {
            currentLocation.value = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            }
            
            locationStatus.value = `${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`
            locationLoading.value = false
            
            if (isInFence.value) {
                showNotify({ type: 'success', message: 'You are in the return area' })
            } else {
                showNotify({ type: 'warning', message: 'You are outside the return area' })
            }
        },
        (error) => {
            console.error('Geolocation error:', error)
            locationLoading.value = false
            
            let message = 'Failed to get location'
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    message = 'Location access denied by user'
                    break
                case error.POSITION_UNAVAILABLE:
                    message = 'Location information is unavailable'
                    break
                case error.TIMEOUT:
                    message = 'Location request timed out'
                    break
            }
            
            showNotify({ type: 'danger', message })
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000
        }
    )
}

// 计算两点间距离 (使用Haversine公式)
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371e3 // 地球半径，单位：米
    const φ1 = lat1 * Math.PI / 180
    const φ2 = lat2 * Math.PI / 180
    const Δφ = (lat2 - lat1) * Math.PI / 180
    const Δλ = (lon2 - lon1) * Math.PI / 180

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))

    return R * c // 距离，单位：米
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

// 处理文件上传
const handleFileUpload = async (file: any) => {
    uploading.value = true
    
    try {
        // 生成文件名
        const timestamp = Date.now()
        const fileExtension = file.file.name.split('.').pop() || 'jpg'
        const filename = `${timestamp}-image.${fileExtension}`
        console.log('filename', filename)
        // 获取上传URL
        const uploadUrlResponse : any = await getUploadUrl({
            filename: filename,
            contentType: file.file.type || 'image/jpeg'
        })
        console.log('uploadUrlResponse:', uploadUrlResponse)
        console.log('uploadUrlResponse.data:', uploadUrlResponse.data)
        console.log('uploadUrlResponse.data?.uploadUrl:', uploadUrlResponse.data?.uploadUrl)
        console.log('uploadUrlResponse.data?.fileUrl:', uploadUrlResponse.data?.fileUrl)
        
        if (!uploadUrlResponse || !uploadUrlResponse.uploadUrl || !uploadUrlResponse.fileUrl) {
            console.error('Missing upload URL or file URL:', {
                hasResponse: !!uploadUrlResponse,
                hasData: !!uploadUrlResponse,
                hasUploadUrl: !!uploadUrlResponse?.uploadUrl,
                hasFileUrl: !!uploadUrlResponse?.fileUrl
            })
            throw new Error('Failed to get upload URL')
        }
        
        const { uploadUrl, fileUrl } = uploadUrlResponse
        
        console.log('uploadUrl:', uploadUrl)
        console.log('fileUrl:', fileUrl)
        console.log('file to upload:', file.file)
        
        // 上传文件到OSS
        const uploadResponse = await fetch(uploadUrl, {
            method: 'PUT',
            body: file.file,
            headers: {
                'Content-Type': file.file.type || 'image/jpeg'
            },
            mode: 'cors' // 明确指定CORS模式
        })
        
        console.log('uploadResponse:', uploadResponse)
        console.log('uploadResponse.ok:', uploadResponse.ok)
        console.log('uploadResponse.status:', uploadResponse.status)
        console.log('uploadResponse.statusText:', uploadResponse.statusText)
        
        if (!uploadResponse.ok) {
            let errorText = ''
            try {
                errorText = await uploadResponse.text()
            } catch (e) {
                errorText = 'Unable to read error response'
            }
            console.error('Upload failed:', {
                status: uploadResponse.status,
                statusText: uploadResponse.statusText,
                errorText: errorText,
                url: uploadUrl
            })
            throw new Error(`Upload failed: ${uploadResponse.status} ${uploadResponse.statusText} - ${errorText}`)
        }
        
        // 保存文件URL
        maintenanceForm.value.fileUrl = fileUrl
        
        // 更新文件列表显示
        fileList.value = [{
            url: fileUrl,
            name: file.file.name,
            status: 'done'
        }]
        
        showNotify({ type: 'success', message: 'Image uploaded successfully' })
        
    } catch (error) {
        console.error('Upload error:', error)
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
        showNotify({ 
            type: 'danger', 
            message: `Failed to upload image: ${errorMessage}`,
            duration: 5000 // 显示更长时间以便用户阅读
        })
        fileList.value = []
    } finally {
        uploading.value = false
    }
    
    // 阻止默认上传行为
    return false
}

// 删除文件
const handleFileDelete = () => {
    fileList.value = []
    maintenanceForm.value.fileUrl = ''
}

// 获取设备状态标签类型
const getStatusTagType = (status?: number) => {
    switch (status) {
        case 0: return 'success'
        case 1: return 'warning'
        case 2: return 'danger'
        default: return 'default'
    }
}

// 获取设备状态文本
const getStatusText = (status?: number) => {
    switch (status) {
        case 0: return 'Available'
        case 1: return 'Borrowed'
        case 2: return 'Maintenance'
        default: return 'Unknown'
    }
}

// 处理表单提交
const handleSubmit = async () => {
    if (!isInFence.value) {
        showNotify({ type: 'warning', message: 'Please move to the designated return area' })
        return
    }
    
    if (!borrowRecord.value) {
        showNotify({ type: 'danger', message: 'No borrow record found' })
        return
    }
    
    if (!currentLocation.value) {
        showNotify({ type: 'warning', message: 'Please get your current location first' })
        return
    }
    
    // 如果选择报修但没有填写描述，提示用户
    if (isMaintenanceSelected.value && !maintenanceForm.value.description.trim()) {
        showNotify({ type: 'warning', message: 'Please describe the device issue for maintenance report' })
        return
    }
    
    try {
        const confirmMessage = isMaintenanceSelected.value 
            ? `Are you sure you want to return ${deviceInfo.value?.deviceName} and submit a maintenance report?`
            : `Are you sure you want to return ${deviceInfo.value?.deviceName}?`
            
        await showConfirmDialog({
            title: 'Confirm Return',
            message: confirmMessage,
        })
        
        submitting.value = true
        
        // 归还设备
        const returnData: API.BorrowRecordReturnDto = {
            id: borrowRecord.value.id!,
            latitude: currentLocation.value.latitude.toString(),
            longitude: currentLocation.value.longitude.toString(),
            returnTime: new Date().toISOString(),
            remarks: formData.value.remarks
        }
        
        const returnResponse = await returnDevice(returnData)
        
        if (!returnResponse) {
            showNotify({ type: 'danger', message: 'Failed to return device' })
            return
        }
        
        // 如果需要报修，则调用报修接口
        if (isMaintenanceSelected.value && maintenanceForm.value.description.trim()) {
            try {
                const maintenanceData: API.UserCreateDto = {
                    borrowRecordId: borrowRecord.value?.id!,
                    description: maintenanceForm.value.description,
                    image: maintenanceForm.value.fileUrl || ''
                }
                
                await createMaintenanceRecord(maintenanceData)
                showNotify({ type: 'success', message: 'Device returned and maintenance report submitted successfully' })
            } catch (maintenanceError) {
                console.error('Failed to submit maintenance report:', maintenanceError)
                showNotify({ type: 'warning', message: 'Device returned successfully, but maintenance report submission failed' })
            }
        } else {
            showNotify({ type: 'success', message: 'Device returned successfully' })
        }
        
        await userStore.loadFromServer();
        router.push({ name: 'Home' })
        
    } finally {
        submitting.value = false
    }
}

// 初始化当前时间
const initCurrentTime = () => {
    formData.value.returnTime = new Date().toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    })
}

// 页面加载时初始化
onMounted(async () => {
    const deviceId = route.query.deviceId
    if (!deviceId || isNaN(Number(deviceId))) {
        showNotify({ type: 'danger', message: 'Invalid device ID' })
        router.back()
        return
    }
    
    initCurrentTime()
    await Promise.all([
        fetchDeviceInfo(Number(deviceId)),
        fetchBorrowRecord(Number(deviceId))
    ])
    
    // 自动获取位置
    getCurrentLocation()
})
</script>

<style scoped>
.return-page {
    background-color: white;
    min-height: 100vh;
    padding-bottom: 20px;
}

.device-info-section {
    margin-bottom: 12px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    overflow: hidden;
}

.device-card {
    background: white;
}

.status-tag {
    margin-right: 8px;
}

.type-tag {
    margin-right: 8px;
}

.location-tag {
    margin-right: 8px;
}

.borrow-time-tag-container {
    display: flex;
    flex-direction: column;
    
}

.borrow-time-tag {
    margin-top: 4px;
    /* display: block; */
}

.due-time-tag {
    margin-top: 4px;
    /* display: block; */
}

.notice-bar {
    margin: 12px;
}

.form-section {
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    overflow: hidden;
}

.form-group {
    margin-bottom: 0;
}

.form-group:not(:last-child) {
    border-bottom: 1px solid #ebedf0;
}

.location-btn {
    margin: 12px 16px;
}

.submit-section {
    padding: 20px 16px;
    background: white;
}

.submit-btn {
    font-size: 16px;
    font-weight: 600;
}

.maintenance-collapse {
    margin: 12px 16px;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.cancel-maintenance-btn {
    margin: 12px 0;
    width: 100%;
}

.maintenance-uploader {
    width: 100%;
}

:deep(.van-uploader__upload) {
    border-radius: 6px;
    border: 1px dashed #dcdee0;
}

:deep(.van-uploader__preview-image) {
    border-radius: 6px;
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
</style>
