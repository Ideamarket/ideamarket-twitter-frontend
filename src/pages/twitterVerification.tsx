import { completeVerification } from 'actions/web2/twitter/completeVerification'
import { CircleSpinner, DefaultLayout } from 'components'
import { GetServerSideProps } from 'next'
import { ReactElement, useContext, useEffect } from 'react'
import { GlobalContext } from './_app'

type Props = {
  oauth_token: string
  oauth_verifier: string
  denied: string
}

/**
 * User taken to this page directly after logging into Twitter using external Twitter login page.
 * This page then redirects user back to account page
 */
const TwitterVerifyRedirect = ({
  oauth_token,
  oauth_verifier,
  denied,
}: Props) => {
  const { jwtToken, user } = useContext(GlobalContext)

  useEffect(() => {
    const completeVerificationAndRedirect = async () => {
      const response = await completeVerification(
        oauth_token,
        oauth_verifier,
        jwtToken
      )

      const wasVerificationSuccess = Boolean(response?.verificationCompleted)

      const userNameOrWallet =
        user && user.username ? user.username : user?.walletAddress

      const destination = `/u/${userNameOrWallet}?wasVerificationSuccess=${wasVerificationSuccess}`

      // Send user to account page to continue verification
      window.location.href = destination
      // window.open(destination, '_blank')
    }

    // TODO: sometimes jwt is set in cookies, but this file doesn't detect any changes here and redirect never called. Fix this
    if (
      jwtToken &&
      user &&
      (user?.username || user?.walletAddress) &&
      ((oauth_token && oauth_verifier) || denied)
    ) {
      completeVerificationAndRedirect()
    }
  }, [
    jwtToken,
    user,
    user?.username,
    user?.walletAddress,
    oauth_token,
    oauth_verifier,
    denied,
  ])

  return (
    <div className="mt-20 text-xl text-white flex justify-center items-center space-x-2">
      <CircleSpinner color="#0857e0" />

      {denied ? (
        <div className="text-red-500">
          Verification failed. Redirecting to your profile.
        </div>
      ) : (
        <span>Completing verification. Please wait.</span>
      )}
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const {
    oauth_token = null,
    oauth_verifier = null,
    denied = null,
  } = context.query

  return {
    props: {
      oauth_token: oauth_token,
      oauth_verifier: oauth_verifier,
      denied: denied,
    },
  }
}

TwitterVerifyRedirect.getLayout = (page: ReactElement) => (
  <DefaultLayout bgColor="bg-theme-blue-1 dark:bg-gray-900">
    {page}
  </DefaultLayout>
)

export default TwitterVerifyRedirect
