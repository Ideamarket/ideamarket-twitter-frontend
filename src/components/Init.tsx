import { initWalletStore } from '../store/walletStore'
import { initIdeaMarketsStore } from '../store/ideaMarketsStore'

export default function Init() {
  initWalletStore()
  initIdeaMarketsStore()

  return <div></div>
}
