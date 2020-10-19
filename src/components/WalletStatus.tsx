import useWalletStore from '../store/walletStore'

import DotRed from '../assets/dotred.svg'
import DotGreen from '../assets/dotgreen.svg'

import dynamic from 'next/dynamic'

export default function WalletStatus() {
  const NoSSRWalletModal = dynamic(() => import('./WalletModal'), {
    ssr: false,
  })

  const web3 = useWalletStore((state) => state.web3)
  const address = useWalletStore((state) => state.address)
  const isModalOpen = useWalletStore((state) => state.showWalletModal)
  const toggleWalletModal = useWalletStore((state) => state.toggleWalletModal)

  return (
    <div
      className="flex flex-row items-center px-2 border rounded cursor-pointer border-brand-gray-2"
      onClick={toggleWalletModal}
    >
      <NoSSRWalletModal isOpen={isModalOpen} />

      {web3 === undefined && <DotRed className="w-3 h-3" />}
      {web3 === undefined && (
        <div className="ml-3 text-gray-400 align-middle">No wallet</div>
      )}

      {web3 !== undefined && <DotGreen className="w-3 h-3" />}
      {web3 !== undefined && (
        <div className="ml-3 text-gray-400 align-middle">
          {address.slice(0, 6)}...{address.slice(-4)}
        </div>
      )}
    </div>
  )
}
