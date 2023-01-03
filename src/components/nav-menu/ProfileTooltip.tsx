import { IoIosWallet } from 'react-icons/io'
import { IoMdExit } from 'react-icons/io'
import { useContext } from 'react'
import { GlobalContext } from 'lib/GlobalContext'
import A from 'components/A'
import useAuth from 'components/account/useAuth'

export const ProfileTooltip = () => {
  const { user } = useContext(GlobalContext)

  const userNameOrWallet =
    user && user.twitterUsername ? user.twitterUsername : user?.walletAddress

  const { twitterLogout } = useAuth()

  const onClickDisconnectTwitter = async () => {
    twitterLogout()
  }

  return (
    <div className="flex flex-col w-64 text-black">
      <A href={`/u/${userNameOrWallet}`}>
        <div className="cursor-pointer flex items-center py-3 px-4 border-t border-gray-100 hover:bg-brand-gray">
          <IoIosWallet className="w-6 h-6  text-gray-400" />
          <span className="ml-2 font-medium">My Profile</span>
        </div>
      </A>

      <div
        className="cursor-pointer flex items-center py-3 px-4 border-t border-gray-100 hover:bg-brand-gray"
        onClick={onClickDisconnectTwitter}
      >
        <IoMdExit className="w-6 h-6  text-gray-400" />
        <span className="ml-2 font-medium">Disconnect Twitter</span>
      </div>
    </div>
  )
}
