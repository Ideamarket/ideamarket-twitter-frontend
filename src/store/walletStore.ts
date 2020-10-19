import create from 'zustand'

type State = {
  web3: boolean
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
