import { gql } from 'graphql-request'

export default function getQueryTokens(
  marketID: number,
  skip: number,
  num: number,
  fromTs: number,
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
          rank
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
          earliestPricePoint: pricePoints(first:1, orderBy:"timestamp", orderDirection:"asc", where:{timestamp_gt:"${fromTs}"}) {
            counter
            timestamp
            oldPrice
            price
          }
          dayVolume
          dayChange
        }
      }
    }`
}
