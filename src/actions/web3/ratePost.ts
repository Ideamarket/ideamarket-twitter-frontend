import { useContractStore } from 'store/contractStore'
import { NETWORK } from 'store/networks'

/**
 * Rate a post (URL or text post) onchain.
 * https://github.com/Ideamarket/blockchain-of-opinions/blob/a741391dd5bc1689923fe2a2bd5a96e7fb8bd524/contracts/NFTOpinionBase.sol#L33
 * @param tokenId -- tokenId of NFT that is being rated
 * @param rating -- 0-100 inclusive, except 50
 * @param citations -- array of tokenIds of NFTs used as citations
 * @param inFavorArray -- array where each element corresponds based on index to citations array saying if each citation is in favor of post it is rating or not
 * @param opinionWriter -- Wallet address writing the opinion
 */
export default function ratePost(
  tokenId: number,
  rating: number,
  citations: number[] = [],
  inFavorArray: boolean[] = [],
  opinionWriter: string
) {
  if (!tokenId) {
    console.error(`tokenId ${tokenId} is not valid`)
    return null
  }

  const nftOpinionBase = useContractStore.getState().nftOpinionBase
  const deployedAddresses = NETWORK.getDeployedAddresses()

  if (!nftOpinionBase || !deployedAddresses) {
    console.error(`nftOpinionBase or deployedAddresses not set correctly`)
    return null
  }

  const fee = '1000000000000000' // 0.001 ETH

  try {
    return nftOpinionBase.methods
      .writeOpinion(tokenId, rating, citations, inFavorArray, opinionWriter)
      .send({ value: fee })
  } catch (error) {
    console.error('nftOpinionBase.methods.writeOpinion failed')
    return null
  }
}
