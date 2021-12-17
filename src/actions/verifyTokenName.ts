import { getData } from 'lib/utils/fetch'
import { useContractStore } from 'store/contractStore'
import { getBrokenTokenName } from 'utils/wikipedia'

export default async function verifyTokenName(name: string, marketID: number) {
  const isWikipedia = marketID === 4

  // TODO: only call API if market is Wikipedia
  const { data: apiData } = await getData({
    url: `/api/markets/wikipedia/validPageTitle?title=${name}`,
  })

  let apiIsValid = false
  let validName = null
  // If broken name, use broken name to verify since that is how it was placed in contract
  const brokenName = getBrokenTokenName(name)

  if (isWikipedia && apiData.validPageTitle) {
    // Set correct name that is returned from API
    validName = apiData.validPageTitle
    apiIsValid = true
  }

  const nameToVerify = brokenName ? brokenName : validName ? validName : name

  const factoryContract = useContractStore.getState().factoryContract
  const contractIsValid = await factoryContract.methods
    .isValidTokenName(nameToVerify, marketID.toString())
    .call()

  let isValid = isWikipedia ? apiIsValid && contractIsValid : contractIsValid

  let isAlreadyListed = false
  if (!isValid) {
    isAlreadyListed =
      (await factoryContract.methods
        .getTokenIDByName(nameToVerify, marketID.toString())
        .call()) !== '0'
  }

  return { isValid, isAlreadyListed, validName }
}
