import { useWeb3React } from '@web3-react/core'
import {
  getAccount,
  loginAccount,
} from 'actions/web2/user-market/apiUserActions'
import { GlobalContext } from 'lib/GlobalContext'
import { useContext } from 'react'
import { setCookie } from 'services/CookieService'
import { SignedAddress } from 'types/customTypes'

const useAuth = () => {
  const { setJwtToken, setUser } = useContext(GlobalContext)
  const { account } = useWeb3React()

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
        setUserFromJwt(token)
        return token
      } else {
        console.error('Failed to login')
        return null
      }
    } catch (error) {
      console.error('Failed to login', error)
      setUserFromJwt(null)
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
    // List of wallet address <-> JWT pairs (named t)
    // const oldJwtKeyValues = JSON.parse(getCookie('t'))
    const newJwtKeyValues = { [account]: jwt }

    const validUntilUTCDate = new Date(validUntilISODate).toUTCString()

    setCookie('t', JSON.stringify(newJwtKeyValues), validUntilUTCDate)
  }

  const setUserFromJwt = async (jwt: string) => {
    if (jwt) {
      const userToken = await getAccount({ jwt })
      if (userToken) {
        setUser(userToken)
      }
    }
  }

  return { loginByWallet, setUserFromJwt }
}

export default useAuth
