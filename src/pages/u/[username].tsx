import { DefaultLayout } from 'components'
import { Toaster } from 'react-hot-toast'
import { ProfileWallet } from 'components/account'
import ProfileGeneralInfo from 'components/account/ProfileGeneralInfo'
import { ReactElement, useContext } from 'react'
import { useQuery } from 'react-query'
import { useRouter } from 'next/router'
import { getTwitterUserToken } from 'actions/web2/user-market/apiUserActions'
import BgBanner from 'components/BgBanner'
import { GlobalContext } from 'lib/GlobalContext'
import { IdeamarketTwitterUser } from 'modules/user-market/services/TwitterUserService'

const PublicProfile = () => {
  const { isTxPending } = useContext(GlobalContext)
  const router = useRouter()
  const { username } = router.query // This can be DB username or onchain wallet address

  const { data: userData } = useQuery<IdeamarketTwitterUser>(
    [{ username }],
    () =>
      getTwitterUserToken({
        twitterUsername: username,
      }),
    {
      enabled: !isTxPending,
    }
  )

  return (
    <div className="font-inter">
      <BgBanner bgColor="bg-[#0D0D0D]" />

      {/* Relative and z-index important to put page above BgBanner */}
      <div className="relative z-10 h-full pt-8 pb-5 text-white md:pt-16">
        <div className="mx-auto md:px-4 md:max-w-304">
          <Toaster />
          <ProfileGeneralInfo userData={userData} />
          <ProfileWallet userData={userData} />
        </div>
      </div>
    </div>
  )
}

PublicProfile.getLayout = (page: ReactElement) => (
  <DefaultLayout
    bgColor="bg-[#0D0D0D] md:bg-brand-gray md:dark:bg-gray-900"
    bgHeaderColor="bg-transparent"
  >
    {page}
  </DefaultLayout>
)

export default PublicProfile
