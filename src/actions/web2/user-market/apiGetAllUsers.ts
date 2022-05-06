import client from 'lib/axios'

/**
 * Get all users (on and off chain)
 */
export default async function apiGetAllUsers({
  skip,
  limit,
  orderBy,
  orderDirection,
  // filterWallets,
  search,
}) {
  try {
    // const filterTokensString =
    //   filterTokens && filterTokens?.length > 0 ? filterTokens?.join(',') : null
    const response = await client.get(`/user-token`, {
      params: {
        skip,
        limit,
        orderBy,
        orderDirection,
        filterWallets: null,
        search,
      },
    })

    return response?.data?.data?.userTokens
  } catch (error) {
    console.error('Could not get all users', error)
    return []
  }
}
