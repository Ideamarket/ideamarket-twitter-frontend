import classNames from 'classnames'
import BigNumber from 'bignumber.js'
import { IdeaMarket, IdeaToken } from 'store/ideaMarketsStore'
import { getMarketSVGBlack } from '../../store/ideaMarketsStore'

import { calculateCurrentPriceBN, web3BNToFloatString } from '../../utils'

const tenPow18 = new BigNumber('10').pow(new BigNumber('18'))

export default function TokenCard({
  token,
  market,
  enabled,
}: {
  token: IdeaToken
  market: IdeaMarket
  enabled: boolean
}) {
  const isLoading = !(token && market)

  return (
    <div
      className={classNames(
        'border-gray-400 rounded text-brand-gray-2 border bg-brand-gray',
        enabled && 'hover:shadow-xl hover:border-very-dark-blue cursor-pointer'
      )}
    >
      <div className="flex justify-center mt-5">
        {isLoading ? (
          <div className="bg-gray-400 rounded-full w-18 h-18 animate animate-pulse"></div>
        ) : (
          <img
            className="rounded-full max-w-18 max-h-18"
            src={token.iconURL}
            alt=""
          />
        )}
      </div>
      <div className="mt-1 text-4xl font-semibold text-center">
        {isLoading ? (
          <div className="w-64 mx-auto bg-gray-400 rounded animate animate-pulse">
            <span className="invisible">A</span>
          </div>
        ) : (
          token.name
        )}
      </div>
      <div className="flex items-center justify-center mt-1 text-xs italic">
        {isLoading ? (
          <div
            className="w-32 mx-auto bg-gray-400 rounded animate animate-pulse"
            style={{ height: '20px' }}
          ></div>
        ) : (
          <>
            <div>on</div>
            <div className="ml-2.5 mr-1">{getMarketSVGBlack(market.name)}</div>
            <div>{market.name}</div>
          </>
        )}
      </div>
      <div className="text-3xl mt-7.5 text-center flex justify-center bg-very-dark-blue py-5 text-gray-300">
        <div>
          {'$' +
            web3BNToFloatString(
              calculateCurrentPriceBN(
                token.rawSupply,
                market.rawBaseCost,
                market.rawPriceRise
              ),
              tenPow18,
              2
            )}
          &nbsp;(
          <span
            className={classNames(
              parseFloat(token.dayChange) < 0
                ? 'text-brand-red'
                : 'text-brand-green'
            )}
          >
            {(parseInt(token.dayChange) >= 0.0 ? '+' : '') + token.dayChange}%
          </span>
          )
        </div>
      </div>
      <div className="mt-5">
        <br />
        <br />
        <br />
      </div>
    </div>
  )
}
