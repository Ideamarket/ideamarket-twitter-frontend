import 'tailwindcss/tailwind.css'
import '../styles/globals.css'
import '../styles/fonts/gilroy/style.css'
import '../styles/fonts/sf-compact-display/style.css'
import '../styles/fonts/inter/style.css'
import '../styles/nprogress.css'
import { ThemeProvider } from 'next-themes'

import { ReactElement, useEffect } from 'react'
import type { AppProps } from 'next/app'
import { DefaultSeo } from 'next-seo'
import {
  DEFAULT_CANONICAL,
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  DEFAULT_TITLE,
  DEFAULT_TITLE_TEMPLATE,
  FAVICON_LINK,
  SITE_NAME,
  TWITTER_HANDLE,
} from 'utils/seo-constants'
import ModalRoot from 'components/modals/ModalRoot'
import { WrongNetworkOverlay } from 'components'
import { NextPage } from 'next'

import { QueryClient, QueryClientProvider } from 'react-query'

import MixPanelProvider from 'utils/mixPanel'
import { GlobalContextComponent } from 'lib/GlobalContext'
import { ClientWrapper } from 'lib/ClientWrapper'
export { GlobalContext } from 'lib/GlobalContext'

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactElement<any, any>
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

const queryClient = new QueryClient()

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page)

  useEffect(() => {
    const initializeTwitterAPI = () => {
      // You can add this as script tag in <head>, but for some reason that way stopped working. But this works fine for now
      const s = document.createElement('script')
      s.setAttribute('src', 'https://platform.twitter.com/widgets.js')
      s.setAttribute('async', 'true')
      document.head.appendChild(s)
    }

    initializeTwitterAPI()
  }, [])

  return (
    <>
      <DefaultSeo
        titleTemplate={DEFAULT_TITLE_TEMPLATE}
        description={DEFAULT_DESCRIPTION}
        canonical={DEFAULT_CANONICAL}
        openGraph={{
          type: 'website',
          locale: 'en_US',
          url: DEFAULT_CANONICAL,
          site_name: SITE_NAME,
          title: DEFAULT_TITLE,
          description: DEFAULT_DESCRIPTION,
          images: [
            {
              url: DEFAULT_OG_IMAGE,
              alt: SITE_NAME,
            },
          ],
        }}
        twitter={{
          handle: TWITTER_HANDLE,
          site: TWITTER_HANDLE,
          cardType: 'summary_large_image',
        }}
        additionalLinkTags={[
          {
            rel: 'shortcut icon',
            href: FAVICON_LINK,
          },
        ]}
      />
      <QueryClientProvider client={queryClient}>
        <GlobalContextComponent>
          <ThemeProvider attribute="class" defaultTheme="light">
            <ClientWrapper>
              <MixPanelProvider>
                {getLayout(<Component {...pageProps} />)}
              </MixPanelProvider>
            </ClientWrapper>
            <WrongNetworkOverlay />
            <ModalRoot />
          </ThemeProvider>
        </GlobalContextComponent>
      </QueryClientProvider>
    </>
  )
}

export default MyApp
