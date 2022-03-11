import { useWalletStore } from 'store/walletStore'
import { useContractStore } from 'store/contractStore'

/**
 * Withdraw IDT that are currently locked so they are no longer locked.
 * @param idtAddress -- address of IDT that is being unlocked
 * @param untils -- array of expiration dates (in seconds) that will be unlocked. Used to find different locking instances.
 */
export default function unlockIDT(idtAddress: string, untils: number[]) {
  const userAddress = useWalletStore.getState().address
  const vaultContract = useContractStore.getState().ideaTokenVaultContract
  return vaultContract.methods.withdraw(idtAddress, untils, userAddress).send()
}
