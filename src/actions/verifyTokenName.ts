import { getData } from 'lib/utils/fetch'
import { useContractStore } from 'store/contractStore'

export default async function verifyTokenName(name: string, marketID: number) {
  const { data: response } = await getData({
    url: `/api/markets/wikipedia/validPageTitle?title=${name}`,
  })

  let apiIsValid = false
  let validName = null

  if (response.validPageTitle) {
    // Set correct name that is returned from API
    validName = response.validPageTitle
    apiIsValid = true
  }

  const factoryContract = useContractStore.getState().factoryContract
  const contractIsValid = await factoryContract.methods
    .isValidTokenName(validName ? validName : name, marketID.toString())
    .call()

  const isWikipedia = marketID === 4
  let isValid = isWikipedia ? apiIsValid && contractIsValid : contractIsValid

  let isAlreadyListed = false
  if (!isValid) {
    isAlreadyListed =
      (await factoryContract.methods
        .getTokenIDByName(apiIsValid ? validName : name, marketID.toString())
        .call()) !== '0'
  }

  return { isValid, isAlreadyListed, validName }
}
