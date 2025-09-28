// @ts-ignore
/* eslint-disable */
import request from '../axios/request'

/** 此处后端没有提供注释 POST /device/addDevice */
export async function addDevice(
    body: API.DeviceAddDto,
    options?: { [key: string]: any }
) {
    return request<API.BaseResponseLong>('/device/addDevice', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: body,
        ...(options || {}),
    })
}

/** 此处后端没有提供注释 POST /device/deleteDevice */
export async function deleteDevice(
    body: API.DeleteDto,
    options?: { [key: string]: any }
) {
    return request<API.BaseResponseBoolean>('/device/deleteDevice', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: body,
        ...(options || {}),
    })
}

/** 此处后端没有提供注释 GET /device/getDevice/${param0} */
export async function getDevice(
    // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
    params: API.getDeviceParams,
    options?: { [key: string]: any }
) {
    const { id: param0, ...queryParams } = params
    return request<API.BaseResponseDeviceVo>(`/device/getDevice/${param0}`, {
        method: 'GET',
        params: { ...queryParams },
        ...(options || {}),
    })
}

/** 此处后端没有提供注释 POST /device/getDeviceList */
export async function getDeviceList(
    body: API.PageDto,
    options?: { [key: string]: any }
) {
    return request<API.BaseResponseListDeviceVo>('/device/getDeviceList', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: body,
        ...(options || {}),
    })
}

/** 此处后端没有提供注释 POST /device/updateDevice */
export async function updateDevice(
    body: API.DeviceUpdateDto,
    options?: { [key: string]: any }
) {
    return request<API.BaseResponseLong>('/device/updateDevice', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: body,
        ...(options || {}),
    })
}

/** 此处后端没有提供注释 POST /device/updateDeviceStatus */
export async function updateDeviceStatus(
    // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
    params: API.updateDeviceStatusParams,
    options?: { [key: string]: any }
) {
    return request<API.BaseResponseBoolean>('/device/updateDeviceStatus', {
        method: 'POST',
        params: {
            ...params,
        },
        ...(options || {}),
    })
}
