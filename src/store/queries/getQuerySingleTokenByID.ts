import { gql } from 'graphql-request'

export default function getQuerySingleTokenByID(
  marketID: string,
  tokenID: string
): string {
  return gql`
    {
      ideaMarkets(where:{marketID:${marketID}}) {
        tokens(where:{tokenID:${tokenID}}) {
            id
            tokenID
            name
            market {
              id
              name
            }
            supply
            holders
            marketCap
            tokenOwner
            daiInToken
            invested
            listedAt
            lockedAmount
            rank
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
