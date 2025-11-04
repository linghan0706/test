import type { NextConfig } from 'next'

// 后端地址仅在服务端路由中使用，不再通过 rewrites 代理，避免 Vercel 外部目标连接错误
const nextConfig: NextConfig = {
  allowedDevOrigins: ['http://localhost:3000'],
}

export default nextConfig
