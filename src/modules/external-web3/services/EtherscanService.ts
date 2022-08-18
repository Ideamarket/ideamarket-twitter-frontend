import { apiGetETHPrice } from 'actions/web2/external-web3/apiGetETHPrice'

/**
 * Get current ETH price
 */
export const getETHPrice = async (): Promise<number> => {
  const ethPrice = await apiGetETHPrice()

  return Number(ethPrice)
}
