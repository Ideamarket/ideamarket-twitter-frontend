import { gql } from 'graphql-request'

export default function getQuerySingleToken(
  marketName: string,
  tokenName: string
): string {
  return gql`
    {
      ideaMarkets(where:{name:${'"' + marketName + '"'}}) {
        tokens(where:{name:${'"' + tokenName + '"'}}) {
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
            latestPricePoint {
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
