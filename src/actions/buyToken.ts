import { useWalletStore } from '../store/walletStore'
import { useContractStore } from '../store/contractStore'
import { BigNumber } from 'ethers'

export async function buyToken(
  marketID: number,
  tokenID: number,
  amount: number
) {
  const factory = useContractStore.getState().factoryContract
  const exchange = useContractStore.getState().exchangeContract
  const info = await factory.getTokenInfo(
    marketID.toString(),
    tokenID.toString()
  )
  const address = info.ideaToken

  const amountBN = BigNumber.from(amount).mul(
    BigNumber.from('10').pow(BigNumber.from('18'))
  )
  const cost = await exchange.getCostForBuyingTokens(
    address,
    amountBN.toString()
  )

  const daiContract = useContractStore.getState().daiContract
  await daiContract.approve(exchange.options.address, cost)
  await exchange.buyTokens(
    address,
    amountBN.toString(),
    amountBN.toString(),
    cost,
    useWalletStore.getState().address
  )
}
