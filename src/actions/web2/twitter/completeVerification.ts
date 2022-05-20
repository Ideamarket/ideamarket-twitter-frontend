import client from 'lib/axios'

/**
 *
 */
export const completeVerification = async (
  requestToken: string,
  oAuthVerifier: string,
  jwt: string
) => {
  try {
    const response = await client.post(
      `/twitter-verification/completeVerification`,
      { requestToken, oAuthVerifier },
      {
        headers: {
          Authorization: jwt ? `Bearer ${jwt}` : null,
        },
      }
    )
    return response?.data?.data?.twitterVerification
  } catch (error) {
    console.error(`Could not complete verification`, error)
  }
}
