import { useContractStore } from 'store/contractStore'
import { getMarketSpecificsByMarketName } from 'store/markets'
import { getSingleListing } from './web2/getSingleListing'

export default async function verifyTokenName(
  url: string,
  selectedMarket: any,
  isWalletConnected: boolean // Is there a user connected to a wallet?
) {
  if (!url || url === '' || !selectedMarket)
    return {
      isValid: false,
      isAlreadyGhostListed: false,
      isAlreadyOnChain: false,
      finalTokenValue: '',
      canonical: '',
    }

  // Final value that will be stored on chain as token's value
  const finalTokenValue = getMarketSpecificsByMarketName(
    selectedMarket.name
  ).convertUserInputToTokenName(url)

  let contractIsValid = true
  // Need to be connected to wallet to check contract validation. Skip it if not connnected to wallet so users can still type URLs
  if (isWalletConnected) {
    const factoryContract = useContractStore.getState().factoryContract
    contractIsValid = await factoryContract.methods
      .isValidTokenName(
        finalTokenValue || '',
        selectedMarket.marketID.toString()
      )
      .call()
  }

  // When fetching listing, backend always expects URL (not a token name from old market)
  const getExistingListing = await getSingleListing(
    url,
    selectedMarket.marketID
  )

  const isAlreadyGhostListed = getExistingListing?.web2TokenData
  const isAlreadyOnChain = getExistingListing?.web3TokenData

  // Is valid if 1) canonical is not null 2) contract validation works 3) not already on chain 4) not already on ghost market
  const isValid = url && contractIsValid && !isAlreadyOnChain

  return {
    isValid,
    isAlreadyGhostListed,
    isAlreadyOnChain,
    finalTokenValue,
  }
}
