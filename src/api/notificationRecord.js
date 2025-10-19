// @ts-ignore
/* eslint-disable */
import request from "../axios/request";
// 分页查询通知记录 POST /notification/record/list
export async function listNotificationRecords(body, options) {
    return request("/notification/record/list", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        data: body,
        ...(options || {}),
    });
}
// 清空用户所有已读消息 POST /notification/record/clear
export async function clearUserNotifications(params, options) {
    return request("/notification/record/clear", {
        method: "POST",
        params,
        ...(options || {}),
    });
}
// 删除通知记录 POST /notification/record/delete
export async function deleteNotificationRecord(body, options) {
    return request("/notification/record/delete", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        data: body,
        ...(options || {}),
    });
}
// 批量删除通知记录 POST /notification/record/batchDelete
export async function batchDeleteNotificationRecords(body, options) {
    return request("/notification/record/batchDelete", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        data: body,
        ...(options || {}),
    });
}
// 批量标记消息为已读 POST /notification/record/batchMarkAsRead
export async function batchMarkAsRead(body, options) {
    return request("/notification/record/batchMarkAsRead", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        data: body,
        ...(options || {}),
    });
}
// 标记用户所有未读消息为已读 POST /notification/record/markAllAsRead
export async function markAllAsRead(params, options) {
    return request("/notification/record/markAllAsRead", {
        method: "POST",
        params,
        ...(options || {}),
    });
}
