import client from 'lib/axios'

type Response = {
  authorizationUrl?: string
}

/**
 *
 */
export const initiateTwitterLoginAPI = async (
  jwt: string
): Promise<Response> => {
  try {
    const response = await client.post(
      `/twitter-user-token/initiateTwitterLogin`,
      {},
      {
        headers: {
          Authorization: jwt ? `Bearer ${jwt}` : null,
        },
      }
    )
    return response?.data?.data?.twitterVerification
  } catch (error) {
    console.error(
      `Could not generate access token for twitter authentication`,
      error
    )
  }
}
