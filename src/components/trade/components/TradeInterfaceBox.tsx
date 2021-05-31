import Select from 'react-select'
import { TransactionManager } from 'utils'
import SelectTokensFormat from './SelectTokenFormat'
import { TokenListEntry } from '../../../store/tokenListStore'

const selectStyles = {
  container: (provided) => ({
    ...provided,
    width: 150,
    border: 'none',
  }),

  control: () => ({
    borderRadius: 100,
    display: 'flex',
  }),
  indicatorSeparator: () => ({}),
}

const selectTheme = (theme) => ({
  ...theme,
  borderRadius: 2,
  colors: {
    ...theme.colors,
    primary25: '#d8d8d8', // brand-gray
    primary: '#0857e0', // brand-blue
  },
})

type TradeInterfaceBoxProps = {
  label: string
  setIdeaTokenAmount: (value: string) => void
  ideaTokenAmount: string
  isTokenBalanceLoading: boolean
  tokenBalance: string
  maxButtonClicked: () => void
  selectTokensValues: any
  showBuySellSwitch?: boolean
  setSelectedToken: (value: string) => void
  setTradeType: (value: string) => void
  disabled: boolean
  tradeType: string
  selectedIdeaToken: TokenListEntry | null
  txManager: TransactionManager
}

const TradeInterfaceBox: React.FC<TradeInterfaceBoxProps> = ({
  label,
  setIdeaTokenAmount,
  ideaTokenAmount = '',
  isTokenBalanceLoading,
  tokenBalance,
  maxButtonClicked,
  selectTokensValues,
  showBuySellSwitch,
  setSelectedToken,
  setTradeType,
  disabled,
  tradeType,
  selectedIdeaToken,
  txManager,
}) => {
  const handleBuySellClick = () => {
    if (!txManager.isPending && tradeType === 'sell') setTradeType('buy')
    if (!txManager.isPending && tradeType === 'buy') setTradeType('sell')

    setIdeaTokenAmount('0')
  }

  return (
    <div className="mb-1 bg-gray-50 border border-gray-100 rounded-md px-5 py-4 relative text-brand-new-dark">
      <div
        style={{
          top: '-16px',
          left: '50%',
          transform: 'translate(-50%, 0)',
        }}
        className="text-xs font-medium bg-white rounded-md shadow-md flex item-center py-1 px-4 absolute font-bold"
      >
        {label}
      </div>

      {showBuySellSwitch && (
        <div
          style={{
            top: '-16px',
            left: 'calc(50% + 70px)',
            transform: 'translate(-50%, 0)',
          }}
          className="text-xs font-medium bg-white rounded-md shadow-md flex item-center py-1 px-4 absolute font-bold cursor-pointer"
          onClick={handleBuySellClick}
        >
          ↓
        </div>
      )}
      <div className="flex justify-between mb-2">
        {selectedIdeaToken ? (
          <div className="flex flex-row items-center w-full border-gray-200 rounded-md text-brand-gray-4 trade-select text-xs font-medium">
            <div className="bg-white flex items-center px-2 py-1  rounded-2xl shadow-md">
              <div className="flex items-center">
                {selectedIdeaToken?.logoURL && (
                  <img
                    className="w-7.5 rounded-full"
                    src={selectedIdeaToken?.logoURL}
                    alt="token"
                  />
                )}
              </div>
              {selectedIdeaToken?.symbol && (
                <div className="ml-2.5">
                  <div>{selectedIdeaToken?.symbol}</div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <Select
            className="border-2 border-gray-200 rounded-xl text-brand-gray-4 trade-select text-xs font-medium bg-white rounded-2xl shadow-md cursor-pointer"
            isClearable={false}
            isSearchable={false}
            isDisabled={txManager.isPending || disabled}
            onChange={(value) => {
              setSelectedToken(value.token)
            }}
            options={selectTokensValues}
            formatOptionLabel={SelectTokensFormat}
            defaultValue={
              selectedIdeaToken
                ? {
                    token: selectedIdeaToken,
                  }
                : selectTokensValues[0]
            }
            theme={selectTheme}
            styles={selectStyles}
          />
        )}
        <input
          className="border-none outline-none text-brand-gray-2 bg-gray-50 text-3xl text-right w-full max-w-sm"
          min="0"
          placeholder="0"
          disabled={!selectedIdeaToken || txManager.isPending}
          value={ideaTokenAmount}
          onChange={(event) => {
            setIdeaTokenAmount(event.target.value)
          }}
        />
      </div>
      <div className="flex justify-between text-sm">
        <div className="text-gray-500">
          Balance: {isTokenBalanceLoading ? '...' : tokenBalance}
          {!txManager.isPending && label === 'Spend' && (
            <span
              className="text-brand-blue cursor-pointer"
              onClick={maxButtonClicked}
            >
              {' '}
              (Max)
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default TradeInterfaceBox
