'use client'

import { Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

interface LoadingSpinnerProps {
  size?: 'small' | 'default' | 'large'
  tip?: string
  spinning?: boolean
  children?: React.ReactNode
  className?: string
}

export default function LoadingSpinner({
  size = 'default',
  tip,
  spinning = true,
  children,
  className = ''
}: LoadingSpinnerProps) {
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />

  if (children) {
    return (
      <Spin 
        spinning={spinning} 
        tip={tip} 
        size={size}
        indicator={antIcon}
        className={className}
      >
        {children}
      </Spin>
    )
  }

  return (
    <div className={`flex items-center justify-center p-4 ${className}`}>
      <Spin 
        spinning={spinning} 
        tip={tip} 
        size={size}
        indicator={antIcon}
      />
    </div>
  )
}