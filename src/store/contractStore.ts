import create from 'zustand'
import ethers from 'ethers'

import { addresses } from '../util'
import DeployedAddressesKovan from '../assets/deployed-kovan.json'
import DeployedABIsKovan from '../assets/abis-kovan.json'
import ERC20ABI from '../assets/abi-erc20.json'
import { useWalletStore } from './walletStore'

type State = {
  daiContract: ethers.Contract
  factoryContract: ethers.Contract
  exchangeContract: ethers.Contract
  currencyConverterContract: ethers.Contract
}

export const useContractStore = create<State>((set) => ({
  daiContract: undefined,
  factoryContract: undefined,
  exchangeContract: undefined,
  currencyConverterContract: undefined,
}))

export async function clearContracts() {
  useContractStore.setState({
    daiContract: undefined,
    factoryContract: undefined,
    exchangeContract: undefined,
    currencyConverterContract: undefined,
  })
}

export async function initContractsFromProvider(provider) {
  const daiContract = new ethers.Contract(
    addresses.dai,
    ERC20ABI as any,
    provider.HttpProvider
  )

  const factoryContract = new ethers.Contract(
    DeployedAddressesKovan.ideaTokenFactory,
    DeployedABIsKovan.ideaTokenFactory as any,
    provider.HttpProvider
  )

  const exchangeContract = new ethers.Contract(
    DeployedAddressesKovan.ideaTokenExchange,
    DeployedABIsKovan.ideaTokenExchange as any,
    provider.HttpProvider
  )

  const currencyConverterContract = new ethers.Contract(
    DeployedAddressesKovan.currencyConverter,
    DeployedABIsKovan.currencyConverter as any,
    provider.HttpProvider
  )

  useContractStore.setState({
    daiContract: daiContract,
    factoryContract: factoryContract,
    exchangeContract: exchangeContract,
    currencyConverterContract: currencyConverterContract,
  })
}

export function getERC20Contract(address: string, provider) {
  const web3 = useWalletStore.getState().provider
  return new ethers.Contract(address, ERC20ABI as any, provider.HttpProvider)
}
