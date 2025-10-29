/*
 * @Description: URL工具函数
 * @version: v1.0.0
 * @Author: GaoMingze
 * @Date: 2025-10-29 00:00:00
 */

/**
 * 确保URL使用HTTPS协议
 * 如果URL使用HTTP协议，则转换为HTTPS
 * @param url - 原始URL
 * @returns 使用HTTPS协议的URL
 */
export function ensureHttps(url: string | undefined | null): string {
    if (!url) return ''
    
    // 如果URL是相对路径或已经是HTTPS，直接返回
    if (url.startsWith('https://') || url.startsWith('//') || url.startsWith('/')) {
        return url
    }
    
    // 如果是HTTP协议，转换为HTTPS
    if (url.startsWith('http://')) {
        return url.replace('http://', 'https://')
    }
    
    return url
}

/**
 * 处理OSS图片URL，确保使用HTTPS协议
 * @param url - OSS图片URL
 * @returns 使用HTTPS协议的URL
 */
export function ensureOssHttps(url: string | undefined | null): string {
    return ensureHttps(url)
}

