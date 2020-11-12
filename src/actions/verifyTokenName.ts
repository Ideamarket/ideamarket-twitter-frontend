import { useMemo } from 'react'
import { useContractStore, getNameVerifierContract } from 'store/contractStore'

export default async function verifyTokenName(name: string, marketID: number) {
  const factoryContract = useContractStore.getState().factoryContract
  const nameVerifierAddress = (
    await factoryContract.methods
      .getMarketDetailsByID(marketID.toString())
      .call()
  ).nameVerifier
  const nameVerifier = getNameVerifierContract(nameVerifierAddress)

  console.log(nameVerifierAddress, name)

  return await nameVerifier.methods.verifyTokenName(name).call()
}
