import '../styles/fonts/gilroy/style.css'
import '../styles/fonts/sf-compact-display/style.css'
import '../styles/globals.css'

import { initWalletStore } from '../store/walletStore'

import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  initWalletStore()

  return <Component {...pageProps} />
}

export default MyApp
