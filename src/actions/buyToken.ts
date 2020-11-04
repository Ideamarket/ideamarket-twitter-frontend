import { useWalletStore } from 'store/walletStore'
import { useContractStore } from 'store/contractStore'
import { addresses } from '../utils'
import BigNumber from 'bignumber.js'
import BN from 'bn.js'

export default async function buyToken(
  ideaTokenAddress: string,
  inputTokenAddress: string,
  amount: BN,
  cost: BN,
  slippage: number
) {
  const userAddress = useWalletStore.getState().address
  const exchange = useContractStore.getState().exchangeContract

  let contractCall
  let contractCallOptions = {}
  if (inputTokenAddress === addresses.dai) {
    const slippageAmount = new BN(
      new BigNumber(amount.toString())
        .multipliedBy(new BigNumber(slippage))
        .toFixed(0)
    )
    const fallbackAmount = amount.sub(slippageAmount)
    contractCall = exchange.methods.buyTokens(
      ideaTokenAddress,
      amount,
      fallbackAmount,
      cost,
      userAddress
    )
  }

  await contractCall.send(contractCallOptions)

  /*

  const factory = useContractStore.getState().factoryContract
  const exchange = useContractStore.getState().exchangeContract

  const amountBN = new BN(amount).mul(new BN('10').pow(new BN('18')))
  const cost = await exchange.methods
    .getCostForBuyingTokens(address, amountBN)
    .call()

  const daiContract = useContractStore.getState().daiContract
  await daiContract.methods.approve(exchange.options.address, cost).send()
  await exchange.methods
    .buyTokens(
      address,
      amountBN,
      amountBN,
      cost,
      useWalletStore.getState().address
    )
    .send()*/
}
