import { useContractStore } from 'store/contractStore'
import { NETWORK } from 'store/networks'

/**
 * Method for user to withdraw claimable fees
 */
export default function withdrawClaimableFees() {
  const nftOpinionBase = useContractStore.getState().nftOpinionBase
  const deployedAddresses = NETWORK.getDeployedAddresses()

  if (!nftOpinionBase || !deployedAddresses) {
    console.error(`nftOpinionBase or deployedAddresses not set correctly`)
    return null
  }

  try {
    return nftOpinionBase.methods.withdrawClaimableFees().send()
  } catch (error) {
    console.error('nftOpinionBase.methods.withdrawClaimableFees failed')
    return null
  }
}
