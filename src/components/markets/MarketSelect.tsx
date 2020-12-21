import { useState, useEffect } from 'react'
import Select from 'react-select'
import { getMarketSpecificsByMarketName } from 'store/markets'
import { useQuery } from 'react-query'
import { queryMarkets } from 'store/ideaMarketsStore'

export default function MarketSelect({
  onChange,
  disabled,
  isClearable = false,
}: {
  onChange: (val: any) => void
  disabled: boolean
  isClearable?: boolean
}) {
  const [selectMarketValues, setSelectMarketValues] = useState([])

  const { data: markets, isLoading: isMarketsLoading } = useQuery(
    'all-markets',
    queryMarkets
  )

  useEffect(() => {
    if (markets) {
      setSelectMarketValues(
        // TODO: Remove filter when we do not want to hide "Substack" market anymore (launch)
        markets
          .filter((v) => {
            return v.name === 'Twitter' || v.name === 'Substack'
          })
          .map((market) => ({
            value: market.marketID.toString(),
            market: market,
          }))
      )
    } else {
      setSelectMarketValues([])
    }
  }, [markets])

  const selectMarketFormat = (entry) => (
    <div className="flex items-center">
      <div>
        {entry?.market?.name
          ? getMarketSpecificsByMarketName(
              entry.market.name
            ).getMarketSVGBlack()
          : ''}
      </div>
      <div className="ml-2.5">{entry.market.name}</div>
    </div>
  )

  return (
    <Select
      isDisabled={disabled}
      isClearable={isClearable}
      isSearchable={false}
      onChange={onChange}
      options={selectMarketValues}
      formatOptionLabel={selectMarketFormat}
      defaultValue={isMarketsLoading ? undefined : selectMarketValues[0]}
      theme={(theme) => ({
        ...theme,
        borderRadius: 2,
        colors: {
          ...theme.colors,
          primary25: '#f6f6f6', // brand-gray
          primary: '#0857e0', // brand-blue
        },
      })}
      styles={{
        valueContainer: (provided) => ({
          ...provided,
          minHeight: '50px',
        }),
      }}
    />
  )
}
