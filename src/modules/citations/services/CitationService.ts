import { apiGetCitationsByTokenID } from 'actions/web2/citations/apiGetCitationsByTokenID'
import { apiGetCitedOnByTokenID } from 'actions/web2/citations/apiGetCitedOnByTokenID'
// import { getETHPrice } from 'modules/external-web3/services/EtherscanService'
import {
  formatApiResponseToPost,
  IdeamarketPost,
} from 'modules/posts/services/PostService'

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
}): Promise<IdeamarketPost[]> {
  if (!tokenID) return null

  const allCitations = await apiGetCitationsByTokenID({
    tokenID,
    latest,
    skip,
    limit,
    orderBy,
    orderDirection,
  })

  const exchangeRate = 0

  return await Promise.all(
    allCitations.map(async (post) => {
      const postIncome = post.totalRatingsCount * 0.001
      // Caclulate the DAI worth of the input tokens by finding this product
      const product = postIncome * exchangeRate
      post.incomeInDAI = product
      return formatApiResponseToPost(post)
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
