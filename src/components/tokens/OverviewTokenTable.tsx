import React, { useEffect, useRef, useState } from 'react'
import { useInfiniteQuery, useQuery } from 'react-query'
import { flatten } from 'lodash'

import { useWindowSize, WEEK_SECONDS } from 'utils'
import {
  IdeaToken,
  IdeaMarket,
  queryMarket,
  queryTokens,
  queryTokensChartData,
} from 'store/ideaMarketsStore'
import { querySupplyRate, queryExchangeRate } from 'store/compoundStore'
import { useIdeaMarketsStore } from 'store/ideaMarketsStore'
import TokenRow from './OverviewTokenRow'
import TokenRowSkeleton from './OverviewTokenRowSkeleton'
import { Categories } from 'store/models/category'
import { Header } from './table/Header'

export default function Table({
  selectedMarketName,
  selectedCategoryId,
  nameSearch,
  currentPage,
  setCurrentPage,
  onOrderByChanged,
  onTradeClicked,
}: {
  selectedMarketName: string
  selectedCategoryId: number
  nameSearch: string
  currentPage: number
  setCurrentPage: (p: number) => void
  onOrderByChanged: (o: string, d: string) => void
  onTradeClicked: (token: IdeaToken, market: IdeaMarket) => void
}) {
  const windowSize = useWindowSize()
  const TOKENS_PER_PAGE = windowSize.width < 768 ? 4 : 10
  const LOADING_MARGIN = 200

  const [currentHeader, setCurrentHeader] = useState('rank')
  const [orderBy, setOrderBy] = useState('rank')
  const [orderDirection, setOrderDirection] = useState('asc')
  const infiniteDataRef = useRef<IdeaToken[][]>()

  const {
    data: compoundExchangeRate,
    isLoading: isCompoundExchangeRateLoading,
  } = useQuery(
    'compound-exchange-rate',
    queryExchangeRate,

    {
      refetchOnWindowFocus: false,
    }
  )

  const {
    data: compoundSupplyRate,
    isLoading: isCompoundSupplyRateLoading,
  } = useQuery('compound-supply-rate', querySupplyRate, {
    refetchOnWindowFocus: false,
  })

  const { data: market, isLoading: isMarketLoading } = useQuery(
    [`market-${selectedMarketName}`, selectedMarketName],
    queryMarket,
    {
      refetchOnWindowFocus: false,
    }
  )

  useEffect(() => {
    fetchMore()
  }, [selectedMarketName && !!market])

  const watchingTokens = Object.keys(
    useIdeaMarketsStore((store) => store.watching)
  )

  const filterTokens =
    selectedCategoryId === Categories.STARRED.id ? watchingTokens : undefined

  const {
    data: infiniteData,
    isFetching: isTokenDataLoading,
    fetchMore,
  } = useInfiniteQuery([`tokens-${selectedMarketName}`], queryTokens, {
    getFetchMore: (lastGroup, allGroups) => {
      const morePagesExist = allGroups.length === 1 || lastGroup?.length === 10

      if (!morePagesExist) {
        return false
      }

      return [
        market,
        (allGroups.length - 1) * TOKENS_PER_PAGE,
        TOKENS_PER_PAGE,
        WEEK_SECONDS,
        selectedCategoryId === Categories.HOT.id
          ? 'dayChange'
          : selectedCategoryId === Categories.NEW.id
          ? 'listedAt'
          : orderBy,
        selectedCategoryId === Categories.HOT.id ||
        selectedCategoryId === Categories.NEW.id
          ? 'desc'
          : orderDirection,
        nameSearch,
        filterTokens,
      ]
    },
    refetchOnWindowFocus: false,
    forceFetchOnMount: true,
    enabled: !!market,
  })

  infiniteDataRef.current = infiniteData

  const tokenData = flatten(infiniteData || [])

  const hasMore = (infiniteData: IdeaToken[][]) => {
    return infiniteData[infiniteData.length - 1].length === 10
  }

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const height = document.documentElement.scrollHeight
      const windowHeight = window.innerHeight
      const diff = height - windowHeight - currentScrollY

      if (diff < LOADING_MARGIN && hasMore(infiniteDataRef.current)) {
        fetchMore()
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const { data: chartData, isLoading: isChartDataLoading } = useQuery(
    ['chartdata', tokenData, 100],
    queryTokensChartData
  )

  const isLoading =
    isMarketLoading ||
    isTokenDataLoading ||
    isChartDataLoading ||
    isCompoundSupplyRateLoading ||
    isCompoundExchangeRateLoading

  function headerClicked(headerValue: string) {
    setCurrentPage(0)

    if (currentHeader === headerValue) {
      if (orderDirection === 'asc') {
        setOrderDirection('desc')
        onOrderByChanged(orderBy, 'desc')
      } else {
        setOrderDirection('asc')
        onOrderByChanged(orderBy, 'asc')
      }
    } else {
      setCurrentHeader(headerValue)

      if (headerValue === 'name') {
        setOrderBy('name')
        onOrderByChanged('name', 'desc')
      } else if (
        headerValue === 'price' ||
        headerValue === 'deposits' ||
        headerValue === 'income'
      ) {
        setOrderBy('supply')
        onOrderByChanged('supply', 'desc')
      } else if (headerValue === 'change') {
        setOrderBy('dayChange')
        onOrderByChanged('dayChange', 'desc')
      } else if (headerValue === 'volume') {
        setOrderBy('dayVolume')
        onOrderByChanged('dayVolume', 'desc')
      } else if (headerValue === 'locked') {
        setOrderBy('lockedPercentage')
        onOrderByChanged('lockedAmount', 'desc')
      }

      setOrderDirection('desc')
    }
  }

  return (
    <>
      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden border-b border-gray-200 sm:rounded-t-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="hidden md:table-header-group">
                  <tr>
                    <Header
                      currentHeader={currentHeader}
                      orderDirection={orderDirection}
                      headerClicked={headerClicked}
                      isLoading={isLoading}
                      market={market}
                      compoundExchangeRate={compoundExchangeRate}
                    />
                  </tr>
                </thead>
                <tbody className="bg-white w-full divide-y divide-gray-200">
                  <>
                    {(tokenData as IdeaToken[]).map((token) => (
                      <TokenRow
                        key={market.marketID + '-' + token.tokenID}
                        token={token}
                        market={market}
                        showMarketSVG={false}
                        compoundSupplyRate={compoundSupplyRate}
                        chartData={chartData ? chartData[token.address] : []}
                        chartDuration={WEEK_SECONDS}
                        onTradeClicked={onTradeClicked}
                      />
                    ))}
                  </>
                  {isLoading
                    ? Array.from(Array(TOKENS_PER_PAGE).keys()).map((token) => (
                        <TokenRowSkeleton key={token} />
                      ))
                    : null}{' '}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
