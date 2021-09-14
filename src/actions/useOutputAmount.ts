import { useState, useEffect } from 'react'
import { TokenAmount, Trade, TradeType } from '@uniswap/sdk'
import { bigNumberTenPow18, web3BNToFloatString } from '../utils'
import { useWalletStore } from 'store/walletStore'
import { useContractStore } from 'store/contractStore'
import { ZERO_ADDRESS, getUniswapPath } from '../utils'
import { NETWORK } from 'store/networks'
import { IdeaToken, IdeaMarket } from '../store/ideaMarketsStore'

import BigNumber from 'bignumber.js'
import BN from 'bn.js'

export default function useOutputAmount(
  ideaToken: IdeaToken,
  market: IdeaMarket,
  tokenAddress: string,
  amount: string,
  decimals: number,
  tradeType: string
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
        (!ideaToken && !market)
      ) {
        return new BN('0')
      }

      const amountBN = new BN(
        new BigNumber(amount).multipliedBy(bigNumberTenPow18).toFixed()
      )

      const exchangeContract = useContractStore.getState().exchangeContract

      let requiredDaiAmount
      if (!ideaToken) {
        // No ideaToken yet because it is being listed
        const factoryContract = useContractStore.getState().factoryContract
        const marketDetails = await factoryContract.methods
          .getMarketDetailsByID(market.marketID)
          .call()
        requiredDaiAmount = new BN(
          (
            await exchangeContract.methods
              .getCostsForBuyingTokens(
                marketDetails,
                new BN('0'),
                amountBN,
                false
              )
              .call()
          ).total
        )
      } else {
        requiredDaiAmount = new BN(
          await exchangeContract.methods
            .getCostForBuyingTokens(ideaToken.address, amountBN)
            .call()
        )
      }

      if (tokenAddress === NETWORK.getExternalAddresses().dai) {
        return requiredDaiAmount
      }

      const inputTokenAddress =
        tokenAddress === ZERO_ADDRESS
          ? NETWORK.getExternalAddresses().weth
          : tokenAddress
      const outputTokenAddress = NETWORK.getExternalAddresses().dai
      const path = await getUniswapPath(inputTokenAddress, outputTokenAddress)

      if (!path) {
        throw Error('No Uniswap path exists')
      }

      try {
        const trade = new Trade(
          path.route,
          new TokenAmount(path.outToken, requiredDaiAmount.toString()),
          TradeType.EXACT_OUTPUT
        )
        const requiredInputBN = new BN(
          new BigNumber(trade.inputAmount.toExact())
            .multipliedBy(new BigNumber('10').exponentiatedBy(decimals))
            .toFixed()
        )

        return requiredInputBN
      } catch (ex) {
        return new BN('0')
      }
    }

    async function calculateSellPrice() {
      const amountBN = new BN(
        new BigNumber(amount).multipliedBy(bigNumberTenPow18).toFixed()
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
      let daiOutputAmount
      try {
        daiOutputAmount = new BN(
          await exchangeContract.methods
            .getPriceForSellingTokens(ideaToken.address, amountBN)
            .call()
        )
      } catch (ex) {
        return new BN('0')
      }

      if (tokenAddress === NETWORK.getExternalAddresses().dai) {
        return daiOutputAmount
      }

      const inputTokenAddress = NETWORK.getExternalAddresses().dai
      const outputTokenAddress =
        tokenAddress === ZERO_ADDRESS
          ? NETWORK.getExternalAddresses().weth
          : tokenAddress
      const path = await getUniswapPath(inputTokenAddress, outputTokenAddress)

      if (!path) {
        throw Error('No Uniswap path exists')
      }

      try {
        const trade = new Trade(
          path.route,
          new TokenAmount(path.inToken, daiOutputAmount.toString()),
          TradeType.EXACT_INPUT
        )
        const outputBN = new BN(
          new BigNumber(trade.outputAmount.toExact())
            .multipliedBy(new BigNumber('10').exponentiatedBy(decimals))
            .toFixed()
        )

        return outputBN
      } catch (ex) {
        return new BN('0')
      }
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
        setOutput(web3BNToFloatString(bn, pow, 8))
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
  }, [ideaToken, tokenAddress, amount, tradeType, decimals, market])

  return [isLoading, outputBN, output]
}
