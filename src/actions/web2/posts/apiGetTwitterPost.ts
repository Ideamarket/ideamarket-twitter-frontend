import client from 'lib/axios'

type Props = {
  content?: string
  postID?: string
}

/**
 * Get post by text in content variable.
 * @param content
 */
export const apiGetTwitterPost = async ({ content, postID }: Props) => {
  if (!content && !postID) return []

  try {
    const params = {
      content,
      postID,
    }

    const response = await client.get(`/twitter-post/single`, {
      params,
    })

    return response?.data?.data?.post
  } catch (error) {
    console.error(
      `Could not get twitter post for this: ${content}${postID}`,
      error
    )
    return null
  }
}
