import { useContractStore } from 'store/contractStore'

export default async function verifyTokenName(name: string, marketID: number) {
  const factoryContract = useContractStore.getState().factoryContract
  const isValid = await factoryContract.methods
    .isValidTokenName(name, marketID.toString())
    .call()

  let isAlreadyListed = false
  if (!isValid) {
    isAlreadyListed =
      (await factoryContract.methods
        .getTokenIDByName(name, marketID.toString())
        .call()) !== '0'
  }

  return { isValid, isAlreadyListed }
}
