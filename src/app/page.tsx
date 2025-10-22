'use client'

import { Layout, Typography, Card, Row, Col } from 'antd'
import {
  RobotOutlined,
  WalletOutlined,
  SendOutlined,
  HistoryOutlined,
} from '@ant-design/icons'
import { TonConnectUIProvider } from '@tonconnect/ui-react'
import WalletConnect from '@/components/WalletConnect'
import { tonConnectConfig } from '@/lib/ton-config'

const { Header, Content, Footer } = Layout
const { Title, Paragraph } = Typography

export default function Home() {
  return (
    <TonConnectUIProvider manifestUrl={tonConnectConfig.manifestUrl}>
      <Layout className="min-h-screen">
        <Header className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <RobotOutlined className="text-2xl text-blue-600 mr-3" />
                <Title
                  level={3}
                  className="!mb-0 text-gray-900 dark:text-white"
                >
                  Nova Explorer Bot
                </Title>
              </div>
            </div>
          </div>
        </Header>

        <Content className="bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-12">
              <Title level={1} className="!mb-4">
                欢迎使用 Nova Explorer Bot
              </Title>
              <Paragraph className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                一个功能强大的 Telegram Bot 前端，支持 TON
                钱包连接、交易管理和区块链探索。
              </Paragraph>
            </div>

            <Row gutter={[24, 24]} justify="center">
              <Col xs={24} sm={12} lg={8}>
                <Card
                  hoverable
                  className="h-full text-center"
                  cover={
                    <div className="p-8">
                      <WalletOutlined className="text-4xl text-blue-500" />
                    </div>
                  }
                >
                  <Card.Meta
                    title="钱包连接"
                    description="安全连接您的 TON 钱包，管理您的数字资产"
                  />
                </Card>
              </Col>

              <Col xs={24} sm={12} lg={8}>
                <Card
                  hoverable
                  className="h-full text-center"
                  cover={
                    <div className="p-8">
                      <SendOutlined className="text-4xl text-green-500" />
                    </div>
                  }
                >
                  <Card.Meta
                    title="交易管理"
                    description="发送和接收 TON 代币，查看交易历史"
                  />
                </Card>
              </Col>

              <Col xs={24} sm={12} lg={8}>
                <Card
                  hoverable
                  className="h-full text-center"
                  cover={
                    <div className="p-8">
                      <HistoryOutlined className="text-4xl text-purple-500" />
                    </div>
                  }
                >
                  <Card.Meta
                    title="区块链探索"
                    description="探索 TON 区块链，查看地址和交易详情"
                  />
                </Card>
              </Col>
            </Row>

            <div className="mt-16 flex justify-center">
              <WalletConnect />
            </div>
          </div>
        </Content>

        <Footer className="text-center bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <Paragraph className="text-gray-500 dark:text-gray-400">
            © 2024 Nova Explorer Bot. 基于 Next.js 和 TON 构建。
          </Paragraph>
        </Footer>
      </Layout>
    </TonConnectUIProvider>
  )
}
