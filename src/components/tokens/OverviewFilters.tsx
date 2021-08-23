import classNames from 'classnames'
import { useMarketStore } from 'store/markets'
import { ChevronDownIcon, BadgeCheckIcon } from '@heroicons/react/solid'
import {
  StarIcon,
  SparklesIcon,
  FireIcon,
  ArrowSmUpIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/outline'
import React, { useEffect, useRef, useState } from 'react'
import { OverviewSearchbar } from './OverviewSearchbar'

export const Filters = {
  TOP: {
    id: 1,
    value: 'Top',
  },
  HOT: {
    id: 2,
    value: 'Hot',
  },
  NEW: {
    id: 3,
    value: 'New',
  },
  // VERIFIED: {
  //   id: 4,
  //   value: 'Verified',
  // },
  STARRED: {
    id: 5,
    value: 'Starred',
  },
}

export const DropdownFilters = {
  PLATFORMS: {
    id: 1,
    name: 'Platforms',
    values: ['All'], // Don't hardcode the markets. They are set in OverviewFilters component below
  },
  COLUMNS: {
    id: 2,
    name: 'Columns',
    values: [
      'All',
      'Deposits',
      '% Locked',
      '1YR Income',
      '24H Change',
      'Claimable Income',
    ],
  },
}

type DropdownButtonProps = {
  filters: any
  name: string
  selectedOptions: any
  toggleOption: (marketValue: string) => void
  className?: string
}

// filters = options to appear in the dropdown
const DropdownButton = ({
  filters,
  name,
  selectedOptions,
  toggleOption,
  className,
}: DropdownButtonProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const container = useRef(null)

  function handleClickOutside(event) {
    const value = container.current
    if (value && !value.contains(event.target)) {
      setIsDropdownOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div
      className={classNames(
        className,
        `relative flex items-center p-1 border rounded-md pl-3 pr-1 text-sm text-brand-black dark:text-gray-50 cursor-pointer z-40`
      )}
      onClick={() => {
        setIsDropdownOpen(true)
      }}
    >
      <span className="mr-1">{name}</span>
      {name === 'Platforms' && (
        <span className="w-7 text-center text-xs text-gray-400">
          {
            [...selectedOptions].filter((o) => o !== 'All' && o !== 'None')
              .length
          }{' '}
          / {filters.length - 1}
        </span>
      )}
      <ChevronDownIcon className="h-5" />
      {isDropdownOpen && (
        <div
          ref={container}
          className="absolute max-h-36 w-32 md:w-64 mt-1 p-4 shadow-xl border rounded-lg flex flex-col flex-wrap bg-white dark:bg-gray-800 cursor-default z-40"
          style={{ top: '100%', left: 0 }}
        >
          {filters.map((filter) => (
            <span key={filter}>
              <input
                type="checkbox"
                id={`checkbox-${filter}`}
                className="cursor-pointer border-2 border-gray-200 rounded-sm"
                checked={
                  selectedOptions.has(filter) || selectedOptions.has('All')
                }
                onChange={(e) => {
                  toggleOption(filter)
                }}
              />
              <label
                htmlFor={`checkbox-${filter}`}
                className={classNames(
                  'ml-2 cursor-pointer font-medium',
                  selectedOptions.has(filter) || selectedOptions.has('All')
                    ? 'text-brand-blue dark:text-blue-400'
                    : 'text-brand-black'
                )}
              >
                {filter}
              </label>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

type FiltersButtonProps = {
  filter: any
  isSelected: boolean
  onClick: (filterId: number) => void
}

const FiltersButton = ({ filter, isSelected, onClick }: FiltersButtonProps) => {
  function getButtonIcon(filterId: number) {
    switch (filterId) {
      case 1:
        return <ArrowSmUpIcon className="stroke-current w-4 h-4" />
      case 2:
        return <FireIcon className="w-4 h-4 mr-1" />
      case 3:
        return <SparklesIcon className="w-4 h-4 mr-1" />
      case 4:
        return <BadgeCheckIcon className="w-5 h-5 mr-1" />
      case 5:
        return <StarIcon className="w-4 h-4 mr-1" />
      default:
        return <QuestionMarkCircleIcon className="w-4 h-4 mr-1" />
    }
  }

  return (
    <button
      className={classNames(
        'flex flex-grow md:flex-auto justify-center items-center md:px-3 p-2 border md:rounded-md text-sm',
        filter.value === 'Top' && 'rounded-l-md',
        filter.value === 'Starred' && 'rounded-r-md',
        {
          'text-brand-blue dark:text-white bg-gray-100 dark:bg-very-dark-blue':
            isSelected,
        },
        { 'text-brand-black dark:text-gray-50': !isSelected }
      )}
      onClick={() => {
        onClick(filter.id)
      }}
    >
      {getButtonIcon(filter.id)}
      <span>{filter.value}</span>
    </button>
  )
}

type FilterButtonRowProps = {
  filters: any
  onFilterChanged: (filterId: number) => void
  selectedFilterId: number
}

const FilterButtonRow = ({
  filters,
  onFilterChanged,
  selectedFilterId,
}: FilterButtonRowProps) => {
  return (
    <>
      <div className="flex md:hidden">
        {Object.values(filters).map((filter: { id: number; value: string }) => (
          <FiltersButton
            key={filter.id}
            filter={filter}
            onClick={onFilterChanged}
            isSelected={filter.id === selectedFilterId}
          />
        ))}
      </div>
      <div className="hidden md:flex gap-x-2">
        {Object.values(filters).map((filter: { id: number; value: string }) => (
          <FiltersButton
            key={filter.id}
            filter={filter}
            onClick={onFilterChanged}
            isSelected={filter.id === selectedFilterId}
          />
        ))}
      </div>
    </>
  )
}

type OverviewFiltersProps = {
  selectedFilterId: number
  selectedMarkets: Set<string>
  selectedColumns: Set<string>
  onMarketChanged: (set: Set<string>) => void
  setSelectedFilterId: (filterId: number) => void
  onColumnChanged: (set: Set<string>) => void
  onNameSearchChanged: (value: string) => void
}

export const OverviewFilters = ({
  selectedFilterId,
  selectedMarkets,
  selectedColumns,
  onMarketChanged,
  setSelectedFilterId,
  onColumnChanged,
  onNameSearchChanged,
}: OverviewFiltersProps) => {
  const toggleMarket = (marketName: string) => {
    const newSet = new Set(selectedMarkets)

    if (newSet.has('None')) {
      newSet.delete('None')
    }

    if (newSet.has(marketName)) {
      newSet.delete(marketName)
      if (newSet.size === 0) {
        // If removed last option, add 'None' which will query to show no tokens
        newSet.add('None')
      }
      if (marketName === 'All') {
        // Remove all other options too
        newSet.clear()
        // If clicked 'All', add 'None' which will query to show no tokens
        newSet.add('None')
      }
      if (newSet.has('All') && marketName !== 'All') {
        // Remove 'All' option if any option is removed
        newSet.delete('All')
      }
    } else {
      if (marketName === 'All') {
        DropdownFilters.PLATFORMS.values.forEach((platform) => {
          if (!newSet.has(platform)) {
            newSet.add(platform)
          }
        })
      } else {
        newSet.add(marketName)
        // If all options selected, make sure the 'All' option is selected too
        if (DropdownFilters.PLATFORMS.values.length - newSet.size === 1) {
          newSet.add('All')
        }
      }
    }

    onMarketChanged(newSet)
  }

  const toggleColumn = (columnName: string) => {
    const newSet = new Set(selectedColumns)

    if (newSet.has(columnName)) {
      newSet.delete(columnName)
      if (columnName === 'All') {
        // Remove all other options too
        newSet.clear()
      }
      if (newSet.has('All') && columnName !== 'All') {
        // Remove 'All' option if any option is removed
        newSet.delete('All')
      }
    } else {
      if (columnName === 'All') {
        DropdownFilters.COLUMNS.values.forEach((column) => {
          if (!newSet.has(column)) {
            newSet.add(column)
          }
        })
      } else {
        newSet.add(columnName)
        // If all options selected, make sure the 'All' option is selected too
        if (DropdownFilters.COLUMNS.values.length - newSet.size === 1) {
          newSet.add('All')
        }
      }
    }

    onColumnChanged(newSet)
  }

  function onFilterChanged(filterId: number) {
    setSelectedFilterId(filterId)
  }

  const markets = useMarketStore((state) =>
    state.markets.map((m) => m?.market?.name)
  )

  useEffect(() => {
    // toggleMarket method is dependent on DropdownFilters.PLATFORMS.values
    DropdownFilters.PLATFORMS.values = ['All', ...markets]
  }, [markets])

  return (
    <div className="md:flex justify-center p-3 bg-white dark:bg-gray-700 rounded-t-lg gap-x-2 gap-y-2 md:justify-start overflow-x-scroll lg:overflow-x-visible">
      <FilterButtonRow
        filters={Filters}
        onFilterChanged={onFilterChanged}
        selectedFilterId={selectedFilterId}
      />

      <DropdownButton
        className="hidden md:flex"
        filters={DropdownFilters.PLATFORMS.values}
        name={DropdownFilters.PLATFORMS.name}
        selectedOptions={selectedMarkets}
        toggleOption={toggleMarket}
      />

      <DropdownButton
        className="hidden md:flex"
        filters={DropdownFilters.COLUMNS.values}
        name={DropdownFilters.COLUMNS.name}
        selectedOptions={selectedColumns}
        toggleOption={toggleColumn}
      />

      <div className="ml-auto mt-2 md:mt-0 w-full">
        <OverviewSearchbar onNameSearchChanged={onNameSearchChanged} />
      </div>
    </div>
  )
}
