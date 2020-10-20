import '../styles/fonts/gilroy/style.css'
import '../styles/fonts/sf-compact-display/style.css'
import '../styles/globals.css'

import dynamic from 'next/dynamic'

import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  const NoSSRInit = dynamic(() => import('../components/Init'), {
    ssr: false,
  })

  return (
    <div>
      <NoSSRInit />
      <Component {...pageProps} />
    </div>
  )
}

export default MyApp
