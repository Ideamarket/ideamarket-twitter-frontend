import { useRef } from 'react'

import Metamask from '../assets/metamask.svg'
import WalletConnect from '../assets/walletconnect.svg'
import Coinbase from '../assets/coinbase.svg'
import Fortmatic from '../assets/fortmatic.svg'
import Portis from '../assets/portis.svg'

import Modal from './Modal'

import * as wallets from 'eth-wallets'

export default function WalletSelectionModal({ isOpen }: { isOpen: boolean }) {
  const modalRef = useRef()

  async function onWalletClicked(wallet) {
    // TODO: Move this to the global store and set when the app boots

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

    let web3
    try {
      web3 = await wallets.connect(wallet)
    } catch (ex) {
      console.log(ex)
    }
  }

  function makeWalletButton(svg: JSX.Element, name: string, wallet: number) {
    return (
      <div className="mt-4 pl-4 pr-4 flex">
        <button
          onClick={() => onWalletClicked(wallet)}
          className="flex-grow p-2 text-lg border-2 border-brand-gray-1 text-black rounded-lg font-sf-compact-medium hover:border-transparent hover:bg-brand-blue hover:text-white"
        >
          <div className="flex flex-row items-center">
            <div className="flex-none">{svg}</div>
            <div className="flex-none ml-2">{name}</div>
          </div>
        </button>
      </div>
    )
  }

  return (
    <Modal modalRef={modalRef} isOpen={isOpen} setIsOpen={(b) => (isOpen = b)}>
      <div style={{ minWidth: 400 }}>
        <div className="bg-gradient-to-b from-very-dark-blue to-brand-blue p-4">
          <p className="text-3xl text-center font-gilroy-bold text-gray-200">
            {' '}
            Connect your Wallet
          </p>
        </div>

        {makeWalletButton(
          <Metamask className="w-8 h-8" />,
          'Metamask',
          wallets.WALLETS.METAMASK
        )}
        {makeWalletButton(
          <WalletConnect className="w-8 h-8" />,
          'WalletConnect',
          wallets.WALLETS.WALLETCONNECT
        )}
        {makeWalletButton(
          <Coinbase className="w-7 h-7" />,
          'Coinbase',
          wallets.WALLETS.COINBASE
        )}
        {makeWalletButton(
          <Fortmatic className="w-7 h-7" />,
          'Fortmatic',
          wallets.WALLETS.FORTMATIC
        )}

        <hr className="mt-4" />
      </div>
    </Modal>
  )
}

// { makeWalletButton(<Portis className="w-7 h-7"/>, 'Fortmatic', wallets.WALLETS.PORTIS) }
