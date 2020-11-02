import classNames from 'classnames'
import { queryMarket, queryTokens } from 'store/ideaMarketsStore'
import { useState } from 'react'
import { useQuery } from 'react-query'
import { querySupplyRate } from 'store/compoundStore'
import { useIdeaMarketsStore } from 'store/ideaMarketsStore'
import TokenRow from './TokenRow'
import TokenRowSkeleton from './TokenRowSkeleton'

type Header = {
  title: string
  value: string
  sortable: boolean
}
const headers: Header[] = [
  {
    title: 'Name',
    value: 'name',
    sortable: true,
  },
  {
    title: 'Price',
    value: 'price',
    sortable: true,
  },
  {
    title: 'Deposits',
    value: 'deposits',
    sortable: true,
  },
  {
    title: '24H Change',
    value: 'change',
    sortable: true,
  },
  {
    title: '24H Volume',
    value: 'volume',
    sortable: true,
  },
  {
    title: '1YR Income',
    value: 'income',
    sortable: true,
  },
  {
    title: '24H Chart',
    value: 'chart',
    sortable: false,
  },
  {
    title: 'Trade',
    value: 'trade',
    sortable: false,
  },
  {
    title: 'Watch',
    value: 'watch',
    sortable: false,
  },
]

export default function Table({
  selectedMarketName,
  selectedCategoryId,
  nameSearch,
  onOrderByChanged,
}: {
  selectedMarketName: string
  selectedCategoryId: number
  nameSearch: string
  onOrderByChanged: (o: string, d: string) => void
}) {
  const TOKENS_PER_PAGE = 10
  const [currentPage, setCurrentPage] = useState(0)
  const [currentHeader, setCurrentHeader] = useState('price')
  const [orderBy, setOrderBy] = useState('supply')
  const [orderDirection, setOrderDirection] = useState('desc')

  const {
    data: compoundSupplyRate,
    isLoading: isCompoundSupplyRateLoading,
  } = useQuery('compound-supply-rate', querySupplyRate)
  const { data: market, isLoading: isMarketLoading } = useQuery(
    ['market', selectedMarketName],
    queryMarket
  )

  const watchingTokens = Object.keys(
    useIdeaMarketsStore((store) => store.watching)
  )
  const filterTokens = selectedCategoryId === 4 ? watchingTokens : undefined
  const { data: tokens, isLoading: isTokensDataLoading } = useQuery(
    [
      'tokens',
      market,
      currentPage * TOKENS_PER_PAGE,
      TOKENS_PER_PAGE,
      selectedCategoryId === 2
        ? 'dayChange'
        : selectedCategoryId === 3
        ? 'listedAt'
        : orderBy,
      selectedCategoryId === 2 || selectedCategoryId === 3
        ? 'desc'
        : orderDirection,
      nameSearch,
      filterTokens,
    ],
    queryTokens
  )

  const isLoading =
    isMarketLoading || isTokensDataLoading || isCompoundSupplyRateLoading

  function headerClicked(headerValue: string) {
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
      }

      setOrderDirection('desc')
    }
  }

  return (
    <>
      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden border-b border-gray-200 sm:rounded-t-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="hidden md:table-header-group">
                  <tr>
                    {headers.map((header) => (
                      <th
                        className={classNames(
                          'px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase bg-gray-50',
                          header.sortable && 'cursor-pointer'
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
                        {header.title}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {isLoading ? (
                    Array.from(Array(TOKENS_PER_PAGE).keys()).map((token) => (
                      <TokenRowSkeleton key={token} />
                    ))
                  ) : (
                    <>
                      {tokens.map((token) => (
                        <TokenRow
                          key={token.tokenID}
                          token={token}
                          market={market}
                          compoundSupplyRate={compoundSupplyRate}
                        />
                      ))}

                      {Array.from(
                        Array(TOKENS_PER_PAGE - (tokens?.length ?? 0))
                      ).map((a, b) => (
                        <tr
                          key={`${'filler-' + b.toString()}`}
                          className="hidden h-18 md:table-row"
                        ></tr>
                      ))}
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-row items-stretch justify-between px-10 py-5 md:justify-center md:flex md:border-b md:space-x-10">
        <div
          onClick={() => {
            if (currentPage > 0) setCurrentPage(currentPage - 1)
          }}
          className="text-sm font-medium leading-none cursor-pointer font-sf-pro-text text-brand-gray-4 tracking-tightest md:w-30"
        >
          &larr; Previous
        </div>
        <div
          onClick={() => {
            if (tokens && tokens.length === TOKENS_PER_PAGE)
              setCurrentPage(currentPage + 1)
          }}
          className="text-sm font-medium leading-none cursor-pointer font-sf-pro-text text-brand-gray-4 tracking-tightest md:w-30"
        >
          Next &rarr;
        </div>
      </div>
    </>
  )
}
