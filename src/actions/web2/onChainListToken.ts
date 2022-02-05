import client from 'lib/axios'

/**
 * Do web2 portion of listing a token on chain.
 * @param value -- value of token being listed in format that it is stored on blockchain
 * @param marketID -- id of market this token is being listed on. ID determined by data returned from subgraph
 * @param jwt (OPTIONAL) -- auth token for user
 *
 * @return {
 *   ghostListedAt: "2022-02-03T12:32:49.575Z"
 *   ghostListedBy: "josh1"
 *   isOnChain: true
 *   listingId: "61fbcb71918ab078c37e8764"
 *   marketId: 6
 *   marketName: "URL"
 *   onchainId: "0x09b08f967eb62c45f3c0704b1be61b80212d6147"
 *   onchainListedAt: "2022-02-03T13:48:45.000Z"
 *   onchainListedBy: "josh1"
 *   onchainValue: "https://stackoverflow.com/questions/27863094/how-to-block-a-url-in-chromes-developer-tools-network-monitor"
 *   totalVotes: 0
 *   upVoted: false
 *   value: "https://stackoverflow.com/questions/27863094/how-to-block-a-url-in-chromes-developer-tools-network-monitor"
 * }
 */
export const onChainListToken = async (
  value: string,
  url: string,
  marketId: number,
  jwt: string
) => {
  const decodedValue = decodeURIComponent(value)
  const decodedURL = decodeURIComponent(url)
  try {
    const response = await client.post(
      `/listing/onchain`,
      { value: decodedURL, onchainValue: decodedValue, marketId },
      {
        headers:
          jwt && jwt !== '' && jwt !== undefined
            ? {
                Authorization: `Bearer ${jwt}`,
              }
            : null,
      }
    )
    return response?.data?.data
  } catch (error) {
    console.error(
      `Could not do the web2 portion of listing ${value} on chain`,
      error
    )
  }
}
