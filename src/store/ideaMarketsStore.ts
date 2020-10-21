import create from 'zustand'
import BN from 'bn.js'
import BigNumber from 'bignumber.js'

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
import { useContractStore } from './contractStore'

const tenPow2 = new BigNumber('10').pow(new BigNumber('2'))
const tenPow18 = new BigNumber('10').pow(new BigNumber('18'))

const HTTP_GRAPHQL_ENDPOINT =
  'https://api.thegraph.com/subgraphs/name/ideamarket/ideamarket'
const WS_GRAPHQL_ENDPOINT =
  'wss://api.thegraph.com/subgraphs/name/ideamarket/ideamarket'

type IdeaMarket = {
  name: string
  marketID: number
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

type State = {
  client: ApolloClient<NormalizedCacheObject>
  markets: { [id: number]: IdeaMarket }
}

export const useIdeaMarketsStore = create<State>((set) => ({
  client: undefined,
  markets: {},
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

  const result = await client.query({ query: queryGetAllMarkets() })
  const promises = []
  for (let i = 0; i < result.data.ideaMarkets.length; i++) {
    const market = result.data.ideaMarkets[i]
    promises.push(handleNewMarket(market))
  }

  await Promise.all(promises)
}

async function handleNewMarket(market): Promise<void> {
  const newMarket = <IdeaMarket>{
    name: market.name,
    marketID: market.marketID,
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
}

function web3BNToFloatString(
  bn: BN,
  divideBy: BigNumber,
  decimals: number
): string {
  const converted = new BigNumber(bn.toString())
  const divided = converted.div(divideBy)
  return divided.toFixed(decimals)
}

const queryGetAllMarkets = () => gql`
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
    }
  }
`
