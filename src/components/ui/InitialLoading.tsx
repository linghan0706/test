'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import Image from 'next/image'

interface InitialLoadingProps {
  onLoadingComplete?: () => void
}

const InitialLoading = ({ onLoadingComplete }: InitialLoadingProps) => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // 简化加载逻辑，3秒后完成加载
    const timer = setTimeout(() => {
      onLoadingComplete?.()
    }, 1000000)

    // 模拟进度条动画
    const progressTimer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 100
        return prev + 2
      })
    }, 60)

    return () => {
      clearTimeout(timer)
      clearInterval(progressTimer)
    }
  }, [onLoadingComplete])

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 overflow-hidden flex flex-col items-center justify-center">
      {/* 像素风格背景星星 */}
      <div className="absolute inset-0">
        {Array.from({ length: 30 }, (_, i) => (
          <div
            key={i}
            className="absolute bg-white"
            style={{
              left: `${(i * 37) % 100}%`,
              top: `${(i * 73) % 100}%`,
              width: '2px',
              height: '2px',
              imageRendering: 'pixelated',
            }}
          />
        ))}
      </div>

      {/* 主要内容区域 */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-md mx-auto px-6">
        {/* 中央行星容器 - 作为火箭轨道的中心点 */}
        <div className="relative mb-8 w-40 h-40 flex items-center justify-center">
          {/* 中央行星 */}
          <div className="relative w-32 h-32 flex items-center justify-center">
            <Image
              src="/LoadingIcon/IntiaLoadong.png"
              alt="Nova Explorer Planet"
              width={128}
              height={128}
              className="object-contain"
              style={{ imageRendering: 'pixelated' }}
              priority
            />
          </div>

          {/* 第一个火箭轨道容器 */}
          <motion.div
            className="absolute inset-0 w-40 h-40"
            animate={{ rotate: 360 }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              transformOrigin: 'center',
            }}
          >
            {/* 第一个火箭 */}
            <div
              className="absolute w-8 h-8"
              style={{
                top: '10px',
                left: '50%',
                marginLeft: '-16px',
              }}
            >
              {/* 火箭主体 */}
              <div className="relative w-8 h-8">
                <Image
                  src="/LoadingIcon/Rocket.png"
                  alt="Rocket"
                  width={32}
                  height={32}
                  className="object-contain"
                  style={{ 
                    imageRendering: 'pixelated',
                    transform: 'rotate(90deg)'
                  }}
                />
              </div>
            </div>
          </motion.div>

          {/* 第二个火箭轨道容器 */}
          <motion.div
            className="absolute inset-0 w-40 h-40"
            animate={{ rotate: 360 }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              transformOrigin: 'center',
            }}
          >
            {/* 第二个火箭 */}
            <div
              className="absolute w-6 h-6"
              style={{
                bottom: '8px',
                left: '50%',
                marginLeft: '-12px',
              }}
            >
              {/* 火箭主体 */}
              <div className="relative w-6 h-6">
                <Image
                  src="/LoadingIcon/Rocket.png"
                  alt="Rocket"
                  width={24}
                  height={24}
                  className="object-contain"
                  style={{ 
                    imageRendering: 'pixelated',
                    transform: 'rotate(-90deg)'
                  }}
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* NovaExplorer 标题 */}
        <h1
          className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-green-400 via-yellow-400 via-orange-400 to-pink-400 bg-clip-text text-transparent"
          style={{
            fontFamily: "'Jersey 10', monospace",
          }}
        >
          NovaExplorer
        </h1>

        {/* 进度条 */}
        <div className="w-full max-w-xs mb-4">
          <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-2">
            <span>{Math.round(progress)}%</span>
            <span>Loading</span>
          </div>
        </div>

        {/* 加载状态文本 */}
        <p
          className="text-gray-300 text-lg"
          style={{
            fontFamily: "'Exo 2', sans-serif",
          }}
        >
          Loading NovaExplorer...
        </p>
      </div>

      {/* 像素风格装饰粒子 */}
      <div className="absolute bottom-0 left-0 right-0 h-32 overflow-hidden">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-blue-400"
            style={{
              left: `${(i * 7) % 100}%`,
              bottom: `${(i * 3) % 20}px`,
              width: '2px',
              height: '2px',
              imageRendering: 'pixelated',
            }}
            animate={{
              y: [-20, -100],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + (i % 2),
              repeat: Infinity,
              delay: i * 0.3,
              ease: "linear",
            }}
          />
        ))}
      </div>

      <style jsx>{`
        /* 像素风格样式 */
        * {
          image-rendering: -moz-crisp-edges;
          image-rendering: -webkit-crisp-edges;
          image-rendering: pixelated;
          image-rendering: crisp-edges;
        }
        
        @media (max-width: 640px) {
          .text-4xl { font-size: 2rem; }
          .text-lg { font-size: 1rem; }
        }
      `}</style>
    </div>
  )
}

export default InitialLoading