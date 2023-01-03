import apiGetAllTwitterOpinions from 'actions/web2/opinions/apiGetAllTwitterOpinions'
import { apiNewOpinion } from 'actions/web2/opinions/apiNewOpinion'
import { IdeamarketTwitterPost } from 'modules/posts/services/TwitterPostService'
import { IdeamarketTwitterUser } from 'modules/user-market/services/TwitterUserService'

export const createNewOpinion = async ({
  jwt,
  ratedPostID,
  rating,
  citations,
}) => {
  const response = await apiNewOpinion({
    jwt,
    ratedPostID,
    rating,
    citations,
  })
  return response
}

/**
 * Call API to get all opinions and then convert data to format consistent across entire frontend
 */
export async function getAllTwitterOpinions({
  skip,
  limit,
  orderBy,
  orderDirection,
  ratedBy,
  ratedPostID,
  search,
  latest,
}: any): Promise<IdeamarketTwitterOpinion[]> {
  const allOpinions = await apiGetAllTwitterOpinions({
    skip,
    limit,
    orderBy,
    orderDirection,
    ratedBy,
    ratedPostID,
    search,
    latest,
  })

  return await Promise.all(
    allOpinions.map(async (opinion) => {
      return formatApiResponseToTwitterOpinion(opinion)
    })
  )
}

export type Citation = {
  citation: IdeamarketTwitterPost
  inFavor: boolean
}

export type IdeamarketTwitterOpinion = {
  opinionID: string
  content: string
  citations: Citation[]

  userToken: IdeamarketTwitterUser // User data for ratedBy (when getting opinions for Post page)

  ratedBy: string
  ratedAt: string
  rating: number
  ratedPostID: string
}

/**
 * Format data fetched from API so that the format is consistent across entire frontend
 */
export const formatApiResponseToTwitterOpinion = (
  apiOpinion: any
): IdeamarketTwitterOpinion => {
  return {
    opinionID: apiOpinion?.opinionID,
    content: apiOpinion?.content,
    citations: apiOpinion?.citations,

    userToken: apiOpinion?.userToken,

    ratedBy: apiOpinion?.ratedBy,
    ratedAt: apiOpinion?.ratedAt,
    rating: apiOpinion?.rating,
    ratedPostID: apiOpinion?.ratedPostID,
  }
}
