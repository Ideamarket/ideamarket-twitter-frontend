import { useState, useEffect } from 'react'
import { useWalletStore } from 'store/walletStore'
import getClaimableFees from 'actions/web3/user-market/getClaimableFees'
import BigNumber from 'bignumber.js'
import { bigNumberTenPow18, web3BNToFloatString } from 'utils'

// Get the fees claimable by the connected user
export default function useUserFeesClaimable() {
  const [isLoading, setIsLoading] = useState(true)
  const [ethClaimableBN, setEthClaimableBN] = useState(undefined)
  const [ethClaimable, setEthClaimable] = useState(undefined)

  // Need walletAddress to detect when user changes wallet accounts
  const { web3, walletAddress, chainID } = useWalletStore((state) => ({
    web3: state.web3,
    walletAddress: state.address,
    chainID: state.chainID,
  }))

  useEffect(() => {
    let isCancelled = false

    async function run() {
      const bn = walletAddress ? await getClaimableFees(walletAddress) : null
      if (!isCancelled) {
        setEthClaimableBN(bn)
        setEthClaimable(
          bn
            ? web3BNToFloatString(
                bn,
                bigNumberTenPow18,
                3,
                BigNumber.ROUND_DOWN
              )
            : '0'
        )
        setIsLoading(false)
      }
    }

    setIsLoading(true)
    run()

    return () => {
      isCancelled = true
    }
  }, [web3, walletAddress, chainID])

  return [ethClaimableBN, ethClaimable, isLoading]
}
