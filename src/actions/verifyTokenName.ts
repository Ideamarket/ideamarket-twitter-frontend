import { getPostByContent } from 'modules/posts/services/PostService'

export default async function verifyTokenName(url: string) {
  if (!url || url === '')
    return {
      isValid: false,
      isAlreadyGhostListed: false,
      isAlreadyOnChain: false,
      finalTokenValue: '',
    }

  const existingListing = await getPostByContent({ content: url })

  const isAlreadyOnChain = Boolean(existingListing)

  // Is valid if 1) canonical is not null 2) not already on chain
  const isValid = url && !isAlreadyOnChain

  return {
    isValid,
    isAlreadyOnChain,
    finalTokenValue: url, // TODO
  }
}
