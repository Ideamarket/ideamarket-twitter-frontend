import { useContractStore } from 'store/contractStore'

export default async function listToken(name: string, marketID: number) {
  const factoryContract = useContractStore.getState().factoryContract
  return factoryContract.methods.addToken(name, marketID.toString()).send()
}
