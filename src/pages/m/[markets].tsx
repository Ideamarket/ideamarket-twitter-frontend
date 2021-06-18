import React from 'react'
import { useRouter } from 'next/router'
import { DefaultLayout, Home as HomeComponent } from 'components'
import { DropdownFilters } from 'components/tokens/OverviewFilters'

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
  if (marketsList.length === 0) {
    // Redirect to regular home page if no valid markets
    router.push('/')
  }

  return <HomeComponent urlMarkets={marketsList} />
}

MarketsHome.layoutProps = {
  Layout: DefaultLayout,
}
