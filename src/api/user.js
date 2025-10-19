// @ts-ignore
/* eslint-disable */
import request from "../axios/request";
/** 此处后端没有提供注释 POST /user/admin/deleteUser */
export async function deleteUser(body, options) {
    return request("/user/admin/deleteUser", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        data: body,
        ...(options || {}),
    });
}
/** 此处后端没有提供注释 POST /user/admin/getUserList */
export async function getAllUsers(body, options) {
    return request("/user/admin/getUserList", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        data: body,
        ...(options || {}),
    });
}
/** 此处后端没有提供注释 POST /user/deactivateUser */
export async function deactivateUser(body, options) {
    return request("/user/deactivateUser", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        data: body,
        ...(options || {}),
    });
}
/** 此处后端没有提供注释 GET /user/getCurrentUser */
export async function getCurrentUser(options) {
    return request("/user/getCurrentUser", {
        method: "GET",
        ...(options || {}),
    });
}
/** 此处后端没有提供注释 POST /user/login */
export async function userLogin(body, options) {
    return request("/user/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        data: body,
        ...(options || {}),
    });
}
/** 此处后端没有提供注释 POST /user/register */
export async function userRegister(body, options) {
    return request("/user/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        data: body,
        ...(options || {}),
    });
}
/** 此处后端没有提供注释 POST /user/updateUser */
export async function updateUser(body, options) {
    return request("/user/updateUser", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        data: body,
        ...(options || {}),
    });
}
