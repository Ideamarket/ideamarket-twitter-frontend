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

  const currentTs = Math.floor(Date.now() / 1000)
  const weekBack = currentTs - 604800

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
            oldPrice
            price
          }
          dayVolume
          dayChange
          pricePoints(where:{timestamp_gt:${weekBack}} orderBy:timestamp) {
            timestamp
            oldPrice
            price
          }
        }
      }
    }`
}
