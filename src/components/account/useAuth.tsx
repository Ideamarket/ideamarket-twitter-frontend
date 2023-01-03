import {
  getTwitterUserToken,
  loginAccount,
} from 'actions/web2/user-market/apiUserActions'
import { GlobalContext } from 'lib/GlobalContext'
import { useContext } from 'react'
import { deleteCookie, setCookie } from 'services/CookieService'
import { SignedAddress } from 'types/customTypes'

const useAuth = () => {
  const { setJwtToken, setUser } = useContext(GlobalContext)

  const loginByWallet = async (signedWalletAddress: SignedAddress) => {
    try {
      const response = await loginAccount({
        signedWalletAddress,
      })
      if (response.data?.success && response.data?.data) {
        const {
          data: { token, validUntil },
        } = response.data
        setJwtFromApi(token, validUntil)
        await setUserFromJwt(token)
        return token
      } else {
        console.error('Failed to login')
        return null
      }
    } catch (error) {
      console.error('Failed to login', error)
      await setUserFromJwt(null)
      return null
    }
  }

  /**
   *
   * @param jwt -- the JWT from login API
   * @param validUntil -- the expiration date for the JWT returned
   */
  const setJwtFromApi = (jwt: string, validUntilISODate: string) => {
    setJwtToken(jwt)

    const validUntilUTCDate = new Date(validUntilISODate).toUTCString()

    setCookie('tt', jwt, validUntilUTCDate)
  }

  const setUserFromJwt = async (jwt: string) => {
    if (jwt) {
      const userToken = await getTwitterUserToken({ jwt })
      if (userToken) {
        setUser(userToken)
      }
    }
  }

  const twitterLogout = (): void => {
    deleteCookie('tt')
    setUser(null)
    setJwtToken(null)
  }

  return { loginByWallet, setUserFromJwt, twitterLogout, setJwtFromApi }
}

export default useAuth
