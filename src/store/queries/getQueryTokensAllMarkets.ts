import { gql } from 'graphql-request'

export default function getQueryTokensAllMarkets(
  skip: number,
  num: number,
  orderBy: string,
  orderDirection: string,
  filterTokens: string[]
): string {
  let filterTokensQuery = ''
  if (filterTokens) {
    filterTokensQuery = ',where:{id_in:['
    filterTokens.forEach((value, index) => {
      if (index > 0) {
        filterTokensQuery += ','
      }
      filterTokensQuery += `"${value}"`
    })
    filterTokensQuery += ']}'
  }

  return gql`
    {
      ideaTokens(skip:${skip}, first:${num}, orderBy:${orderBy}, orderDirection:${orderDirection}${filterTokensQuery}) {
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
            platformFeeRedeemed
            platformInterestRedeemed
            nameVerifier
          }
          supply
          holders
          marketCap
          tokenOwner
          daiInToken
          invested
          tokenInterestRedeemed
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
