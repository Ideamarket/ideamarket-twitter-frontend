import { gql } from 'graphql-request'

export default function getQueryTokens(
  marketID: number,
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
      ideaMarkets(where:{marketID:${marketID.toString()}}) {
        tokens(skip:${skip}, first:${num}, orderBy:${orderBy}, orderDirection:${orderDirection}${filterTokensQuery}) {
          id
          tokenID
          name
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
      }
    }`
}
