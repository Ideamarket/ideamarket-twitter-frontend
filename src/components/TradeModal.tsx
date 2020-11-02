import { useState } from 'react'
import classNames from 'classnames'
import { IdeaToken, IdeaMarket } from '../store/ideaMarketsStore'
import { useTokenListStore, TokenListEntry } from '../store/tokenListStore'
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

  if (!isOpen) {
    return <></>
  }

  return (
    <Modal isOpen={isOpen} setIsOpen={(b) => (isOpen = b)}>
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
          <select className="w-full">
            {tokenList.map((t: TokenListEntry) => (
              <option key={t.address}>{t.name}</option>
            ))}
          </select>
        </div>

        <p className="mx-5 mt-5 text-sm text-brand-gray-2">
          {tradeType === 'buy'
            ? 'Amount of tokens to buy'
            : 'Amount of tokens to sell'}
        </p>
        <div className="mx-5">
          <input
            className="w-full px-4 py-2 leading-tight bg-gray-200 border-2 border-gray-200 rounded appearance-none focus:outline-none focus:bg-white focus:border-brand-blue"
            type="text"
          />
        </div>

        <p className="mx-5 mt-5 text-sm text-brand-gray-2">
          {tradeType === 'buy' ? 'You will pay' : 'You will receive'}
        </p>
        <div className="mx-5">
          <input
            className="w-full px-4 py-2 leading-tight bg-gray-200 border-2 border-gray-200 rounded appearance-none focus:outline-none focus:bg-white focus:border-brand-blue"
            type="text"
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
