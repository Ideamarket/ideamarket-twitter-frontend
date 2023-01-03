import client from 'lib/axios'

/**
 *
 */
export const completeTwitterLogin = async (
  requestToken: string,
  oAuthVerifier: string
) => {
  try {
    const response = await client.post(
      `/twitter-user-token/completeTwitterLogin`,
      { requestToken, oAuthVerifier }
    )
    return response?.data?.data?.twitterVerification
  } catch (error) {
    console.error(`Could not complete twitter login`, error)
  }
}
