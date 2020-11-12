import { useContractStore } from 'store/contractStore'

export default async function verifyTokenName(name: string, marketID: number) {
  const factoryContract = useContractStore.getState().factoryContract
  return await factoryContract.methods
    .isValidTokenName(name, marketID.toString())
    .call()
}
