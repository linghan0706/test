'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import Image from 'next/image'

// 引导页面数据
const guidancePages = [
  {
    id: 1,
    icon: '/LoadingIcon/CionOne.png',
    title: 'Welcome to',
    subtitle: 'NovaExplorer',
    description: 'Collect energy and search for spaceship parts',
  },
  {
    id: 2,
    icon: '/LoadingIcon/CionTwo.png',
    title: '',
    subtitle: 'Blue Star',
    description: 'Collect energy and search for spaceship parts',
  },
  {
    id: 3,
    icon: '/LoadingIcon/CionThree.png',
    title: '',
    subtitle: 'Solar System',
    description: 'Roam the planets and explore the mysteries',
  },
  {
    id: 4,
    icon: '/LoadingIcon/CionFour.png',
    title: '',
    subtitle: 'Galaxy',
    description: 'Traverse the wormholes and challenge the unknown',
  },
  {
    id: 5,
    icon: '/LoadingIcon/CionFive.png',
    title: '',
    subtitle: 'Infinite Universe',
    description: 'Time-space Jump, Become a Legend',
  },
  {
    id: 6,
    icon: '/LoadingIcon/CionSix.png',
    title: 'Star—Universe',
    subtitle: 'UNI Heart NFT',
    description: 'your legend, eternally written in the cosmos',
  },

]

interface LoadingProps {
  onComplete?: () => void
}

export default function Loading({ onComplete }: LoadingProps) {
  // 初始化为1，这样第二个进度条（index=1）会在进入时点亮
  const [currentPage, setCurrentPage] = useState(1)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // 确保从id为1的数据开始加载引导页内容
  // currentPage为1时显示第一个引导页数据（guidancePages[0]）
  const currentData = guidancePages[currentPage - 1]

  // 移除自动切换功能
  // useEffect(() => {
  //   const autoSwitch = setTimeout(() => {
  //     if (currentPage < guidancePages.length - 1) {
  //       handleNext()
  //     }
  //   }, 5000) // 5秒自动切换

  //   return () => clearTimeout(autoSwitch)
  // }, [currentPage])

  const handleNext = () => {
    // currentPage从1开始，最大值为6（对应guidancePages.length）
    if (currentPage < guidancePages.length && !isTransitioning) {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentPage(prev => prev + 1)
        setIsTransitioning(false)
      }, 500) // 增加过渡时间以配合CSS动画
    } else if (currentPage === guidancePages.length) {
      onComplete?.()
    }
  }

  const handleSkip = () => {
    onComplete?.()
  }

  const handleDotClick = (index: number) => {
    // 不允许点击第一个进度条（index=0），因为它代表InitialLoading
    // 只允许点击从第二个开始的进度条（index>=1）
    if (index >= 1 && index !== currentPage && !isTransitioning) {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentPage(index)
        setIsTransitioning(false)
      }, 500) // 增加过渡时间以配合CSS动画
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex flex-col items-center justify-center relative overflow-hidden">
      {/* 背景装饰星星 */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${(i * 37) % 100}%`,
              top: `${(i * 73) % 100}%`,
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [0.5, 1.2, 0.5],
            }}
            transition={{
              duration: 2 + (i % 3),
              repeat: Infinity,
              delay: (i * 0.1) % 2,
            }}
          />
        ))}
      </div>

      {/* 主要内容容器 */}
      <div className="relative z-10 w-full max-w-sm mx-auto px-6 flex flex-col items-center">
        {/* 主图标区域 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            className="relative mb-8"
            initial={{ opacity: 0, x: 100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -100, scale: 0.8 }}
            transition={{ 
              duration: 0.5,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
          >
            {/* 灰色椭圆底盘 */}
            <motion.div
              className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-80 h-10 bg-purple-800/40 rounded-full blur-lg"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.4, 0.6, 0.4],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            
            {/* 主图标 */}
            <div className="relative w-80 h-64 flex items-center justify-center">
              <motion.div
                className="relative"
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Image
                  src={currentData.icon}
                  alt={currentData.title}
                  width={320}
                  height={240}
                  className="object-contain drop-shadow-2xl"
                  priority
                />
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* 标题区域 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`title-${currentPage}`}
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            {/* 主标题 */}
            <motion.h1
              className="text-white text-4xl font-normal mb-2"
              style={{
                fontFamily: "'Jersey 10', monospace",
                fontSize: '54px',
                lineHeight: '58px',
              }}
            >
              {currentData.title}
            </motion.h1>
            
            {/* 副标题 */}
            {currentData.subtitle && (
              <motion.h2
                className="bg-gradient-to-r from-cyan-400 via-green-400 via-yellow-400 via-orange-400 to-pink-400 bg-clip-text text-transparent font-normal mb-4"
                style={{
                  fontFamily: "'Jersey 10', monospace",
                  fontSize: '54px',
                  lineHeight: '48px',
                }}
              >
                {currentData.subtitle}
              </motion.h2>
            )}
            
            {/* 描述文本 */}
            <motion.p
              className="text-gray-300 text-base leading-relaxed px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {currentData.description}
            </motion.p>
          </motion.div>
        </AnimatePresence>

        {/* 页面指示器 */}
        <motion.div
          className="flex justify-center items-center space-x-2.5 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          style={{
            width: '106px',
            height: '6px',
            gap: '10px',
          }}
        >
          {/* 创建7个进度条：1个InitialLoading + 6个引导页 */}
          {Array.from({ length: 7 }, (_, index) => {
            // 第一个进度条代表InitialLoading，永远保持灰色圆点状态
            if (index === 0) {
              return (
                <div
                  key={index}
                  className="rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: '6px',
                    height: '6px',
                    background: '#878787',
                    flex: 'none',
                    transform: 'scale(1)',
                  }}
                />
              )
            } 
            // 当前激活的进度条显示为长条样式
            else if (index === currentPage) {
              return (
                <div
                  key={index}
                  className="rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: '26px',
                    height: '6px',
                    background: 'linear-gradient(172.02deg, #EE3BA7 -21.97%, #B448FB 99.02%)',
                    borderRadius: '20px',
                    flex: 'none',
                    transform: 'scale(1)',
                    transformOrigin: 'center',
                  }}
                />
              )
            } 
            // 其他进度条为圆形样式
            else {
              return (
                <motion.button
                  key={index}
                  className="rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: '6px',
                    height: '6px',
                    // 已经完成的页面显示为激活的粉色圆点，未完成的显示为灰色
                    background: currentPage > index ? '#EE3BA7' : '#878787',
                    flex: 'none',
                    cursor: 'pointer',
                    transform: 'scale(1)',
                    transformOrigin: 'center',
                  }}
                  onClick={() => handleDotClick(index)}
                  whileHover={{ 
                    scale: 1.3,
                    transition: { duration: 0.2, ease: "easeOut" }
                  }}
                  whileTap={{ 
                    scale: 0.8,
                    transition: { duration: 0.1, ease: "easeOut" }
                  }}
                  animate={{
                    scale: currentPage > index ? 1.1 : 1,
                  }}
                  transition={{
                    duration: 0.5,
                    ease: "easeOut"
                  }}
                />
              )
            }
          })}
        </motion.div>

        {/* 底部按钮区域 */}
        <motion.div
          className="flex justify-center space-x-2 w-full max-w-xs"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          {/* Skip 按钮 */}
          <motion.button
            className="flex-1 py-2 px-4 bg-white rounded-lg text-black font-medium text-sm hover:bg-gray-100 transition-all duration-300"
            onClick={handleSkip}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Skip
          </motion.button>
          
          {/* Next Step 按钮 */}
          <motion.button
            className="flex-1 py-2 px-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-white font-medium text-sm hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg"
            onClick={handleNext}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {currentPage === guidancePages.length - 1 ? 'Get Started' : 'Next Step'}
          </motion.button>
        </motion.div>
      </div>

      {/* 装饰性粒子效果 */}
      <div className="absolute bottom-0 left-0 right-0 h-32 overflow-hidden pointer-events-none">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400 rounded-full"
            style={{
              left: `${(i * 7) % 100}%`,
              bottom: `${(i * 2) % 20}px`,
            }}
            animate={{
              y: [-20, -80],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2 + (i % 2),
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

      {/* 侧边装饰元素 */}
      <motion.div
        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl opacity-30"
        animate={{
          x: [0, 10, 0],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        🚀
      </motion.div>

      <motion.div
        className="absolute right-4 top-1/3 text-xl opacity-30"
        animate={{
          x: [0, -10, 0],
          rotate: [0, -5, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      >
        ⭐
      </motion.div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Jersey+10&display=swap');
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        @media (max-width: 640px) {
          .text-4xl { font-size: 2.5rem; }
        }
      `}</style>
    </div>
  )
}
