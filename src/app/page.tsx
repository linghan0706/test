'use client'

import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { getTelegramInitData } from '@/utils/telegramBot'
import axios from 'axios'

export default function HomePage() {
  useEffect(() => {
    const fetchTelegramData = () => {
      const initData = getTelegramInitData()
      // 发送到后端验证
      const uValidateTg = async () => { 
          const response = await axios('/api', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ initData }),
          })
          if (response.ok) {
            console.log('Telegram用户验证成功')
          } else {
            console.log('Telegram用户验证失败')
          }
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