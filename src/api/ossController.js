// @ts-ignore
/* eslint-disable */
import request from "../axios/request";
/** 此处后端没有提供注释 GET /api/oss/uploadUrl */
export async function getUploadUrl(
// 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
params, options) {
    return request("/api/oss/uploadUrl", {
        method: "GET",
        params: {
            ...params,
        },
        ...(options || {}),
    });
}
