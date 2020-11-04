import { useWalletStore } from 'store/walletStore'
import { useContractStore } from 'store/contractStore'
import { addresses } from '../utils'
import BigNumber from 'bignumber.js'
import BN from 'bn.js'

export default function sellToken(
  ideaTokenAddress: string,
  outputTokenAddress: string,
  amount: BN,
  price: BN,
  slippage: number
) {
  const userAddress = useWalletStore.getState().address
  const exchange = useContractStore.getState().exchangeContract
  const currencyConverter = useContractStore.getState()
    .currencyConverterContract

  const slippageAmount = new BN(
    new BigNumber(price.toString())
      .multipliedBy(new BigNumber(slippage))
      .toFixed(0)
  )
  const minPrice = price.sub(slippageAmount)

  let contractCall
  if (outputTokenAddress === addresses.dai) {
    contractCall = exchange.methods.sellTokens(
      ideaTokenAddress,
      amount,
      minPrice,
      userAddress
    )
  } else {
    contractCall = currencyConverter.methods.sellTokens(
      outputTokenAddress,
      ideaTokenAddress,
      amount,
      minPrice,
      userAddress
    )
  }

  return contractCall.send()
}
