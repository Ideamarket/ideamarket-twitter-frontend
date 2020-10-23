import create from 'zustand'
import BN from 'bn.js'
import BigNumber from 'bignumber.js'

import {
  gql,
  HttpLink,
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client'

const DAI_ADDRESS = '0x6b175474e89094c44da98b954eedeac495271d0f'
const HTTP_GRAPHQL_ENDPOINT =
  'https://api.thegraph.com/subgraphs/name/graphprotocol/compound-v2'

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

  const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
  })

  useCompoundStore.setState({ client: client })
}

export async function querySupplyRate(queryKey: string) {
  const client = useCompoundStore.getState().client

  const result = await client.query({
    query: getQuerySupplyRate(DAI_ADDRESS),
  })

  const market = result.data.markets[0]
  return parseFloat(market.supplyRate)
}

function getQuerySupplyRate(address: string) {
  return gql`{
    markets(where:{underlyingAddress:${'"' + address + '"'}}) {
        supplyRate
    }
  }`
}
