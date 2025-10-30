export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface TonApiConfig {
  apiKey: string
  baseUrl: string
  timeout?: number
}

export interface NetworkConfig {
  rpcEndpoint: string
  apiEndpoint: string
  name: string
  chainId?: string
}

export interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  headers?: Record<string, string>
  params?: Record<string, unknown>
  timeout?: number
}

export interface ErrorResponse {
  code: string
  message: string
  details?: Record<string, unknown> | null
}

// Telegram 登录相关类型
export interface TelegramUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
  language_code: string
  is_premium?: boolean
}

export interface LoginRequest {
  initData: string
}

export interface LoginResponse {
  success: boolean
  user?: TelegramUser
  token?: string
  message?: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken?: string
  expiresIn?: number
}