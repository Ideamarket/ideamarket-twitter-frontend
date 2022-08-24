import Modal from '../modals/Modal'
// import useAuth from './useAuth'
// import { useWeb3React } from '@web3-react/core'
// import WalletGreenIcon from '../../assets/wallet-green.svg'
import { useContext, useEffect } from 'react'
import { GlobalContext } from 'lib/GlobalContext'
// import { getSignedInWalletAddress } from 'lib/utils/web3-eth'

export default function CreateAccountModal({ close }: { close: () => void }) {
  const { jwtToken } = useContext(GlobalContext)
  // const { active, account, library } = useWeb3React()

  // const { loginByWallet } = useAuth()
  // const onLoginClicked = async () => {
  //   if (active) {
  //     const signedWalletAddress = await getSignedInWalletAddress({
  //       account,
  //       library,
  //     })
  //     await loginByWallet(signedWalletAddress)
  //   }
  // }

  useEffect(() => {
    if (jwtToken) close()
  }, [close, jwtToken])

  return (
    <Modal close={close} isCloseActive={false}>
      <div className="p-6 bg-white w-96 md:w-[21rem]">
        <div className="flex justify-between items-center">
          <span className="text-xl text-left text-black font-gilroy-bold font-bold">
            To edit your profile, click{' '}
            <span className="text-blue-600">SIGN</span> in Metamask.
          </span>
        </div>

        <p className="text-sm font-inter text-gray-400 font-normal my-4">
          A MetaMask popup should open shortly. This will{' '}
          <span className="font-semibold">NOT</span> trigger a blockchain
          transaction or cost gas fees.
        </p>

        <button
          onClick={close}
          className="w-full rounded-lg border bg-white text-black p-4"
        >
          Got it
        </button>
      </div>
    </Modal>
  )
}
