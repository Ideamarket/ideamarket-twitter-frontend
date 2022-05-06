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
 * Get account for a walletAddress, username, or jwt
 */
export const getAccount = async ({
  walletAddress = null,
  username = null,
  jwt = null,
}) => {
  if (!username && !walletAddress && !jwt) return null

  try {
    const response = await client.get(`/user-token/single`, {
      params: {
        username,
        walletAddress,
      },
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })

    return response?.data?.data?.userToken
  } catch (error) {
    console.error(`getAccount failed`)
    return null
  }
}
