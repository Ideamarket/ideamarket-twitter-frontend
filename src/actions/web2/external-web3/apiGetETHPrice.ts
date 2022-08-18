import client from 'lib/axios'

/**
 * Get current ETH price using Etherscan API
 */
export const apiGetETHPrice = async () => {
  try {
    const response = await client.get(`/general/eth-price`)

    return response?.data?.data?.price
  } catch (error) {
    console.error(`Could not get ETH price using Etherscan API`, error)
    return null
  }
}
