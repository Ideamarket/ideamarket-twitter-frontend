import Select from 'react-select'
import { getMarketSVGBlack } from 'store/ideaMarketsStore'

export default function MarketSelect({ onChange, options, defaultValue }) {
  const selectMarketFormat = (entry) => (
    <div className="flex items-center">
      <div>
        {entry?.market?.name ? getMarketSVGBlack(entry.market.name) : ''}
      </div>
      <div className="ml-2.5">{entry.market.name}</div>
    </div>
  )

  return (
    <Select
      isClearable={false}
      isSearchable={false}
      onChange={onChange}
      options={options}
      formatOptionLabel={selectMarketFormat}
      defaultValue={defaultValue}
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
