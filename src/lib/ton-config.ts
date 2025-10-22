import { TonConnect } from '@tonconnect/sdk'

// TON Connect 配置
export const tonConnectConfig = {
  manifestUrl: '/tonconnect-manifest.json',
  walletsListSource:
    'https://raw.githubusercontent.com/ton-community/tonconnect-utils/main/tonconnect-wallets.json',
  walletsListCacheTTLMs: 1000 * 60 * 60 * 24, // 24 hours
}

// TON API 配置
export const tonApiConfig = {
  apiKey: process.env.NEXT_PUBLIC_TON_API_KEY || '',
  baseUrl: 'https://tonapi.io',
}

// 网络配置
export const networkConfig = {
  mainnet: {
    rpcEndpoint: 'https://toncenter.com/api/v2/jsonRPC',
    apiEndpoint: 'https://tonapi.io',
  },
  testnet: {
    rpcEndpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',
    apiEndpoint: 'https://testnet.tonapi.io',
  },
}

// 默认网络
export const DEFAULT_NETWORK = 'mainnet' as keyof typeof networkConfig
