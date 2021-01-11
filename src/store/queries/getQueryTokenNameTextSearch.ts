import { gql } from 'graphql-request'

export default function getQueryTokenNameTextSearch(
  marketID: number,
  skip: number,
  num: number,
  fromTs: number,
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
    }`
}
