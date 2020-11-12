import create from 'zustand'
import Web3 from 'web3'

import { addresses } from 'utils'
import DeployedAddressesKovan from '../assets/deployed-kovan.json'
import DeployedABIsKovan from '../assets/abis-kovan.json'
import UniswapFactoryABI from '../assets/abi-uniswap-factory.json'
import UniswapPairABI from '../assets/abi-uniswap-pair.json'
import ERC20ABI from '../assets/abi-erc20.json'
import { useWalletStore } from './walletStore'

type State = {
  daiContract: any
  factoryContract: any
  exchangeContract: any
  currencyConverterContract: any
  uniswapFactoryContract: any
}

export const useContractStore = create<State>((set) => ({
  daiContract: undefined,
  factoryContract: undefined,
  exchangeContract: undefined,
  currencyConverterContract: undefined,
  uniswapFactoryContract: undefined,
}))

export async function clearContracts() {
  useContractStore.setState({
    daiContract: undefined,
    factoryContract: undefined,
    exchangeContract: undefined,
    currencyConverterContract: undefined,
  })
}

export async function initContractsFromWeb3(web3: Web3) {
  const daiContract = new web3.eth.Contract(ERC20ABI as any, addresses.dai, {
    from: web3.eth.defaultAccount,
  })

  const factoryContract = new web3.eth.Contract(
    DeployedABIsKovan.ideaTokenFactory as any,
    DeployedAddressesKovan.ideaTokenFactory,
    { from: web3.eth.defaultAccount }
  )

  const exchangeContract = new web3.eth.Contract(
    DeployedABIsKovan.ideaTokenExchange as any,
    DeployedAddressesKovan.ideaTokenExchange,
    { from: web3.eth.defaultAccount }
  )

  const currencyConverterContract = new web3.eth.Contract(
    DeployedABIsKovan.currencyConverter as any,
    DeployedAddressesKovan.currencyConverter,
    { from: web3.eth.defaultAccount }
  )

  const uniswapFactoryContract = new web3.eth.Contract(
    UniswapFactoryABI as any,
    '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f', // same on all networks
    { from: web3.eth.defaultAccount }
  )

  useContractStore.setState({
    daiContract: daiContract,
    factoryContract: factoryContract,
    exchangeContract: exchangeContract,
    currencyConverterContract: currencyConverterContract,
    uniswapFactoryContract: uniswapFactoryContract,
  })
}

export function getERC20Contract(address: string) {
  const web3 = useWalletStore.getState().web3
  return new web3.eth.Contract(ERC20ABI as any, address, {
    from: web3.eth.defaultAccount,
  })
}

export function getUniswapPairContract(pairAddress: string) {
  const web3 = useWalletStore.getState().web3
  return new web3.eth.Contract(UniswapPairABI as any, pairAddress, {
    from: web3.eth.defaultAccount,
  })
}

export function getNameVerifierContract(address: string) {
  const web3 = useWalletStore.getState().web3
  return new web3.eth.Contract(
    DeployedABIsKovan.twitterHandleNameVerifier as any,
    address,
    {
      from: web3.eth.defaultAccount,
    }
  )
}
