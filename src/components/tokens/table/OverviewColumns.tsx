import React, { useRef, useState } from 'react'
import classNames from 'classnames'
import Tooltip from 'components/tooltip/Tooltip'
import { A } from 'components'
import { SortAscendingIcon, SortDescendingIcon } from '@heroicons/react/solid'
// import { StarIcon } from '@heroicons/react/solid'
// import SelectableButton from 'components/buttons/SelectableButton'
import {
  getSortOptionDisplayNameByValue,
  getTimeFilterDisplayNameByValue,
  SortOptionsHomePostsTable,
  SortOptionsHomeUsersTable,
  TABLE_NAMES,
  TimeFilterOptions,
  TIME_FILTER,
} from 'utils/tables'
import { OverviewSearchbar } from '../OverviewSearchbar'
import { ChevronDownIcon } from '@heroicons/react/outline'
import DropdownButtons from 'components/dropdowns/DropdownButtons'
import useOnClickOutside from 'utils/useOnClickOutside'

type Props = {
  orderBy: string
  orderDirection: string
  columnData: Array<any>
  isStarredFilterActive: boolean
  selectedTable: TABLE_NAMES
  timeFilter?: TIME_FILTER
  columnClicked: (column: string) => void
  setIsStarredFilterActive: (isActive: boolean) => void
  onNameSearchChanged: (value: string) => void
  setTimeFilter?: (value: TIME_FILTER) => void
}

function IncomeColumn() {
  return (
    <>
      1YR
      <br />
      <div className="flex items-center">
        Income [Paused]
        <Tooltip className="ml-1">
          <div className="w-32 md:w-64">
            ARBITRUM UPGRADE: Since{' '}
            <A href="https://compound.finance" className="underline">
              compound.finance
            </A>{' '}
            is not on Arbitrum, interest generation has been paused until they
            launch, or we replace them with another lending protocol. Columns
            currently display 6% APR
          </div>
        </Tooltip>
      </div>
    </>
  )
}

export const OverviewColumns = ({
  orderBy,
  orderDirection,
  columnData,
  selectedTable,
  isStarredFilterActive,
  timeFilter,
  columnClicked,
  setIsStarredFilterActive,
  onNameSearchChanged,
  setTimeFilter,
}: Props) => {
  const [isTimeFilterDropdownOpen, setIsTimeFilterDropdownOpen] =
    useState(false)
  const [isSortingDropdownOpen, setIsSortingDropdownOpen] = useState(false)
  const ref = useRef()
  useOnClickOutside(ref, () => {
    setIsTimeFilterDropdownOpen(false)
    setIsSortingDropdownOpen(false)
  })

  function getColumnContent(column) {
    switch (column.value) {
      case 'name':
        return (
          <div className="flex items-center space-x-2">
            <div className="flex w-52">
              <OverviewSearchbar
                onNameSearchChanged={onNameSearchChanged}
                bgColor="bg-white"
              />
            </div>

            <div
              onClick={() => setIsSortingDropdownOpen(!isSortingDropdownOpen)}
              className="relative w-auto h-9 flex justify-center items-center px-2 py-1 border rounded-md normal-case cursor-pointer"
            >
              <span className="text-xs mr-1 text-sm text-black/[.5] font-semibold dark:text-white whitespace-nowrap">
                Sort by:
              </span>
              <span className="text-xs text-blue-500 font-semibold flex items-center whitespace-nowrap">
                {getSortOptionDisplayNameByValue(orderBy, selectedTable)}
              </span>
              <span>
                <ChevronDownIcon className="h-4" />
              </span>

              {isSortingDropdownOpen && (
                <DropdownButtons
                  container={ref}
                  filters={Object.values(
                    selectedTable === TABLE_NAMES.HOME_POSTS
                      ? SortOptionsHomePostsTable
                      : SortOptionsHomeUsersTable
                  )}
                  selectedOptions={new Set([orderBy])}
                  toggleOption={columnClicked}
                  width="w-[10rem]"
                />
              )}
            </div>

            {selectedTable === TABLE_NAMES.HOME_POSTS && (
              <div
                onClick={() =>
                  setIsTimeFilterDropdownOpen(!isTimeFilterDropdownOpen)
                }
                className="relative w-28 h-9 flex justify-center items-center px-2 py-1 border rounded-md normal-case cursor-pointer"
              >
                <span className="text-xs text-blue-500 font-semibold flex items-center">
                  {getTimeFilterDisplayNameByValue(timeFilter)}
                </span>
                <span>
                  <ChevronDownIcon className="h-4" />
                </span>

                {isTimeFilterDropdownOpen && (
                  <DropdownButtons
                    container={ref}
                    filters={Object.values(TimeFilterOptions)}
                    selectedOptions={new Set([timeFilter])}
                    toggleOption={setTimeFilter}
                    width="w-[10rem]"
                  />
                )}
              </div>
            )}
          </div>
        )
      case 'income':
        return <IncomeColumn />
      case 'claimable':
        return (
          <>
            Claimable
            <br />
            Income
          </>
        )
      case 'dayChange':
        return (
          <>
            24H
            <br />
            Change
          </>
        )

      case 'weekChange':
        return (
          <>
            7D
            <br />
            Change
          </>
        )
      case SortOptionsHomePostsTable.MARKET_INTEREST.value:
        return (
          <div className="invisible flex items-center">
            <span className="mr-1">SCRUTINY</span>
            <Tooltip
              className="text-black/[.5] z-[200]"
              iconComponentClassNames="w-3"
            >
              <div className="w-64">
                The total amount of IMO staked on all users who rated a post
              </div>
            </Tooltip>
          </div>
        )
      case SortOptionsHomePostsTable.COMPOSITE_RATING.value:
        return (
          <div className="flex items-center">
            <span>
              Confidence
              <Tooltip
                className="ml-1 text-black/[.5] z-[200]"
                iconComponentClassNames="w-3"
              >
                <div className="w-64">
                  Rating weighted by IMO staked on each user. The more IMO
                  staked on a user, the more that user’s ratings affect the IMO
                  Rating of every post they rate.
                </div>
              </Tooltip>
            </span>
          </div>
        )
      // case SortOptionsHomePostsTable.AVG_RATING.value:
      //   return (
      //     <>
      //       Average
      //       <br />
      //       Rating
      //     </>
      //   )
      default:
        return column.content
    }
  }

  const getColumnStyle = (column) => {
    if (selectedTable === TABLE_NAMES.HOME_POSTS) {
      switch (column.value) {
        case 'name':
          return 'w-[45%] lg:w-[55%] pl-6 pr-24'
        case SortOptionsHomePostsTable.COMPOSITE_RATING.value:
          return 'w-[18.3%] lg:w-[15%] pl-12 lg:pl-0'
        // case SortOptionsHomePostsTable.AVG_RATING.value:
        //   return 'w-[11%] lg:w-[9%]'
        case SortOptionsHomePostsTable.MARKET_INTEREST.value:
          return 'w-[18.3%] lg:w-[15%]'
        // case SortOptionsHomePostsTable.RATINGS.value:
        //   return 'w-[13.75%] lg:w-[11.25%]'
        case 'txButtons':
          return 'w-[18.3%] lg:w-[15%]'
        default:
          return ''
      }
    } else if (selectedTable === TABLE_NAMES.HOME_USERS) {
      switch (column.value) {
        case 'name':
          return 'w-[45%] lg:w-[55%] pl-6 pr-24'
        case SortOptionsHomeUsersTable.TOTAL_RATINGS_COUNT.value:
          return 'w-[13.75%] lg:w-[11.25%]'
        case SortOptionsHomeUsersTable.STAKED.value:
          return 'w-[13.75%] lg:w-[11.25%]'
        // case SortOptionsHomeUsersTable.WEEK_CHANGE.value:
        //   return 'w-[13.75%] lg:w-[11.25%]'
        case SortOptionsHomeUsersTable.HOLDERS.value:
          return 'w-[13.75%] lg:w-[11.25%]'
        case 'stakeButton':
          return 'w-[13.75%] lg:w-[11.25%]'
        default:
          return ''
      }
    }
  }

  return (
    <>
      {columnData.map((column) => {
        return (
          <div
            className={classNames(
              getColumnStyle(column),
              'flex items-center pr-5 py-5 text-xs leading-4 text-left text-brand-gray-4 dark:text-gray-200 bg-gray-50 dark:bg-gray-600',
              column.sortable && 'cursor-pointer'
            )}
            key={column.value}
            onClick={() => {
              if (column.sortable) {
                columnClicked(column.value)
              }
            }}
          >
            <div className="flex items-center">
              {column.sortable &&
                orderBy === column.value &&
                orderBy !== SortOptionsHomePostsTable.MARKET_INTEREST.value && (
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
                {getColumnContent(column)}
              </span>
            </div>
          </div>
        )
      })}
    </>
  )
}
