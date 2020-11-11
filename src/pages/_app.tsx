import '../styles/fonts/gilroy/style.css'
import '../styles/fonts/sf-compact-display/style.css'
import '../styles/globals.css'

import { createContext, useEffect, useState } from 'react'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { initWalletStore } from 'store/walletStore'
import { initIdeaMarketsStore } from 'store/ideaMarketsStore'
import { initTokenList } from 'store/tokenListStore'
import { NavBar } from 'components'

export const GlobalContext = createContext({
  isWalletModalOpen: false,
  setIsWalletModalOpen: (val: boolean) => {},
  onWalletConnectedCallback: () => {},
  setOnWalletConnectedCallback: (f: () => void) => {},
  isListTokenModalOpen: false,
  setIsListTokenModalOpen: (val: boolean) => {},
})

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    initWalletStore()
    initIdeaMarketsStore()
    initTokenList()
  }, [])

  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false)
  const [
    onWalletConnectedCallback,
    setOnWalletConnectedCallback,
  ] = useState(() => () => {})
  const [isListTokenModalOpen, setIsListTokenModalOpen] = useState(false)

  return (
    <GlobalContext.Provider
      value={{
        isWalletModalOpen,
        setIsWalletModalOpen,
        onWalletConnectedCallback,
        setOnWalletConnectedCallback,
        isListTokenModalOpen,
        setIsListTokenModalOpen,
      }}
    >
      <Head>
        <title>IdeaMarkets</title>
      </Head>
      <div className="min-h-screen bg-brand-gray">
        <NavBar />
        <div className="py-16">
          <Component {...pageProps} />
        </div>
      </div>
    </GlobalContext.Provider>
  )
}

export default MyApp
