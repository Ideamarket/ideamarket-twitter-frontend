import { useContractStore } from '../store/contractStore'

export async function listToken(name: string, marketID: number) {
  const factoryContract = useContractStore.getState().factoryContract
  return factoryContract.addToken(name, marketID.toString())
}
