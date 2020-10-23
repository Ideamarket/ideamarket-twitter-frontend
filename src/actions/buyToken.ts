import { useWalletStore } from '../store/walletStore'
import { useContractStore } from '../store/contractStore'
import BigNumber from 'bignumber.js'

export async function buyToken(
  marketID: number,
  tokenID: number,
  amount: number
) {
  const factory = useContractStore.getState().factoryContract
  const exchange = useContractStore.getState().exchangeContract
  const info = await factory.methods
    .getTokenInfo(marketID.toString(), tokenID.toString())
    .call()
  const address = info.ideaToken

  const amountBN = new BigNumber(amount).multipliedBy(
    new BigNumber('10').exponentiatedBy(new BigNumber('18'))
  )
  const cost = await exchange.methods
    .getCostForBuyingTokens(address, amountBN.toString())
    .call()

  const daiContract = useContractStore.getState().daiContract
  await daiContract.methods.approve(exchange.options.address, cost).send()
  await exchange.methods
    .buyTokens(
      address,
      amountBN.toString(),
      amountBN.toString(),
      cost,
      useWalletStore.getState().address
    )
    .send()
}
