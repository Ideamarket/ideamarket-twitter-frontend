import create from 'zustand'
import ethers from 'ethers'

import { initContractsFromProvider, clearContracts } from './contractStore'

type State = {
  provider: ethers.providers.Web3Provider
  showWalletModal: boolean
  address: string
  toggleWalletModal: () => void
  setShowWalletModal: (b: boolean) => void
}

export const useWalletStore = create<State>((set) => ({
  provider: undefined,
  address: '',
  showWalletModal: false,
  toggleWalletModal: () =>
    set((state) => ({ showWalletModal: !state.showWalletModal })),
  setShowWalletModal: (b: boolean) => set((state) => ({ showWalletModal: b })),
}))

export const initWalletStore = async () => {
  const wallets = require('eth-wallets')
  wallets.setOption(
    wallets.WALLETS.WALLETCONNECT,
    wallets.OPTIONS.INFURA_KEY,
    '3399077c10a24059be2a6c5b4fa77c03'
  )
  wallets.setOption(
    wallets.WALLETS.COINBASE,
    wallets.OPTIONS.JSON_RPC_URL,
    'https://mainnet.infura.io/v3/3399077c10a24059be2a6c5b4fa77c03'
  )
  wallets.setOption(
    wallets.WALLETS.FORTMATIC,
    wallets.OPTIONS.API_KEY,
    'pk_live_B3A1A25FBF96DCB5'
  )

  const walletStr = localStorage.getItem('WALLET_TYPE')
  try {
    if (walletStr !== null) {
      const wallet = parseInt(walletStr)

      if (
        (await wallets.isAvailable(wallet)) &&
        (await wallets.isConnected(wallet))
      ) {
        const provider = await wallets.connect(wallet)
        await setProvider(provider, wallet)
      }
    }
  } catch (ex) {
    console.log(ex)
    localStorage.removeItem('WALLET_TYPE')
  }
}

export async function setProvider(provider, wallet) {
  const address = 'todo' //(await provider.())[0]
  useWalletStore.setState({
    provider: provider,
    address: address,
  })

  localStorage.setItem('WALLET_TYPE', wallet.toString())

  initContractsFromProvider(provider)
}

export async function unsetProvider() {
  useWalletStore.setState({
    provider: undefined,
    address: '',
  })

  localStorage.removeItem('WALLET_TYPE')

  clearContracts()
}
