import { MailIcon } from '@heroicons/react/solid'
import { IoIosWallet } from 'react-icons/io'
import { BiCog } from 'react-icons/bi'
import { IoMdExit } from 'react-icons/io'
import ModalService from 'components/modals/ModalService'
import ProfileSettingsModal from 'components/account/ProfileSettingsModal'
import { disconnectWalletConnector } from 'wallets/connectors'
import { unsetWeb3 } from 'store/walletStore'
import { useWeb3React } from '@web3-react/core'
import { useContext } from 'react'
import { GlobalContext } from 'lib/GlobalContext'
import { BsFillBellFill } from 'react-icons/bs'
import SpearkIcon from '../../assets/speaker.svg'
import TwitterOutlineWhite from '../../assets/twitter-outline-white.svg'
import A from 'components/A'
import { clearContracts } from 'store/contractStore'
import CreateAccountModal from 'components/account/CreateAccountModal'
import useAuth from 'components/account/useAuth'
import { getSignedInWalletAddress } from 'lib/utils/web3-eth'
import { twitterLogin } from 'modules/user-market/services/VerificationService'

export const ProfileTooltip = () => {
  const { user, jwtToken } = useContext(GlobalContext)
  const { active, account, library, connector, deactivate } = useWeb3React()

  const userNameOrWallet =
    user && user.username ? user.username : user?.walletAddress

  const { loginByWallet } = useAuth()

  const onLoginClicked = async () => {
    if (active) {
      const signedWalletAddress = await getSignedInWalletAddress({
        account,
        library,
      })
      return await loginByWallet(signedWalletAddress)
    }

    return null
  }

  const onVerifyTwitterClicked = async () => {
    let newOrOldJwt = jwtToken
    if (!jwtToken) {
      ModalService.open(CreateAccountModal, {})
      newOrOldJwt = await onLoginClicked()
      ModalService.closeAll() // Get weird errors without this due to modal being closed inside CreateAccountModal in useEffect
    }

    // That i know of, this only happens when user declines MM modal to login
    if (!newOrOldJwt) return

    await twitterLogin(newOrOldJwt)
  }

  const onClickSettings = async () => {
    // if jwtToken is not present, then popup modal and MM popup to ask user to create account or sign in
    if (!jwtToken) {
      ModalService.open(CreateAccountModal, {})
      const isLoginSuccess = await onLoginClicked()
      ModalService.closeAll() // Get weird errors without this due to modal being closed inside CreateAccountModal in useEffect
      if (isLoginSuccess) {
        ModalService.open(ProfileSettingsModal)
      }

      return
    }

    ModalService.open(ProfileSettingsModal)
  }

  const onClickDisconnectWallet = async () => {
    await disconnectWalletConnector(connector)

    try {
      clearContracts()
      await deactivate()
    } catch (ex) {
      console.log(ex)
    }
    unsetWeb3()
  }

  return (
    <div className="flex flex-col w-64 text-black">
      {active && !user?.twitterUsername && (
        <div
          className="py-3 px-4 bg-blue-400 hover:bg-blue-500 text-white cursor-pointer "
          onClick={onVerifyTwitterClicked}
        >
          <div className="mb-2 flex items-center text-white">
            <TwitterOutlineWhite className="w-5" />
            <b className="ml-2 font-bold text-base">Connect Twitter</b>
          </div>

          <div className="text-white text-xs">
            Attract like-minded followers
          </div>
        </div>
      )}

      {active && !Boolean(user?.email) && (
        <>
          <div
            onClick={onClickSettings}
            className="py-3 px-4 bg-brand-blue hover:bg-brand-blue/[.8] cursor-pointer"
          >
            <div className="mb-2 flex items-center text-white">
              <MailIcon className="w-5 h-5" />
              <span className="ml-2 font-bold text-base">Connect Email</span>
            </div>

            <span className="text-white text-xs">
              <BsFillBellFill className="w-3 h-3 text-yellow-1" /> get notified
              when you <br />
              have earnings to withdraw <SpearkIcon className="w-3 h-3" />
            </span>
          </div>
        </>
      )}

      <A href={`/u/${userNameOrWallet}`}>
        <div className="cursor-pointer flex items-center py-3 px-4 border-t border-gray-100 hover:bg-brand-gray">
          <IoIosWallet className="w-6 h-6  text-gray-400" />
          <span className="ml-2 font-medium">My Profile</span>
        </div>
      </A>

      {active && (
        <div
          className="cursor-pointer flex items-center py-3 px-4 border-t border-gray-100 hover:bg-brand-gray"
          onClick={onClickSettings}
        >
          <BiCog className="w-6 h-6  text-gray-400" />
          <span className="ml-2 font-medium">Edit Profile</span>
        </div>
      )}

      <div
        className="cursor-pointer flex items-center py-3 px-4 border-t border-gray-100 hover:bg-brand-gray"
        onClick={onClickDisconnectWallet}
      >
        <IoMdExit className="w-6 h-6  text-gray-400" />
        <span className="ml-2 font-medium">Disconnect Wallet</span>
      </div>
    </div>
  )
}
