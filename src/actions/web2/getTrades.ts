import client from 'lib/axios'

type Response = {
  trades: any[]
  totalTradesValue: string
}

/**
 * Get all BUY/SELL trades for a specific wallet.
 * @param ownerAddress -- Address to get trades for
 */
export const getTrades = async ({
  ownerAddress,
  marketIds,
  skip,
  limit,
  orderBy,
  orderDirection,
  filterTokens,
  nameSearch,
}): Promise<Response> => {
  const filterTokensString =
    filterTokens && filterTokens?.length > 0 ? filterTokens?.join(',') : null

  try {
    const params = {
      owner: ownerAddress,
      marketIds,
      skip,
      limit,
      orderBy,
      orderDirection,
      filterTokens: filterTokensString,
      search: nameSearch,
    }

    const response = await client.get(`/subgraph/trades`, {
      params,
    })

    return {
      trades: response?.data?.data?.trades,
      totalTradesValue: response?.data?.data?.totalTradesValue,
    }
  } catch (error) {
    console.error(`Could not get trades for address ${ownerAddress}`, error)
    return null
  }
}
