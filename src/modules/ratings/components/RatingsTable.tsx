import classNames from 'classnames'
import { useCallback, useRef, MutableRefObject } from 'react'
import { IdeaTokenMarketPair } from 'store/ideaMarketsStore'
import { SortAscendingIcon, SortDescendingIcon } from '@heroicons/react/solid'
import RatingsRow from './RatingsRow'
import RatingsRowSkeleton from './RatingsRowSkeleton'
import { SortOptionsAccountOpinions } from 'utils/tables'
import EmptyTableBody from 'modules/tables/components/EmptyTableBody'
import { IdeamarketTwitterPost } from 'modules/posts/services/TwitterPostService'

type Header = {
  title: string
  value: string
  sortable: boolean
}

const headers: Header[] = [
  {
    title: '',
    value: 'name',
    sortable: true,
  },
  {
    title: 'Rating By User',
    value: SortOptionsAccountOpinions.RATING.value,
    sortable: true,
  },
  // {
  //   title: 'Rating',
  //   value: 'compositeRating',
  //   sortable: true,
  // },
  // {
  //   title: 'Average Rating',
  //   value: SortOptionsAccountOpinions.AVG_RATING.value,
  //   sortable: true,
  // },
  {
    title: 'HOT',
    value: SortOptionsAccountOpinions.MARKET_INTEREST.value,
    sortable: true,
  },
  {
    title: 'Rate',
    value: 'rateButton',
    sortable: false,
  },
]

type RatingsTableProps = {
  rawPairs: IdeaTokenMarketPair[]
  isPairsDataLoading: boolean
  refetch: () => void
  canFetchMore: boolean
  orderDirection: string
  orderBy: string
  fetchMore: () => any
  headerClicked: (value: string) => void
  onRateClicked: (idt: IdeamarketTwitterPost) => void
}

export default function RatingsTable({
  rawPairs,
  isPairsDataLoading,
  refetch,
  canFetchMore,
  orderDirection,
  orderBy,
  fetchMore,
  headerClicked,
  onRateClicked,
}: RatingsTableProps) {
  const TOKENS_PER_PAGE = 10

  const observer: MutableRefObject<any> = useRef()
  const lastElementRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect()

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && canFetchMore) {
          fetchMore()
        }
      })

      if (node) observer.current.observe(node)
    },
    [canFetchMore, fetchMore]
  )

  const getColumnContent = (column) => {
    switch (column.value) {
      case SortOptionsAccountOpinions.MARKET_INTEREST.value:
        return (
          <div className="flex items-center">
            <span className="mr-1 uppercase">
              {SortOptionsAccountOpinions.MARKET_INTEREST.displayName}
            </span>
          </div>
        )
      default:
        return column.title
    }
  }

  const getColumnStyle = (column) => {
    switch (column.value) {
      case 'name':
        return 'w-[40%] pl-6 pr-24'
      case SortOptionsAccountOpinions.RATING.value:
        return 'w-[20%]'
      // case 'compositeRating':
      //   return 'w-[12%]'
      case SortOptionsAccountOpinions.MARKET_INTEREST.value:
        return 'w-[20%]'
      // case 'marketInterest':
      //   return 'w-[12%]'
      case 'rateButton':
        return 'w-[20%]'
      default:
        return ''
    }
  }

  return (
    <div className="flex flex-col">
      <div className="-my-2 overflow-x-auto">
        <div className="inline-block w-full py-2 align-middle">
          <div className="overflow-hidden dark:border-gray-500">
            <div className="hidden md:flex h-24">
              {headers.map((header) => (
                <div
                  className={classNames(
                    getColumnStyle(header),
                    'flex items-center pr-5 py-5 text-xs leading-4 text-left text-brand-gray-4 dark:text-gray-200 bg-gray-50 dark:bg-gray-600',
                    header.sortable && 'cursor-pointer'
                  )}
                  key={header.value}
                  onClick={() => {
                    if (header.sortable) {
                      headerClicked(header.value)
                    }
                  }}
                >
                  <div className="flex items-center">
                    {rawPairs &&
                      rawPairs?.length > 0 &&
                      header.sortable &&
                      orderBy === header.value && (
                        <div
                          className="h-8 z-[42] text-[.65rem] flex justify-center items-center"
                          title="SORT"
                        >
                          {orderDirection === 'desc' ? (
                            <SortDescendingIcon className="w-3.5 text-blue-500" />
                          ) : (
                            <SortAscendingIcon className="w-3.5 text-blue-500" />
                          )}
                        </div>
                      )}
                    <span className="uppercase font-semibold mr-1">
                      {getColumnContent(header)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white divide-y-[6px] dark:bg-gray-700">
              {rawPairs &&
                rawPairs.map((pair: any, index) => (
                  <RatingsRow
                    key={index}
                    opinion={pair}
                    onRateClicked={onRateClicked}
                    refetch={refetch}
                    lastElementRef={
                      rawPairs.length === index + 1 ? lastElementRef : null
                    }
                  />
                ))}

              {isPairsDataLoading
                ? Array.from(Array(TOKENS_PER_PAGE).keys()).map((token) => (
                    <RatingsRowSkeleton key={token} />
                  ))
                : null}

              {rawPairs && rawPairs.length <= 0 && <EmptyTableBody />}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
