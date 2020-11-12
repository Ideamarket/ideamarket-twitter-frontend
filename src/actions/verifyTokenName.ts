import { useContractStore, getNameVerifierContract } from 'store/contractStore'

export default async function verifyTokenName(name: string, marketID: number) {
  const factoryContract = useContractStore.getState().factoryContract
  const nameVerifierAddress = (
    await factoryContract.methods
      .getMarketDetailsByID(marketID.toString())
      .call()
  ).nameVerifier
  const nameVerifier = getNameVerifierContract(nameVerifierAddress)

  return await nameVerifier.methods.verifyTokenName(name).call()
}
