import client from 'lib/axios'

type Response = {
  id?: string
  username?: string
  name?: string
  bio?: string
  profileImageUrl?: string
}

/**
 * Get Twitter profile data for Twitter username passed in.
 * @param username -- Twitter username to fetch data for
 */
export const getTwitterProfileData = async (
  username: string
): Promise<Response> => {
  try {
    const response = await client.get(
      `/twitterVerification/profile/${username}`
    )
    return response?.data?.data?.twitterProfile
  } catch (error) {
    console.error(
      `Could not get Twitter profile data for this username: ${username}`,
      error
    )
  }
}
