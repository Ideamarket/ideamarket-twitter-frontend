import { gql } from 'graphql-request'

export default function getQueryTokenNameTextSearchAllMarkets(
  skip: number,
  num: number,
  orderBy: string,
  orderDirection: string,
  search: string,
  filterTokens: string[]
): string {
  let filterTokensQuery = ''
  if (filterTokens) {
    filterTokensQuery = 'id_in:['
    filterTokens.forEach((value, index) => {
      if (index > 0) {
        filterTokensQuery += ','
      }
      filterTokensQuery += `"${value}"`
    })
    filterTokensQuery += ']'
  }

  return gql`
    {
      tokenNameSearch(skip:${skip}, first:${num}, orderBy:${orderBy}, orderDirection:${orderDirection}, where:{${filterTokensQuery}}, text:${
    '"' + search + ':*"'
  }) {
          id
          tokenID
          name
          market {
            marketID
            name
            baseCost
            priceRise
            hatchTokens
            tradingFeeRate
            platformFeeRate
            platformOwner
            platformFeeInvested
            nameVerifier
          }
          supply
          holders
          marketCap
          tokenOwner
          daiInToken
          invested
          listedAt
          lockedAmount
          lockedPercentage
          latestPricePoint {
            timestamp
            counter
            oldPrice
            price
          }
          dayVolume
          dayChange
        }
    }`
}
