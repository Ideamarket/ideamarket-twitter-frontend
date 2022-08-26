import client from 'lib/axios'

/**
 * Get recommended users for this wallet based on mutual ratings
 */
export default async function apiGetRecommendedUsersByWallet({
  walletAddress,
  skip,
  limit,
  orderBy,
  orderDirection,
}) {
  try {
    const response = await client.get(`/user-token/relations`, {
      params: {
        walletAddress,
        skip,
        limit,
        orderBy,
        orderDirection,
      },
    })

    return response?.data?.data?.relations
  } catch (error) {
    console.error(`Could not get recommended for ${walletAddress}`, error)
    return []
  }
}
