/*
 * @Description:
 * @version: v1.0.0
 * @Author: GaoMingze
 * @Date: 2025-10-20 13:29:32
 * @LastEditors: GaoMingze
 * @LastEditTime: 2025-10-21 20:12:45
 */
// @ts-ignore
/* eslint-disable */
import request from '../axios/request'
/** 此处后端没有提供注释 GET /userMaintenanceRecord/${param0} */
export async function getRecordDetail1(
    // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
    params,
    options
) {
    const { id: param0, ...queryParams } = params
    return request(`/maintenance/userMaintenanceRecord/${param0}`, {
        method: 'GET',
        params: { ...queryParams },
        ...(options || {}),
    })
}
/** 此处后端没有提供注释 POST /userMaintenanceRecord/cancel */
export async function cancelRecord(body, options) {
    return request('/maintenance/userMaintenanceRecord/cancel', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: body,
        ...(options || {}),
    })
}
/** 此处后端没有提供注释 POST /userMaintenanceRecord/myList */
export async function listMyRecords(body, options) {
    return request('/maintenance/userMaintenanceRecord/myList', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: body,
        ...(options || {}),
    })
}
/** 此处后端没有提供注释 POST /userMaintenanceRecord/report */
export async function createMaintenanceRecord(body, options) {
    return request('/maintenance/userMaintenanceRecord/report', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: body,
        ...(options || {}),
    })
}
