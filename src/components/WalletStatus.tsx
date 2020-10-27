import React from 'react'
import { useWalletStore } from '../store/walletStore'

import DotRed from '../assets/dotred.svg'
import DotGreen from '../assets/dotgreen.svg'

import dynamic from 'next/dynamic'

export default function WalletStatus() {
  const NoSSRWalletModal = dynamic(() => import('./WalletModal'), {
    ssr: false,
  })

  const signer = useWalletStore((state) => state.signer)
  const address = useWalletStore((state) => state.address)
  const isModalOpen = useWalletStore((state) => state.showWalletModal)
  const toggleWalletModal = useWalletStore((state) => state.toggleWalletModal)

  const setIsWalletModalOpen = function (b: boolean) {
    useWalletStore.setState({ showWalletModal: b })
  }

  return (
    <React.Fragment>
      <NoSSRWalletModal isOpen={isModalOpen} setIsOpen={setIsWalletModalOpen} />
      <div
        className="flex flex-row items-center px-2 border rounded cursor-pointer border-brand-gray-2"
        onClick={toggleWalletModal}
      >
        {signer === undefined && <DotRed className="w-3 h-3" />}
        {signer === undefined && (
          <div className="ml-3 text-gray-400 align-middle">No wallet</div>
        )}

        {signer !== undefined && <DotGreen className="w-3 h-3" />}
        {signer !== undefined && (
          <div className="ml-3 text-gray-400 align-middle">
            {address.slice(0, 6)}...{address.slice(-4)}
          </div>
        )}
      </div>
    </React.Fragment>
  )
}
