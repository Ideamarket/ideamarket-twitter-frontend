import create from 'zustand'
import Web3 from 'web3'

import DeployedAddressesKovan from '../assets/deployed-kovan.json'
import DeployedABIsKovan from '../assets/abis-kovan.json'

type State = {
  factoryContract: any
  exchangeContract: any
  currencyConverterContract: any
}

export const useContractStore = create<State>((set) => ({
  factoryContract: undefined,
  exchangeContract: undefined,
  currencyConverterContract: undefined,
}))

export async function clearContracts() {
  useContractStore.setState({
    factoryContract: undefined,
    exchangeContract: undefined,
    currencyConverterContract: undefined,
  })
}

export async function initContractsFromWeb3(web3: Web3) {
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
    factoryContract: factoryContract,
    exchangeContract: exchangeContract,
    currencyConverterContract: currencyConverterContract,
  })
}
