import { useContractStore } from 'store/contractStore'
import BN from 'bn.js'

export default function migrateTokensToArbitrum(
  marketID: number,
  tokenID: number,
  l2Recipient: string
) {
  const exchangeContract = useContractStore.getState().exchangeContract

  const maxSubmissionCost = new BN('100000') // 100K
  const l2GasLimit = new BN('1000000') // 1MM
  const l2GasPriceBid = new BN('1000000000') // 1 gwei

  const value = maxSubmissionCost.add(l2GasLimit.mul(l2GasPriceBid))

  return exchangeContract.methods
    .transferIdeaTokens(marketID, tokenID, l2Recipient, l2GasPriceBid)
    .send({
      value: value,
    })
}
