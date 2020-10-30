import React from 'react'
import { useWalletStore } from 'store/walletStore'

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

  const setIsWalletModalOpen = function (b: boolean) {
    useWalletStore.setState({ showWalletModal: b })
  }

  return (
    <React.Fragment>
      <NoSSRWalletModal isOpen={isModalOpen} setIsOpen={setIsWalletModalOpen} />
      <div
        className="flex flex-row items-center w-32 px-2 cursor-pointer justify-self-end"
        onClick={toggleWalletModal}
      >
        {web3 === undefined && <DotRed className="w-4 h-4" />}
        {web3 === undefined && (
          <div className="ml-3 text-gray-400 align-middle">No wallet</div>
        )}

        {web3 !== undefined && <DotGreen className="w-4 h-4" />}
        {web3 !== undefined && (
          <div className="ml-3 text-gray-400 align-middle">
            {address.slice(0, 6)}...{address.slice(-4)}
          </div>
        )}
      </div>
    </React.Fragment>
  )
}
