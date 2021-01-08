import { gql } from 'graphql-request'

export default function getQueryTokenNameTextSearch(
  marketID: number,
  skip: number,
  num: number,
  orderBy: string,
  orderDirection: string,
  search: string,
  filterTokens: string[]
): string {
  const hexMarketID = '0x' + marketID.toString(16)

  let filterTokensQuery = ''
  if (filterTokens) {
    filterTokensQuery = ',id_in:['
    filterTokens.forEach((value, index) => {
      if (index > 0) {
        filterTokensQuery += ','
      }
      filterTokensQuery += `"${value}"`
    })
    filterTokensQuery += ']'
  }

  const currentTs = Math.floor(Date.now() / 1000)
  const weekBack = currentTs - 604800

  return gql`
    {
      tokenNameSearch(skip:${skip}, first:${num}, orderBy:${orderBy}, orderDirection:${orderDirection}, where:{market:${
    '"' + hexMarketID + '"'
  }${filterTokensQuery}}, text:${'"' + search + ':*"'}) {
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
    }`
}
