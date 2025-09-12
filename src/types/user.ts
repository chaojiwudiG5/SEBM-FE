/*
 * @Description:
 * @version: v1.0.0
 * @Author: GaoMingze
 * @Date: 2025-09-12 17:55:46
 * @LastEditors: GaoMingze
 * @LastEditTime: 2025-09-12 17:56:55
 */
// src/types/user.ts

export interface IUser {
    id: number // id
    username?: string // 用户昵称，可为空
    password: string // 密码，不为空
    email?: string // 邮箱，可为空
    phone?: string // 电话，可为空
    gender?: number // 性别，可为空，tinyint 对应 number
    avatarUrl?: string // 用户头像，可为空
    userRole: number // 用户角色 0 - 普通用户 1 - 管理员
    isDelete: number // 是否删除 0 - 未删除 1 - 删除
    updateTime?: string // 更新时间，datetime 字符串
    createTime?: string // 创建时间，datetime 字符串
    userStatus: number // 用户状态 0 - 正常
    age?: number // 年龄，可为空
}
