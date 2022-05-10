import BN from 'bn.js'

// The user market as defined by the data returned by subgraph when querying ideaMarkets
export const USER_MARKET = {
  baseCost: '1',
  rawBaseCost: new BN('1000000000000000000'),
  hatchTokens: 0,
  rawHatchTokens: new BN(0),
  id: '0x1',
  marketID: 1,
  name: 'User',
  platformFeeInvested: 0,
  rawPlatformFeeInvested: new BN(0),
  platformFeeRate: 0,
  rawPlatformFeeRate: new BN(0),
  platformFeeRedeemed: 0,
  rawPlatformFeeRedeemed: new BN(0),
  platformInterestRedeemed: 0,
  rawPlatformInterestRedeemed: new BN(0),
  platformOwner: '0x0000000000000000000000000000000000000000',
  priceRise: 0,
  rawPriceRise: new BN(0),
  tradingFeeRate: 0,
  rawTradingFeeRate: new BN(0),
}
