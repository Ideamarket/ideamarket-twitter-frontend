import client from 'lib/axios'

/**
 * Create new post in DB
 */
export const apiNewPost = async ({
  jwt,
  content,
  // categories,
}) => {
  // const categoriesString =
  //   categories && categories.length > 0 ? categories.join(',') : null
  const body = {
    content,
    // categories: categoriesString,
  }

  try {
    let response = await client.patch(`/twitter-post/update`, body, {
      headers: {
        Authorization: jwt ? `Bearer ${jwt}` : null,
      },
    })

    return response?.data?.data?.post
  } catch (error) {
    console.error(`Could not create new post for ${content}`, error)
    return null
  }
}
