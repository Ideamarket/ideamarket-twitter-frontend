import { gql } from 'graphql-request'

function convertArrayOfStringsToGQLString(items: string[]) {
  const result = items.reduce((a, b) => `${a},"${b}"`, '')
  return `[${result}]`
}

export default function getQueryBalancesOfHolders(holders: string[]): string {
  return gql`
    {
      ideaTokenBalances(where: { holder_in: ${convertArrayOfStringsToGQLString(
        holders
      )} }) {
        id
        amount
        token {
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
          rank
          latestPricePoint {
            timestamp
            counter
            oldPrice
            price
          }
          dayVolume
          dayChange
          market {
            id
            marketID
            name
          }
          lockedPercentage
        }
      }
    }`
}
