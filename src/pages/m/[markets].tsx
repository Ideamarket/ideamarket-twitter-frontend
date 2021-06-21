import React from 'react'
import { DefaultLayout, Home as HomeComponent } from 'components'
import { getMarketSpecificsByMarketNameInURLRepresentation } from 'store/markets'
import { GetServerSideProps } from 'next'

export default function MarketsHome({
  marketsList,
}: {
  marketsList: string[]
}) {
  return <HomeComponent urlMarkets={marketsList} />
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { markets } = context.params

  console.log('context', context)
  console.log('params', context.params)
  const marketsList = (markets as string)
    .split('+')
    .map((m) => getMarketSpecificsByMarketNameInURLRepresentation(m))
    .filter((m) => m !== undefined)
    .map((m) => m.getMarketName())

  console.log('marketsList', marketsList)

  if (marketsList.length === 0) {
    // Redirect to regular home page if no valid markets
    return {
      redirect: {
        destination: `/`,
        permanent: true,
      },
    }
  }

  return { props: { marketsList } }
}

MarketsHome.layoutProps = {
  Layout: DefaultLayout,
}
