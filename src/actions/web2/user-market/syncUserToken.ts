import client from 'lib/axios'

/**
 * Trigger that will update DB with newest onchain user token data with given name.
 */
export const syncUserToken = async (walletAddress: string) => {
  const body = {
    type: 'USER_TOKEN',
    triggerData: {
      walletAddress,
    },
  }
  try {
    const response = await client.post(`/trigger`, body)
    return response?.data?.data?.trigger
  } catch (error) {
    console.error(
      `Could not trigger user token sync for ${walletAddress}`,
      error
    )
    return null
  }
}
