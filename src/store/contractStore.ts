import create from 'zustand'
import Web3 from 'web3'

import { addresses } from '../util'
import DeployedAddressesKovan from '../assets/deployed-kovan.json'
import DeployedABIsKovan from '../assets/abis-kovan.json'
import ERC20ABI from '../assets/abi-erc20.json'
import { useWalletStore } from './walletStore'

type State = {
  daiContract: any
  factoryContract: any
  exchangeContract: any
  currencyConverterContract: any
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

  useContractStore.setState({
    daiContract: daiContract,
    factoryContract: factoryContract,
    exchangeContract: exchangeContract,
    currencyConverterContract: currencyConverterContract,
  })
}

export function getERC20Contract(address: string) {
  const web3 = useWalletStore.getState().web3
  return new web3.eth.Contract(ERC20ABI as any, address, {
    from: web3.eth.defaultAccount,
  })
}
