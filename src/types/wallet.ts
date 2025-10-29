export interface WalletState {
  isConnected: boolean
  address: string | null
  balance: string | null
  network: 'mainnet' | 'testnet'
}

export interface WalletActions {
  connectWallet: (address: string) => void
  disconnectWallet: () => void
  updateBalance: (balance: string) => void
  setNetwork: (network: 'mainnet' | 'testnet') => void
}

export interface WalletStore extends WalletState, WalletActions {}

export interface TonWallet {
  address: string
  publicKey: string
  chain: string
}

export interface WalletConnection {
  wallet: TonWallet
  provider: string
}

export interface TransactionRequest {
  to: string
  amount: string
  comment?: string
}

export interface TransactionResult {
  hash: string
  success: boolean
  error?: string
}