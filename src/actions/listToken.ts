import { useContractStore } from '../store/contractStore'

export async function listToken(name: string, marketID: number) {
  const factoryContract = useContractStore.getState().factoryContract
  console.log(factoryContract)
  const a = await factoryContract.addToken(name, marketID.toString())
  console.log('a')
  return a
}
