import '../styles/fonts/gilroy/style.css'
import '../styles/fonts/sf-compact-display/style.css'
import '../styles/globals.css'

import { useEffect } from 'react'
import Head from 'next/head'
import type { AppProps } from 'next/app'
import { initWalletStore } from 'store/walletStore'
import { initIdeaMarketsStore } from 'store/ideaMarketsStore'
import { initTokenList } from 'store/tokenListStore'

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    initWalletStore()
    initIdeaMarketsStore()
    initTokenList()
  }, [])

  return (
    <div>
      <Head>
        <title>IdeaMarkets</title>
      </Head>
      <Component {...pageProps} />
    </div>
  )
}

export default MyApp
