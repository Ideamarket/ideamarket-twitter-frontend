import Broken from 'assets/broken-wiki-tokens.json'

/**
 * On launch, a few Wikipedia tokens were created with broken names. This function gets correct names for broken tokens.
 * @param tokenName the raw token name from smart contract
 */
export const getRealTokenName = (tokenName: string) => {
  if (Broken.some((token) => token.brokenName === tokenName)) {
    return Broken.find((token) => token.brokenName === tokenName).realName
  }

  return tokenName
}
