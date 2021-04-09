import { gql } from 'graphql-request'

export default function getQueryTokenBalances(
  marketName: string,
  tokenName: string
): string {
  return gql`
    {
      ideaMarkets(where:{name:${'"' + marketName + '"'}}) {
        tokens(where:{name:${'"' + tokenName + '"'}}) {
          balances {
            id
            holder
            amount
            token {
              name
            }
          }
        }
      }
    }`
}
