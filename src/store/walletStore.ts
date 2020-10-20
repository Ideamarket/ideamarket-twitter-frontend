import create from 'zustand'
import Web3 from 'web3'

import { initContractsFromWeb3, clearContracts } from './contractStore'

type State = {
  web3: Web3
  showWalletModal: boolean
  address: string
  toggleWalletModal: () => void
  setShowWalletModal: (b: boolean) => void
}

export const useWalletStore = create<State>((set) => ({
  web3: undefined,
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
        const web3 = await wallets.connect(wallet)
        await setWeb3(web3, wallet)
      }
    }
  } catch (ex) {
    console.log(ex)
    localStorage.removeItem('WALLET_TYPE')
  }
}

export const setWeb3 = async (web3, wallet) => {
  useWalletStore.setState({
    web3: web3,
    address: (await web3.eth.getAccounts())[0],
  })

  localStorage.setItem('WALLET_TYPE', wallet.toString())

  initContractsFromWeb3(web3)
}

export const unsetWeb3 = () => {
  useWalletStore.setState({
    web3: undefined,
    address: '',
  })

  localStorage.removeItem('WALLET_TYPE')

  clearContracts()
}
