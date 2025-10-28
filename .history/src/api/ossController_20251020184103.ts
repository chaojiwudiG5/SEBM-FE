/*
 * @Description:
 * @version: v1.0.0
 * @Author: GaoMingze
 * @Date: 2025-10-07 19:47:21
 * @LastEditors: GaoMingze
 * @LastEditTime: 2025-10-20 18:40:57
 */
// @ts-ignore
/* eslint-disable */
import request from '../axios/request'

/** 此处后端没有提供注释 GET /api/oss/uploadUrl */
export async function getUploadUrl(
    // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
    params: API.getUploadUrlParams,
    options?: { [key: string]: any }
) {
    return request<API.BaseResponseMapStringString>(
        '/maintenance/oss/uploadUrl',
        {
            method: 'GET',
            params: {
                ...params,
            },
            ...(options || {}),
        }
    )
}
