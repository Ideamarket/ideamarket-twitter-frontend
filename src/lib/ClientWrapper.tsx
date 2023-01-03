import { GlobalContext } from './GlobalContext'
import { useContext, useEffect } from 'react'
import { getCookie } from 'services/CookieService'
import useAuth from 'components/account/useAuth'

export const ClientWrapper: React.FC = ({ children }) => {
  const { setJwtToken } = useContext(GlobalContext)

  const { setUserFromJwt } = useAuth()

  useEffect(() => {
    const initUserData = async () => {
      const jwtValue = getCookie('tt') || null

      // If there is JWT (they are signed in or faking it), then fetch user data using JWT
      if (jwtValue) {
        await setUserFromJwt(jwtValue)
        setJwtToken(jwtValue)
      }
    }

    initUserData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <>{children}</>
}
