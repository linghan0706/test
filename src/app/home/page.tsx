'use client'

import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { getTelegramInitData, verifyInitData } from '@/utils/telegramBot'

export default function HomePage() {
  useEffect(() => {
    console.log("HomePage (home/page.tsx) useEffect called - checking Telegram data");
    // 在客户端环境中获取 Telegram 用户数据
    const fetchTelegramData = async () => {
      console.log("fetchTelegramData function called in home page");
      const initData = getTelegramInitData()
      console.log("getTelegramInitData result in home page:", initData);
      if (initData) {
        console.log("Telegram Init Data in home page:", initData)
        
        // 发送到后端进行验证
        const verificationResult = await verifyInitData(initData.rawInitData)
        console.log("Verification Result in home page:", verificationResult)
      } else {
        console.log("No Telegram init data found in home page");
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