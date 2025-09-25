// @ts-ignore
/* eslint-disable */
import request from '../axios/request'

/** 此处后端没有提供注释 POST /user/admin/deleteUser */
export async function deleteUser(
    body: API.DeleteDto,
    options?: { [key: string]: any }
) {
    return request<API.BaseResponseBoolean>('/user/admin/deleteUser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: body,
        ...(options || {}),
    })
}

/** 此处后端没有提供注释 POST /user/admin/getUserList */
export async function getAllUsers(
    body: API.PageDto,
    options?: { [key: string]: any }
) {
    return request<API.BaseResponsePageUserVo>('/user/admin/getUserList', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: body,
        ...(options || {}),
    })
}

/** 此处后端没有提供注释 GET /user/getCurrentUser */
export async function getCurrentUser(options?: { [key: string]: any }) {
    return request<API.BaseResponseUserVo>('/user/getCurrentUser', {
        method: 'GET',
        ...(options || {}),
    })
}

/** 此处后端没有提供注释 POST /user/login */
export async function userLogin(
    body: API.LoginDto,
    options?: { [key: string]: any }
) {
    return request<API.BaseResponseUserVo>('/user/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: body,
        ...(options || {}),
    })
}

/** 此处后端没有提供注释 POST /user/register */
export async function userRegister(
    body: API.RegisterDto,
    options?: { [key: string]: any }
) {
    return request<API.BaseResponseLong>('/user/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: body,
        ...(options || {}),
    })
}

/** 此处后端没有提供注释 POST /user/updateUser */
export async function updateUser(
    body: API.UpdateDto,
    options?: { [key: string]: any }
) {
    return request<API.BaseResponseUserVo>('/user/updateUser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: body,
        ...(options || {}),
    })
}
