import { useEffect, useState } from 'react'
import { useWalletStore } from 'store/walletStore'

export function useENSAddress(recipientAddress: string) {
  const ens = useWalletStore((state) => state.ens)
  const [hexAddress /*, setHexAddress*/] = useState('0x0')
  const [isLoading, setIsLoading] = useState(true)

  useEffect((): any => {
    /* ENS is disabled on AVM for now */

    /*async function run() {
      try {
        setHexAddress(await ens.name(recipientAddress).getAddress())
      } catch (e) {
        setHexAddress('0')
      }
    }

    setIsLoading(true)
    run()*/

    setIsLoading(false)
  }, [recipientAddress, ens])

  // First return value says if is valid ENS address or not
  return [parseInt(hexAddress, 16) !== 0, hexAddress, isLoading]
}
