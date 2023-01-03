import client from 'lib/axios'

/**
 * Create new opinion in DB
 */
export const apiNewOpinion = async ({
  jwt,
  ratedPostID,
  rating,
  citations,
}) => {
  const stringifiedCitations = JSON.stringify(citations)
  const body = {
    ratedPostID,
    rating,
    citations: stringifiedCitations,
  }

  try {
    let response = await client.post(`/twitter-opinion`, body, {
      headers: {
        Authorization: jwt ? `Bearer ${jwt}` : null,
      },
    })

    return response?.data?.data?.opinion
  } catch (error) {
    console.error(`Could not create new opinion`, error)
    return null
  }
}
