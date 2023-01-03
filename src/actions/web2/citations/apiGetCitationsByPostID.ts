import client from 'lib/axios'

/**
 * Get citations that are for and against this postID.=
 */
export const apiGetCitationsByPostID = async ({
  postID,
  latest,
  skip,
  limit,
  orderBy,
  orderDirection,
}) => {
  if (!postID) return []

  try {
    const params = {
      postID,
      latest,
      skip,
      limit,
      orderBy,
      orderDirection,
    }

    const response = await client.get(`/twitter-post/citations`, {
      params,
    })

    return response?.data?.data?.citations
  } catch (error) {
    console.error(`Could not get citations for this postID: ${postID}`, error)
    return null
  }
}
