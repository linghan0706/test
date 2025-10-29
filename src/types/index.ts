// 导出所有类型定义
export * from './wallet'
export * from './api'

// 通用类型定义
export interface LoadingState {
  isLoading: boolean
  error: string | null
}

export interface User {
  id: string
  username?: string
  firstName?: string
  lastName?: string
  languageCode?: string
}

export interface BotConfig {
  token: string
  webhookUrl?: string
  allowedUsers?: string[]
}

export type Theme = 'light' | 'dark' | 'auto'

export interface AppConfig {
  theme: Theme
  language: string
  notifications: boolean
}