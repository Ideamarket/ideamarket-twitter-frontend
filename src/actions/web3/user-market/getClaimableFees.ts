import { useContractStore } from 'store/contractStore'

export default async function getClaimableFees(userAddress: string) {
  if (!userAddress) {
    console.error(`No userAddress provided`)
    return null
  }

  const nftOpinionBase = useContractStore.getState().nftOpinionBase

  if (!nftOpinionBase) {
    console.error(`nftOpinionBase not set correctly`)
    return null
  }

  try {
    return await nftOpinionBase.methods.claimableFees(userAddress).call()
  } catch (error) {
    console.error('nftOpinionBase.methods.claimableFees failed', error)
    return null
  }
}
