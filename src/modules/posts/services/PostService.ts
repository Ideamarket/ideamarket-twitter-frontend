import apiGetAllPosts from 'actions/web2/posts/apiGetAllPosts'
import { apiGetPostByTokenID } from 'actions/web2/posts/apiGetPostByTokenID'

/**
 * Get post data from backend and convert to one format for frontend
 */
export const getPostByTokenID = async ({
  tokenID,
}): Promise<IdeamarketPost> => {
  if (!tokenID) return null
  const post = await apiGetPostByTokenID({
    tokenID,
  })

  return formatApiResponseToPost(post)
}

type Params = [
  limit: number,
  orderBy: string,
  orderDirection: string,
  categories: string[],
  filterTokens: string[],
  search: string,
  minterAddress: string
]

/**
 * Call API to get all posts and then convert data to format consistent across entire frontend
 */
export async function getAllPosts(
  params: Params,
  skip = 0
): Promise<IdeamarketPost[]> {
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
    minterAddress,
  ] = params

  const allPosts = await apiGetAllPosts({
    skip,
    limit,
    orderBy,
    orderDirection,
    categories,
    filterTokens,
    search,
    minterAddress,
  })

  return await Promise.all(
    allPosts.map(async (post) => {
      return formatApiResponseToPost(post)
    })
  )
}

export type IdeamarketPost = {
  contractAddress: string // Contract address the NFT is stored in
  tokenID: number // tokenID of this NFT
  minterAddress: string // Person that minted the NFT
  content: string
  categories: string[]
  imageLink: string
  isURL: boolean
  url: string
  blockHeight: number

  averageRating: number
  totalRatingsCount: number
  latestRatingsCount: number
  totalCommentsCount: number
  latestCommentsCount: number
  compositeRating: number
  marketInterest: number
}

/**
 * Format data fetched from API so that the format is consistent across entire frontend
 */
const formatApiResponseToPost = (apiPost: any): IdeamarketPost => {
  return {
    contractAddress: apiPost?.contractAddress,
    tokenID: apiPost?.tokenID,
    minterAddress: apiPost?.minterAddress,
    content: apiPost?.content,
    categories: apiPost?.categories,
    imageLink: apiPost?.imageLink,
    isURL: apiPost?.isURL,
    url: apiPost?.isURL ? apiPost?.content : '', // If there is a URL that was listed, it will be in content variable
    blockHeight: apiPost?.blockHeight,

    averageRating: apiPost?.averageRating,
    totalRatingsCount: apiPost?.totalRatingsCount,
    latestRatingsCount: apiPost?.latestRatingsCount,
    totalCommentsCount: apiPost?.totalCommentsCount,
    latestCommentsCount: apiPost?.latestCommentsCount,
    compositeRating: apiPost?.compositeRating,
    marketInterest: apiPost?.marketInterest,
  }
}
