'use client'

import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { getTelegramInitData, verifyInitData } from '@/utils/telegramBot'

export default function HomePage() {
  useEffect(() => {
    console.log("个人中心页面useEffect被调用 - 检查Telegram数据");
    // 在客户端环境中获取 Telegram 用户数据
    const fetchTelegramData = async () => {
      console.log("在个人中心页面调用fetchTelegramData函数");
      const initData = getTelegramInitData()
      console.log("个人中心页面getTelegramInitData返回结果:", initData);
      if (initData) {
        console.log("个人中心页面获取到Telegram初始化数据:", initData)
        
        // 发送到后端进行验证
        const verificationResult = await verifyInitData(initData.rawInitData)
        console.log("个人中心页面后端验证结果:", verificationResult)
      } else {
        console.log("个人中心页面未找到Telegram初始化数据");
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
          <p className="text-gray-400">个人中心功能开发中...</p>
        </motion.div>
      </div>
    </div>
  )
}