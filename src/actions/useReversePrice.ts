import { useEffect, useState } from 'react'
import { TokenAmount, Trade, TradeType } from '@uniswap/sdk'
import { IdeaMarket, IdeaToken } from 'store/ideaMarketsStore'
import { useWalletStore } from 'store/walletStore'
import { useContractStore } from 'store/contractStore'
import {
  calculateIdeaTokenDaiValue,
  calculateMaxIdeaTokensBuyable,
  ZERO_ADDRESS,
  getUniswapPath,
  web3BNToFloatString,
  formatNumber,
} from 'utils'
import { NETWORK } from 'store/networks'

import BigNumber from 'bignumber.js'
import BN from 'bn.js'

const tenPow18 = new BigNumber('10').pow(new BigNumber('18'))

export default function useReversePrice(
  ideaToken: IdeaToken,
  market: IdeaMarket,
  tokenAddress: string,
  amount: string,
  decimals: number,
  tradeType: string,
  tokenBalanceBN: any
) {
  const [isLoading, setIsLoading] = useState(true)
  const [outputBN, setOutputBN] = useState(undefined)
  const [output, setOutput] = useState(undefined)

  useEffect(() => {
    let isCancelled = false

    async function calculateBuyCost() {
      if (
        !useWalletStore.getState().web3 ||
        !tokenAddress ||
        (!ideaToken && !market) ||
        !tokenBalanceBN
      ) {
        return new BN('0')
      }

      const amountBN = new BN(
        new BigNumber(amount).multipliedBy(tenPow18).toFixed()
      )

      const exchangeContract = useContractStore.getState().exchangeContract

      const requiredIdeaTokenAmount = calculateMaxIdeaTokensBuyable(
        amountBN,
        ideaToken?.rawSupply || new BN('0'),
        market
      )
      // if (!ideaToken) {
      //   // No ideaToken yet because it is being listed
      //   const factoryContract = useContractStore.getState().factoryContract
      //   const marketDetails = await factoryContract.methods
      //     .getMarketDetailsByID(market.marketID)
      //     .call()
      //   requiredIdeaTokenAmount = new BN(
      //     (
      //       await exchangeContract.methods
      //         .getCostsForBuyingTokens(
      //           marketDetails,
      //           new BN('0'),
      //           amountBN,
      //           false
      //         )
      //         .call()
      //     ).total
      //   )
      // } else {
      //   requiredIdeaTokenAmount = new BN(
      //     await exchangeContract.methods
      //       .getCostForBuyingTokens(ideaToken.address, amountBN)
      //       .call()
      //   )
      // }

      if (tokenAddress === NETWORK.getExternalAddresses().dai) {
        return requiredIdeaTokenAmount
      }

      const inputTokenAddress =
        tokenAddress === ZERO_ADDRESS
          ? NETWORK.getExternalAddresses().weth
          : tokenAddress
      const outputTokenAddress = NETWORK.getExternalAddresses().dai
      const path = await getUniswapPath(inputTokenAddress, outputTokenAddress)

      if (!path) {
        throw 'No Uniswap path exists'
      }

      const trade = new Trade(
        path.route,
        new TokenAmount(path.outToken, requiredIdeaTokenAmount.toString()),
        TradeType.EXACT_OUTPUT
      )
      const requiredInputBN = new BN(
        new BigNumber(trade.inputAmount.toExact())
          .multipliedBy(new BigNumber('10').exponentiatedBy(decimals))
          .toFixed()
      )

      return requiredInputBN
    }

    async function calculateSellPrice() {
      const amountBN = new BN(
        new BigNumber(amount).multipliedBy(tenPow18).toFixed()
      )

      if (
        !useWalletStore.getState().web3 ||
        !ideaToken ||
        !tokenAddress ||
        amountBN.eq(new BN('0'))
      ) {
        return new BN('0')
      }

      const exchangeContract = useContractStore.getState().exchangeContract
      let ideaTokenOutputAmount
      try {
        // ideaTokenOutputAmount = new BN(
        //   await exchangeContract.methods
        //     .getPriceForSellingTokens(ideaToken.address, amountBN)
        //     .call()
        // )
        ideaTokenOutputAmount = calculateMaxIdeaTokensBuyable(
          amountBN,
          ideaToken?.rawSupply || new BN('0'),
          market
        )
      } catch (ex) {
        return new BN('0')
      }

      if (tokenAddress === NETWORK.getExternalAddresses().dai) {
        return ideaTokenOutputAmount
      }

      const inputTokenAddress = NETWORK.getExternalAddresses().dai
      const outputTokenAddress =
        tokenAddress === ZERO_ADDRESS
          ? NETWORK.getExternalAddresses().weth
          : tokenAddress
      const path = await getUniswapPath(inputTokenAddress, outputTokenAddress)

      if (!path) {
        throw 'No Uniswap path exists'
      }

      const trade = new Trade(
        path.route,
        new TokenAmount(path.inToken, ideaTokenOutputAmount.toString()),
        TradeType.EXACT_INPUT
      )
      const outputBN = new BN(
        new BigNumber(trade.outputAmount.toExact())
          .multipliedBy(new BigNumber('10').exponentiatedBy(decimals))
          .toFixed()
      )

      return outputBN
    }

    async function run(fn) {
      if (!amount || amount === '') {
        setOutputBN(new BigNumber('0'))
        setOutput('0.0000')
        setIsLoading(false)
        return
      }

      const bn = await fn
      if (!isCancelled) {
        const pow = new BigNumber('10').pow(new BigNumber(decimals))
        setOutputBN(bn)
        setOutput(web3BNToFloatString(bn, pow, 4))
        setIsLoading(false)
      }
    }

    setIsLoading(true)
    if (tradeType === 'buy') {
      run(calculateBuyCost())
    } else {
      run(calculateSellPrice())
    }

    return () => {
      isCancelled = true
    }
  }, [ideaToken, tokenAddress, amount, tradeType, tokenBalanceBN])

  return [isLoading, outputBN, output]
}
