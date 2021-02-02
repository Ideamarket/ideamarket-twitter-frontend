import BN from 'bn.js'
import BigNumber from 'bignumber.js'
import {
  ChainId,
  Token,
  TokenAmount,
  Pair,
  Route,
  TradeType,
  Trade,
} from '@uniswap/sdk'
import {
  getERC20Contract,
  getUniswapPairContract,
  useContractStore,
} from 'store/contractStore'
import { addresses, NETWORK } from './index'

export type UniswapPairDetails = {
  exists: boolean
  route?: Route
  inToken?: Token
  outToken?: Token
}

export async function getUniswapPath(
  inputTokenAddress: string,
  outputTokenAddress: string
): Promise<UniswapPairDetails> {
  // TODO: CACHE!

  const uniswapFactoryContract = useContractStore.getState()
    .uniswapFactoryContract
  const directPairAddress = await uniswapFactoryContract.methods
    .getPair(inputTokenAddress, outputTokenAddress)
    .call()

  const chainID = NETWORK === 'mainnet' ? ChainId.MAINNET : ChainId.RINKEBY

  const inputTokenContract = getERC20Contract(inputTokenAddress)
  const outputTokenContract = getERC20Contract(outputTokenAddress)

  let inputTokenDecimals, outputTokenDecimals
  await Promise.all([
    (async () => {
      inputTokenDecimals = parseInt(
        (await inputTokenContract.methods.decimals().call()).toString()
      )
    })(),
    (async () => {
      outputTokenDecimals = parseInt(
        (await outputTokenContract.methods.decimals().call()).toString()
      )
    })(),
  ])

  const inputToken = new Token(
    chainID,
    inputTokenAddress,
    inputTokenDecimals,
    inputTokenAddress,
    inputTokenAddress
  )
  const wethToken = new Token(
    chainID,
    addresses.weth,
    18,
    addresses.weth,
    addresses.weth
  )
  const outputToken = new Token(
    chainID,
    outputTokenAddress,
    outputTokenDecimals,
    outputTokenAddress,
    outputTokenAddress
  )

  if (directPairAddress !== addresses.ZERO) {
    // The direct pair exists

    const directPairContract = getUniswapPairContract(directPairAddress)
    const directPair = await getPair(
      directPairContract,
      inputToken,
      outputToken
    )

    return {
      exists: true,
      route: new Route([directPair], inputToken, outputToken),
      inToken: inputToken,
      outToken: outputToken,
    }
  } else {
    // The direct pair does not exist, check for input -> WETH -> output

    let inputWETHPairAddress
    let outputWETHPairAddress

    await Promise.all([
      (async () => {
        inputWETHPairAddress = await uniswapFactoryContract.methods
          .getPair(inputTokenAddress, addresses.weth)
          .call()
      })(),
      (async () => {
        outputWETHPairAddress = await uniswapFactoryContract.methods
          .getPair(outputTokenAddress, addresses.weth)
          .call()
      })(),
    ])

    if (
      inputTokenAddress === addresses.ZERO ||
      outputTokenAddress === addresses.ZERO
    ) {
      // That path also does not exist
      return {
        exists: false,
      }
    }

    // The path exists, find the route
    const firstPairContract = getUniswapPairContract(inputWETHPairAddress)
    const secondPairContract = getUniswapPairContract(outputWETHPairAddress)
    let firstPair, secondPair

    await Promise.all([
      (async () => {
        firstPair = await getPair(firstPairContract, inputToken, wethToken)
      })(),
      (async () => {
        secondPair = await getPair(secondPairContract, outputToken, wethToken)
      })(),
    ])

    return {
      exists: true,
      route: new Route([firstPair, secondPair], inputToken, outputToken),
      inToken: inputToken,
      outToken: outputToken,
    }
  }
}

export async function getUniswapDaiOutputSwap(
  inputAddress: string,
  inputAmount: BN
) {
  const inputTokenAddress =
    inputAddress === addresses.ZERO ? addresses.weth : inputAddress
  const outputTokenAddress = addresses.dai
  const path = await getUniswapPath(inputTokenAddress, outputTokenAddress)

  if (!path) {
    throw 'No Uniswap path exists'
  }

  const trade = new Trade(
    path.route,
    new TokenAmount(path.inToken, inputAmount.toString()),
    TradeType.EXACT_INPUT
  )

  const outputBN = new BN(
    new BigNumber(trade.outputAmount.toExact())
      .multipliedBy(new BigNumber('10').exponentiatedBy(18))
      .toFixed()
  )

  return outputBN
}

async function getPair(
  pairContract,
  tokenA: Token,
  tokenB: Token
): Promise<Pair> {
  let token0: string
  let token1: string
  let reserves

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

  return new Pair(
    new TokenAmount(
      token0 === tokenA.address ? tokenA : tokenB,
      reserves._reserve0
    ),
    new TokenAmount(
      token1 === tokenA.address ? tokenA : tokenB,
      reserves._reserve1
    )
  )
}
