/**
 * 认证相关工具函数
 */

import { TelegramUser } from '@/types/api'

const TOKEN_KEY = 'auth_token'
const USER_KEY = 'user_info'

/**
 * 存储认证Token
 */
export const setAuthToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token)
  }
}

/**
 * 获取认证Token
 */
export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(TOKEN_KEY)
  }
  return null
}

/**
 * 清除认证Token
 */
export const clearAuthToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  }
}

/**
 * 存储用户信息
 */
export const setUserInfo = (user: TelegramUser): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  }
}

/**
 * 获取用户信息
 */
export const getUserInfo = (): TelegramUser | null => {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem(USER_KEY)
    return userStr ? JSON.parse(userStr) : null
  }
  return null
}

/**
 * 检查是否已登录
 */
export const isAuthenticated = (): boolean => {
  return !!getAuthToken()
}

/**
 * 登出
 */
export const logout = (): void => {
  clearAuthToken()
  // 可以在这里添加其他登出逻辑，比如重定向到登录页面
}