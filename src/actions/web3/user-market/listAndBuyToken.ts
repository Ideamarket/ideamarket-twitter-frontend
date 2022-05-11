import { useContractStore } from 'store/contractStore'
import {
  bigNumberTenPow18,
  web3BNToFloatString,
  ZERO_ADDRESS,
} from '../../../utils'
import { NETWORK } from 'store/networks'
import BigNumber from 'bignumber.js'
import BN from 'bn.js'
import { IdeaMarket } from 'store/ideaMarketsStore'

export default function listAndBuyToken(
  tokenName: string,
  market: IdeaMarket,
  inputTokenAddress: string,
  amount: BN,
  cost: BN,
  slippage: number,
  lockDuration: number,
  recipientAddress: string
) {
  const multiAction = useContractStore.getState().multiActionContractUserMarket

  const slippageAmount = new BN(
    new BigNumber(amount.toString())
      .multipliedBy(new BigNumber(slippage))
      .toFixed(0)
  )
  const fallbackAmount = amount.sub(slippageAmount)

  let contractCall
  let contractCallOptions = {}

  if (inputTokenAddress === NETWORK.getExternalAddresses().imo) {
    console.log('tokenName==', tokenName)
    console.log('market.marketID==', market.marketID)
    console.log('amount==', web3BNToFloatString(amount, bigNumberTenPow18, 4))
    console.log('recipientAddress==', recipientAddress)
    contractCall = multiAction.methods.addAndBuy(
      tokenName,
      market.marketID,
      amount,
      lockDuration,
      recipientAddress
    )
  } else {
    contractCall = multiAction.methods.convertAddAndBuy(
      tokenName,
      market.marketID,
      inputTokenAddress,
      amount,
      fallbackAmount,
      cost,
      lockDuration,
      recipientAddress
    )

    if (inputTokenAddress === ZERO_ADDRESS) {
      contractCallOptions = {
        value: cost,
      }
    }
  }

  return contractCall.send(contractCallOptions)
}
