import { useState } from 'react'
import BN from 'bn.js'
import BigNumber from 'bignumber.js'

export function web3BNToFloatString(
  bn: BN,
  divideBy: BigNumber,
  decimals: number
): string {
  const converted = new BigNumber(bn.toString())
  const divided = converted.div(divideBy)
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
