import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import BigNumber from 'bignumber.js'
import { PriceChart, WatchingStar, TradeInterface } from '../../components'
import { querySupplyRate } from '../../store/compoundStore'
import {
  querySingleToken,
  queryTokenChartData,
  queryMarketFromTokenAddress,
} from '../../store/ideaMarketsStore'
import {
  toChecksumedAddress,
  isAddress,
  calculateCurrentPriceBN,
  web3BNToFloatString,
} from '../../utils'

const tenPow18 = new BigNumber('10').pow(new BigNumber('18'))

export default function TokenDetails() {
  const router = useRouter()
  const address = isAddress(router.query.address as string)
    ? toChecksumedAddress(router.query.address as string)
    : undefined

  const { data: market, isLoading: isMarketLoading } = useQuery(
    [`market-${address}`, address],
    queryMarketFromTokenAddress
  )

  const { data: token, isLoading: isTokenLoading } = useQuery(
    [`token-${address}`, address],
    querySingleToken
  )

  const [chartFromTs, setChartFromTs] = useState(
    Math.floor(Date.now() / 1000) - 604800
  )
  const { data: rawChartData, isLoading: isRawChartDataLoading } = useQuery(
    [`chartData-${address}`, address, chartFromTs],
    queryTokenChartData
  )
  const [chartData, setChartData] = useState([])

  const {
    data: compoundSupplyRate,
    isLoading: isCompoundSupplyRateLoading,
  } = useQuery('compound-supply-rate', querySupplyRate)

  useEffect(() => {
    const currentTs = Math.floor(Date.now() / 1000)
    let beginPrice: number
    let endPrice: number

    if (!rawChartData) {
      return
    } else if (rawChartData.pricePoints.length === 0) {
      beginPrice = rawChartData.latestPricePoint.price
      endPrice = rawChartData.latestPricePoint.price
    } else {
      beginPrice = rawChartData.pricePoints[0].oldPrice
      endPrice =
        rawChartData.pricePoints[rawChartData.pricePoints.length - 1].price
    }

    const finalChartData = [[chartFromTs, beginPrice]].concat(
      rawChartData.pricePoints.map((pricePoint) => [
        pricePoint.timestamp,
        pricePoint.price,
      ])
    )
    finalChartData.push([currentTs, endPrice])
    setChartData(finalChartData)
  }, [rawChartData])

  const isLoading =
    isTokenLoading || isMarketLoading || isCompoundSupplyRateLoading

  // Todo: Invalid token supplied
  if (!token) {
    return <></>
  }

  function makeDetailsEntry(header, content) {
    return (
      <div className="text-center">
        <div className="text-xs text-brand-gray-2">{header}</div>
        <div className="text-xl">{content}</div>
      </div>
    )
  }

  function makeContainerWithHeader(header, content) {
    return (
      <div className="overflow-hidden rounded-md bg-brand-gray">
        <div
          className="flex items-center py-1 pl-1 text-sm border-gray-400 bg-very-dark-blue text-brand-gray"
          style={{ borderBottomWidth: '1px' }}
        >
          {header}
        </div>
        <div className="p-1">{content}</div>
      </div>
    )
  }

  function makeDetailsSkeleton() {
    return (
      <div className="mx-auto bg-gray-400 rounded w-15 animate animate-pulse">
        <span className="invisible">A</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-brand-gray">
      <div
        className="min-h-screen mx-auto bg-white border-gray-400"
        style={{
          maxWidth: '1500px',
          borderLeftWidth: '1px',
          borderRightWidth: '1px',
        }}
      >
        <div
          className="flex flex-row items-center pl-5 bg-gray-200 border-gray-400 h-15"
          style={{ borderBottomWidth: '1px' }}
        >
          <img src={token.iconURL} />
          <a
            className="ml-2.5 text-2xl text-brand-gray-4"
            href={token.url}
            target="_blank"
          >
            {token.name}
          </a>
        </div>

        <div className="grid grid-cols-1 gap-5 mx-5 mt-5 text-black md:grid-cols-2">
          {makeContainerWithHeader(
            'Details',
            <div className="grid grid-cols-3 gap-7">
              {makeDetailsEntry(
                'Price',
                isLoading
                  ? makeDetailsSkeleton()
                  : '$' +
                      web3BNToFloatString(
                        calculateCurrentPriceBN(
                          token.rawSupply,
                          market.rawBaseCost,
                          market.rawPriceRise
                        ),
                        tenPow18,
                        2
                      )
              )}

              {makeDetailsEntry(
                'Deposits',
                isLoading ? (
                  makeDetailsSkeleton()
                ) : parseFloat(token.daiInToken) <= 0.0 ? (
                  <>&mdash;</>
                ) : (
                  `$${token.daiInToken}`
                )
              )}

              {makeDetailsEntry(
                '1YR Income',
                isLoading
                  ? makeDetailsSkeleton()
                  : `$${(
                      parseFloat(token.daiInToken) * compoundSupplyRate
                    ).toFixed(2)}`
              )}

              {makeDetailsEntry(
                '24H Change',
                isLoading ? makeDetailsSkeleton() : token.dayChange
              )}

              {makeDetailsEntry(
                '24H Volume',
                isLoading ? makeDetailsSkeleton() : token.dayVolume
              )}

              {makeDetailsEntry(
                'Watch',
                isLoading ? (
                  makeDetailsSkeleton()
                ) : (
                  <div className="flex justify-center mt-1">
                    <WatchingStar token={token} />
                  </div>
                )
              )}
            </div>
          )}

          {makeContainerWithHeader(
            'Chart',
            isLoading ? (
              <div
                className="w-full mx-auto bg-gray-400 rounded animate animate-pulse"
                style={{
                  minHeight: '190px',
                  marginTop: '5px',
                  marginBottom: '5px',
                }}
              ></div>
            ) : (
              <div style={{ minHeight: '200px' }}>
                <PriceChart chartData={chartData} />
              </div>
            )
          )}

          {makeContainerWithHeader(
            'Trade',
            isLoading ? (
              ''
            ) : (
              <TradeInterface
                ideaToken={token}
                market={market}
                onTradeSuccessful={() => {}}
                resetOn={false}
              />
            )
          )}
        </div>
      </div>
    </div>
  )
}
