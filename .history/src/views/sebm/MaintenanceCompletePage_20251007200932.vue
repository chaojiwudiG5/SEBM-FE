<!--
 * @Description: 维修完成页面
 * @version: v1.0.0
 * @Author: GaoMingze
 * @Date: 2025-01-27 00:00:00
 * @LastEditors: GaoMingze
 * @LastEditTime: 2025-01-27 00:00:00
-->
<template>
    <div class="maintenance-complete-page">
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
            
            <!-- 设备状态检查提示 -->
            <van-notice-bar
                v-if="deviceInfo && deviceInfo.status !== 2"
                type="warning"
                text="This device is not currently under maintenance"
                class="notice-bar"
            />
        </div>

        <!-- 维修表单区 -->
        <div class="form-section">
            <van-form @submit="handleSubmit">
                <!-- 维修结果选择 -->
                <van-cell-group title="Maintenance Result" class="form-group">
                    <van-field name="maintenanceResult" label="Result">
                        <template #input>
                            <van-radio-group v-model="formData.maintenanceResult" direction="horizontal">
                                <van-radio name="fixed">Fixed</van-radio>
                                <van-radio name="scrapped">Scrapped</van-radio>
                            </van-radio-group>
                        </template>
                    </van-field>
                </van-cell-group>

                <!-- 维修描述 -->
                <van-cell-group title="Maintenance Details" class="form-group">
                    <van-field
                        v-model="formData.description"
                        name="description"
                        label="Description"
                        type="textarea"
                        placeholder="Please describe the maintenance work performed"
                        autosize
                        maxlength="500"
                        show-word-limit
                        :rules="[{ required: true, message: 'Description is required' }]"
                    />
                </van-cell-group>

                <!-- 维修图片 -->
                <van-cell-group class="form-group">
                    <van-field
                        name="maintenanceImage"
                        label="Maintenance Image"
                        placeholder="Upload maintenance result image (optional)"
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
                </van-cell-group>

                <!-- 提交按钮 -->
                <div class="submit-section">
                    <van-button
                        type="primary"
                        size="large"
                        round
                        block
                        native-type="submit"
                        :loading="submitting"
                        :disabled="!canSubmit"
                        class="submit-btn"
                    >
                        {{ getSubmitButtonText() }}
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
import { updateTaskStatus, getRecordDetail } from '../../api/mechanicanMaintenanceRecord'
import { getUploadUrl } from '../../api/ossController'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

// 响应式数据
const deviceInfo = ref<API.DeviceVo | null>(null)
const maintenanceRecord = ref<API.MechanicanMaintenanceRecordVo | null>(null)
const submitting = ref(false)
const uploading = ref(false)

// 表单数据
const formData = ref({
    maintenanceResult: '',
    description: ''
})

// 文件上传相关数据
const fileList = ref<any[]>([])

// 计算属性
const canSubmit = computed(() => {
    return deviceInfo.value?.status === 2 && 
           formData.value.maintenanceResult && 
           formData.value.description.trim()
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

// 获取维修记录
const fetchMaintenanceRecord = async (deviceId: number) => {
    try {
        const response: any = await getRecordDetail({
            deviceId: deviceId,
            status: 1 // 获取状态为1（处理中）的记录
        })
        
        console.log('Maintenance record detail response:', response)
        
        if (response) {
            maintenanceRecord.value = response
            console.log('Found maintenance record:', response)
        } else {
            showNotify({ type: 'warning', message: 'No active maintenance record found for this device' })
        }
    } catch (error) {
        console.error('Failed to fetch maintenance record:', error)
        showNotify({ type: 'danger', message: 'Failed to load maintenance record' })
    }
}

// 处理文件上传
const handleFileUpload = async (file: any) => {
    uploading.value = true
    
    try {
        // 生成文件名
        const timestamp = Date.now()
        const fileExtension = file.file.name.split('.').pop() || 'jpg'
        const filename = `${timestamp}-maintenance.${fileExtension}`
        
        // 获取上传URL
        const uploadUrlResponse: any = await getUploadUrl({
            filename: filename,
            contentType: file.file.type || 'image/jpeg'
        })
        
        if (!uploadUrlResponse || !uploadUrlResponse.uploadUrl || !uploadUrlResponse.fileUrl) {
            throw new Error('Failed to get upload URL')
        }
        
        const { uploadUrl, fileUrl } = uploadUrlResponse
        
        // 上传文件到OSS
        const uploadResponse = await fetch(uploadUrl, {
            method: 'PUT',
            body: file.file,
            headers: {
                'Content-Type': file.file.type || 'image/jpeg'
            },
            mode: 'cors'
        })
        
        if (!uploadResponse.ok) {
            throw new Error('Upload failed')
        }
        
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
            duration: 5000
        })
        fileList.value = []
    } finally {
        uploading.value = false
    }
    
    return false
}

// 删除文件
const handleFileDelete = () => {
    fileList.value = []
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

// 获取提交按钮文本
const getSubmitButtonText = () => {
    if (!canSubmit.value) {
        if (deviceInfo.value?.status !== 2) {
            return 'Device Not Under Maintenance'
        }
        return 'Please Fill All Fields'
    }
    return `Mark as ${formData.value.maintenanceResult === 'fixed' ? 'Fixed' : 'Scrapped'}`
}

// 处理表单提交
const handleSubmit = async () => {
    if (!canSubmit.value) {
        if (deviceInfo.value?.status !== 2) {
            showNotify({ type: 'warning', message: 'This device is not currently under maintenance' })
            return
        }
        showNotify({ type: 'warning', message: 'Please fill all required fields' })
        return
    }
    
    try {
        const resultText = formData.value.maintenanceResult === 'fixed' ? 'fixed' : 'scrapped'
        const confirmMessage = `Are you sure you want to mark this device as ${resultText}?`
        
        await showConfirmDialog({
            title: 'Confirm Maintenance',
            message: confirmMessage,
        })
        
        submitting.value = true
        
        // 检查是否有维修记录
        if (!maintenanceRecord.value) {
            showNotify({ type: 'warning', message: 'No active maintenance record found for this device' })
            return
        }
        
        // 构建更新数据
        const updateData: API.MechanicanUpdateDto = {
            id: maintenanceRecord.value.id!,
            status: formData.value.maintenanceResult === 'fixed' ? 2 : 3, // 2: 修复成功, 3: 报废
            description: formData.value.description,
            image: fileList.value.length > 0 ? fileList.value[0].url : '',
            userMaintenanceRecordId: maintenanceRecord.value.userMaintenanceRecordId || 0
        }
        
        const response = await updateTaskStatus(updateData)
        
        if (response) {
            showNotify({ type: 'success', message: `Device marked as ${resultText} successfully` })
            router.push({ name: 'Tasks' })
        } else {
            showNotify({ type: 'danger', message: 'Failed to update maintenance status' })
        }
        
    } finally {
        submitting.value = false
    }
}

// 页面加载时初始化
onMounted(async () => {
    const deviceId = route.query.deviceId
    if (!deviceId || isNaN(Number(deviceId))) {
        showNotify({ type: 'danger', message: 'Invalid device ID' })
        router.back()
        return
    }
    
    await Promise.all([
        fetchDeviceInfo(Number(deviceId)),
        fetchMaintenanceRecord(Number(deviceId))
    ])
})
</script>

<style scoped>
.maintenance-complete-page {
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

.submit-section {
    padding: 20px 16px;
    background: white;
}

.submit-btn {
    font-size: 16px;
    font-weight: 600;
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

:deep(.van-radio-group) {
    display: flex;
    gap: 20px;
}
</style>
