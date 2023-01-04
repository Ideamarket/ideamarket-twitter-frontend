import React, { useContext } from 'react'
import ModalService from 'components/modals/ModalService'
import Image from 'next/image'
import ProfileSettingsModal from './ProfileSettingsModal'
import { BiCog } from 'react-icons/bi'
import { ExternalLinkIcon, ShareIcon } from '@heroicons/react/outline'
import copy from 'copy-to-clipboard'
import { getURL } from 'utils/seo-constants'
import toast from 'react-hot-toast'
import A from 'components/A'
import { useWeb3React } from '@web3-react/core'
import { getSignedInWalletAddress } from 'lib/utils/web3-eth'
import useAuth from './useAuth'
import CreateAccountModal from './CreateAccountModal'
import { GlobalContext } from 'lib/GlobalContext'
import { useQuery } from 'react-query'
import { getUserHolders } from 'actions/web2/user-market/apiUserActions'
import HoldersSummary from './HoldersSummary'
import { SortOptionsHomeUsersTable } from 'utils/tables'

interface Props {
  userData?: any
}

const ProfileGeneralInfo: React.FC<Props> = ({ userData }) => {
  const { account, active, library } = useWeb3React()

  const { jwtToken, isTxPending } = useContext(GlobalContext)

  const { loginByWallet } = useAuth()

  const { data: userHolders } = useQuery<any>(
    ['holders', userData?.walletAddress],
    () =>
      getUserHolders({
        walletAddress: userData?.walletAddress,
        skip: 0,
        limit: 10,
        orderBy: SortOptionsHomeUsersTable.STAKED.value,
        orderDirection: 'desc',
      }),
    {
      enabled: !isTxPending,
    }
  )

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

  const copyProfileURL = () => {
    const url = `${getURL()}/u/${
      userData && userData?.twitterUsername
        ? userData?.twitterUsername
        : userData?.walletAddress
    }`
    copy(url)
    toast.success('Copied profile URL')
  }

  // If true, then show settings button so wallet owners can change their settings
  const isConnectedWalletSameAsPublicWallet =
    userData &&
    userData?.walletAddress &&
    account &&
    userData?.walletAddress === account?.toLowerCase()

  return (
    <>
      {/* Desktop top section of account page */}
      <div className="hidden lg:block">
        <div className="text-base opacity-50 mb-4">
          {isConnectedWalletSameAsPublicWallet ? 'My Profile' : 'Profile'}
        </div>

        <div className="flex justify-between">
          {/* Left container */}
          <div className="w-3/4 bg-black border border-[#1d1d1d] flex items-center p-4 rounded-lg">
            <div className="relative w-20 h-20 rounded-full bg-gray-400 overflow-hidden">
              <Image
                src={
                  userData?.twitterProfilePicURL || '/default-profile-pic.png'
                }
                alt="Profile photo"
                layout="fill"
                objectFit="cover"
                className="rounded-full"
              />
            </div>

            {/* Username and bio */}
            <div className="w-[25rem] px-8 border-r-2 border-[#4c4c4c]">
              {userData?.username && (
                <div className="text-xl font-bold">{userData?.username}</div>
              )}

              {userData?.bio && (
                <div className="whitespace-pre-wrap break-words text-sm italic opacity-70 my-1">
                  {userData?.bio || ''}
                </div>
              )}

              <HoldersSummary holders={userHolders} userData={userData} />
            </div>

            {/* Links */}
            <div className="pl-6 flex flex-col space-y-2">
              {userData?.twitterUsername && (
                <div className="flex items-center">
                  <div className="w-5 mr-3">
                    <div className="relative w-5 h-5">
                      <Image
                        src={'/twitter-solid-gray.svg'}
                        alt="twitter-solid-gray-icon"
                        layout="fill"
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 rounded-xl border border-[#1d1d1d] px-3 py-1">
                    <span className="text-sm">Twitter</span>
                    <A
                      className="flex items-center space-x-2 text-blue-500 hover:text-blue-600 z-50"
                      href={`https://twitter.com/${userData?.twitterUsername}`}
                    >
                      <span className="text-sm">
                        @{userData?.twitterUsername}
                      </span>

                      <ExternalLinkIcon className="w-4 text-[#7f7f7f]" />
                    </A>
                  </div>
                </div>
              )}

              {/* Wallet */}
              {/* <div className="flex items-center">
                <WalletIcon className="stroke-current text-white w-5 h-full mr-3" />
                <div className="flex items-center rounded-xl border border-[#1d1d1d] px-3 py-1">
                  <A
                    href={`https://context.app/${userData?.walletAddress}`}
                    className="flex items-center space-x-2 text-sm hover:text-blue-600"
                  >
                    <span>{`${userData?.walletAddress?.slice(
                      0,
                      10
                    )}...${userData?.walletAddress?.slice(-8)}`}</span>

                    <ExternalLinkIcon className="w-4 text-[#7f7f7f]" />
                  </A>
                </div>
              </div> */}
            </div>
          </div>

          {/* Right container */}
          <div className="w-56">
            {/* Upper box: staked, stake, holders */}
            {/* <div className="bg-black border border-[#1d1d1d] flex flex-col rounded-lg">
              <div className="flex items-start p-4">
                <span className="text-sm opacity-70 mr-6">STAKED</span>
                <span>
                  {formatNumberWithCommasAsThousandsSerperator(
                    Math.round(userData?.deposits)
                  ) || 0}{' '}
                  IMO
                </span>
              </div>

              <div
                onClick={onStakeClicked}
                className="p-3 bg-blue-700 hover:bg-blue-800 text-center text-white font-bold cursor-pointer"
              >
                Stake
              </div>

              <div className="flex items-start p-4">
                <span className="text-sm opacity-70 mr-6">HOLDERS</span>
                <span>
                  {formatNumberWithCommasAsThousandsSerperator(
                    userData?.holders
                  ) || 0}
                </span>
              </div>
            </div> */}

            {/* Share and settings button */}
            <div className="h-12 ml-auto mt-2 flex items-start">
              <div
                onClick={copyProfileURL}
                className="w-full p-3 flex justify-center items-center h-full space-x-2 bg-black border border-[#1d1d1d] rounded-lg hover:bg-black/[.1] cursor-pointer"
              >
                <ShareIcon className="w-5" />
                <span>Share</span>
              </div>

              {isConnectedWalletSameAsPublicWallet && (
                <div
                  className="flex justify-center items-center h-full ml-2 px-3 bg-black border border-[#1d1d1d] rounded-lg hover:bg-black/[.1] cursor-pointer"
                  onClick={onClickSettings}
                >
                  <BiCog className="w-6 h-6" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tablet top section of account page */}
      <div className="hidden md:block lg:hidden">
        <div className="text-base opacity-50 mb-4">My Profile</div>

        <div className="flex justify-between">
          {/* Left container */}
          <div className="w-3/4 bg-black border border-[#1d1d1d] flex items-start p-4 rounded-lg">
            <div className="relative w-20 h-20 rounded-full bg-gray-400 overflow-hidden">
              <Image
                src={
                  userData?.twitterProfilePicURL || '/default-profile-pic.png'
                }
                alt="Profile photo"
                layout="fill"
                objectFit="cover"
                className="rounded-full"
              />
            </div>

            {/* Username and bio */}
            <div className="w-full px-8">
              {userData?.username && (
                <div className="text-xl font-bold">{userData?.username}</div>
              )}

              {userData?.bio && (
                <div className="max-w-[25rem] whitespace-pre-wrap break-words text-sm italic opacity-70 mt-1">
                  {userData?.bio || ''}
                </div>
              )}

              {/* Links */}
              <div className="flex flex-col space-y-2 mt-8">
                {userData?.twitterUsername && (
                  <div className="flex items-center">
                    <div className="w-5 mr-3">
                      <div className="relative w-5 h-5">
                        <Image
                          src={'/twitter-solid-gray.svg'}
                          alt="twitter-solid-gray-icon"
                          layout="fill"
                        />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 rounded-xl border border-[#1d1d1d] px-3 py-1">
                      <span className="text-sm">Twitter</span>
                      <A
                        className="flex items-center space-x-2 text-blue-500 hover:text-blue-600 z-50"
                        href={`https://twitter.com/${userData?.twitterUsername}`}
                      >
                        <span className="text-sm">
                          @{userData?.twitterUsername}
                        </span>

                        <ExternalLinkIcon className="w-4 text-[#7f7f7f]" />
                      </A>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right container */}
          <div className="w-56 ml-10">
            {/* Share and settings button */}
            <div className="w-56 h-12 ml-auto mt-2 flex items-start">
              <div
                onClick={copyProfileURL}
                className="w-full p-3 flex justify-center items-center h-full space-x-2 bg-black border border-[#1d1d1d] rounded-lg hover:bg-black/[.1] cursor-pointer"
              >
                <ShareIcon className="w-5" />
                <span>Share</span>
              </div>

              {isConnectedWalletSameAsPublicWallet && (
                <div
                  className="flex justify-center items-center h-full ml-2 px-3 bg-black border border-[#1d1d1d] rounded-lg hover:bg-black/[.1] cursor-pointer"
                  onClick={onClickSettings}
                >
                  <BiCog className="w-6 h-6" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile top section of account page */}
      <div className="block md:hidden max-w-[18rem] mx-auto">
        <div className="text-base opacity-50 mb-4">My Profile</div>

        <div className="">
          {/* Left container */}
          <div className="w-full bg-black border border-[#1d1d1d] flex flex-col items-start p-4 rounded-lg">
            <div className="relative w-20 h-20 mx-auto rounded-full bg-gray-400 overflow-hidden">
              <Image
                src={
                  userData?.twitterProfilePicURL || '/default-profile-pic.png'
                }
                alt="Profile photo"
                layout="fill"
                objectFit="cover"
                className="rounded-full"
              />
            </div>

            {/* Username and bio */}
            <div className="w-full text-center">
              {userData?.username && (
                <div className="text-xl font-bold">{userData?.username}</div>
              )}

              {userData?.bio && (
                <div className="max-w-[25rem] whitespace-pre-wrap break-words text-sm italic opacity-70 mt-1">
                  {userData?.bio || ''}
                </div>
              )}

              {/* Links */}
              <div className="flex flex-col space-y-2 mt-8 mb-4">
                {userData?.twitterUsername && (
                  <div className="flex items-center">
                    <div className="w-5 mr-3">
                      <div className="relative w-5 h-5">
                        <Image
                          src={'/twitter-solid-gray.svg'}
                          alt="twitter-solid-gray-icon"
                          layout="fill"
                        />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 rounded-xl border border-[#1d1d1d] px-3 py-1">
                      <span className="text-sm">Twitter</span>
                      <A
                        className="flex items-center space-x-2 text-blue-500 hover:text-blue-600 z-50"
                        href={`https://twitter.com/${userData?.twitterUsername}`}
                      >
                        <span className="text-sm">
                          @{userData?.twitterUsername}
                        </span>

                        <ExternalLinkIcon className="w-4 text-[#7f7f7f]" />
                      </A>
                    </div>
                  </div>
                )}
              </div>

              <HoldersSummary holders={userHolders} userData={userData} />
            </div>
          </div>

          {/* Staked/Stake/Holders container */}
          <div className="w-full mt-6">
            {/* Share and settings button */}
            <div className="w-full h-12 mt-2 flex items-start">
              <div
                onClick={copyProfileURL}
                className="w-full p-3 flex justify-center items-center h-full space-x-2 bg-black border border-[#1d1d1d] rounded-lg hover:bg-black/[.1] cursor-pointer"
              >
                <ShareIcon className="w-5" />
                <span>Share</span>
              </div>

              {isConnectedWalletSameAsPublicWallet && (
                <div
                  className="flex justify-center items-center h-full ml-2 px-3 bg-black border border-[#1d1d1d] rounded-lg hover:bg-black/[.1] cursor-pointer"
                  onClick={onClickSettings}
                >
                  <BiCog className="w-6 h-6" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProfileGeneralInfo
