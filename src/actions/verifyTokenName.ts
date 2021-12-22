import { getData } from 'lib/utils/fetch'
import { useContractStore } from 'store/contractStore'
import { getMarketSpecificsByMarketName } from 'store/markets'
import { getBrokenTokenName } from 'utils/wikipedia'

export default async function verifyTokenName(
  name: string,
  selectedMarket: any
) {
  const { data: apiData } = await getData({
    url: `/api/markets/validateTokenName?marketName=${
      selectedMarket.name
    }&tokenName=${name ? name?.replace('@', '') : ''}`,
  })

  // Set correct name that is returned from API and then convert into valid input for smart contract. Will be null if input name was invalid
  const validName =
    apiData && apiData.validToken
      ? getMarketSpecificsByMarketName(
          selectedMarket.name
        ).convertUserInputToTokenName(apiData.validToken)
      : null
  // If broken name, use broken name to verify since that is how it was placed in contract
  const brokenName = getBrokenTokenName(name)

  const nameToVerify = brokenName ? brokenName : validName ? validName : name

  const factoryContract = useContractStore.getState().factoryContract
  const contractIsValid = await factoryContract.methods
    .isValidTokenName(nameToVerify, selectedMarket.marketID.toString())
    .call()

  const isValid = validName && contractIsValid

  let isAlreadyListed = false
  if (!isValid) {
    isAlreadyListed =
      (await factoryContract.methods
        .getTokenIDByName(nameToVerify, selectedMarket.marketID.toString())
        .call()) !== '0'
  }

  return { isValid, isAlreadyListed, validName }
}
