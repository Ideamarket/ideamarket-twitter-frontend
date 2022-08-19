import { useWeb3React } from '@web3-react/core'
import classNames from 'classnames'
import { GlobalContext } from 'lib/GlobalContext'
import { useContext, useEffect, useState } from 'react'
import { setWeb3 } from 'store/walletStore'
import {
  ConnectorIds,
  connectorsById,
  resetWalletConnector,
} from 'wallets/connectors'
import Metamask from '../../assets/metamask.svg'
import CircleSpinner from '../animations/CircleSpinner'
import WalletConnect from '../../assets/walletconnect.svg'
import Coinbase from '../../assets/coinbase.svg'
import Fortmatic from '../../assets/fortmatic.svg'
import Portis from '../../assets/portis.svg'

const ConnectWalletTooltip = () => {
  const [connectingWallet, setConnectingWallet] = useState(0)
  const { onWalletConnectedCallback, setOnWalletConnectedCallback } =
    useContext(GlobalContext)

  const [isAnotherWallet, setIsAnotherWallet] = useState(false)

  const { library, connector, activate } = useWeb3React()

  // handle logic to recognize the connector currently being activated
  const [activatingConnector, setActivatingConnector] = useState<any>()

  useEffect(() => {
    const setWeb3WithWait = async () => {
      await setWeb3(library, connectingWallet)

      if (onWalletConnectedCallback) {
        onWalletConnectedCallback()
        setOnWalletConnectedCallback(undefined)
      }
    }

    if (activatingConnector && activatingConnector === connector) {
      // Wait until connector is set, THEN you can set web3
      if (library) {
        setWeb3WithWait()
      } else {
        // Connecting to wallet cancelled or failed
        if (connectingWallet === ConnectorIds.WalletConnect) {
          // You need to reset WalletConnector before you can reconnect to it and show QRcode again: https://github.com/NoahZinsmeister/web3-react/issues/124
          resetWalletConnector(activatingConnector)
        }
        // After connecting to a wallet fails, it disconnects any previous wallet, so we try to reconnect
        const walletStr = localStorage.getItem('WALLET_TYPE')
        const previousConnector = connectorsById[parseInt(walletStr)]
        activate(previousConnector)
      }

      setConnectingWallet(0)
      setActivatingConnector(undefined)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activatingConnector, connector])

  async function onWalletClicked(wallet) {
    setConnectingWallet(wallet)
    const currentConnector = connectorsById[wallet]
    setActivatingConnector(currentConnector)

    try {
      await activate(currentConnector)
    } catch (ex) {
      console.log(ex)
      return
    }
  }

  function WalletButton({
    svg,
    name,
    wallet,
    isDisabled = false,
    rightSvg,
  }: {
    svg: JSX.Element
    name: string
    wallet?: number
    isDisabled?: boolean
    rightSvg?: JSX.Element
  }) {
    return (
      <div
        className={
          'relative flex px-4 py-4 hover:bg-brand-blue hover:text-brand-gray'
        }
      >
        <button
          disabled={connectingWallet !== 0 || isDisabled}
          onClick={() => onWalletClicked(wallet)}
          className={classNames(
            connectingWallet === 0 && !isDisabled
              ? 'cursor-pointer'
              : 'cursor-not-allowed',
            connectingWallet === wallet &&
              'border-transparent bg-brand-blue text-brand-gray',
            'flex-grow text-black rounded-lg',
            isDisabled && 'bg-brand-gray'
          )}
        >
          <div className="flex flex-row items-center">
            <div className="flex-none">{svg}</div>
            <div className="ml-2 text-left font-bold">{name}</div>
            <div
              className={classNames(
                connectingWallet !== wallet && 'display: hidden',
                'flex flex-row justify-end flex-grow'
              )}
            >
              <CircleSpinner color="white" bgcolor="#0857e0" />
            </div>
            {rightSvg && (
              <div className="flex flex-row justify-end pl-2 ml-auto">
                {rightSvg}
              </div>
            )}
          </div>
        </button>
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-col w-64 px-4 py-4 bg-white rounded-2xl text-black">
        <div className="text-black/[0.5] text-xs mb-3">
          Pick a Wallet to connect
        </div>

        <div
          onClick={() => onWalletClicked(ConnectorIds.Metamask)}
          className="flex items-center border px-3 py-2 rounded-2xl cursor-pointer hover:border-blue-600"
        >
          <Metamask className="w-8 h-8 mr-2" />
          <div>
            <div className="font-bold">Metamask</div>
            <div className="text-black/[0.25] text-xs">(Recommended)</div>
          </div>
        </div>

        <div className="text-xs text-center mt-4">
          <div>
            <span className="text-black/[0.25] font-semibold mr-1">OR</span>
            <span
              onClick={() => setIsAnotherWallet(true)}
              className="text-blue-600 cursor-pointer"
            >
              Select another Wallet
            </span>
          </div>
          <div className="text-black/[0.25] text-xs">(limited support)</div>
        </div>
      </div>

      {isAnotherWallet && (
        <div className="flex flex-col divide-y w-64 mt-3 bg-white rounded-2xl text-black">
          <WalletButton
            svg={<WalletConnect className="w-8 h-8" />}
            name="WalletConnect"
            wallet={ConnectorIds.WalletConnect}
          />
          <WalletButton
            svg={<Coinbase className="w-7 h-7" />}
            name="Coinbase"
            wallet={ConnectorIds.Coinbase}
          />
          <WalletButton
            svg={<Portis className="w-7 h-7" />}
            name="Portis"
            wallet={ConnectorIds.Portis}
          />
          <WalletButton
            svg={<Fortmatic className="w-7 h-7" />}
            name="Fortmatic"
            wallet={ConnectorIds.Fortmatic}
          />
        </div>
      )}
    </>
  )
}

export default ConnectWalletTooltip
