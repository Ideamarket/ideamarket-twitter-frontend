import { useEffect, useState } from 'react'
import { IdeaMarket, IdeaToken } from 'store/ideaMarketsStore'
import { useWalletStore } from 'store/walletStore'
import {
  calculateIdeaTokensInputForDaiOutput,
  ZERO_ADDRESS,
  web3BNToFloatString,
} from 'utils'
import { NETWORK } from 'store/networks'

import BigNumber from 'bignumber.js'
import BN from 'bn.js'
import { getInputForOutput } from 'utils/uniswap'
import { TX_TYPES } from 'components/trade/TradeCompleteModal'

const nullTokenBalance = new BN('0')

/**
 * Calculates the ideaToken amount after the selectedToken is typed in
 */
export default function useCalcIDTAmount(
  ideaToken: IdeaToken,
  market: IdeaMarket,
  selectedTokenAddress: string, // The token selected. Will be IMO or ERC20 that will get converted to IMO
  selectedTokenAmount: string,
  decimals: number,
  tradeType: TX_TYPES,
  tokenBalanceBN = nullTokenBalance // The connected wallet's balance for selectedToken. This is mainly meant to trigger rerun of this hook when balance changes
) {
  const [isLoading, setIsLoading] = useState(true)
  const [outputBN, setOutputBN] = useState(undefined)
  const [output, setOutput] = useState(undefined)

  useEffect(() => {
    let isCancelled = false

    async function calculateBuyCost() {
      if (
        !selectedTokenAddress ||
        (!ideaToken && !market) ||
        !market ||
        !tokenBalanceBN ||
        isNaN(parseFloat(selectedTokenAmount)) ||
        parseFloat(selectedTokenAmount) <= 0.0
      ) {
        return new BN('0')
      }

      const selectedTokenAmountBN = new BN(
        new BigNumber(selectedTokenAmount)
          .multipliedBy(new BigNumber('10').exponentiatedBy(decimals))
          .toFixed(0, BigNumber.ROUND_DOWN)
      )

      let imoAmountBN = selectedTokenAmountBN
      // if (selectedTokenAddress !== NETWORK.getExternalAddresses().dai) {
      //   // Selected ERC20 token
      //   const inputTokenAddress =
      //     selectedTokenAddress === ZERO_ADDRESS
      //       ? NETWORK.getExternalAddresses().weth
      //       : selectedTokenAddress
      //   const outputTokenAddress = NETWORK.getExternalAddresses().dai

      //   try {
      //     // BUY: ERC20 -> WETH -> DAI (we want amount for DAI)
      //     daiAmountBN = await getOutputForInput(
      //       inputTokenAddress,
      //       outputTokenAddress,
      //       selectedTokenAmountBN,
      //       tradeType
      //     )
      //   } catch (ex) {
      //     console.error('Exception during quote process for BUY:', ex)
      //     return new BN('0')
      //   }
      // }

      // const requiredIdeaTokenAmount = new BN(
      //   calculateMaxIdeaTokensBuyable(
      //     imoAmountBN,
      //     ideaToken?.rawSupply || new BN('0'),
      //     market
      //   ).toFixed(0, BigNumber.ROUND_DOWN)
      // )

      // 1:1 so, if they stake 500 IMO, then they want 500 IDT
      return imoAmountBN
    }

    async function calculateSellPrice() {
      const selectedTokenAmountBN = new BN(
        new BigNumber(selectedTokenAmount)
          .multipliedBy(
            new BigNumber('10').exponentiatedBy(decimals.toString())
          )
          .toFixed(0, BigNumber.ROUND_UP)
      )

      if (
        !useWalletStore.getState().web3 ||
        !ideaToken ||
        !market ||
        !selectedTokenAddress ||
        isNaN(parseFloat(selectedTokenAmount)) ||
        parseFloat(selectedTokenAmount) <= 0.0
      ) {
        return new BN('0')
      }

      let requiredDaiAmountBN = selectedTokenAmountBN
      if (selectedTokenAddress !== NETWORK.getExternalAddresses().dai) {
        // The user wants to receive a different currency than Dai
        // -> perform a Uniswap trade

        const inputTokenAddress = NETWORK.getExternalAddresses().dai
        const outputTokenAddress =
          selectedTokenAddress === ZERO_ADDRESS
            ? NETWORK.getExternalAddresses().weth
            : selectedTokenAddress

        try {
          // SELL: DAI -> WETH -> ERC20 (we want amount for DAI)
          requiredDaiAmountBN = await getInputForOutput(
            inputTokenAddress,
            outputTokenAddress,
            selectedTokenAmountBN,
            tradeType
          )
        } catch (ex) {
          return new BN('0')
        }
      }

      const outputBN = new BN(
        calculateIdeaTokensInputForDaiOutput(
          requiredDaiAmountBN,
          ideaToken?.rawSupply || new BN('0'),
          market
        ).toFixed(0, BigNumber.ROUND_UP)
      )

      return outputBN
    }

    async function run(fn) {
      if (!selectedTokenAmount || selectedTokenAmount === '') {
        setOutputBN(new BN('0'))
        setOutput('0.0000')
        setIsLoading(false)
        return
      }

      const bn = await fn
      if (!isCancelled) {
        const pow = new BigNumber('10').pow(new BigNumber('18'))
        setOutputBN(bn)
        setOutput(web3BNToFloatString(bn, pow, 8))
        setIsLoading(false)
      }
    }

    setIsLoading(true)
    if (tradeType === TX_TYPES.STAKE_USER) {
      run(calculateBuyCost())
    } else {
      run(calculateSellPrice())
    }

    return () => {
      isCancelled = true
    }
  }, [
    ideaToken,
    selectedTokenAddress,
    selectedTokenAmount,
    tradeType,
    tokenBalanceBN,
    decimals,
    market,
  ])

  return [isLoading, outputBN, output]
}
