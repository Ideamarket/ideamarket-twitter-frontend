import { gql } from 'graphql-request'

function convertArrayOfStringsToGQLString(items: string[]) {
  const result = items.reduce((a, b) => `${a},"${b}"`, '')
  return `[${result}]`
}

export default function getQueryBalancesOfHolders({
  holders,
  start,
  skip,
}: {
  holders: string[]
  start: number
  skip: number
}): string {
  return gql`
    {
      ideaTokenBalances(where: { holder_in: ${convertArrayOfStringsToGQLString(
        holders
      )} }, start: ${start}, skip: ${skip}) {
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
