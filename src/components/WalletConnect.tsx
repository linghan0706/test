'use client'

import { Button, Card, Space, Typography, message } from 'antd'
import { WalletOutlined, DisconnectOutlined } from '@ant-design/icons'
import { useTonConnectUI } from '@tonconnect/ui-react'
import { useWalletStore } from '@/stores/useWalletStore'
import { useEffect } from 'react'

const { Title, Text } = Typography

export default function WalletConnect() {
  const [tonConnectUI] = useTonConnectUI()
  const {
    isConnected,
    address,
    balance,
    network,
    connectWallet,
    disconnectWallet,
    updateBalance,
  } = useWalletStore()

  // 监听钱包连接状态
  useEffect(() => {
    const unsubscribe = tonConnectUI.onStatusChange(wallet => {
      if (wallet) {
        connectWallet(wallet.account.address)
        // 这里可以添加获取余额的逻辑
        updateBalance('0.00')
      } else {
        disconnectWallet()
      }
    })

    return unsubscribe
  }, [tonConnectUI, connectWallet, disconnectWallet, updateBalance])

  const handleConnect = async () => {
    try {
      await tonConnectUI.connectWallet()
      message.success('钱包连接成功！')
    } catch (error) {
      message.error('钱包连接失败，请重试')
      console.error('Wallet connection error:', error)
    }
  }

  const handleDisconnect = async () => {
    try {
      await tonConnectUI.disconnect()
      message.success('钱包已断开连接')
    } catch (error) {
      message.error('断开连接失败，请重试')
      console.error('Wallet disconnection error:', error)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <Space direction="vertical" size="large" className="w-full">
        <div className="text-center">
          <Title level={3} className="!mb-2">
            <WalletOutlined className="mr-2" />
            钱包连接
          </Title>
          <Text type="secondary">连接您的 TON 钱包以开始使用</Text>
        </div>

        {isConnected ? (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <Text strong className="text-green-600 dark:text-green-400">
                已连接
              </Text>
              <div className="mt-2">
                <Text code className="text-xs break-all">
                  {address}
                </Text>
              </div>
              <div className="mt-2">
                <Text type="secondary">
                  网络: {network === 'mainnet' ? '主网' : '测试网'}
                </Text>
              </div>
              {balance && (
                <div className="mt-2">
                  <Text type="secondary">余额: {balance} TON</Text>
                </div>
              )}
            </div>
            <Button
              type="primary"
              danger
              icon={<DisconnectOutlined />}
              onClick={handleDisconnect}
              className="w-full"
            >
              断开连接
            </Button>
          </div>
        ) : (
          <Button
            type="primary"
            icon={<WalletOutlined />}
            onClick={handleConnect}
            className="w-full"
            size="large"
          >
            连接钱包
          </Button>
        )}
      </Space>
    </Card>
  )
}
