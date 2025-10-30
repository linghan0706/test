'use client'

import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { getTelegramInitData } from '@/utils/telegramBot'
import http from '@/utils/http'

interface TelegramUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
  language_code: string
  is_premium?: boolean
}

interface ValidateResponse {
  success: boolean
  user?: TelegramUser
  message?: string
}

export default function HomePage() {
  useEffect(() => {
    const fetchTelegramData = async () => {
      try {
        const initData = getTelegramInitData()
        
        if (!initData) {
          console.log('未获取到 Telegram 初始化数据')
          return
        }
        
        // 发送到后端验证
        const validateTg = async () => { 
          try {
            const response = await http.post<ValidateResponse>('/api/auth/login', {
              initData: initData.rawInitData
            })
            
            if (response.data.success) {
              console.log('Telegram用户验证成功', response.data.user)
            } else {
              console.log('Telegram用户验证失败', response.data.message)
            }
          } catch (error) {
            console.error('Telegram用户验证请求失败', (error as Error).message)
          }
        }
        
        await validateTg()
      } catch (error) {
        console.error('获取 Telegram 数据失败', (error as Error).message)
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
          <p className="text-gray-400">基地功能开发中...</p>
        </motion.div>
      </div>
    </div>
  )
}