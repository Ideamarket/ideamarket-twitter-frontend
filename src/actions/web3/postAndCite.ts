import { useContractStore } from 'store/contractStore'
import { NETWORK } from 'store/networks'
import { useWalletStore } from 'store/walletStore'

/**
 * Does 3 things: 1) Create new text post 2) Cite newly created text post 3) Rate a post using citing from #2
 */
export default function postAndCite(
  content: string,
  rating: number,
  categoryTags: string[],
  isURL: boolean,
  urlContent: string,
  tokenId: number
) {
  if (!tokenId) {
    console.error(`tokenId ${tokenId} is not valid`)
    return null
  }

  const citationMultiAction = useContractStore.getState().citationMultiAction
  const deployedAddresses = NETWORK.getDeployedAddresses()

  if (!citationMultiAction || !deployedAddresses) {
    console.error(`citationMultiAction or deployedAddresses not set correctly`)
    return null
  }

  const connectedAddress = useWalletStore.getState().address

  console.log('connectedAddress==', connectedAddress)

  try {
    return citationMultiAction.methods
      .postAndCite(
        content,
        rating,
        categoryTags,
        isURL,
        urlContent,
        connectedAddress,
        tokenId
      )
      .send()
  } catch (error) {
    console.error('citationMultiAction.methods.postAndCite failed')
    return null
  }
}
