// @ts-ignore
/* eslint-disable */
import request from "../axios/request";
/** 此处后端没有提供注释 POST /borrow/borrowDevice */
export async function borrowDevice(body, options) {
    return request("/borrow/borrowDevice", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        data: body,
        ...(options || {}),
    });
}
/** 此处后端没有提供注释 POST /borrow/getBorrowRecordList */
export async function getBorrowRecordList(body, options) {
    return request("/borrow/getBorrowRecordList", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        data: body,
        ...(options || {}),
    });
}
/** 此处后端没有提供注释 POST /borrow/getBorrowRecordListWithStatus */
export async function getBorrowRecordListWithStatus(body, options) {
    return request("/borrow/getBorrowRecordListWithStatus", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        data: body,
        ...(options || {}),
    });
}
/** 此处后端没有提供注释 POST /borrow/returnDevice */
export async function returnDevice(body, options) {
    return request("/borrow/returnDevice", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        data: body,
        ...(options || {}),
    });
}
