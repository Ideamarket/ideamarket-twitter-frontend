import client from 'lib/axios'

/**
 * Create account in database. This is called:
 * 1) On connection of wallet, if that wallet does not already have an account
 * 2) On buyAndList of that wallet
 */
export const createAccount = async ({ walletAddress }) => {
  try {
    await client.post(`/user-token`, {
      walletAddress,
    })
  } catch (error) {
    console.error(`createAccount failed for ${walletAddress}`)
    return null
  }
}
export const loginAccount = ({ signedWalletAddress }) =>
  client.post(`/user-token/signIn`, {
    signedWalletAddress,
  })

export const updateAccount = ({ requestBody, token }) =>
  client.patch(`/user-token`, requestBody, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

export const uploadAccountPhoto = ({ formData, token }) =>
  client.post(`/user-token/profilePhoto`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'content-Type': 'multipart/form-data',
    },
  })

export const sendVerificationCodeToAccountEmail = ({ token, email }) =>
  client.get(`/user-token/emailVerification`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      email,
    },
  })

export const checkAccountEmailVerificationCode = ({ token, code, email }) =>
  client.post(
    `/user-token/emailVerification`,
    { code, email },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

/**
 * Get account for a twitterUsername, or jwt
 */
export const getTwitterUserToken = async ({
  twitterUsername = null,
  jwt = null,
}) => {
  if (!twitterUsername && !jwt) return null

  try {
    const response = await client.get(`/twitter-user-token/single`, {
      params: {
        twitterUsername,
      },
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })

    return response?.data?.data?.twitterUserToken
  } catch (error) {
    console.error(`getTwitterUserToken failed`)
    return null
  }
}

/**
 * Get holders of a certain wallet address
 */
export const getUserHolders = async ({
  walletAddress,
  skip,
  limit,
  orderBy,
  orderDirection,
}) => {
  if (!walletAddress) return null

  try {
    const response = await client.get(`/user-token/holders`, {
      params: {
        walletAddress,
        skip,
        limit,
        orderBy,
        orderDirection,
      },
    })

    return response?.data?.data?.holders
  } catch (error) {
    console.error(`getting holders of wallet address ${walletAddress} failed`)
    return null
  }
}

/**
 * Get holdings of a certain wallet address (the users they are staked on)
 */
export const getUserHoldings = async ({
  walletAddress,
  skip,
  limit,
  orderBy,
  orderDirection,
}) => {
  if (!walletAddress) return null

  try {
    const response = await client.get(`/user-token/holdings`, {
      params: {
        walletAddress,
        skip,
        limit,
        orderBy,
        orderDirection,
      },
    })

    return response?.data?.data?.holdings
  } catch (error) {
    console.error(`getting holdings of wallet address ${walletAddress} failed`)
    return null
  }
}
