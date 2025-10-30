'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { getTelegramInitData } from '@/utils/telegramBot'
import { setAuthToken, setUserInfo, isAuthenticated } from '@/utils/auth'
import http from '@/utils/http'
import { LoginResponse } from '@/types/api'

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [loginStatus, setLoginStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string>('')

  useEffect(() => {
    // 如果已经登录，跳过登录流程
    if (isAuthenticated()) {
      setLoginStatus('success')
      return
    }

    const fetchTelegramData = async () => {
      setIsLoading(true)
      setLoginStatus('loading')
      
      try {
        const initData = getTelegramInitData()
        console.log("Telegram Init Data:", initData)
        
        if (!initData) {
          console.log('未获取到 Telegram 初始化数据')
          setErrorMessage('未获取到 Telegram 初始化数据')
          setLoginStatus('error')
          return
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
      } finally {
        setIsLoading(false)
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
          <h1 className="text-white text-2xl font-bold mb-4">基地</h1>
          
          {/* 登录状态显示 */}
          {loginStatus === 'loading' && (
            <div className="text-blue-400 mb-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-2"></div>
              正在验证 Telegram 用户...
            </div>
          )}
          
          {loginStatus === 'success' && (
            <div className="text-green-400 mb-4">
              ✅ 登录成功！欢迎使用 Nova Explorer Bot
            </div>
          )}
          
          {loginStatus === 'error' && (
            <div className="text-red-400 mb-4">
              ❌ 登录失败: {errorMessage}
            </div>
          )}
          
          {loginStatus === 'success' ? (
            <p className="text-gray-400">基地功能开发中...</p>
          ) : (
            <p className="text-gray-400">请在 Telegram 中打开此应用</p>
          )}
        </motion.div>
      </div>
    </div>
  )
}