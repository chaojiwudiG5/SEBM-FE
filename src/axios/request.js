/*
 * @Description: Axios 封装（JWT 版本）
 * @Author: GaoMingze
 * @Date: 2025-09-25
 */
import axios from 'axios';
import { showNotify } from 'vant';
// 根据环境自动选择后端地址
const getBaseURL = () => {
    // 开发环境
    if (import.meta.env.DEV) {
        return 'http://localhost:29578';
    }
    // 生产环境
    return 'https://sebm-production.up.railway.app';
};
// 创建 Axios 实例
const myAxios = axios.create({
    baseURL: getBaseURL(),
    timeout: 60000,
});
// 请求拦截器：自动带上 token
myAxios.interceptors.request.use(function (config) {
    const token = localStorage.getItem('token'); // 从本地存储取 token
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, function (error) {
    return Promise.reject(error);
});
// 响应拦截器
myAxios.interceptors.response.use(function (response) {
    const res = response.data;
    if (res.code !== 0) {
        showNotify(res.message || 'Error');
        return Promise.reject(new Error(res.message || 'Error'));
    }
    return res.data;
}, function (error) {
    // token 过期或未登录，可统一处理
    if (error.response && error.response.status === 401) {
        showNotify('Login expired, please login again');
        // 可以跳转到登录页或清除 token
        localStorage.removeItem('token');
        window.location.href = '/login';
    }
    return Promise.reject(error);
});
export default myAxios;
