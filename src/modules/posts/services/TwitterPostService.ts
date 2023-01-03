import apiGetAllTwitterPosts from 'actions/web2/posts/apiGetAllTwitterPosts'
import { apiGetTwitterPost } from 'actions/web2/posts/apiGetTwitterPost'
import { apiNewPost } from 'actions/web2/posts/apiNewPost'
import { IdeamarketTwitterUser } from 'modules/user-market/services/TwitterUserService'
import { TIME_FILTER } from 'utils/tables'

export const createNewPost = async ({
  jwt,
  content,
  // categories,
}) => {
  const response = await apiNewPost({ jwt, content })
  return response
}

/**
 * Get post data from backend and convert to one format for frontend
 */
export const getTwitterPostByURL = async ({
  content,
}): Promise<IdeamarketTwitterPost> => {
  if (!content) return null
  const post = await apiGetTwitterPost({
    content,
  })

  return post ? formatApiResponseToTwitterPost(post) : null
}

/**
 * Get post data from backend and convert to one format for frontend
 */
export const getTwitterPostByPostID = async ({
  postID,
}): Promise<IdeamarketTwitterPost> => {
  if (!postID) return null
  const post = await apiGetTwitterPost({
    postID,
  })

  return post ? formatApiResponseToTwitterPost(post) : null
}

type Params = [
  limit: number,
  orderBy: string,
  orderDirection: string,
  categories: string[],
  filterTokens: string[],
  search: string,
  timeFilter: TIME_FILTER
]

/**
 * Call API to get all posts and then convert data to format consistent across entire frontend
 */
export async function getAllTwitterPosts(
  params: Params,
  skip = 0
): Promise<IdeamarketTwitterPost[]> {
  if (!params) {
    return []
  }

  const [
    limit,
    orderBy,
    orderDirection,
    categories,
    filterTokens,
    search,
    timeFilter,
  ] = params

  const allPosts = await apiGetAllTwitterPosts({
    skip,
    limit,
    orderBy,
    orderDirection,
    categories,
    filterTokens,
    search,
    timeFilter: search?.length > 0 ? TIME_FILTER.ALL_TIME : timeFilter, // Filter by all time if user is using search bar
  })

  return await Promise.all(
    allPosts.map(async (post) => {
      return formatApiResponseToTwitterPost(post)
    })
  )
}

export type IdeamarketTwitterPost = {
  postID: string
  content: string
  postedAt: Date

  userToken: IdeamarketTwitterUser

  averageRating: number
  totalRatingsCount: number
  latestRatingsCount: number
  // compositeRating: number
  // marketInterest: number

  topCitations?: any[]
  topRatings?: any[]
  isPostInFavorOfParent?: boolean
}

/**
 * Format data fetched from API so that the format is consistent across entire frontend
 */
export const formatApiResponseToTwitterPost = (
  apiPost: any
): IdeamarketTwitterPost => {
  return {
    postID: apiPost?.postID,
    content: apiPost?.content,
    postedAt: new Date(apiPost?.postedAt),
    // categories: apiPost?.categories,

    userToken: apiPost?.userToken,

    averageRating: apiPost?.averageRating,
    totalRatingsCount: apiPost?.totalRatingsCount,
    latestRatingsCount: apiPost?.latestRatingsCount,
    // compositeRating: apiPost?.compositeRating,
    // marketInterest: apiPost?.marketInterest,

    topCitations: apiPost?.topCitations,
    topRatings: apiPost?.topRatings,
    isPostInFavorOfParent: apiPost?.isPostInFavorOfParent,
  }
}
