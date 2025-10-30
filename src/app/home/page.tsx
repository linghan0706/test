'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { getTelegramInitData, isTelegramEnvironment, getTelegramDebugInfo } from '@/utils/telegramBot'
import { setAuthToken, setUserInfo, isAuthenticated } from '@/utils/auth'
import http from '@/utils/http'
import { LoginResponse } from '@/types/api'
export default function HomePage() {
  const [loginStatus, setLoginStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [debugInfo, setDebugInfo] = useState<{
    hasTelegramWebApp: boolean
    hasInitData: boolean
    userAgent: string
    url: string
    webAppData?: Record<string, unknown>
  } | null>(null)

  useEffect(() => {
    // 获取调试信息
    const debug = getTelegramDebugInfo()
    setDebugInfo(debug)
    console.log('Telegram 调试信息:', debug)
    
    // 如果已经登录，跳过登录流程
    if (isAuthenticated()) {
      setLoginStatus('success')
      return
    }

    const fetchTelegramData = async () => {
      setLoginStatus('loading')
      
      try {
        const initData = getTelegramInitData()
        console.log("Telegram Init Data:", initData)
        
        // 在 Telegram Web App 环境中，如果没有获取到数据，可能是调试模式
        if (!initData) {
          console.log('未获取到 Telegram 初始化数据，可能处于调试模式')
          
          // 检查是否在 Telegram 环境中
          if (isTelegramEnvironment()) {
            setErrorMessage('Telegram 数据加载中，请稍候...')
            // 在真实 Telegram 环境中，可以尝试重新获取
            setTimeout(() => {
              const retryData = getTelegramInitData()
              if (!retryData) {
                setErrorMessage('无法获取 Telegram 用户数据，请检查应用是否在 Telegram 中正确打开')
                setLoginStatus('error')
              }
            }, 2000) // 增加等待时间到2秒
            return
          } else {
            // 调试模式：提供模拟数据或跳过验证
            console.log('调试模式：跳过 Telegram 验证')
            setErrorMessage('调试模式：未连接到 Telegram')
            setLoginStatus('error')
            return
          }
        }
        
        // 发送到后端验证
        const response = await http.post<LoginResponse>('/api/auth/login', {
          initData: initData.rawInitData
        })
        
        if (response.data.success) {
          console.log('Telegram用户验证成功', response.data.user)
          
          // 存储Token和用户信息
          if (response.data.token) {
            setAuthToken(response.data.token)
          }
          if (response.data.user) {
            setUserInfo(response.data.user)
          }
          
          setLoginStatus('success')
        } else {
          console.log('Telegram用户验证失败', response.data.message)
          setErrorMessage(response.data.message || '验证失败')
          setLoginStatus('error')
        }
      } catch (error) {
        console.error('Telegram用户验证请求失败', (error as Error).message)
        setErrorMessage('网络请求失败，请稍后重试')
        setLoginStatus('error')
      }
    }
    
    fetchTelegramData()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-blue-900 to-black relative overflow-hidden pb-20">
      {/* 主要内容 */}
      <div className="relative z-10 px-4 pt-6">
        <motion.div
          className="text-center py-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-white text-2xl font-bold mb-4">个人中心</h1>
          
          {/* 登录状态显示 */}
          {loginStatus === 'loading' && (
            <div className="mb-4">
              <p className="text-blue-400">正在验证用户身份...</p>
            </div>
          )}
          
          {loginStatus === 'success' && (
            <div className="mb-4">
              <p className="text-green-400">✓ 用户验证成功</p>
            </div>
          )}
          
          {loginStatus === 'error' && (
            <div className="mb-4">
              <p className="text-red-400">✗ 验证失败</p>
              {errorMessage && (
                <div className="mt-2">
                  <p className="text-red-300 text-sm">{errorMessage}</p>
                  {errorMessage.includes('Telegram') && (
                    <div className="mt-3 p-3 bg-blue-900/30 rounded-lg border border-blue-500/30">
                      <p className="text-blue-300 text-sm">
                        💡 <strong>提示：</strong>
                      </p>
                      <p className="text-blue-200 text-xs mt-1">
                        • 请在 Telegram 应用中打开此链接<br/>
                        • 或通过 Telegram Bot 访问此应用<br/>
                        • 普通浏览器无法获取 Telegram 用户数据
                      </p>
                    </div>
                  )}
                  
                  {/* 调试信息显示 */}
                  {debugInfo && (
                    <details className="mt-3 p-3 bg-gray-900/50 rounded-lg border border-gray-600/30">
                      <summary className="text-gray-300 text-xs cursor-pointer hover:text-white">
                        🔍 调试信息 (点击展开)
                      </summary>
                      <div className="mt-2 text-xs text-gray-400 font-mono">
                        <div className="mb-2">
                          <span className="text-gray-300">Telegram Web App:</span> {debugInfo.hasTelegramWebApp ? '✓' : '✗'}
                        </div>
                        <div className="mb-2">
                          <span className="text-gray-300">初始化数据:</span> {debugInfo.hasInitData ? '✓' : '✗'}
                        </div>
                        <div className="mb-2">
                          <span className="text-gray-300">User Agent:</span> {debugInfo.userAgent.substring(0, 50)}...
                        </div>
                        <div className="mb-2">
                          <span className="text-gray-300">当前 URL:</span> {debugInfo.url.substring(0, 50)}...
                        </div>
                        {debugInfo.webAppData && (
                          <div className="mt-2 p-2 bg-gray-800/50 rounded">
                            <div className="text-gray-300 mb-1">Web App 数据:</div>
                            <pre className="text-xs overflow-x-auto">
                              {JSON.stringify(debugInfo.webAppData, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    </details>
                  )}
                </div>
              )}
            </div>
          )}
          
          <p className="text-gray-400">个人中心功能开发中...</p>
        </motion.div>
      </div>
    </div>
  )
}