import BN from 'bn.js'
import BigNumber from 'bignumber.js'
import { useState, useEffect } from 'react'

// FIXME: Right now all addresses are kovan. Use .env.local file to set env vars, see Next docs
// Unfortunately this is not working right now. Next is not supplying env vars to process.env,
// even if they are defined as NEXT_PUBLIC_* .
export const addresses = {
  dai:
    process.env.NEXT_PUBLIC_NETWORK === 'kovan'
      ? '0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa'
      : '0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa',
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
