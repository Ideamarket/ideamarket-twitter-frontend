import React, { useContext } from 'react'
import Image from 'next/image'

import WalletGreenIcon from '../../assets/wallet-green.svg'
import { useWeb3React } from '@web3-react/core'
import { GlobalContext } from 'lib/GlobalContext'
import ModalService from 'components/modals/ModalService'
import WalletModal from './WalletModal'
import A from 'components/A'

export default function WalletStatusWithConnectButton() {
  const { active, account } = useWeb3React()
  const { user } = useContext(GlobalContext)

  const openWalletModal = () => {
    ModalService.open(WalletModal)
  }

  return (
    <React.Fragment>
      <div className="flex flex-row items-center px-2 cursor-pointer justify-self-end">
        {active && (
          <div onClick={openWalletModal} className="flex items-center">
            <WalletGreenIcon className="w-6 h-6" />
            <div className="ml-3 text-gray-400 align-middle whitespace-nowrap hidden md:flex">
              {account.slice(0, 6)}...{account.slice(-4)}
            </div>
          </div>
        )}

        <button
          onClick={active ? null : openWalletModal}
          className="flex items-center space-x-2 h-9 bg-white/[.1] text-white text-sm font-semibold pl-3 py-1 ml-3 rounded-lg"
        >
          <A
            href={
              active
                ? `/u/${
                    user && user.username ? user.username : user?.walletAddress
                  }`
                : '#'
            }
            className="text-white hover:text-gray-500"
          >
            My Profile
          </A>
          <div className="ml-3 w-8 h-8 relative rounded-full bg-gray-400">
            {Boolean(user?.profilePhoto) && (
              <Image
                src={user?.profilePhoto}
                alt="Profile photo"
                layout="fill"
                objectFit="cover"
                className="rounded-full"
              />
            )}
          </div>
        </button>
      </div>
    </React.Fragment>
  )
}
