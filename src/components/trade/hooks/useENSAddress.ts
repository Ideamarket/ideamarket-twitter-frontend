import { useEffect, useState } from 'react'
import { useWalletStore } from 'store/walletStore'

export function useENSAddress(recipientAddress: string) {
  const ens = useWalletStore((state) => state.ens)
  const [hexAddress, setHexAddress] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect((): any => {
    async function run() {
      try {
        setHexAddress(await ens.name(recipientAddress).getAddress())
      } catch (e) {
        setHexAddress('0')
      }
    }

    setIsLoading(true)
    run()
  }, [recipientAddress, ens])

  // First return value says if is valid ENS address or not
  return [parseInt(hexAddress, 16) !== 0, hexAddress]
}
