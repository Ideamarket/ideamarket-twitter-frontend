import { INetworkSpecifics, ExternalAddresses } from '.'
import DeployedAddressesTestAVML2 from '../../assets/deployed-test-avm-l2.json'
import DeployedABIsTestAVML2 from '../../assets/abis-test-avm-l2.json'
import TokenListTestAVML2 from '../../assets/token-list-test-avm-l2.json'

export default class KovanAVMNetworkSpecifics implements INetworkSpecifics {
  getNetworkName(): string {
    return 'test-avm-l2'
  }

  getHumanReadableNetworkName(): string {
    return 'Arbitrum Rinkeby'
  }

  getChainID(): number {
    return 421611
  }

  getDeployedAddresses(): any {
    return DeployedAddressesTestAVML2
  }

  getDeployedABIs(): any {
    return DeployedABIsTestAVML2
  }

  getExternalAddresses(): ExternalAddresses {
    return {
      dai: '0x5364Dc963c402aAF150700f38a8ef52C1D7D7F14',
      cDai: '0x0000000000000000000000000000000000000001',
      weth: '0x0000000000000000000000000000000000000001',
    }
  }

  getTokenList(): any {
    return TokenListTestAVML2
  }

  getSubgraphURL(): string {
    return 'https://subgraph-test-avm-l2.backend.ideamarket.io/subgraphs/name/Ideamarket/IdeamarketTESTAVML2'
  }

  getEtherscanTxUrl(tx: string): string {
    return `https://rinkeby-explorer.arbitrum.io/tx/${tx}`
  }
}
