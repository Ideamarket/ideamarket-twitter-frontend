import { useWalletStore } from 'store/walletStore'
import { useContractStore } from 'store/contractStore'
import { addresses } from '../utils'
import BigNumber from 'bignumber.js'
import BN from 'bn.js'

export default function buyToken(
  ideaTokenAddress: string,
  inputTokenAddress: string,
  amount: BN,
  cost: BN,
  slippage: number,
  lockDuration: number
) {
  const userAddress = useWalletStore.getState().address
  const exchange = useContractStore.getState().exchangeContract
  const multiAction = useContractStore.getState().multiActionContract

  const slippageAmount = new BN(
    new BigNumber(amount.toString())
      .multipliedBy(new BigNumber(slippage))
      .toFixed(0)
  )
  const fallbackAmount = amount.sub(slippageAmount)

  let contractCall
  let contractCallOptions = {}

  if (inputTokenAddress === addresses.dai) {
    if (lockDuration > 0) {
      contractCall = multiAction.methods.buyAndLock(
        ideaTokenAddress,
        amount,
        fallbackAmount,
        cost,
        lockDuration,
        userAddress
      )
    } else {
      contractCall = exchange.methods.buyTokens(
        ideaTokenAddress,
        amount,
        fallbackAmount,
        cost,
        userAddress
      )
    }
  } else {
    contractCall = multiAction.methods.convertAndBuy(
      inputTokenAddress,
      ideaTokenAddress,
      amount,
      fallbackAmount,
      cost,
      lockDuration,
      userAddress
    )

    if (inputTokenAddress === addresses.ZERO) {
      contractCallOptions = {
        value: cost,
      }
    }
  }

  return contractCall.send(contractCallOptions)
}
