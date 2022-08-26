import classNames from 'classnames'
import { useCallback, useRef, MutableRefObject } from 'react'
import { SortAscendingIcon, SortDescendingIcon } from '@heroicons/react/solid'
import { SortOptionsAccountRecommended } from 'utils/tables'
import UserRecommendedRow from './UserRecommendedRow'
import UserRecommendedRowSkeleton from './UserRecommendedRowSkeleton'
import EmptyTableBody from 'modules/tables/components/EmptyTableBody'
import { IdeamarketUser } from '../services/UserMarketService'

type Header = {
  title: string
  value: string
  sortable: boolean
}

const headers: Header[] = [
  {
    title: '',
    value: 'name',
    sortable: false,
  },
  {
    title: SortOptionsAccountRecommended.MATCH_SCORE.displayName,
    value: SortOptionsAccountRecommended.MATCH_SCORE.value,
    sortable: true,
  },
  {
    title: SortOptionsAccountRecommended.STAKED.displayName,
    value: SortOptionsAccountRecommended.STAKED.value,
    sortable: true,
  },
  {
    title: 'STAKE',
    value: 'txButtons',
    sortable: false,
  },
]

type UserRecommendedTableProps = {
  rawPairs: any[]
  isPairsDataLoading: boolean
  refetch: () => void
  canFetchMore: boolean
  orderDirection: string
  orderBy: string
  fetchMore: () => any
  headerClicked: (value: string) => void
  onStakeClicked: (idt: IdeamarketUser) => void
}

export default function UserRecommendedTable({
  rawPairs,
  isPairsDataLoading,
  refetch,
  canFetchMore,
  orderDirection,
  orderBy,
  fetchMore,
  headerClicked,
  onStakeClicked,
}: UserRecommendedTableProps) {
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
      default:
        return column.title
    }
  }

  const getColumnStyle = (column) => {
    switch (column.value) {
      case 'name':
        return 'w-[45%] lg:w-[55%] pl-6 pr-24'
      case SortOptionsAccountRecommended.STAKED.value:
        return 'w-[18.33%] lg:w-[15%]'
      case SortOptionsAccountRecommended.MATCH_SCORE.value:
        return 'w-[18.33%] lg:w-[15%]'
      case 'txButtons':
        return 'w-[18.33%] lg:w-[15%]'
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
              {!isPairsDataLoading &&
                rawPairs &&
                rawPairs.map((pair: any, index) => (
                  <UserRecommendedRow
                    key={index}
                    recommendedUser={pair}
                    onStakeClicked={onStakeClicked}
                    refetch={refetch}
                    lastElementRef={
                      rawPairs.length === index + 1 ? lastElementRef : null
                    }
                  />
                ))}

              {true
                ? Array.from(Array(TOKENS_PER_PAGE).keys()).map((token) => (
                    <UserRecommendedRowSkeleton key={token} />
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
