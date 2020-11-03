import { useState } from 'react'
import classNames from 'classnames'
import { IdeaToken, IdeaMarket } from '../store/ideaMarketsStore'
import { useTokenListStore } from '../store/tokenListStore'
import { useBalance } from '../actions/useBalance'
import { useOutputAmount } from '../actions/useOutputAmount'
import { floatToWeb3BN } from '../utils'

import Select from 'react-select'
import Modal from './Modal'

export default function TradeModal({
  isOpen,
  setIsOpen,
  token,
  market,
}: {
  isOpen: boolean
  setIsOpen: (b: boolean) => void
  token: IdeaToken
  market: IdeaMarket
}) {
  const [tradeType, setTradeType] = useState('buy')
  const tokenList = useTokenListStore((state) => state.tokens)
  const selectTokensValues = tokenList.map((token) => ({
    value: token.address,
    token: token,
  }))

  const [selectedToken, setSelectedToken] = useState(undefined)
  const [
    isIdeaTokenBalanceLoading,
    ideaTokenBalanceBN,
    ideaTokenBalance,
  ] = useBalance(token?.address, 18)

  const [isTokenBalanceLoading, tokenBalanceBN, tokenBalance] = useBalance(
    selectedToken?.address,
    selectedToken?.decimals
  )

  const [inputAmount, setInputAmount] = useState('0')
  const [isOutputAmountLoading, outputAmountBN, outputAmount] = useOutputAmount(
    token,
    selectedToken?.address,
    inputAmount,
    selectedToken?.decimals,
    tradeType
  )

  const selectTokensFormat = (entry) => (
    <div className="flex flex-row">
      <div className="flex items-center">
        <img className="w-7.5" src={'' + entry.token.logoURL} />
      </div>
      <div className="ml-2.5">
        <div>{entry.token.symbol}</div>
        <div className="text-xs text-brand-gray-2">{entry.token.name}</div>
      </div>
    </div>
  )

  if (!isOpen) {
    return <></>
  }

  return (
    <Modal isOpen={isOpen} close={() => setIsOpen(false)}>
      <div className="lg:min-w-100">
        <div className="p-4 bg-top-mobile">
          <p className="text-2xl text-center text-gray-300 md:text-3xl font-gilroy-bold">
            Trade: {token.name}
          </p>
        </div>
        <nav className="flex">
          <a
            onClick={() => {
              setTradeType('buy')
            }}
            className={classNames(
              'ml-5 mr-2.5 text-center flex-grow px-1 py-4 text-base leading-none tracking-tightest whitespace-no-wrap border-b-2 focus:outline-none cursor-pointer',
              tradeType === 'buy'
                ? 'font-semibold text-brand-green border-brand-green focus:text-brand-green focus:border-very-dark-blue-2'
                : 'font-medium text-brand-gray-2 border-transparent hover:text-gray-700 hover:border-gray-300 focus:text-gray-700 focus:border-gray-300'
            )}
          >
            Buy
          </a>
          <a
            onClick={() => {
              setTradeType('sell')
            }}
            className={classNames(
              'ml-2.5 mr-5 text-center flex-grow px-1 py-4 text-base leading-none tracking-tightest whitespace-no-wrap border-b-2 focus:outline-none cursor-pointer',
              tradeType === 'sell'
                ? 'font-semibold text-brand-red border-brand-red focus:text-brand-red focus:border-brand-red'
                : 'font-medium text-brand-gray-2 border-transparent hover:text-gray-700 hover:border-gray-300 focus:text-gray-700 focus:border-gray-300'
            )}
          >
            Sell
          </a>
        </nav>
        <hr className="my-2.5" />

        <p className="mx-5 mt-5 text-sm text-brand-gray-2">
          {tradeType === 'buy' ? 'Pay with' : 'Receive'}
        </p>
        <div className="mx-5">
          <Select
            isClearable={false}
            isSearchable={false}
            onChange={(value) => {
              setSelectedToken(value.token)
            }}
            options={selectTokensValues}
            formatOptionLabel={selectTokensFormat}
            defaultValue={selectTokensValues[0]}
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
        </div>

        <div className="flex flex-row justify-between mx-5 mt-5">
          <p className="text-sm text-brand-gray-2">
            {tradeType === 'buy'
              ? 'Amount of tokens to buy'
              : 'Amount of tokens to sell'}
          </p>
          <p
            className={classNames(
              'text-sm',
              !isIdeaTokenBalanceLoading &&
                ideaTokenBalanceBN.lt(floatToWeb3BN(inputAmount, 18))
                ? 'text-brand-red font-bold'
                : 'text-brand-gray-2'
            )}
          >
            {tradeType === 'buy'
              ? ''
              : 'Available: ' +
                (isIdeaTokenBalanceLoading ? '...' : ideaTokenBalance)}
          </p>
        </div>
        <div className="mx-5">
          <input
            className="w-full px-4 py-2 leading-tight bg-gray-200 border-2 border-gray-200 rounded appearance-none focus:outline-none focus:bg-white focus:border-brand-blue"
            type="number"
            onChange={(event) => {
              setInputAmount(event.target.value)
            }}
          />
        </div>

        <div className="flex flex-row justify-between mx-5 mt-5">
          <p className="text-sm text-brand-gray-2">
            {tradeType === 'buy' ? 'You will pay' : 'You will receive'}
          </p>
          <p
            className={classNames(
              'text-sm',
              !isTokenBalanceLoading && tokenBalanceBN.lt(outputAmountBN)
                ? 'text-brand-red font-bold'
                : 'text-brand-gray-2'
            )}
          >
            {tradeType === 'buy'
              ? 'Available: ' + (isTokenBalanceLoading ? '...' : tokenBalance)
              : ''}
          </p>
        </div>

        <div className="mx-5">
          <input
            className="w-full px-4 py-2 leading-tight bg-gray-200 border-2 border-gray-200 rounded appearance-none focus:outline-none focus:bg-white focus:border-brand-blue"
            type="text"
            disabled={true}
            value={isOutputAmountLoading ? '...' : outputAmount}
          />
        </div>

        <div className="grid grid-cols-3 mx-5 mt-5 text-xs text-brand-gray-2">
          <div className="text-center">
            Platform fee: {market.platformFeeRate}%
          </div>
          <div className="text-center">
            Trading fee: {market.tradingFeeRate}%
          </div>
          <div>
            <select>
              <option>1% max. slippage</option>
              <option>2% max. slippage</option>
              <option>3% max. slippage</option>
              <option>4% max. slippage</option>
              <option>5% max. slippage</option>
            </select>
          </div>
        </div>
      </div>

      <hr className="mt-5" />

      <div className="flex flex-row justify-center mt-5">
        <button
          className={classNames(
            'w-40 h-12 text-base font-medium bg-white border-2 rounded-lg hover:text-white tracking-tightest-2 font-sf-compact-medium',
            tradeType === 'buy'
              ? 'border-brand-green text-brand-green hover:bg-brand-green'
              : 'border-brand-red text-brand-red hover:bg-brand-red'
          )}
        >
          {tradeType === 'buy' ? 'Buy' : 'Sell'}
        </button>
      </div>
    </Modal>
  )
}
