import { gql } from 'graphql-request'

export default function getQueryMarkets(): string {
  return gql`
    {
      ideaMarkets {
        marketID
        name
        baseCost
        priceRise
        hatchTokens
        tradingFeeRate
        platformFeeRate
        platformOwner
        platformFeeInvested
        nameVerifier
      }
    }
  `
}
