import type { NextConfig } from 'next'

const BACKEND_URL = process.env.BACKEND_URL || 'http://xb8692a8.natappfree.cc:8080'

const nextConfig: NextConfig = {
  // 开发允许的来源（保留原设置）
  allowedDevOrigins: ['http://localhost:3000'],
  // 通过重写将同源的 /api/* 请求代理到后端，避免浏览器混合内容拦截
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${BACKEND_URL}/api/:path*`,
      },
    ]
  },
}

export default nextConfig
