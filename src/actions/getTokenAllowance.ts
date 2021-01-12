import { useWalletStore } from 'store/walletStore'
import { getERC20Contract } from 'store/contractStore'
import { addresses } from '../utils'
import BN from 'bn.js'

export default async function getTokenAllowance(
  tokenAddress: string,
  spenderAddress: string
) {
  if (!tokenAddress || !spenderAddress) {
    return new BN('0')
  }

  if (tokenAddress === addresses.ZERO) {
    return new BN('2').pow(new BN('256')).sub(new BN('1'))
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
