'use client'

import { Card, Descriptions, Typography, Space, Button, Tag, Tooltip } from 'antd'
import { 
  CopyOutlined, 
  ReloadOutlined, 
  ExportOutlined,
  WalletOutlined,
  ClockCircleOutlined
} from '@ant-design/icons'
import { TonAccount } from '@/services/ton'
import { formatTonAmount, formatAddress, formatTimestamp, copyToClipboard } from '@/utils'

const { Text, Title } = Typography

interface AccountInfoProps {
  account: TonAccount
  loading?: boolean
  onRefresh?: () => void
}

export default function AccountInfo({ account, loading = false, onRefresh }: AccountInfoProps) {
  
  const handleCopyAddress = async () => {
    const success = await copyToClipboard(account.address)
    if (success) {
      console.log('地址已复制')
    }
  }

  const getAccountStatus = () => {
    if (account.status === 'active') {
      return <Tag color="green">活跃</Tag>
    } else if (account.status === 'uninitialized') {
      return <Tag color="orange">未初始化</Tag>
    } else {
      return <Tag color="red">非活跃</Tag>
    }
  }

  const getAccountType = () => {
    switch (account.account_type) {
      case 'wallet':
        return <Tag icon={<WalletOutlined />} color="blue">钱包</Tag>
      case 'contract':
        return <Tag color="purple">合约</Tag>
      default:
        return <Tag color="default">未知</Tag>
    }
  }

  return (
    <Card
      title={
        <Space>
          <WalletOutlined />
          <span>账户信息</span>
          {getAccountStatus()}
          {getAccountType()}
        </Space>
      }
      extra={
        <Space>
          <Tooltip title="刷新数据">
            <Button
              type="text"
              icon={<ReloadOutlined />}
              onClick={onRefresh}
              loading={loading}
            />
          </Tooltip>
          <Tooltip title="导出数据">
            <Button
              type="text"
              icon={<ExportOutlined />}
              onClick={() => console.log('导出功能开发中...')}
            />
          </Tooltip>
        </Space>
      }
      loading={loading}
    >
      <Descriptions column={1} bordered size="small">
        <Descriptions.Item 
          label="地址"
          labelStyle={{ width: '120px' }}
        >
          <Space>
            <Text code copyable={{ text: account.address }}>
              {formatAddress(account.address)}
            </Text>
            <Button
              type="text"
              size="small"
              icon={<CopyOutlined />}
              onClick={handleCopyAddress}
            />
          </Space>
        </Descriptions.Item>

        <Descriptions.Item label="余额">
          <Title level={4} className="!mb-0 text-green-600">
            {formatTonAmount(account.balance)} TON
          </Title>
        </Descriptions.Item>

        <Descriptions.Item label="状态">
          <Space>
            {getAccountStatus()}
            <Text type="secondary">
              {account.status === 'active' ? '账户已激活并可以进行交易' : 
               account.status === 'uninitialized' ? '账户尚未初始化' : 
               '账户当前非活跃状态'}
            </Text>
          </Space>
        </Descriptions.Item>

        <Descriptions.Item label="账户类型">
          <Space>
            {getAccountType()}
            <Text type="secondary">
              {account.account_type === 'wallet' ? '普通钱包账户' : 
               account.account_type === 'contract' ? '智能合约账户' : 
               '未知账户类型'}
            </Text>
          </Space>
        </Descriptions.Item>

        {account.last_transaction_lt && (
          <Descriptions.Item label="最后交易">
            <Space direction="vertical" size="small">
              <Text>
                <ClockCircleOutlined className="mr-1" />
                逻辑时间: {account.last_transaction_lt}
              </Text>
              {account.last_transaction_hash && (
                <Text code copyable={{ text: account.last_transaction_hash }}>
                  哈希: {formatAddress(account.last_transaction_hash)}
                </Text>
              )}
            </Space>
          </Descriptions.Item>
        )}

        {account.code_hash && (
          <Descriptions.Item label="代码哈希">
            <Text code copyable={{ text: account.code_hash }}>
              {formatAddress(account.code_hash)}
            </Text>
          </Descriptions.Item>
        )}

        {account.data_hash && (
          <Descriptions.Item label="数据哈希">
            <Text code copyable={{ text: account.data_hash }}>
              {formatAddress(account.data_hash)}
            </Text>
          </Descriptions.Item>
        )}

        <Descriptions.Item label="更新时间">
          <Text>
            <ClockCircleOutlined className="mr-1" />
            {formatTimestamp(Date.now())}
          </Text>
        </Descriptions.Item>
      </Descriptions>
    </Card>
  )
}