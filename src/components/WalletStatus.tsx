import React from 'react'
import { useWalletStore } from 'store/walletStore'

import DotRed from '../assets/dotred.svg'
import DotGreen from '../assets/dotgreen.svg'

export default function WalletStatus({
  setIsWalletModalOpen,
}: {
  setIsWalletModalOpen: (b: boolean) => void
}) {
  const web3 = useWalletStore((state) => state.web3)
  const address = useWalletStore((state) => state.address)

  return (
    <React.Fragment>
      <div
        className="flex flex-row items-center w-32 px-2 cursor-pointer justify-self-end"
        onClick={() => setIsWalletModalOpen(true)}
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
