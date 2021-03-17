import classNames from 'classnames'
import {
  useWindowSize,
  formatNumber,
  bigNumberTenPow18,
  web3BNToFloatString,
  WEEK_SECONDS,
} from 'utils'
import {
  IdeaToken,
  IdeaMarket,
  queryMarket,
  queryTokens,
  queryTokensChartData,
} from 'store/ideaMarketsStore'
import { ReactNode, useCallback, useEffect, useState } from 'react'
import { useInfiniteQuery, useQuery } from 'react-query'
import {
  querySupplyRate,
  queryExchangeRate,
  investmentTokenToUnderlying,
} from 'store/compoundStore'
import { useIdeaMarketsStore } from 'store/ideaMarketsStore'
import TokenRow from './OverviewTokenRow'
import TokenRowSkeleton from './OverviewTokenRowSkeleton'
import Tooltip from '../tooltip/Tooltip'
import { Categories } from 'store/models/category'
import { debounce, throttle } from 'lodash'

const page = 0

type Header = {
  content: ReactNode | string
  value: string
  sortable: boolean
}
const headers: Header[] = [
  {
    content: '#',
    value: 'rank',
    sortable: true,
  },
  {
    content: 'Name',
    value: 'name',
    sortable: true,
  },
  {
    content: 'Price',
    value: 'price',
    sortable: true,
  },
  {
    content: 'Deposits',
    value: 'deposits',
    sortable: true,
  },
  {
    content: '% Locked',
    value: 'locked',
    sortable: true,
  },
  {
    content: '24H Change',
    value: 'change',
    sortable: true,
  },
  {
    content: '24H Volume',
    value: 'volume',
    sortable: true,
  },
  {
    content: (
      <>
        1YR
        <br />
        <div className="flex items-center">
          Income
          <Tooltip className="ml-1">
            <div className="w-32 md:w-64">
              Estimated annual passive income paid to the listing owner.
              Calculated by Deposits * Lending APY at{' '}
              <a
                href="https://compound.finance"
                target="_blank"
                className="underline"
              >
                compound.finance
              </a>
            </div>
          </Tooltip>
        </div>
      </>
    ),
    value: 'income',
    sortable: true,
  },
  {
    content: '7D Chart',
    value: 'chart',
    sortable: false,
  },
]

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

  const [currentHeader, setCurrentHeader] = useState('rank')
  const [orderBy, setOrderBy] = useState('rank')
  const [orderDirection, setOrderDirection] = useState('asc')

  const {
    data: compoundExchangeRate,
    isLoading: isCompoundExchangeRateLoading,
  } = useQuery('compound-exchange-rate', queryExchangeRate)

  const {
    data: compoundSupplyRate,
    isLoading: isCompoundSupplyRateLoading,
  } = useQuery('compound-supply-rate', querySupplyRate)

  const {
    data: market,
    isLoading: isMarketLoading,
    refetch: refetchMarket,
  } = useQuery(
    [`market-${selectedMarketName}`, selectedMarketName],
    queryMarket,
    {
      enabled: false,
    }
  )

  useEffect(() => {
    refetchMarket()
  }, [selectedMarketName])

  // useEffect(() => {
  //   fetchMore()
  // }, [market])

  const watchingTokens = Object.keys(
    useIdeaMarketsStore((store) => store.watching)
  )

  const filterTokens =
    selectedCategoryId === Categories.STARRED.id ? watchingTokens : undefined

  // const {
  //   data: tokenData = [],
  //   isLoading: isTokenDataLoading,
  // }: {
  //   data: IdeaToken[]
  //   isLoading: boolean
  // } = useQuery(
  //   [
  //     `tokens-${selectedMarketName}`,
  //     [
  //       market,
  //       currentPage * TOKENS_PER_PAGE,
  //       TOKENS_PER_PAGE,
  //       WEEK_SECONDS,
  //       selectedCategoryId === Categories.HOT.id
  //         ? 'dayChange'
  //         : selectedCategoryId === Categories.NEW.id
  //         ? 'listedAt'
  //         : orderBy,
  //       selectedCategoryId === Categories.HOT.id ||
  //       selectedCategoryId === Categories.NEW.id
  //         ? 'desc'
  //         : orderDirection,
  //       nameSearch,
  //       filterTokens,
  //     ],
  //   ],
  //   queryTokens
  // )

  const {
    status,
    data: infiniteData,
    error,
    isFetching: isTokenDataLoading,
    isLoading: asd,
    fetchMore,
  } = useInfiniteQuery(
    [
      `tokens-${selectedMarketName}`,
      // [
      //   market,
      //   currentPage * TOKENS_PER_PAGE,
      //   TOKENS_PER_PAGE,
      //   WEEK_SECONDS,
      //   selectedCategoryId === Categories.HOT.id
      //     ? 'dayChange'
      //     : selectedCategoryId === Categories.NEW.id
      //     ? 'listedAt'
      //     : orderBy,
      //   selectedCategoryId === Categories.HOT.id ||
      //   selectedCategoryId === Categories.NEW.id
      //     ? 'desc'
      //     : orderDirection,
      //   nameSearch,
      //   filterTokens,
      // ],
    ],
    queryTokens,
    {
      getFetchMore: (lastGroup, allGroups) => {
        const morePagesExist =
          lastGroup?.length === 10 || lastGroup?.length === 0

        if (!morePagesExist) return false

        console.log(morePagesExist, lastGroup, allGroups)

        return [
          market,
          (allGroups.length - 1) * 10,
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
      // refetchOnWindowFocus: false,
      // refetchOnMount: false,
      forceFetchOnMount: true,
      enabled: !!market,
    }
  )

  const tokenData = []

  ;(infiniteData || []).forEach((page) => {
    page.forEach((char) => {
      tokenData.push(char)
    })
  })

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const height = document.documentElement.scrollHeight
      const windowHeight = window.innerHeight
      const diff = height - windowHeight - currentScrollY
      if (diff < 100 && (!isChartDataLoading || !isTokenDataLoading)) {
        loadMore()
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const loadMore = throttle(() => {
    fetchMore()
  }, 1000)

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
                    {headers.map((header) => (
                      <th
                        className={classNames(
                          'pl-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase bg-gray-50',
                          header.sortable && 'cursor-pointer',
                          header.value !== 'rank' && 'pr-6'
                        )}
                        key={header.value}
                        onClick={() => {
                          if (header.sortable) {
                            headerClicked(header.value)
                          }
                        }}
                      >
                        {header.sortable && (
                          <>
                            {currentHeader === header.value &&
                              orderDirection === 'asc' && <span>&#x25B2;</span>}
                            {currentHeader === header.value &&
                              orderDirection === 'desc' && (
                                <span>&#x25bc;</span>
                              )}
                            &nbsp;
                          </>
                        )}
                        {header.content}
                      </th>
                    ))}
                    <th
                      colSpan={2}
                      className="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase bg-gray-50"
                    >
                      {!isLoading && (
                        <div className="text-right">
                          {'$' +
                            formatNumber(
                              parseFloat(
                                web3BNToFloatString(
                                  investmentTokenToUnderlying(
                                    market.rawPlatformFeeInvested,
                                    compoundExchangeRate
                                  ).add(market.rawPlatformFeeRedeemed),
                                  bigNumberTenPow18,
                                  4
                                )
                              )
                            )}
                          <br />
                          <div className="flex flex-row items-center justify-end">
                            earned for {market.name}
                            <Tooltip className="ml-1">
                              <div className="w-32 md:w-64">
                                Platforms get a new income stream too. Half of
                                the trading fees for each market are paid to the
                                platform it curates. To claim funds on behalf of
                                Twitter, email{' '}
                                <a
                                  className="underline"
                                  href="mailto:team@ideamarkets.org"
                                >
                                  team@ideamarkets.org
                                </a>
                              </div>
                            </Tooltip>
                          </div>
                        </div>
                      )}
                    </th>
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

                    {/* {Array.from(
                      Array(TOKENS_PER_PAGE - (tokenData?.length ?? 0))
                      ).map((a, b) => (
                      <tr
                      key={`${'filler-' + b.toString()}`}
                      className="hidden h-18 md:table-row"
                      ></tr>
                      ))} */}
                  </>
                  {/* ) : null} */}
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
      <div className="flex flex-row items-stretch justify-between px-10 py-5 md:justify-center md:flex md:border-b md:space-x-10">
        <button
          onClick={() => {
            if (currentPage > 0) setCurrentPage(currentPage - 1)
          }}
          className={classNames(
            'px-4 py-2 text-sm font-medium leading-none cursor-pointer focus:outline-none font-sf-pro-text text-brand-gray-4 tracking-tightest',
            currentPage <= 0
              ? 'cursor-not-allowed opacity-50'
              : 'hover:bg-brand-gray'
          )}
          disabled={currentPage <= 0}
        >
          &larr; Previous
        </button>
        <button
          onClick={() => {
            fetchMore()
            // if (tokenData && tokenData.length === TOKENS_PER_PAGE)
            // setCurrentPage(currentPage + 1)
          }}
          className={classNames(
            'px-4 py-2 text-sm font-medium leading-none cursor-pointer focus:outline-none font-sf-pro-text text-brand-gray-4 tracking-tightest',
            tokenData?.length !== TOKENS_PER_PAGE
              ? 'cursor-not-allowed opacity-50'
              : 'hover:bg-brand-gray'
          )}
          // disabled={tokenData?.length !== TOKENS_PER_PAGE}
        >
          Next &rarr;
        </button>
      </div>
    </>
  )
}
