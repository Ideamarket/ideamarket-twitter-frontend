import { ChevronDownIcon } from '@heroicons/react/solid'
import DropdownButtons from 'components/dropdowns/DropdownButtons'
import { OverviewSearchbar } from 'components/tokens/OverviewSearchbar'
import { CheckboxFilters } from 'components/tokens/utils/OverviewUtils'
import { useEffect, useRef, useState } from 'react'
import { useMarketStore } from 'store/markets'
import {
  getSortOptionDisplayNameByValue,
  SortOptionsAccountOpinions,
  SortOptionsAccountPosts,
  TABLE_NAMES,
} from 'utils/tables'
import useOnClickOutside from 'utils/useOnClickOutside'

type Props = {
  table: TABLE_NAMES
  selectedMarkets: Set<string>
  isVerifiedFilterActive: boolean
  isStarredFilterActive: boolean
  isLockedFilterActive: boolean
  nameSearch: string
  orderBy: string
  onMarketChanged: (set: Set<string>) => void
  onNameSearchChanged: (value: string) => void
  setIsVerifiedFilterActive: (isActive: boolean) => void
  setIsStarredFilterActive: (isActive: boolean) => void
  setIsLockedFilterActive: (isActive: boolean) => void
  setOrderBy: (value: string) => void
}

const WalletFilters = ({
  table,
  selectedMarkets,
  isVerifiedFilterActive,
  isStarredFilterActive,
  isLockedFilterActive,
  nameSearch,
  orderBy,
  onMarketChanged,
  onNameSearchChanged,
  setIsVerifiedFilterActive,
  setIsStarredFilterActive,
  setIsLockedFilterActive,
  setOrderBy,
}: Props) => {
  const [isSortingDropdownOpen, setIsSortingDropdownOpen] = useState(false)
  const ref = useRef()
  useOnClickOutside(ref, () => setIsSortingDropdownOpen(false))

  const markets = useMarketStore((state) =>
    state.markets.map((m) => m?.market?.name)
  )

  useEffect(() => {
    // toggleMarket method is dependent on CheckboxFilters.PLATFORMS.values
    CheckboxFilters.PLATFORMS.values = ['All', ...markets]
  }, [markets])

  return (
    <div className="justify-center p-3 bg-white rounded-t-lg text-black md:flex dark:bg-gray-700 gap-x-2 gap-y-2 md:justify-start lg:overflow-x-visible">
      {/* <FiltersButton
        className="hidden md:flex"
        onClick={setIsStarredFilterActive}
        isSelected={isStarredFilterActive}
        label={<StarIcon className="w-5 h-5" />}
      /> */}

      <div className="w-full h-auto">
        {/* Start of dropdown button that only shows on mobile Account Opinion table */}
        {(table === TABLE_NAMES.ACCOUNT_OPINIONS ||
          table === TABLE_NAMES.ACCOUNT_POSTS) && (
          <div
            onClick={() => setIsSortingDropdownOpen(!isSortingDropdownOpen)}
            className="relative w-full flex md:hidden justify-center items-center px-2 py-1 mb-1 ml-auto border rounded-md"
          >
            <span className="mr-1 text-sm text-black/[.5] font-semibold dark:text-white whitespace-nowrap">
              Sort by:
            </span>
            <span className="text-sm text-blue-500 font-semibold flex items-center">
              {/* <span>{getSortByIcon(selectedSortOptionID)}</span> */}
              <span>{getSortOptionDisplayNameByValue(orderBy, table)}</span>
            </span>
            <span>
              <ChevronDownIcon className="h-5" />
            </span>

            {isSortingDropdownOpen && (
              <DropdownButtons
                container={ref}
                filters={Object.values(
                  table === TABLE_NAMES.ACCOUNT_OPINIONS
                    ? SortOptionsAccountOpinions
                    : SortOptionsAccountPosts
                )}
                selectedOptions={new Set([orderBy])}
                toggleOption={setOrderBy}
              />
            )}
          </div>
        )}

        <OverviewSearchbar onNameSearchChanged={onNameSearchChanged} />
      </div>

      {/* <DropdownButton
        className="hidden md:flex"
        filters={CheckboxFilters.COLUMNS.values}
        name={<AdjustmentsIcon className="w-5 h-5" />}
        selectedOptions={selectedColumns}
        toggleOption={toggleColumn}
        dropdownType="columns"
      /> */}
    </div>
  )
}

export default WalletFilters
