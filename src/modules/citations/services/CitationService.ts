import { apiGetCitationsByTokenID } from 'actions/web2/citations/apiGetCitationsByTokenID'
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
