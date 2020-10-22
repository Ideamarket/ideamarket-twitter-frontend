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
import { web3BNToFloatString } from '../util'

const tenPow18 = new BigNumber('10').pow(new BigNumber('18'))
const DAI_ADDRESS = '0x6b175474e89094c44da98b954eedeac495271d0f'
const HTTP_GRAPHQL_ENDPOINT =
  'https://api.thegraph.com/subgraphs/name/graphprotocol/compound-v2'
const WS_GRAPHQL_ENDPOINT =
  'wss://api.thegraph.com/subgraphs/name/graphprotocol/compound-v2'

type State = {
  client: ApolloClient<NormalizedCacheObject>
  supplyRate: string
  rawSupplyRate: BN
}

export const useCompoundStore = create<State>((set) => ({
  client: undefined,
  supplyRate: '',
  rawSupplyRate: new BN('0'),
}))

export async function initCompoundStore() {
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

  useCompoundStore.setState({ client: client })

  const result = await client.query({
    query: querySupplyRate(DAI_ADDRESS),
  })

  const market = result.data.markets[0]
  const supplyRateBN = new BN(
    new BigNumber(market.supplyRate).multipliedBy(tenPow18).toString()
  )

  useCompoundStore.setState({
    supplyRate: web3BNToFloatString(supplyRateBN, tenPow18, 4),
    rawSupplyRate: supplyRateBN,
  })
}

const querySupplyRate = (address: string) => gql`
    {
    markets(where:{underlyingAddress:${'"' + address + '"'}}) {
        supplyRate
    }
}
`
