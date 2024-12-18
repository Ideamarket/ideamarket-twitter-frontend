import create from 'zustand'
import Web3 from 'web3'
import IUniswapV3Pool from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json'
import IUniswapV3Factory from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Factory.sol/IUniswapV3Factory.json'
import UniswapFactoryABI from '../assets/abi-uniswap-factory.json'
import UniswapPairABI from '../assets/abi-uniswap-pair.json'
import Quoter from '@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json'
import ERC20ABI from '../assets/abi-erc20.json'
import { useWalletStore } from './walletStore'
import { getL1Network, NETWORK } from 'store/networks'

type State = {
  factoryContract: any
  quoterContract: any
  exchangeContract: any
  exchangeContractUserMarket: any
  exchangeContractL1: any
  multiActionContract: any
  multiActionContractUserMarket: any
  uniswapFactoryContract: any
  uniswapFactoryContractV2: any
  ideaTokenVaultContract: any
  merkleDistributorContract: any
  communityMerkleDistributorContract: any
  lockingMerkleDistributorContract: any
  locking2MerkleDistributorContract: any
  locking3MerkleDistributorContract: any
  imoContract: any
  imoStakingContract: any
  sushiStakingContract: any
  lptoken: any
  drippingIMOSourceContract: any
  twitterVerifyMerkleDistributor: any
  addressOpinionBase: any
  nftOpinionBase: any
  ideamarketPosts: any
  citationMultiAction: any
}

export const useContractStore = create<State>((set) => ({
  factoryContract: undefined,
  quoterContract: undefined,
  exchangeContract: undefined,
  exchangeContractUserMarket: undefined,
  exchangeContractL1: undefined,
  multiActionContract: undefined,
  multiActionContractUserMarket: undefined,
  uniswapFactoryContract: undefined,
  uniswapFactoryContractV2: undefined,
  ideaTokenVaultContract: undefined,
  merkleDistributorContract: undefined,
  communityMerkleDistributorContract: undefined,
  lockingMerkleDistributorContract: undefined,
  locking2MerkleDistributorContract: undefined,
  locking3MerkleDistributorContract: undefined,
  imoContract: undefined,
  imoStakingContract: undefined,
  sushiStakingContract: undefined,
  lptoken: undefined,
  drippingIMOSourceContract: undefined,
  twitterVerifyMerkleDistributor: undefined,
  addressOpinionBase: undefined,
  nftOpinionBase: undefined,
  ideamarketPosts: undefined,
  citationMultiAction: undefined,
}))

export function clearContracts() {
  useContractStore.setState({
    factoryContract: undefined,
    quoterContract: undefined,
    exchangeContract: undefined,
    exchangeContractUserMarket: undefined,
    exchangeContractL1: undefined,
    multiActionContract: undefined,
    multiActionContractUserMarket: undefined,
    uniswapFactoryContract: undefined,
    uniswapFactoryContractV2: undefined,
    ideaTokenVaultContract: undefined,
    merkleDistributorContract: undefined,
    communityMerkleDistributorContract: undefined,
    lockingMerkleDistributorContract: undefined,
    locking2MerkleDistributorContract: undefined,
    locking3MerkleDistributorContract: undefined,
    imoContract: undefined,
    imoStakingContract: undefined,
    sushiStakingContract: undefined,
    lptoken: undefined,
    drippingIMOSourceContract: undefined,
    twitterVerifyMerkleDistributor: undefined,
    addressOpinionBase: undefined,
    nftOpinionBase: undefined,
    ideamarketPosts: undefined,
    citationMultiAction: undefined,
  })
}

export function initContractsFromWeb3(web3: Web3) {
  const l1Network = getL1Network(NETWORK)
  const deployedAddressesL1 = l1Network.getDeployedAddresses()
  const abisL1 = l1Network.getDeployedABIs()

  const deployedAddresses = NETWORK.getDeployedAddresses()
  const abis = NETWORK.getDeployedABIs()

  const factoryContract = new web3.eth.Contract(
    abis.ideaTokenFactoryAVM as any,
    deployedAddresses.ideaTokenFactoryAVM,
    { from: web3.eth.defaultAccount }
  )

  const exchangeContract = new web3.eth.Contract(
    abis.ideaTokenExchangeAVM as any,
    deployedAddresses.ideaTokenExchangeAVM,
    { from: web3.eth.defaultAccount }
  )

  const exchangeContractUserMarket = new web3.eth.Contract(
    abis.ideaTokenExchangeUserMarket as any,
    deployedAddresses.ideaTokenExchangeUserMarket,
    { from: web3.eth.defaultAccount }
  )

  const exchangeContractL1 = new web3.eth.Contract(
    abisL1.ideaTokenExchange as any,
    deployedAddressesL1.ideaTokenExchange,
    { from: web3.eth.defaultAccount }
  )

  const multiActionContract = new web3.eth.Contract(
    abis.multiAction as any,
    deployedAddresses.multiAction,
    { from: web3.eth.defaultAccount }
  )

  const multiActionContractUserMarket = new web3.eth.Contract(
    abis.multiActionUserMarket as any,
    deployedAddresses.multiActionUserMarket,
    { from: web3.eth.defaultAccount }
  )

  const uniswapFactoryContract = new web3.eth.Contract(
    IUniswapV3Factory.abi as any,
    '0x1F98431c8aD98523631AE4a59f267346ea31F984', // same on all networks
    { from: web3.eth.defaultAccount }
  )

  const uniswapFactoryContractV2 = new web3.eth.Contract(
    UniswapFactoryABI as any,
    '0xc35DADB65012eC5796536bD9864eD8773aBc74C4',
    { from: web3.eth.defaultAccount }
  )

  const quoterContract = new web3.eth.Contract(
    Quoter.abi as any,
    '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6', // same on all networks
    { from: web3.eth.defaultAccount }
  )

  const ideaTokenVaultContract = new web3.eth.Contract(
    abis.ideaTokenVault as any,
    deployedAddresses.ideaTokenVault,
    { from: web3.eth.defaultAccount }
  )

  const merkleDistributorContract = new web3.eth.Contract(
    abis.merkleDistributor as any,
    deployedAddresses.merkleDistributor,
    { from: web3.eth.defaultAccount }
  )

  const communityMerkleDistributorContract = new web3.eth.Contract(
    abis.communityMerkleDistributor as any,
    deployedAddresses.communityMerkleDistributor,
    { from: web3.eth.defaultAccount }
  )

  const lockingMerkleDistributorContract = new web3.eth.Contract(
    abis.lockingMerkleDistributorContract as any,
    deployedAddresses.lockingMerkleDistributor,
    { from: web3.eth.defaultAccount }
  )

  const locking2MerkleDistributorContract = new web3.eth.Contract(
    abis.locking2MerkleDistributorContract as any,
    deployedAddresses.locking2MerkleDistributor,
    { from: web3.eth.defaultAccount }
  )

  const locking3MerkleDistributorContract = new web3.eth.Contract(
    abis.locking3MerkleDistributorContract as any,
    deployedAddresses.locking3MerkleDistributor,
    { from: web3.eth.defaultAccount }
  )

  const imoContract = new web3.eth.Contract(
    abis.imo as any,
    deployedAddresses.imo,
    { from: web3.eth.defaultAccount }
  )

  const imoStakingContract = new web3.eth.Contract(
    abis.imoStaking as any,
    deployedAddresses.imoStaking,
    { from: web3.eth.defaultAccount }
  )

  const sushiStakingContract = new web3.eth.Contract(
    abis.sushiStaking as any,
    deployedAddresses.sushiStaking,
    { from: web3.eth.defaultAccount }
  )

  const lptoken = new web3.eth.Contract(
    abis.lptoken as any,
    deployedAddresses.lptoken,
    { from: web3.eth.defaultAccount }
  )

  const drippingIMOSourceContract = new web3.eth.Contract(
    abis.drippingIMOSource as any,
    deployedAddresses.drippingIMOSource,
    { from: web3.eth.defaultAccount }
  )

  const twitterVerifyMerkleDistributor = new web3.eth.Contract(
    abis.twitterVerifyMerkleDistributor as any,
    deployedAddresses.twitterVerifyMerkleDistributor,
    { from: web3.eth.defaultAccount }
  )

  const addressOpinionBase = deployedAddresses.addressOpinionBase
    ? new web3.eth.Contract(
        abis.addressOpinionBase as any,
        deployedAddresses.addressOpinionBase,
        { from: web3.eth.defaultAccount }
      )
    : null

  const nftOpinionBase = deployedAddresses.nftOpinionBase
    ? new web3.eth.Contract(
        abis.nftOpinionBase as any,
        deployedAddresses.nftOpinionBase,
        { from: web3.eth.defaultAccount }
      )
    : null

  const ideamarketPosts = deployedAddresses.ideamarketPosts
    ? new web3.eth.Contract(
        abis.ideamarketPosts as any,
        deployedAddresses.ideamarketPosts,
        { from: web3.eth.defaultAccount }
      )
    : null

  const citationMultiAction = deployedAddresses.citationMultiAction
    ? new web3.eth.Contract(
        abis.citationMultiAction as any,
        deployedAddresses.citationMultiAction,
        { from: web3.eth.defaultAccount }
      )
    : null

  useContractStore.setState({
    factoryContract: factoryContract,
    quoterContract: quoterContract,
    exchangeContract: exchangeContract,
    exchangeContractUserMarket: exchangeContractUserMarket,
    exchangeContractL1: exchangeContractL1,
    multiActionContract: multiActionContract,
    multiActionContractUserMarket: multiActionContractUserMarket,
    uniswapFactoryContract: uniswapFactoryContract,
    uniswapFactoryContractV2: uniswapFactoryContractV2,
    ideaTokenVaultContract: ideaTokenVaultContract,
    merkleDistributorContract: merkleDistributorContract,
    communityMerkleDistributorContract: communityMerkleDistributorContract,
    lockingMerkleDistributorContract: lockingMerkleDistributorContract,
    locking2MerkleDistributorContract: locking2MerkleDistributorContract,
    locking3MerkleDistributorContract: locking3MerkleDistributorContract,
    imoContract: imoContract,
    imoStakingContract: imoStakingContract,
    sushiStakingContract: sushiStakingContract,
    lptoken: lptoken,
    drippingIMOSourceContract: drippingIMOSourceContract,
    twitterVerifyMerkleDistributor: twitterVerifyMerkleDistributor,
    addressOpinionBase: addressOpinionBase,
    nftOpinionBase: nftOpinionBase,
    ideamarketPosts: ideamarketPosts,
    citationMultiAction: citationMultiAction,
  })
}

export function getERC20Contract(address: string) {
  const web3 = useWalletStore.getState().web3
  return web3
    ? new web3.eth.Contract(ERC20ABI as any, address, {
        from: web3.eth.defaultAccount,
      })
    : null
}

export function getUniswapPoolContract(poolAddress: string) {
  const web3 = useWalletStore.getState().web3
  return web3
    ? new web3.eth.Contract(IUniswapV3Pool.abi as any, poolAddress, {
        from: web3.eth.defaultAccount,
      })
    : null
}

// Used for Uniswap V2
export function getUniswapPairContract(pairAddress: string) {
  const web3 = useWalletStore.getState().web3
  return web3
    ? new web3.eth.Contract(UniswapPairABI as any, pairAddress, {
        from: web3.eth.defaultAccount,
      })
    : null
}
