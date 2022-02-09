import classNames from 'classnames'
import { getMarketSpecificsByMarketName, useMarketStore } from 'store/markets'
import { ChevronDownIcon, StarIcon } from '@heroicons/react/solid'
import {
  AdjustmentsIcon,
  SparklesIcon,
  FireIcon,
  ArrowSmUpIcon,
  QuestionMarkCircleIcon,
  GlobeAltIcon,
} from '@heroicons/react/outline'
import React, { useEffect, useRef, useState } from 'react'
import { OverviewSearchbar } from './OverviewSearchbar'
import ModalService from 'components/modals/ModalService'
import { OverviewFiltersModal } from 'components'
import {
  CheckboxFilters,
  MainFilters,
  toggleColumnHelper,
  toggleMarketHelper,
} from './utils/OverviewUtils'
import useThemeMode from 'components/useThemeMode'
import DropdownButtons from 'components/dropdowns/DropdownButtons'
import DropdownCheckbox from 'components/dropdowns/DropdownCheckbox'
import IdeaverifyIconBlue from '../../assets/IdeaverifyIconBlue.svg'
import { getIconVersion } from 'utils/icons'
import { GhostIconBlack } from 'assets'
import { useMixPanel } from 'utils/mixPanel'

type DropdownButtonProps = {
  filters: any
  name: any
  selectedOptions: any
  toggleOption: (value: any) => void
  className?: string
  dropdownType?: string
  selectedFilterId?: number
}

// filters = options to appear in the dropdown
const DropdownButton = ({
  filters,
  name,
  selectedOptions,
  toggleOption,
  className,
  dropdownType = 'checkbox',
  selectedFilterId,
}: DropdownButtonProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const container = useRef(null)

  const DropdownProps = {
    container,
    filters,
    selectedOptions,
    toggleOption,
  }

  const getButtonIcon = (filterId: number) => {
    switch (filterId) {
      case 1:
        return <ArrowSmUpIcon className="w-4 h-4 stroke-current" />
      case 2:
        return <FireIcon className="w-4 h-4 mr-1" />
      case 3:
        return <SparklesIcon className="w-4 h-4 mr-1" />
      case 4:
        return <IdeaverifyIconBlue className="w-5 h-5 mr-1" />
      case 5:
        return <StarIcon className="w-4 h-4 mr-1" />
      default:
        return <QuestionMarkCircleIcon className="w-4 h-4 mr-1" />
    }
  }

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
        dropdownType !== 'columns' ? 'pl-3' : 'pl-2',
        `relative flex items-center p-1 border rounded-md pr-1 font-semibold text-sm text-brand-black dark:text-gray-50 cursor-pointer `
      )}
      onMouseOver={() => {
        setIsDropdownOpen(true)
      }}
      onMouseLeave={() => {
        setIsDropdownOpen(false)
      }}
    >
      {dropdownType === 'buttons' && (
        <div className="flex">
          <span className="mr-1 text-xs text-gray-500 dark:text-white whitespace-nowrap">
            Sort by:
          </span>
          {getButtonIcon(selectedFilterId)}
        </div>
      )}
      <span className="mr-1">{name}</span>
      {dropdownType !== 'columns' && <ChevronDownIcon className="h-5" />}
      {isDropdownOpen && dropdownType === 'buttons' && (
        <DropdownButtons {...DropdownProps} />
      )}
      {isDropdownOpen && dropdownType !== 'buttons' && (
        <DropdownCheckbox {...DropdownProps} />
      )}
    </div>
  )
}

type FiltersButtonProps = {
  isSelected: boolean
  onClick: (value: any) => void
  label: any
  className?: string
}

const FiltersButton = ({
  isSelected,
  onClick,
  label,
  className,
}: FiltersButtonProps) => {
  return (
    <button
      className={classNames(
        className,
        'flex flex-grow md:flex-auto justify-center items-center md:px-3 p-2 border md:rounded-md text-sm font-semibold',
        {
          'text-brand-blue dark:text-white bg-gray-100 dark:bg-very-dark-blue':
            isSelected,
        },
        { 'text-brand-black dark:text-gray-50': !isSelected }
      )}
      onClick={() => {
        onClick(!isSelected)
      }}
    >
      <span>{label}</span>
    </button>
  )
}

type PlatformButtonProps = {
  platform: any
  isSelected: boolean
  onClick: (platform: string) => void
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const PlatformButton = ({
  platform,
  isSelected,
  onClick,
}: PlatformButtonProps) => {
  const marketSpecifics = getMarketSpecificsByMarketName(platform)
  const { resolvedTheme } = useThemeMode()

  return (
    <button
      className={classNames(
        'h-10 flex flex-grow md:flex-auto justify-center items-center px-3 py-2 border md:rounded-md text-sm font-semibold',
        platform === 'All' && 'rounded-l-md',
        {
          'text-brand-blue dark:text-white bg-gray-100 dark:bg-very-dark-blue':
            isSelected,
        },
        { 'text-brand-black dark:text-gray-50': !isSelected }
      )}
      onClick={() => {
        onClick(platform)
      }}
    >
      {platform !== 'All' && (
        <span
          className={classNames(
            marketSpecifics.getMarketName() === 'Wikipedia' ? 'mr-2' : 'mr-1',
            'w-4 h-auto'
          )}
        >
          {marketSpecifics.getMarketSVGTheme(resolvedTheme)}
        </span>
      )}
      <span>{platform}</span>
    </button>
  )
}

type OverviewFiltersProps = {
  selectedFilterId: number
  selectedMarkets: Set<string>
  selectedColumns: Set<string>
  isVerifiedFilterActive: boolean
  isStarredFilterActive: boolean
  isGhostOnlyActive: boolean
  onMarketChanged: (set: Set<string>) => void
  setSelectedFilterId: (filterId: number) => void
  onColumnChanged: (set: Set<string>) => void
  onNameSearchChanged: (value: string) => void
  setIsVerifiedFilterActive: (isActive: boolean) => void
  setIsStarredFilterActive: (isActive: boolean) => void
  setIsGhostOnlyActive: (isActive: boolean) => void
}

export const OverviewFilters = ({
  selectedFilterId,
  selectedMarkets,
  selectedColumns,
  isVerifiedFilterActive,
  isStarredFilterActive,
  isGhostOnlyActive,
  onMarketChanged,
  setSelectedFilterId,
  onColumnChanged,
  onNameSearchChanged,
  setIsVerifiedFilterActive,
  setIsStarredFilterActive,
  setIsGhostOnlyActive,
}: OverviewFiltersProps) => {
  const { mixpanel } = useMixPanel()
  const { resolvedTheme } = useThemeMode()

  const toggleMarket = (marketName: string) => {
    let newSet = null
    if (marketName === 'URL') {
      newSet = toggleMarketHelper('URL', selectedMarkets)
      newSet = toggleMarketHelper('Minds', newSet)
      newSet = toggleMarketHelper('Substack', newSet)
      newSet = toggleMarketHelper('Showtime', newSet)
    } else {
      newSet = toggleMarketHelper(marketName, selectedMarkets)
    }

    onMarketChanged(newSet)
    mixpanel.track('FILTER_PLATFORM', { platforms: marketName })
  }

  const toggleColumn = (columnName: string) => {
    const newSet = toggleColumnHelper(columnName, selectedColumns)
    onColumnChanged(newSet)
  }

  function onFilterChanged(filterId: number) {
    setSelectedFilterId(filterId)
  }

  const markets = useMarketStore((state) =>
    state.markets.map((m) => m?.market?.name)
  )

  useEffect(() => {
    // toggleMarket method is dependent on CheckboxFilters.PLATFORMS.values
    CheckboxFilters.PLATFORMS.values = ['All', ...markets]
  }, [markets])

  const isURLSelected = selectedMarkets.has('URL')
  const isPeopleSelected = selectedMarkets.has('Twitter')
  const isWikiSelected = selectedMarkets.has('Wikipedia')
  const twitterMarketSpecifics = getMarketSpecificsByMarketName('Twitter')
  const wikiMarketSpecifics = getMarketSpecificsByMarketName('Wikipedia')

  return (
    <div className="h-28 md:h-16 justify-center p-3 bg-white rounded-t-lg md:flex dark:bg-gray-700 gap-x-2 gap-y-2 md:justify-start">
      {/* <div className="flex md:gap-x-2">
        {CheckboxFilters.PLATFORMS.values
          .sort((p1, p2) => {
            // Sort so that All is first and then Wikipedia is 2nd. Minds is 3rd. Rest of order not controlled
            if (p1 === 'All') return -1
            if (p1 === 'Wikipedia' && p2 !== 'All') {
              return -1
            }
            if (p1 === 'Minds' && p2 !== 'All' && p2 !== 'Wikipedia') {
              return -1
            }

            return 1
          })
          .map((platform: string) => (
            <PlatformButton
              key={platform}
              platform={platform}
              isSelected={
                selectedMarkets ? selectedMarkets.has(platform) : false
              }
              onClick={toggleMarket}
            />
          ))}
      </div> */}

      <FiltersButton
        className="hidden md:flex"
        onClick={setIsVerifiedFilterActive}
        isSelected={isVerifiedFilterActive}
        label={getIconVersion('verify', resolvedTheme, isVerifiedFilterActive)}
      />

      <FiltersButton
        className="hidden md:flex"
        onClick={setIsStarredFilterActive}
        isSelected={isStarredFilterActive}
        label={<StarIcon className="w-5 h-5" />}
      />

      <DropdownButton
        className="hidden md:flex"
        filters={Object.values(MainFilters)}
        name={
          Object.values(MainFilters).find(
            (filter) => filter.id === selectedFilterId
          )?.value
        }
        selectedOptions={new Set([selectedFilterId])}
        toggleOption={onFilterChanged}
        dropdownType="buttons"
        selectedFilterId={selectedFilterId}
      />

      <FiltersButton
        className="hidden md:flex w-56 text-sm leading-tight"
        onClick={setIsGhostOnlyActive}
        isSelected={isGhostOnlyActive}
        label={
          <div>
            <GhostIconBlack className="w-6 h-6" />
            Ghost Listings
          </div>
        }
      />

      <div className="flex w-full h-9 md:h-auto ml-auto">
        <OverviewSearchbar onNameSearchChanged={onNameSearchChanged} />
        <button
          className="flex items-center justify-center p-2 ml-2 text-sm font-semibold border rounded-md md:hidden"
          onClick={() => {
            ModalService.open(OverviewFiltersModal, {
              isVerifiedFilterActive,
              isStarredFilterActive,
              selectedFilterId,
              setIsVerifiedFilterActive,
              setIsStarredFilterActive,
              setSelectedFilterId,
            })
          }}
        >
          <span>Filters</span>
          {/* {numActiveFilters !== 0 && (
            <div className="px-1 ml-2 bg-gray-200 rounded text-brand-blue">
              {numActiveFilters}
            </div>
          )} */}
        </button>
      </div>

      <div className="md:hidden flex justify-between items-center space-x-2 mt-2">
        <button
          className={classNames(
            'w-1/3 h-10 flex justify-center items-center md:px-3 p-2 border-2 rounded-md text-sm font-semibold',
            {
              'text-brand-blue dark:text-white bg-blue-100 border-blue-600 dark:bg-very-dark-blue':
                isURLSelected,
            },
            { 'text-brand-black dark:text-gray-50': !isURLSelected }
          )}
          onClick={() => {
            toggleMarket('URL')
          }}
        >
          <GlobeAltIcon className="w-5 mr-1" />
          <span>URLs</span>
        </button>
        <button
          className={classNames(
            'w-1/3 h-10 flex justify-center items-center md:px-3 p-2 border-2 rounded-md text-sm font-semibold',
            {
              'text-brand-blue dark:text-white bg-blue-100 border-blue-600 dark:bg-very-dark-blue':
                isPeopleSelected,
            },
            { 'text-brand-black dark:text-gray-50': !isPeopleSelected }
          )}
          onClick={() => {
            toggleMarket('Twitter')
          }}
        >
          <span className="w-5 mr-1">
            {twitterMarketSpecifics?.getMarketSVGTheme(resolvedTheme)}
          </span>
          <span>People</span>
        </button>
        <button
          className={classNames(
            'w-1/3 h-10 flex justify-center items-center md:px-3 p-2 border-2 rounded-md text-sm font-semibold',
            {
              'text-brand-blue dark:text-white bg-blue-100 border-blue-600 dark:bg-very-dark-blue':
                isWikiSelected,
            },
            { 'text-brand-black dark:text-gray-50': !isWikiSelected }
          )}
          onClick={() => {
            toggleMarket('Wikipedia')
          }}
        >
          <span className="w-5 mr-1">
            {wikiMarketSpecifics?.getMarketSVGTheme(resolvedTheme)}
          </span>
          <span>Wikipedia</span>
        </button>
      </div>

      <DropdownButton
        className="hidden md:flex"
        filters={CheckboxFilters.COLUMNS.values}
        name={<AdjustmentsIcon className="w-5 h-5" />}
        selectedOptions={selectedColumns}
        toggleOption={toggleColumn}
        dropdownType="columns"
      />
    </div>
  )
}
