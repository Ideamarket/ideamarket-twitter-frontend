import { useContractStore } from 'store/contractStore'
import { NETWORK } from 'store/networks'
import BigNumber from 'bignumber.js'
import BN from 'bn.js'

/**
 * Unstake IMO from a user. This is basically selling IDT and getting IMO back.
 */
export default function unstakeUserToken(
  ideaTokenAddress: string,
  outputTokenAddress: string,
  amount: BN,
  price: BN,
  slippage: number,
  recipientAddress: string
) {
  const exchange = useContractStore.getState().exchangeContractUserMarket
  const multiAction = useContractStore.getState().multiActionContractUserMarket

  const slippageAmount = new BN(
    new BigNumber(price.toString())
      .multipliedBy(new BigNumber(slippage))
      .toFixed(0)
  )
  const minPrice = price.sub(slippageAmount)

  let contractCall
  if (outputTokenAddress === NETWORK.getExternalAddresses().imo) {
    contractCall = exchange.methods.sellTokens(
      ideaTokenAddress,
      amount,
      minPrice,
      recipientAddress
    )
  } else {
    contractCall = multiAction.methods.sellAndConvert(
      outputTokenAddress,
      ideaTokenAddress,
      amount,
      minPrice,
      recipientAddress
    )
  }

  return contractCall.send()
}
