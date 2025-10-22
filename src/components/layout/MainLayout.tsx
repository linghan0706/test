'use client'

import { ErrorBoundary } from '@/components/ui'
import BottomNavigation from '@/components/layout/BottomNavigation'

interface MainLayoutProps {
  children: React.ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
      {/* 响应式容器 - 移动端铺满屏幕，大屏幕居中显示 */}
      <div className="h-screen w-full sm:max-w-md lg:max-w-lg xl:max-w-xl sm:h-[600px] lg:h-[700px] xl:h-[800px] rounded-none sm:rounded-2xl shadow-2xl relative overflow-hidden">
        {/* 主内容区域 - 相对定位，铺满整个容器 */}
        <div className="absolute inset-0 flex flex-col">
          <div className="flex-1 overflow-auto relative z-10">
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </div>
          {/* 底部导航栏 - 固定在底部，具有更高的z-index */}
          <div className="absolute bottom-0 left-0 right-0 z-20">
            <BottomNavigation />
          </div>
        </div>
      </div>
    </div>
  )
}