import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import WalletConnect from '../WalletConnect'
import { useWalletStore } from '../../stores/useWalletStore'

// Mock the store
jest.mock('../../stores/useWalletStore', () => ({
  useWalletStore: jest.fn(),
}))

describe('WalletConnect', () => {
  beforeEach(() => {
    jest.mocked(useWalletStore).mockReturnValue({
      isConnected: false,
      address: null,
      balance: null,
      network: 'mainnet',
      connectWallet: jest.fn(),
      disconnectWallet: jest.fn(),
      updateBalance: jest.fn(),
      setNetwork: jest.fn(),
    })
  })

  it('renders wallet connect button when not connected', () => {
    render(<WalletConnect />)

    expect(screen.getByText('钱包连接')).toBeInTheDocument()
    expect(screen.getByText('连接钱包')).toBeInTheDocument()
  })

  it('calls connectWallet when connect button is clicked', async () => {
    const mockConnectWallet = jest.fn()
    jest.mocked(useWalletStore).mockReturnValue({
      isConnected: false,
      address: null,
      balance: null,
      network: 'mainnet',
      connectWallet: mockConnectWallet,
      disconnectWallet: jest.fn(),
      updateBalance: jest.fn(),
      setNetwork: jest.fn(),
    })

    render(<WalletConnect />)

    const connectButton = screen.getByText('连接钱包')
    fireEvent.click(connectButton)

    await waitFor(() => {
      expect(mockConnectWallet).toHaveBeenCalled()
    })
  })
})
