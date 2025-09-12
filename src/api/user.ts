/*
 * @Description:
 * @version: v1.0.0
 * @Author: GaoMingze
 * @Date: 2025-09-12 17:48:33
 * @LastEditors: GaoMingze
 * @LastEditTime: 2025-09-12 17:55:14
 */
import myAxios from './index'

export const login = (data: any) => {
    return myAxios.post('/login', data)
}

export const register = (data: any) => {
    return myAxios.post('/register', data)
}
