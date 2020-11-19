import { useContractStore } from 'store/contractStore'

export default function withdrawInterest(tokenAddress: string) {
  const exchangeContract = useContractStore.getState().exchangeContract
  return exchangeContract.methods.withdrawInterest(tokenAddress).send()
}
