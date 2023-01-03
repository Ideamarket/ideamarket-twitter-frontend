import { apiGetCitationsByPostID } from 'actions/web2/citations/apiGetCitationsByPostID'
import { apiGetCitedOnByTokenID } from 'actions/web2/citations/apiGetCitedOnByTokenID'
import {
  formatApiResponseToPost,
  IdeamarketPost,
} from 'modules/posts/services/PostService'
import { formatApiResponseToTwitterPost } from 'modules/posts/services/TwitterPostService'

/**
 * Call API to get all citations and then convert data to format consistent across entire frontend
 */
export async function getAllCitationsByPostID({
  postID,
  latest,
  skip,
  limit,
  orderBy,
  orderDirection,
}): Promise<IdeamarketPost[]> {
  if (!postID) return null

  const allCitations = await apiGetCitationsByPostID({
    postID,
    latest,
    skip,
    limit,
    orderBy,
    orderDirection,
  })

  return await Promise.all(
    allCitations.map(async (post) => {
      return formatApiResponseToTwitterPost(post)
    })
  )
}

/**
 * Call API to get all "cited by" and then convert data to format consistent across entire frontend
 */
export async function getAllCitedOnByTokenID({
  tokenID,
  skip,
  limit,
  orderBy,
  orderDirection,
}): Promise<IdeamarketPost[]> {
  if (!tokenID) return null

  const allCitedBy = await apiGetCitedOnByTokenID({
    tokenID,
    skip,
    limit,
    orderBy,
    orderDirection,
  })

  return await Promise.all(
    allCitedBy?.map(async (post) => {
      return formatApiResponseToPost(post)
    })
  )
}
