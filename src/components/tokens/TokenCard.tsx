import classNames from 'classnames'
import BigNumber from 'bignumber.js'
import { IdeaMarket, IdeaToken } from 'store/ideaMarketsStore'
import { getMarketSVGBlack } from '../../store/ideaMarketsStore'

import { calculateCurrentPriceBN, web3BNToFloatString } from '../../utils'

const tenPow18 = new BigNumber('10').pow(new BigNumber('18'))

export default function TokenCard({
  token,
  market,
}: {
  token: IdeaToken
  market: IdeaMarket
}) {
  const isLoading = !(token && market)

  return (
    <div className="p-5 border-gray-400 rounded" style={{ borderWidth: '1px' }}>
      <div className="flex justify-center">
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
      <div className="mt-1 text-4xl font-semibold text-center text-brand-gray-2">
        {isLoading ? (
          <div className="w-64 mx-auto bg-gray-400 rounded animate animate-pulse">
            <span className="invisible">A</span>
          </div>
        ) : (
          token.name
        )}
      </div>
      <div className="flex items-center justify-center mt-1 text-xs italic text-brand-gray-2">
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
      <div className="text-3xl mt-7.5 text-center flex justify-center">
        <div className="text-brand-gray-2">
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
            {token.dayChange}%
          </span>
          )
        </div>
      </div>
    </div>
  )
}
