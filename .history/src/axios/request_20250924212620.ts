/*
 * @Description:
 * @version: v1.0.0
 * @Author: GaoMingze
 * @Date: 2025-09-21 23:29:22
 * @LastEditors: GaoMingze
 * @LastEditTime: 2025-09-24 21:26:21
 */
import axios from 'axios'
import { showNotify } from 'vant'

// 创建 Axios 实例
const myAxios = axios.create({
    baseURL: 'http://localhost:29578',
    timeout: 60000,
    withCredentials: true,
})

// 全局请求拦截器
myAxios.interceptors.request.use(
    function (config) {
        // Do something before request is sent
        return config
    },
    function (error) {
        // Do something with request error
        return Promise.reject(error)
    }
)

// 全局响应拦截器
myAxios.interceptors.response.use(
    function (response) {
        const res = response.data
        if (res.code !== 0) {
            // 这里可以用 Element Plus、AntD、或者你自己的 UI 提示
            showNotify(res.message || 'Error')
            // 直接 reject，让调用方能 catch
            return Promise.reject(new Error(res.message || 'Error'))
        }
        return res.data // 直接返回真正的数据
    },
    function (error) {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        return Promise.reject(error)
    }
)

export default myAxios
