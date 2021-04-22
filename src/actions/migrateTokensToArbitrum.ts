import { useContractStore } from 'store/contractStore'
import BN from 'bn.js'

export default function migrateTokensToArbitrum(
  marketID: number,
  tokenID: number,
  l2Recipient: string
) {
  const exchangeContract = useContractStore.getState().exchangeContract
  const oneGwei = new BN('1000000000')
  return exchangeContract.methods
    .transferIdeaTokens(
      marketID,
      tokenID,
      l2Recipient,
      oneGwei // TODO: L2 gas price bid
    )
    .send()
}
