import '../styles/fonts/gilroy/style.css'
import '../styles/fonts/sf-compact-display/style.css'
import '../styles/globals.css'

import { useEffect } from 'react'
import type { AppProps } from 'next/app'
import { initWalletStore } from '../store/walletStore'
import { initCompoundStore } from '../store/compoundStore'
import { initIdeaMarketsStore } from '../store/ideaMarketsStore'

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    initWalletStore()
    initCompoundStore()
    initIdeaMarketsStore()
  }, [])

  return (
    <div>
      <Component {...pageProps} />
    </div>
  )
}

export default MyApp
