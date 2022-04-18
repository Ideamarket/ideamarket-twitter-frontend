import { useContractStore } from 'store/contractStore'

/**
 * Get all ratings/opinions that are onchain (even duplicates from 1 user).
 * @param idtAddress -- address of IDT that has been rated
 */
export default async function getOpinionsAboutAddress(idtAddress: string) {
  const opinionBaseContract = useContractStore.getState().opinionBase
  return await opinionBaseContract.methods
    .getOpinionsAboutAddress(idtAddress)
    .call()
}