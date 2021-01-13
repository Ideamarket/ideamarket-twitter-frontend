import { useWalletStore } from 'store/walletStore'
import { getERC20Contract } from 'store/contractStore'
import { addresses, web3UintMax } from '../utils'
import BN from 'bn.js'

export default async function getTokenAllowance(
  tokenAddress: string,
  spenderAddress: string
) {
  if (!tokenAddress || !spenderAddress) {
    return web3UintMax
  }

  if (tokenAddress === addresses.ZERO) {
    return web3UintMax
  }

  const ownerAddress = useWalletStore.getState().address
  const tokenContract = getERC20Contract(tokenAddress)
  try {
    return new BN(
      await tokenContract.methods.allowance(ownerAddress, spenderAddress).call()
    )
  } catch (ex) {
    console.log(ex)
    throw new Error('Failed to get allowance')
  }
}
