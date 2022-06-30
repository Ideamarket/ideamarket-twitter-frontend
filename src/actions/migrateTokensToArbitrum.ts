import { useContractStore } from 'store/contractStore'
import BN from 'bn.js'
import { getNetworkSpecificsByNetworkName } from 'store/networks'
import Web3 from 'web3'
import BigNumber from 'bignumber.js'

export default async function migrateTokensToArbitrum(
  marketID: number,
  tokenID: number,
  l2Recipient: string
) {
  const exchangeContract = useContractStore.getState().exchangeContractL1

  const maxSubmissionCost = new BN('5000000000000000') // 0.005 ETH
  const l2GasLimit = new BN('3000000') // 3MM

  const l2NetworkSpecifics = getNetworkSpecificsByNetworkName('avm')
  const web3L2 = new Web3(l2NetworkSpecifics.getRPCURL())
  const currentL2GasPrice = await web3L2.eth.getGasPrice()
  const percent25OfGasPrice = new BigNumber(currentL2GasPrice).multipliedBy(
    new BigNumber('.25')
  )
  const l2GasPriceBid = new BN(currentL2GasPrice).add(
    new BN(parseInt(percent25OfGasPrice.toString()))
  ) // Current gas price + 25% of gas price. Have to parseInt the value because cannot add a decimal # using bn.js

  const value = maxSubmissionCost.add(l2GasLimit.mul(l2GasPriceBid))

  return exchangeContract.methods
    .transferIdeaTokens(
      marketID,
      tokenID,
      l2Recipient,
      l2GasLimit,
      maxSubmissionCost,
      l2GasPriceBid
    )
    .send({
      value: value,
    })
}
