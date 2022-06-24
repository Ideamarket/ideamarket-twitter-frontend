import client from 'lib/axios'

/**
 * Get "cited by" that are one degree up this tokenID.
 */
export const apiGetCitedOnByTokenID = async ({
  tokenID,
  skip,
  limit,
  orderBy,
  orderDirection,
}) => {
  if (!tokenID) return []

  try {
    const params = {
      tokenID,
      skip,
      limit,
      orderBy,
      orderDirection,
    }

    const response = await client.get(`/post/citedBy`, {
      params,
    })

    return response?.data?.data
  } catch (error) {
    console.error(
      `Could not get "cited by" for this tokenID: ${tokenID}`,
      error
    )
    return null
  }
}
