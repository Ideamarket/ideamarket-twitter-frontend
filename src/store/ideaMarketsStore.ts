import create from 'zustand'
import BN from 'bn.js'
import BigNumber from 'bignumber.js'

import { web3BNToFloatString } from '../util'

import {
  gql,
  split,
  HttpLink,
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client'
import { getMainDefinition } from '@apollo/client/utilities'
import { WebSocketLink } from '@apollo/client/link/ws'

const tenPow2 = new BigNumber('10').pow(new BigNumber('2'))
const tenPow18 = new BigNumber('10').pow(new BigNumber('18'))

const HTTP_GRAPHQL_ENDPOINT =
  'https://api.thegraph.com/subgraphs/name/ideamarket/ideamarket'
const WS_GRAPHQL_ENDPOINT =
  'wss://api.thegraph.com/subgraphs/name/ideamarket/ideamarket'

export type IdeaMarket = {
  name: string
  marketID: number
  baseCost: string
  rawBaseCost: BN
  priceRise: string
  rawPriceRise: BN
  tradingFeeRate: string
  rawTradingFeeRate: BN
  platformFeeInvested: string
  rawPlatformFeeInvested: BN
  platformFeeRate: string
  rawPlatformFeeRate: BN
  platformFeeWithdrawer: string
}

export type IdeaToken = {
  address: string
  marketID: number
  tokenID: number
  name: string
  supply: string
  rawSupply: BN
  holders: number
  marketCap: string
  rawMarketCap: BN
  interestWithdrawer: string
  daiInToken: string
  rawDaiInToken: BN
  invested: string
  rawInvested: BN
  isWatching: boolean
}

type State = {
  client: ApolloClient<NormalizedCacheObject>
  markets: { [id: number]: IdeaMarket }
  tokens: { [marketID: number]: { [tokenID: number]: IdeaToken } }
}

export const useIdeaMarketsStore = create<State>((set) => ({
  client: undefined,
  markets: {},
  tokens: {},
}))

export async function initIdeaMarketsStore() {
  const httpLink = new HttpLink({
    uri: HTTP_GRAPHQL_ENDPOINT,
  })

  const wsLink = new WebSocketLink({
    uri: WS_GRAPHQL_ENDPOINT,
    options: {
      reconnect: true,
    },
  })

  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query)
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      )
    },
    wsLink,
    httpLink
  )

  const client = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache(),
  })

  useIdeaMarketsStore.setState({ client: client })

  const result = await client.query({
    query: queryGetAllMarketsWithNumTokens(20),
  })
  for (let i = 0; i < result.data.ideaMarkets.length; i++) {
    const market = result.data.ideaMarkets[i]
    handleNewMarket(market)
  }
}

export function setIsWatching(
  marketID: number,
  tokenID: number,
  watching: boolean
): void {
  const token = useIdeaMarketsStore.getState().tokens[marketID][tokenID]
  const address = token.address

  if (watching) {
    localStorage.setItem(`WATCH_${address}`, 'true')
  } else {
    localStorage.removeItem(`WATCH_${address}`)
  }

  token.isWatching = watching
  useIdeaMarketsStore.setState({ tokens: { [marketID]: { [tokenID]: token } } })
}

function handleNewMarket(market): void {
  const newMarket = <IdeaMarket>{
    name: market.name,
    marketID: market.marketID,
    baseCost: web3BNToFloatString(new BN(market.baseCost), tenPow18, 2),
    rawBaseCost: new BN(market.baseCost),
    priceRise: web3BNToFloatString(new BN(market.priceRise), tenPow18, 4),
    rawPriceRise: new BN(market.priceRise),
    tradingFeeRate: web3BNToFloatString(
      new BN(market.tradingFeeRate),
      tenPow2,
      2
    ),
    rawTradingFeeRate: new BN(market.tradingFeeRate),
    platformFeeInvested: web3BNToFloatString(
      new BN(market.platformFeeInvested),
      tenPow18,
      2
    ),
    rawPlatformFeeInvested: new BN(market.platformFeeInvested),
    platformFeeRate: web3BNToFloatString(
      new BN(market.platformFeeRate),
      tenPow2,
      2
    ),
    rawPlatformFeeRate: new BN(market.platformFeeRate),
    platformFeeWithdrawer: market.platformFeeWithdrawer,
  }

  const marketsState = useIdeaMarketsStore.getState().markets
  marketsState[market.marketID] = newMarket
  useIdeaMarketsStore.setState({ markets: marketsState })

  for (let i = 0; i < market.tokens.length; i++) {
    const token = market.tokens[i]
    handleNewToken(token, market.marketID)
  }
}

function handleNewToken(token, marketID: number): void {
  const newToken = <IdeaToken>{
    address: token.id,
    marketID: marketID,
    tokenID: token.tokenID,
    name: token.name,
    supply: web3BNToFloatString(new BN(token.supply), tenPow18, 2),
    rawSupply: new BN(token.supply),
    holders: token.holders,
    marketCap: web3BNToFloatString(new BN(token.marketCap), tenPow18, 2),
    rawMarketCap: new BN(token.marketCap),
    interestWithdrawer: token.interestWithdrawer,
    daiInToken: web3BNToFloatString(new BN(token.daiInToken), tenPow18, 2),
    rawDaiInToken: new BN(token.daiInToken),
    invested: web3BNToFloatString(new BN(token.invested), tenPow18, 2),
    rawInvested: new BN(token.invested),
    isWatching: localStorage.getItem(`WATCH_${token.id}`) === 'true',
  }

  let tokensState = useIdeaMarketsStore.getState().tokens[marketID]
  if (tokensState === undefined) {
    tokensState = {}
    useIdeaMarketsStore.setState({ tokens: tokensState })
  }

  tokensState[token.tokenID] = newToken
  useIdeaMarketsStore.setState({ tokens: { [marketID]: tokensState } })
}

const queryGetAllMarketsWithNumTokens = (numTokens: number) => gql`
  {
    ideaMarkets {
      marketID
      name
      baseCost
      priceRise
      tradingFeeRate
      platformFeeRate
      platformFeeWithdrawer
      platformFeeInvested
      tokens(orderBy: marketCap, orderDirections: desc, first: ${numTokens}) {
        id
        tokenID
        name
        supply
        holders
        marketCap
        interestWithdrawer
        daiInToken
        invested
      }
    }
  }
`
