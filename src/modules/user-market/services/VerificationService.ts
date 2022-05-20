import { initiateVerification } from 'actions/web2/twitter/initiateVerification'
import { getAccount } from 'actions/web2/user-market/apiUserActions'
import VerifyTwitterModal, {
  TWITTER_VERIFY_STATE,
} from 'modules/user-market/components/VerifyTwitterModal'
import ModalService from 'components/modals/ModalService'

/**
 * User clicked to verify an account. Take user to external Twitter login page if account NOT already verified. This should never get called when account/listing is already verified though. The frontend just won't offer button to verify.
 * @returns true if account is already verified
 */
export const twitterLogin = async (jwt: string): Promise<boolean> => {
  const userToken = await getAccount({ jwt })
  const alreadyVerified = userToken?.twitterUsername

  if (!alreadyVerified) {
    const authorizationUrl = (await initiateVerification(jwt)).authorizationUrl
    window.location.href = authorizationUrl // Open user's new tab with external Twitter login page
    // window.open(authorizationUrl, '_blank') // Open user's new tab with external Twitter login page
  }

  return alreadyVerified
}

/**
 * After user returns from Twitter login, open the verify modal with correct data.
 */
export const openVerifyModalAfterLogin = (wasVerificationSuccess: boolean) => {
  const initialVerifyState = wasVerificationSuccess
    ? TWITTER_VERIFY_STATE.SUCCESS
    : TWITTER_VERIFY_STATE.ERROR
  ModalService.open(VerifyTwitterModal, {
    initialVerifyState,
  })
}
