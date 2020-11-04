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
import { IdeaToken } from '../store/ideaMarketsStore'

import BigNumber from 'bignumber.js'
import BN from 'bn.js'

const tenPow18 = new BigNumber('10').pow(new BigNumber('18'))

export default function useOutputAmount(
  ideaToken: IdeaToken,
  tokenAddress: string,
  amount: string,
  decimals: number,
  tradeType: string
) {
  const [isLoading, setIsLoading] = useState(true)
  const [outputBN, setOutputBN] = useState(undefined)
  const [output, setOutput] = useState(undefined)

  useEffect(() => {
    async function calculateOutput() {
      if (useWalletStore.getState().web3 && ideaToken && tokenAddress) {
        const amountBN = new BN(
          new BigNumber(amount).multipliedBy(tenPow18).toFixed()
        )
        const exchangeContract = useContractStore.getState().exchangeContract
        const requiredDaiAmount = new BN(
          await exchangeContract.methods
            .getCostForBuyingTokens(ideaToken.address, amountBN)
            .call()
        )

        if (tokenAddress === addresses.dai) {
          setOutputBN(requiredDaiAmount)
          setOutput(web3BNToFloatString(requiredDaiAmount, tenPow18, 4))
          setIsLoading(false)
          return
        }

        const chain = NETWORK === 'kovan' ? ChainId.KOVAN : ChainId.MAINNET
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
        const requiredInput = trade.inputAmount.toFixed(4)

        setOutputBN(requiredInputBN)
        setOutput(requiredInput)
        setIsLoading(false)
      }
    }

    calculateOutput()
  }, [ideaToken, tokenAddress, amount, decimals])

  return [isLoading, outputBN, output]
}
