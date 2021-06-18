import React from 'react'
import { useRouter } from 'next/router'
import { DefaultLayout, Home as HomeComponent } from 'components'
import { DropdownFilters } from 'components/tokens/OverviewFilters'
import { GetServerSideProps } from 'next'

export default function MarketsHome() {
  const router = useRouter()
  const { markets } = router.query

  if (!router.isReady) {
    return null
  }

  const marketsList = (markets as string)
    .split('+')
    .map((m) => m.charAt(0).toUpperCase() + m.slice(1))
    .filter((m) => DropdownFilters.PLATFORMS.values.includes(m))

  if (marketsList.length === DropdownFilters.PLATFORMS.values.length - 1) {
    marketsList.push('All')
  }

  return <HomeComponent urlMarkets={marketsList} />
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { markets } = context.params

  const marketsList = (markets as string)
    .split('+')
    .map((m) => m.charAt(0).toUpperCase() + m.slice(1))
    .filter((m) => DropdownFilters.PLATFORMS.values.includes(m))

  if (markets.length > 0 && marketsList.length === 0) {
    // Redirect to regular home page if no valid markets
    return {
      redirect: {
        destination: `/`,
        permanent: true,
      },
    }
  }

  return { props: {} }
}

MarketsHome.layoutProps = {
  Layout: DefaultLayout,
}
