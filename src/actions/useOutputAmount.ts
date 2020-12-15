import { useState, useEffect } from 'react'
import {
  ChainId,
  Token,
  TokenAmount,
  Pair,
  Trade,
  Route,
  TradeType,
} from '@uniswap/sdk'
import { web3BNToFloatString, NETWORK } from '../utils'
import { useWalletStore } from 'store/walletStore'
import { getUniswapPairContract, useContractStore } from 'store/contractStore'
import { addresses } from '../utils'
import { IdeaToken, IdeaMarket } from '../store/ideaMarketsStore'

import BigNumber from 'bignumber.js'
import BN from 'bn.js'

const tenPow18 = new BigNumber('10').pow(new BigNumber('18'))

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
        new BigNumber(amount).multipliedBy(tenPow18).toFixed()
      )

      const exchangeContract = useContractStore.getState().exchangeContract

      let requiredDaiAmount
      if (!ideaToken) {
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

      if (tokenAddress === addresses.dai) {
        return requiredDaiAmount
      }

      const chain = NETWORK === 'mainnet' ? ChainId.MAINNET : ChainId.RINKEBY
      const DAI = new Token(chain, addresses.dai, 18, 'DAI', 'DAI')

      let IN
      if (tokenAddress === addresses.ZERO) {
        IN = new Token(chain, addresses.weth, 18, 'WETH', 'WETH')
      } else {
        IN = new Token(chain, tokenAddress, decimals, 'SOME', 'TOKEN')
      }

      const uniswapFactoryContract = useContractStore.getState()
        .uniswapFactoryContract
      const pairAddress = await uniswapFactoryContract.methods
        .getPair(DAI.address, IN.address)
        .call()

      const pairContract = getUniswapPairContract(pairAddress)

      let token0, token1, reserves
      await Promise.all([
        (async () => {
          token0 = await pairContract.methods.token0().call()
        })(),
        (async () => {
          token1 = await pairContract.methods.token1().call()
        })(),
        (async () => {
          reserves = await pairContract.methods.getReserves().call()
        })(),
      ])

      let pair
      if (token0 === DAI.address) {
        pair = new Pair(
          new TokenAmount(DAI, reserves._reserve0),
          new TokenAmount(IN, reserves._reserve1)
        )
      } else {
        pair = new Pair(
          new TokenAmount(DAI, reserves._reserve1),
          new TokenAmount(IN, reserves._reserve0)
        )
      }

      const route = new Route([pair], IN)
      const trade = new Trade(
        route,
        new TokenAmount(DAI, requiredDaiAmount.toString()),
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
      if (!useWalletStore.getState().web3 || !ideaToken || !tokenAddress) {
        return new BN('0')
      }

      const amountBN = new BN(
        new BigNumber(amount).multipliedBy(tenPow18).toFixed()
      )

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

      if (tokenAddress === addresses.dai) {
        return daiOutputAmount
      }

      const chain = NETWORK === 'mainnet' ? ChainId.MAINNET : ChainId.RINKEBY
      const DAI = new Token(chain, addresses.dai, 18, 'DAI', 'DAI')

      let OUT
      if (tokenAddress === addresses.ZERO) {
        OUT = new Token(chain, addresses.weth, 18, 'WETH', 'WETH')
      } else {
        OUT = new Token(chain, tokenAddress, decimals, 'SOME', 'TOKEN')
      }

      const uniswapFactoryContract = useContractStore.getState()
        .uniswapFactoryContract
      const pairAddress = await uniswapFactoryContract.methods
        .getPair(DAI.address, OUT.address)
        .call()

      const pairContract = getUniswapPairContract(pairAddress)

      let token0, token1, reserves
      await Promise.all([
        (async () => {
          token0 = await pairContract.methods.token0().call()
        })(),
        (async () => {
          token1 = await pairContract.methods.token1().call()
        })(),
        (async () => {
          reserves = await pairContract.methods.getReserves().call()
        })(),
      ])

      let pair
      if (token0 === DAI.address) {
        pair = new Pair(
          new TokenAmount(DAI, reserves._reserve0),
          new TokenAmount(OUT, reserves._reserve1)
        )
      } else {
        pair = new Pair(
          new TokenAmount(DAI, reserves._reserve1),
          new TokenAmount(OUT, reserves._reserve0)
        )
      }

      const route = new Route([pair], DAI)
      const trade = new Trade(
        route,
        new TokenAmount(DAI, daiOutputAmount.toString()),
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
        const pow = new BigNumber('10').pow(new BigNumber('18'))
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
  }, [ideaToken, tokenAddress, amount, tradeType])

  return [isLoading, outputBN, output]
}
