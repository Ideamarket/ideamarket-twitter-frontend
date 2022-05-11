import { DefaultLayout } from 'components'
import { Toaster } from 'react-hot-toast'
import { ProfileWallet } from 'components/account'
import ProfileGeneralInfo from 'components/account/ProfileGeneralInfo'
import { ReactElement } from 'react'
import { useQuery } from 'react-query'
import { isAddressValid } from 'lib/utils/web3-eth'
import { useRouter } from 'next/router'
import { getAccount } from 'actions/web2/user-market/apiUserActions'

const PublicProfile = () => {
  const router = useRouter()
  const { username } = router.query // This can be DB username or onchain wallet address

  const { data: userData } = useQuery<any>([{ username }], () =>
    getAccount({
      username: isAddressValid(username as string) ? null : username,
      walletAddress: username,
    })
  )

  // Create user data object for wallet that is not in DB
  const nonDBUserData = {
    walletAddress: isAddressValid(username as string) ? username : null,
  }

  const finalUserData = userData ? userData : nonDBUserData

  return (
    <div className="min-h-screen bg-brand-gray dark:bg-gray-900 font-inter">
      <div className="h-full pt-8 pb-5 text-white md:pt-16 bg-top-mobile md:bg-top-desktop md:h-[38rem]">
        <div className="mx-auto md:px-4 md:max-w-304">
          <Toaster />
          <ProfileGeneralInfo userData={finalUserData} />
          <ProfileWallet userData={finalUserData} />
        </div>
      </div>
    </div>
  )
}

PublicProfile.getLayout = (page: ReactElement) => (
  <DefaultLayout>{page}</DefaultLayout>
)

export default PublicProfile
