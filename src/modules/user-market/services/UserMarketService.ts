import BN from 'bn.js'
import apiGetAllUsers from 'actions/web2/user-market/apiGetAllUsers'

type Params = [
  limit: number,
  orderBy: string,
  orderDirection: string,
  search: string
]

/**
 * Call API to get all users and then convert data to format consistent across entire frontend
 */
export async function getAllUsers(
  params: Params,
  skip = 0
): Promise<IdeamarketUser[]> {
  if (!params) {
    return []
  }

  const [limit, orderBy, orderDirection, search] = params

  const allUsers = await apiGetAllUsers({
    skip,
    limit,
    orderBy,
    orderDirection,
    search,
  })

  return await Promise.all(
    allUsers.map(async (user) => {
      return formatApiResponseToUser(user)
    })
  )
}

export type IdeamarketUser = {
  id: string
  walletAddress: string
  name: string
  username: string
  email: string
  bio: string
  profilePhoto: string
  role: string
  twitterUsername: string

  totalRatingsCount: number
  latestRatingsCount: number

  tokenAddress: string
  marketId: number
  marketName: string
  tokenOwner: string
  price: number
  dayChange: number
  weekChange: number
  deposits: number
  holders: number
  yearIncome: number
  claimableIncome: number

  rawSupply: BN
  rawMarketCap: BN
  rawDaiInToken: BN
  rawInvested: BN
}

/**
 * Format data fetched from API so that the format is consistent across entire frontend
 */
const formatApiResponseToUser = (apiUser: any): IdeamarketUser => {
  return {
    id: apiUser?.id,
    walletAddress: apiUser?.walletAddress,
    name: apiUser?.name,
    username: apiUser?.username,
    email: apiUser?.email,
    bio: apiUser?.bio,
    profilePhoto: apiUser?.profilePhoto,
    role: apiUser?.role,
    twitterUsername: apiUser?.twitterUsername,

    totalRatingsCount: apiUser?.totalRatingsCount,
    latestRatingsCount: apiUser?.latestRatingsCount,

    tokenAddress: apiUser?.tokenAddress,
    marketId: apiUser?.marketId,
    marketName: apiUser?.marketName,
    tokenOwner: apiUser?.tokenOwner,
    price: apiUser?.price,
    dayChange: apiUser?.dayChange,
    weekChange: apiUser?.weekChange,
    deposits: apiUser?.deposits,
    holders: apiUser?.holders,
    yearIncome: apiUser?.yearIncome,
    claimableIncome: apiUser?.claimableIncome,

    // These will always be 0. If you need up-to-date web3 data, need to call querySingleIDTByTokenAddress
    rawSupply: new BN(0),
    rawMarketCap: new BN(0),
    rawDaiInToken: new BN(0),
    rawInvested: new BN(0),
  }
}
