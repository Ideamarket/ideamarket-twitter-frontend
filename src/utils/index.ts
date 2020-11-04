import BN from 'bn.js'
import BigNumber from 'bignumber.js'
import { useState, useEffect } from 'react'

// FIXME: Right now all addresses are kovan. Use .env.local file to set env vars, see Next docs
// Unfortunately this is not working right now. Next is not supplying env vars to process.env,
// even if they are defined as NEXT_PUBLIC_* .
export const NETWORK = 'kovan'

export const addresses = {
  ZERO: '0x0000000000000000000000000000000000000000',
  dai:
    NETWORK === 'kovan'
      ? '0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa'
      : '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  weth:
    NETWORK === 'kovan'
      ? '0xd0A1E359811322d97991E03f863a0C30C2cF029C'
      : '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
}

export function web3BNToFloatString(
  bn: BN,
  divideBy: BigNumber,
  decimals: number
): string {
  const converted = new BigNumber(bn.toString())
  const divided = converted.div(divideBy)
  return divided.toFixed(decimals)
}

export function bnToFloatString(
  bn: BigNumber,
  divideBy: BigNumber,
  decimals: number
): string {
  const divided = bn.div(divideBy)
  return divided.toFixed(decimals)
}

export function calculateCurrentPriceBN(
  rawSupply: BN,
  rawBaseCost: BN,
  rawPriceRise: BN
): BN {
  return rawBaseCost.add(
    rawPriceRise.mul(rawSupply).div(new BN('10').pow(new BN('18')))
  )
}

export function floatToWeb3BN(float: string, decimals: number) {
  const pow = new BigNumber('10').exponentiatedBy(decimals)
  const big = new BigNumber(float).multipliedBy(pow)
  return new BN(big.toFixed())
}

// https://usehooks.com/useWindowSize/
export function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  })

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return windowSize
}
