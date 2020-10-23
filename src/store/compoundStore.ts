import { request, gql } from 'graphql-request'

const DAI_ADDRESS = '0x6b175474e89094c44da98b954eedeac495271d0f'
const HTTP_GRAPHQL_ENDPOINT =
  'https://api.thegraph.com/subgraphs/name/graphprotocol/compound-v2'

export async function querySupplyRate(queryKey: string) {
  const result = await request(
    HTTP_GRAPHQL_ENDPOINT,
    getQuerySupplyRate(DAI_ADDRESS)
  )
  const market = result.markets[0]
  return parseFloat(market.supplyRate)
}

function getQuerySupplyRate(address: string) {
  return gql`{
    markets(where:{underlyingAddress:${'"' + address + '"'}}) {
        supplyRate
    }
  }`
}
