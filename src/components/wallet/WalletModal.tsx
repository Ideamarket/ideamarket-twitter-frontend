import { useContext } from 'react'
import { GlobalContext } from 'pages/_app'

import Modal from '../Modal'
import dynamic from 'next/dynamic'

const NoSSRWalletInterface = dynamic(() => import('./WalletInterface'), {
  ssr: false,
})

export default function WalletModal() {
  const {
    isWalletModalOpen,
    setIsWalletModalOpen,
    onWalletConnectedCallback,
    setOnWalletConnectedCallback,
  } = useContext(GlobalContext)

  function close(success) {
    if (onWalletConnectedCallback) {
      if (success) {
        onWalletConnectedCallback()
      }
      setOnWalletConnectedCallback(undefined)
    }

    setIsWalletModalOpen(false)
  }

  return (
    <Modal isOpen={isWalletModalOpen} close={() => close(false)}>
      <div className="p-4 bg-top-mobile">
        <p className="text-2xl text-center text-gray-300 md:text-3xl font-gilroy-bold">
          {' '}
          Connect your Wallet
        </p>
      </div>
      <NoSSRWalletInterface
        onWalletConnected={() => setIsWalletModalOpen(false)}
      />
    </Modal>
  )
}
