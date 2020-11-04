import classNames from 'classnames'
import BigNumber from 'bignumber.js'
import Star from '../../assets/star.svg'
import StarOn from '../../assets/star-on.svg'
import PreviewPriceChart from 'components/PreviewPriceChart'
import {
  IdeaMarket,
  IdeaToken,
  setIsWatching,
  useIdeaMarketsStore,
} from 'store/ideaMarketsStore'
import { calculateCurrentPriceBN, web3BNToFloatString } from 'utils'

const tenPow18 = new BigNumber('10').pow(new BigNumber('18'))

function getChartData(token: IdeaToken) {
  const currentUnixTs = Date.now() / 1000
  const dayBackUnixTs = currentUnixTs - 86400
  let beginPrice: number
  let endPrice: number
  if (token.dayPricePoints.length === 0) {
    beginPrice = token.latestPricePoint.price
    endPrice = token.latestPricePoint.price
  } else {
    beginPrice = token.dayPricePoints[0].oldPrice
    endPrice = token.dayPricePoints[token.dayPricePoints.length - 1].price
  }

  const chartData = [[dayBackUnixTs, beginPrice]].concat(
    token.dayPricePoints.map((pricePoint) => [
      pricePoint.timestamp,
      pricePoint.price,
    ])
  )
  chartData.push([currentUnixTs, endPrice])
  return chartData
}

export default function TokenRow({
  token,
  market,
  compoundSupplyRate,
  onTradeClicked,
}: {
  token: IdeaToken
  market: IdeaMarket
  compoundSupplyRate: number
  onTradeClicked: (token: IdeaToken, market: IdeaMarket) => void
}) {
  const yearIncome = (
    parseFloat(token.daiInToken) * compoundSupplyRate
  ).toFixed(2)
  const watching = useIdeaMarketsStore((state) => state.watching[token.address])
  const isWatching = watching === true

  return (
    <>
      <tr className="grid grid-cols-3 cursor-pointer md:table-row hover:bg-brand-gray">
        <td className="col-span-3 px-6 py-4 whitespace-no-wrap">
          <div className="flex items-center">
            <div className="flex-shrink-0 w-7.5 h-7.5">
              <img
                className="w-full h-full rounded-full"
                src={token.iconURL}
                alt=""
              />
            </div>
            <div className="ml-4 text-base font-medium leading-5 text-gray-900">
              <a
                href={`${token.url}`}
                target="_blank"
                rel="noreferrer"
                className="hover:underline"
              >
                {token.name}
              </a>
            </div>
            <div className="flex items-center justify-center ml-auto md:hidden">
              <svg
                className="w-7.5 text-brand-blue"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-no-wrap">
          <p className="text-sm font-medium md:hidden tracking-tightest text-brand-gray-4">
            Price
          </p>
          <p className="text-base font-medium leading-4 tracking-tightest-2 text-very-dark-blue">
            $
            {web3BNToFloatString(
              calculateCurrentPriceBN(
                token.rawSupply,
                market.rawBaseCost,
                market.rawPriceRise
              ),
              tenPow18,
              2
            )}
          </p>
        </td>
        <td className="px-6 py-4 whitespace-no-wrap">
          <p className="text-sm font-medium md:hidden tracking-tightest text-brand-gray-4">
            Deposits
          </p>
          <p className="text-base font-medium leading-4 tracking-tightest-2 text-very-dark-blue">
            {parseFloat(token.daiInToken) > 0.0 ? (
              `$` + token.daiInToken
            ) : (
              <>&mdash;</>
            )}
          </p>
        </td>
        <td className="px-6 py-4 whitespace-no-wrap">
          <p className="text-sm font-medium md:hidden tracking-tightest text-brand-gray-4">
            24H Change
          </p>
          <p
            className={classNames(
              'text-base font-medium leading-4 tracking-tightest-2 text-very-dark-blue',
              parseFloat(token.dayChange) >= 0.0
                ? 'text-brand-green'
                : 'text-brand-red'
            )}
          >
            {parseFloat(token.dayChange) >= 0.0 ? '+' : '-'} {token.dayChange}%
          </p>
        </td>
        <td className="px-6 py-4 whitespace-no-wrap">
          <p className="text-sm font-medium md:hidden tracking-tightest text-brand-gray-4">
            24H Volume
          </p>
          <p className="text-base font-medium leading-4 tracking-tightest-2 text-very-dark-blue">
            ${token.dayVolume}
          </p>
        </td>
        <td className="px-6 py-4 whitespace-no-wrap">
          <p className="text-sm font-medium md:hidden tracking-tightest text-brand-gray-4">
            1YR Income
          </p>
          <p className="text-base font-medium leading-4 tracking-tightest-2 text-very-dark-blue">
            ${yearIncome}
          </p>
        </td>

        <td className="col-span-3 row-span-1 row-start-4 px-6 py-4 whitespace-no-wrap col-start-0">
          <PreviewPriceChart chartData={getChartData(token)} />
        </td>
        <td className="hidden px-6 py-4 whitespace-no-wrap md:table-cell">
          <button
            onClick={() => {
              onTradeClicked(token, market)
            }}
            className="w-32 h-10 text-base font-medium bg-white border-2 rounded-lg border-brand-blue text-brand-blue hover:text-white tracking-tightest-2 font-sf-compact-medium hover:bg-brand-blue"
          >
            Trade
          </button>
        </td>
        <td className="px-6 py-4 text-sm leading-5 text-gray-500 whitespace-no-wrap">
          {isWatching ? (
            <StarOn
              className="w-5 cursor-pointer fill-current text-brand-gray-4"
              onClick={() => {
                setIsWatching(token, false)
              }}
            />
          ) : (
            <Star
              className="w-5 cursor-pointer fill-current text-brand-gray-4"
              onClick={() => {
                setIsWatching(token, true)
              }}
            />
          )}
        </td>
      </tr>
    </>
  )
}
