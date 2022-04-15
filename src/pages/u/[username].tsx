import { DefaultLayout } from 'components'
import { Toaster } from 'react-hot-toast'
import { ProfileWallet } from 'components/account'
import ProfileGeneralInfo from 'components/account/ProfileGeneralInfo'
import { getPublicProfile } from 'lib/axios'
import { ReactElement } from 'react'
import { useQuery } from 'react-query'
import { isAddressValid } from 'lib/utils/web3-eth'

type Props = {
  username: string // This can be DB username or onchain wallet address
}

const PublicProfile = ({ username }: Props) => {
  const { data: userData } = useQuery<any>([{ username }], () =>
    getPublicProfile({
      username: isAddressValid(username) ? null : username,
      walletAddress: username,
    })
  )

  return (
    <div className="min-h-screen bg-brand-gray dark:bg-gray-900 font-inter">
      <div className="h-full pt-8 pb-5 text-white md:pt-16 bg-top-mobile md:bg-top-desktop md:h-[38rem]">
        <div className="mx-auto md:px-4 md:max-w-304">
          <Toaster />
          <ProfileGeneralInfo userData={userData} />
          <ProfileWallet userData={userData} />
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps = async (context) => {
  const { query } = context

  return {
    props: {
      username: query.username,
    },
  }
}

PublicProfile.getLayout = (page: ReactElement) => (
  <DefaultLayout>{page}</DefaultLayout>
)

export default PublicProfile
