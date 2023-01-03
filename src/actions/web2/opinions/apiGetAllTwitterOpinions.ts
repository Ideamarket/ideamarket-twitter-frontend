import client from 'lib/axios'

/**
 * Get all twitter opinions
 */
export default async function apiGetAllTwitterOpinions({
  skip,
  limit,
  orderBy,
  orderDirection,
  ratedBy,
  ratedPostID,
  search,
  latest,
}) {
  try {
    const response = await client.get(`/twitter-opinion`, {
      params: {
        skip,
        limit,
        orderBy,
        orderDirection,
        ratedBy,
        ratedPostID,
        search,
        latest,
      },
    })

    return response?.data?.data?.opinions
  } catch (error) {
    console.error('Could not get all twitter opinions', error)
    return []
  }
}
