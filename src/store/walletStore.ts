import create from 'zustand'
import Web3 from 'web3'

type State = {
  web3: Web3
  showWalletModal: boolean
  address: string
  toggleWalletModal: () => void
  setShowWalletModal: (b: boolean) => void
}

const useWalletStore = create<State>((set) => ({
  web3: undefined,
  address: '',
  showWalletModal: false,
  toggleWalletModal: () =>
    set((state) => ({ showWalletModal: !state.showWalletModal })),
  setShowWalletModal: (b: boolean) => set((state) => ({ showWalletModal: b })),
}))

export default useWalletStore
