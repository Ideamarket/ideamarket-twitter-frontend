import client from 'lib/axios'

/**
 * Get citations that are for and against this tokenID.=
 */
export const apiGetCitationsByTokenID = async ({
  tokenID,
  latest,
  skip,
  limit,
  orderBy,
  orderDirection,
}) => {
  if (!tokenID) return []

  try {
    const params = {
      tokenID,
      latest,
      skip,
      limit,
      orderBy,
      orderDirection,
    }

    const response = await client.get(`/post/citations`, {
      params,
    })

    return response?.data?.data?.citations
  } catch (error) {
    console.error(`Could not get citations for this tokenID: ${tokenID}`, error)
    return null
  }
}
