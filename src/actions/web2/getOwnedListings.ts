import client from 'lib/axios'

type Response = {
  holdings: any[]
  totalOwnedTokensValue: string
  totalLockedTokensValue: string
}

/**
 * Get all owned tokens (including locked tokens) for a specific wallet.
 * @param ownerAddress -- Address to get tokens for
 */
export const getOwnedListings = async ({
  ownerAddress,
  marketIds,
  skip,
  limit,
  orderBy,
  orderDirection,
  filterTokens,
  nameSearch,
  isLockedFilterActive,
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
      locked: isLockedFilterActive,
    }

    const response = await client.get(`/subgraph/walletHoldings`, {
      params,
    })

    return {
      holdings: response?.data?.data?.holdings,
      totalOwnedTokensValue: response?.data?.data?.totalOwnedTokensValue,
      totalLockedTokensValue: response?.data?.data?.totalLockedTokensValue,
    }
  } catch (error) {
    console.error(
      `Could not get owned listings for address ${ownerAddress}`,
      error
    )
    return null
  }
}
