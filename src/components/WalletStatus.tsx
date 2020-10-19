import DotRed from '../assets/dotred.svg'
import DotGreen from '../assets/dotgreen.svg'

import dynamic from 'next/dynamic'

export default function WalletStatus() {
  const NoSSRWalletModal = dynamic(
    () => import('../components/WalletSelectionModal'),
    { ssr: false }
  )

  let modalIsOpen = false

  return (
    <div
      style={{ borderWidth: '1px', cursor: 'pointer' }}
      className="flex flex-row items-center px-2 border-brand-gray-2 rounded"
    >
      <NoSSRWalletModal isOpen={modalIsOpen} />
      <DotRed className="w-3 h-3" />
      <div className="ml-3 align-middle text-gray-400">No wallet</div>
    </div>
  )
}
