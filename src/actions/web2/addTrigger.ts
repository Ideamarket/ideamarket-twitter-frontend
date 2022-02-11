import client from 'lib/axios'

/**
 * Add trigger that will update DB with new onchain listing.
 * @param tokenId -- tokenId that is stored on blockchain
 * @param marketID -- id of market this token is being listed on. ID determined by data returned from subgraph
 *
 * @return {
 *   type: "ONCHAIN_LISTING",
 *   triggerData: {
 *     marketID: 1,
 *     tokenId: 1,
 *   }
 * }
 */
export const addTrigger = async (tokenId: number, marketId: number) => {
  const body = {
    type: 'ONCHAIN_LISTING',
    triggerData: {
      marketId,
      tokenId,
    },
  }
  try {
    const response = await client.post(`/trigger`, body)
    return response?.data?.data?.trigger
  } catch (error) {
    console.error(`Could not add trigger for ${tokenId}`, error)
  }
}
