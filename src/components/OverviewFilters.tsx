import classNames from 'classnames'
import { IMarketSpecifics } from 'store/markets'
import ArrowUp from '../assets/arrow-up.svg'
import Fire from '../assets/fire.svg'
import Sparkles from '../assets/sparkles.svg'
import Star from '../assets/star.svg'
import QuestionMark from '../assets/question-mark.svg'

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
  STARRED: {
    id: 4,
    value: 'Starred',
  },
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
        return <ArrowUp className="stroke-current" />
      case 2:
        return <Fire />
      case 3:
        return <Sparkles />
      case 4:
        return <Star />
      default:
        return <QuestionMark />
    }
  }

  return (
    <button
      className={classNames(
        'flex items-center p-1 border rounded-md px-3 text-sm',
        {
          'text-brand-blue bg-gray-100': isSelected,
        },
        { 'text-brand-black': !isSelected }
      )}
      onClick={() => {
        onClick(filter.id)
      }}
    >
      {getButtonIcon(filter.id)}
      <span className="ml-1">{filter.value}</span>
    </button>
  )
}

type OverviewFiltersProps = {
  selectedFilterId: number
  selectedMarkets: Set<string>
  markets: IMarketSpecifics[]
  onMarketChanged: (set: Set<string>) => void
  setSelectedFilterId: (filterId: number) => void
}

export const OverviewFilters = ({
  selectedFilterId,
  selectedMarkets,
  markets,
  onMarketChanged,
  setSelectedFilterId,
}: OverviewFiltersProps) => {
  const toggleMarket = (marketName: string) => {
    const newSet = new Set(selectedMarkets)
    if (newSet.has(marketName)) {
      newSet.delete(marketName)
    } else {
      newSet.add(marketName)
    }

    onMarketChanged(newSet)
  }

  function onFilterChanged(filterId: number) {
    setSelectedFilterId(filterId)
  }

  return (
    <div className="grid justify-center flex-1 grid-cols-2 md:grid-cols-none md:auto-cols-min md:grid-flow-col p-4 bg-white rounded-t-lg gap-x-2 gap-y-2 md:rounded-tr-none md:justify-start">
      {Object.values(Filters).map((filter) => (
        <FiltersButton
          key={filter.id}
          filter={filter}
          onClick={onFilterChanged}
          isSelected={filter.id === selectedFilterId}
        />
      ))}
    </div>
  )
}
