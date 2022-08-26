import client from 'lib/axios'

/**
 * Trigger that will update DB with newest onchain user token data with given name.
 */
export const syncUserToken = async (walletAddress: string) => {
  const body = {
    walletAddress,
  }
  try {
    const response = await client.patch(`/user-token/sync`, body)
    return response?.data?.data
  } catch (error) {
    console.error(
      `Could not trigger user token sync for ${walletAddress}`,
      error
    )
    return null
  }
}
