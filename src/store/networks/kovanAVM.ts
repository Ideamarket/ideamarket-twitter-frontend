import { INetworkSpecifics, ExternalAddresses } from '.'
import DeployedAddressesKovanAVM from '../../assets/deployed-kovan-avm.json'
import DeployedABIsKovanAVM from '../../assets/abis-kovan-avm.json'
import TokenListKovanAVM from '../../assets/token-list-kovan-avm.json'

export default class KovanAVMNetworkSpecifics implements INetworkSpecifics {
  getNetworkName(): string {
    return 'kovan_avm'
  }

  getChainID(): number {
    return 212984383488152
  }

  getDeployedAddresses(): any {
    return DeployedAddressesKovanAVM
  }

  getDeployedABIs(): any {
    return DeployedABIsKovanAVM
  }

  getExternalAddresses(): ExternalAddresses {
    return {
      dai: '0x59d141841328f89bF38672419655175F53740010',
      cDai: '0x0000000000000000000000000000000000000001',
      weth: '0x0000000000000000000000000000000000000001',
    }
  }

  getTokenList(): any {
    return TokenListKovanAVM
  }

  getSubgraphURL(): string {
    return 'https://subgraph-kovan-avm.backend.ideamarket.io/subgraphs/name/Ideamarket/IdeamarketKOVANAVM'
  }

  getEtherscanTxUrl(tx: string): string {
    return `https://kovan.etherscan.io/tx/${tx}`
  }
}
