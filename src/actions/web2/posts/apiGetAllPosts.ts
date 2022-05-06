import client from 'lib/axios'

/**
 * Get all posts (URLs and text posts)
 */
export default async function apiGetAllPosts({
  skip,
  limit,
  orderBy,
  orderDirection,
  categories, // array of strings representing category tags to add to this new onchain listing (OPTIONAL)
  filterTokens,
  search,
  minterAddress,
}) {
  try {
    const categoriesString =
      categories && categories.length > 0 ? categories.join(',') : null
    const filterTokensString =
      filterTokens && filterTokens?.length > 0 ? filterTokens?.join(',') : null
    const response = await client.get(`/post`, {
      params: {
        skip,
        limit,
        orderBy,
        orderDirection,
        categories: categoriesString,
        filterTokens: filterTokensString,
        search,
        minterAddress,
      },
    })

    return response?.data?.data?.posts
  } catch (error) {
    console.error('Could not get all posts', error)
    return []
  }
}
