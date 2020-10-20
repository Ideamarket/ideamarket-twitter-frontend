import { useState } from 'react'
import useWalletStore from '../store/walletStore'

import Metamask from '../assets/metamask.svg'
import WalletConnect from '../assets/walletconnect.svg'
import Coinbase from '../assets/coinbase.svg'
import Fortmatic from '../assets/fortmatic.svg'
// import Portis from '../assets/portis.svg'
import DotRed from '../assets/dotred.svg'
import DotGreen from '../assets/dotgreen.svg'

import Modal from './Modal'

import * as wallets from 'eth-wallets'

export default function WalletSelectionModal({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean
  setIsOpen: (b: boolean) => void
}) {
  const [connectingWallet, setConnectingWallet] = useState(0)
  const web3 = useWalletStore((state) => state.web3)
  const address = useWalletStore((state) => state.address)

  async function onWalletClicked(wallet) {
    setConnectingWallet(wallet)

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
      return
    } finally {
      setConnectingWallet(0)
    }

    localStorage.setItem('WALLET_TYPE', wallet.toString())
    useWalletStore.setState({
      web3: web3,
      address: (await web3.eth.getAccounts())[0],
    })

    setIsOpen(false)
  }

  async function onDisconnectClicked() {
    try {
      const wallet = parseInt(localStorage.getItem('WALLET_TYPE'))
      await wallets.disconnect(wallet)
    } catch (ex) {
      console.log(ex)
    }

    localStorage.removeItem('WALLET_TYPE')
    useWalletStore.setState({
      web3: undefined,
      address: '',
    })
  }

  function makeWalletButton(svg: JSX.Element, name: string, wallet: number) {
    return (
      <div className="flex pl-4 pr-4 mt-4">
        <button
          disabled={connectingWallet !== 0}
          onClick={() => onWalletClicked(wallet)}
          className={`${
            connectingWallet === 0
              ? 'hover:border-transparent hover:bg-brand-blue hover:text-brand-gray cursor-pointer'
              : 'cursor-not-allowed'
          } ${
            connectingWallet === wallet
              ? 'border-transparent bg-brand-blue text-brand-gray'
              : ''
          } flex-grow p-2 text-lg text-black border-2 rounded-lg border-brand-gray-1 font-sf-compact-medium`}
        >
          <div className="flex flex-row items-center">
            <div className="flex-none">{svg}</div>
            <div className="flex-none ml-2">{name}</div>
            <div
              className={`${
                connectingWallet !== wallet ? 'display: hidden' : ''
              } flex flex-row justify-end flex-grow`}
            >
              <svg
                viewBox="0 0 100 100"
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 animate-spin"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  style={{
                    fill: 'transparent',
                    stroke: 'hsl(235, 42%, 17%)',
                    strokeWidth: '10',
                  }}
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  style={{
                    fill: 'transparent',
                    stroke: 'white',
                    strokeWidth: '10',
                    strokeDasharray: '283',
                    strokeDashoffset: '75',
                  }}
                />
              </svg>
            </div>
          </div>
        </button>
      </div>
    )
  }

  return (
    <Modal isOpen={isOpen} setIsOpen={(b) => (isOpen = b)}>
      <div className="lg:min-w-100">
        <div className="p-4 bg-gradient-to-b from-very-dark-blue-3 to-brand-blue">
          <p className="text-2xl text-center text-gray-200 md:text-3xl font-gilroy-bold">
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

        <hr className="m-4" />
        <div className="flex flex-row items-center mx-4 mb-4 ">
          {web3 === undefined && <DotRed className="w-3 h-3" />}
          {web3 !== undefined && <DotGreen className="w-3 h-3" />}
          <p className="ml-2 text-brand-gray-2">
            {address !== '' ? 'Connected with: ' : 'Not connected'}
            {address !== '' && (
              <a
                className="underline"
                href={`https://etherscan.io/address/${address}`}
                target="_blank"
              >
                {address.slice(0, 6)}...{address.slice(-4)}
              </a>
            )}
          </p>
          <div className="flex justify-end flex-grow">
            <button
              disabled={web3 === undefined}
              onClick={onDisconnectClicked}
              className={`${
                web3 !== undefined
                  ? 'hover:border-transparent hover:bg-brand-blue hover:text-brand-gray cursor-pointer'
                  : 'cursor-not-allowed'
              } p-2 text-xs text-center border-2 rounded-lg text-brand-gray-2 border-brand-gray-1 font-sf-compact-medium`}
            >
              Disconnect
            </button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

// { makeWalletButton(<Portis className="w-7 h-7"/>, 'Fortmatic', wallets.WALLETS.PORTIS) }
//
