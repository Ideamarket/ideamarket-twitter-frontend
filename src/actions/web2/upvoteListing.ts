import client from 'lib/axios'

/**
 * Web2 upvote a listing.
 * @param listingId -- listingId of token to be upvoted
 * @param jwt -- auth token for user
 */
export const upvoteListing = async (listingId: string, jwt: string) => {
  try {
    await client.post(
      `/votes/up`,
      { listingId },
      {
        headers: {
          Authorization: jwt ? `Bearer ${jwt}` : null,
        },
      }
    )
  } catch (error) {
    console.error(
      `Could not upvote listing with listingID of ${listingId}`,
      error
    )
  }
}
