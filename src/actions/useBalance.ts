import { useState, useEffect } from 'react'
import { web3BNToFloatString } from '../utils'
import { useWalletStore } from 'store/walletStore'
import { getERC20Contract } from 'store/contractStore'
import BigNumber from 'bignumber.js'
import BN from 'bn.js'

const tenPow18 = new BigNumber('10').pow(new BigNumber('18'))
export function useBalance(address: string, decimals: number) {
  const [isLoading, setIsLoading] = useState(true)
  const [balanceBN, setBalanceBN] = useState(undefined)
  const [balance, setBalance] = useState(undefined)

  useEffect(() => {
    if (useWalletStore.getState().web3 && address) {
      if (address === '0x0000000000000000000000000000000000000000') {
        useWalletStore
          .getState()
          .web3.eth.getBalance(useWalletStore.getState().address)
          .then((value) => {
            setBalanceBN(new BN(value))
            setBalance(web3BNToFloatString(new BN(value), tenPow18, 4))
            setIsLoading(false)
          })
          .catch((error) => {
            console.log(error)
          })
      } else {
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

            setBalanceBN(new BN(data))
            setBalance(
              web3BNToFloatString(
                data,
                new BigNumber('10').exponentiatedBy(new BigNumber(decimals)),
                4
              )
            )
            setIsLoading(false)
          })
          .catch((error) => {
            console.log(error)
          })
      }
    }
  }, [address])

  return [isLoading, balanceBN, balance]
}
