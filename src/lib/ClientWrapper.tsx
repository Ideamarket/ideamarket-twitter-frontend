import { GlobalContext } from './GlobalContext'
import { useContext, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { getCookie } from 'services/CookieService'
import useAuth from 'components/account/useAuth'
import {
  createAccount,
  getAccount,
} from 'actions/web2/user-market/apiUserActions'

export const ClientWrapper: React.FC = ({ children }) => {
  const { active, account } = useWeb3React()
  const { setJwtToken, setUser } = useContext(GlobalContext)

  const { setUserFromJwt } = useAuth()

  useEffect(() => {
    const initUserData = async () => {
      // List of wallet address <-> JWT pairs (named t)
      const jwtKeyValues = JSON.parse(getCookie('t')) || {}
      const jwt = jwtKeyValues[account] // Get JWT for CONNECTED wallet

      // If there is JWT (they are signed in), then fetch user data using JWT
      if (jwt) {
        setJwtToken(jwt)
        setUserFromJwt(jwt)
      } else {
        // If no JWT, fetch user data by sending connected wallet to API
        setJwtToken(null)
        const response = await getAccount({
          username: null,
          walletAddress: account,
        })

        // If newly connected wallet does NOT already have account, then create one for them (then their wallet will appear in home users table and other places to be bought)
        if (!response) {
          await createAccount({ walletAddress: account })
        }

        let userObject = { walletAddress: account, ...response }
        setUser(userObject)
      }
    }

    if (active) initUserData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, account])

  return <>{children}</>
}
