import { useState, useEffect } from 'react'
import { web3BNToFloatString } from '../utils'
import { useWalletStore } from 'store/walletStore'
import { getERC20Contract } from 'store/contractStore'
import BigNumber from 'bignumber.js'
import BN from 'bn.js'

const tenPow18 = new BigNumber('10').pow(new BigNumber('18'))
export function useERC20Balance(address: string) {
  const [isLoading, setIsLoading] = useState(true)
  const [balanceBN, setBalanceBN] = useState(undefined)
  const [balance, setBalance] = useState(undefined)

  useEffect(() => {
    if (useWalletStore.getState().web3 && address) {
      const contract = getERC20Contract(address)
      contract.methods
        .balanceOf(useWalletStore.getState().address)
        .call()
        .then((data, error) => {
          if (error) {
            console.log(error)
            setBalanceBN(new BN('0'))
            setBalance('0.00')
            setIsLoading(false)
            return
          }

          setBalanceBN(data)
          setBalance(web3BNToFloatString(data, tenPow18, 2))
          setIsLoading(false)
        })
        .catch((error) => {
          console.log(error)
        })
    }
  })

  return [isLoading, balanceBN, balance]
}
