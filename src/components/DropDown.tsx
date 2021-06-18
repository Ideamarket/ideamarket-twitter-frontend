import Select from 'react-select'
import { useTheme } from 'next-themes'
export default function MarketSelect({
  onChange,
  isDisabled,
  isSearchable,
  isClearable = false,
  options,
  formatOptionLabel,
  defaultValue,
  name,
  className,
}: {
  onChange: (val: any) => void
  isDisabled: any
  isSearchable: any
  isClearable?: boolean
  options: any
  formatOptionLabel: any
  defaultValue: any
  name: string
  className: string
}) {
  const { theme } = useTheme()

  return (
    <Select
      name={name}
      isDisabled={isDisabled}
      isClearable={isClearable}
      isSearchable={false}
      onChange={onChange}
      options={options}
      formatOptionLabel={formatOptionLabel}
      defaultValue={defaultValue}
      className={className}
      theme={(mytheme) => ({
        ...mytheme,
        borderRadius: 2,
        colors: {
          ...mytheme.colors,
          primary50: theme === 'dark' ? '#4B5563' : '', // brand-gray ,

          primary25: theme === 'dark' ? '#4B5563' : '#f6f6f6', // brand-gray
          primary: '#0857e0', // brand-blue
        },
      })}
      styles={{
        valueContainer: (provided) => ({
          ...provided,
          minHeight: '50px',
        }),
        control: (base, state) => ({
          ...base,
          textDecorationColor: theme === 'dark' ? 'white' : 'gray',
          background: theme === 'dark' ? '#4B5563' : 'white',
          // match with the menu
          borderRadius: state.isFocused ? '3px 3px 0 0' : 3,
          // Overwrittes the different states of border
          borderColor: state.isFocused ? 'yellow' : 'green',
          // Removes weird border around container
          boxShadow: state.isFocused ? null : null,
          '&:hover': {
            // Overwrittes the different states of border
            borderColor: state.isFocused ? 'red' : 'blue',
          },
        }),
        menuList: (base) => ({
          ...base,
          background: theme === 'dark' ? '#6B7280' : 'white',
        }),
      }}
      instanceId="market-select"
    />
  )
}
