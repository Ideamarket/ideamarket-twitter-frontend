import { apiGetCitationsByTokenID } from 'actions/web2/citations/apiGetCitationsByTokenID'
import { apiGetCitedOnByTokenID } from 'actions/web2/citations/apiGetCitedOnByTokenID'
import {
  formatApiResponseToPost,
  IdeamarketPost,
} from 'modules/posts/services/PostService'

type CitationObject = {
  forCitations: IdeamarketPost[]
  againstCitations: IdeamarketPost[]
}

/**
 * Call API to get all citations and then convert data to format consistent across entire frontend
 */
export async function getAllCitationsByTokenID({
  tokenID,
  latest,
  skip,
  limit,
  orderBy,
  orderDirection,
}): Promise<CitationObject> {
  if (!tokenID) return null

  const allCitations = await apiGetCitationsByTokenID({
    tokenID,
    latest,
    skip,
    limit,
    orderBy,
    orderDirection,
  })

  const forCitations = await Promise.all(
    allCitations?.forCitations?.map(async (post) => {
      return formatApiResponseToPost(post)
    })
  )

  const againstCitations = await Promise.all(
    allCitations?.againstCitations?.map(async (post) => {
      return formatApiResponseToPost(post)
    })
  )

  return {
    forCitations,
    againstCitations,
  }
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
