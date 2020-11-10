import classNames from 'classnames'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import BigNumber from 'bignumber.js'
import moment from 'moment'
import { GlobalContext } from '../_app'
import { PriceChart, WatchingStar, TradeInterface } from '../../components'
import { querySupplyRate, queryExchangeRate } from '../../store/compoundStore'
import { useWalletStore } from '../../store/walletStore'
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
  addresses,
} from '../../utils'
import ArrowLeft from '../../assets/arrow-left.svg'

const tenPow18 = new BigNumber('10').pow(new BigNumber('18'))

export default function TokenDetails() {
  const NoSSRWalletModal = dynamic(
    () => import('../../components/WalletModal'),
    {
      ssr: false,
    }
  )

  const { setIsWalletModalOpen } = useContext(GlobalContext)
  const web3 = useWalletStore((state) => state.web3)
  const connectedAddress = useWalletStore((state) => state.address)
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

  const {
    data: compoundExchangeRate,
    isLoading: isCompoundExchangeRateLoading,
  } = useQuery('compound-exchange-rate', queryExchangeRate)

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
    isTokenLoading ||
    isMarketLoading ||
    isCompoundSupplyRateLoading ||
    isCompoundExchangeRateLoading

  // Todo: Invalid token supplied
  if (!token) {
    return <></>
  }

  function makeDetailsEntry(header, content) {
    return (
      <div
        className="text-center rounded-sm"
        style={{ backgroundColor: '#fafafa', border: '1px solid #cbd5e0' }}
      >
        <div className="text-xs text-brand-gray-2">{header}</div>
        <div className="text-xl">{content}</div>
      </div>
    )
  }

  function makeContainerWithHeader(header, content) {
    return (
      <div className="flex flex-col overflow-hidden rounded-md bg-brand-gray">
        <div
          className="flex items-center flex-grow-0 py-1 pl-2.5 text-sm border-gray-400 bg-very-dark-blue text-brand-gray"
          style={{ borderBottomWidth: '1px' }}
        >
          {header}
        </div>
        <div className="flex-grow p-1">{content}</div>
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
          className="relative w-full p-5 mx-auto border-gray-400 bg-brand-gray"
          style={{ borderBottomWidth: '1px' }}
        >
          {isLoading ? (
            <div
              className="mx-auto bg-gray-400 rounded animate animate-pulse"
              style={{ width: '40px', height: '40px' }}
            ></div>
          ) : (
            <img
              className="mx-auto"
              style={{ maxWidth: '40px' }}
              src={token.iconURL}
            />
          )}

          <div className="mt-1 text-3xl font-semibold text-center text-brand-gray-2">
            {isLoading ? (
              <div className="w-64 mx-auto bg-gray-400 rounded animate animate-pulse">
                <span className="invisible">A</span>
              </div>
            ) : (
              token.name.toUpperCase()
            )}
          </div>

          <div className="flex items-center justify-center mt-5 text-sm italic text-brand-gray-2">
            {isLoading ? (
              <div
                className="w-32 mx-auto bg-gray-400 rounded animate animate-pulse"
                style={{ height: '20px' }}
              ></div>
            ) : (
              <>
                <div>on</div>
                <img
                  src="https://youtube.com/favicon.ico"
                  className="ml-2 mr-1"
                  style={{ maxHeight: '20px' }}
                />
                <div>{market.name}</div>
              </>
            )}
          </div>

          <div className="absolute top-0 left-0 flex items-center">
            <ArrowLeft
              className="cursor-pointer"
              onClick={() => {
                router.push('/')
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 mx-5 mt-5 text-black md:grid-cols-2">
          {makeContainerWithHeader(
            'Details',
            <div className="grid h-full grid-cols-3 gap-7">
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
                'Supply',
                isLoading ? (
                  makeDetailsSkeleton()
                ) : parseFloat(token.supply) <= 0.0 ? (
                  <>&mdash;</>
                ) : (
                  `${token.supply}`
                )
              )}

              {makeDetailsEntry(
                '24H Change',
                isLoading ? (
                  makeDetailsSkeleton()
                ) : (
                  <div
                    className={
                      parseFloat(token.dayChange) >= 0.0
                        ? 'text-brand-green'
                        : 'text-brand-red'
                    }
                  >
                    {token.dayChange}%
                  </div>
                )
              )}

              {makeDetailsEntry(
                '24H Volume',
                isLoading ? makeDetailsSkeleton() : `$${token.dayVolume}`
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
                'Listed at',
                isLoading
                  ? makeDetailsSkeleton()
                  : moment(token.listedAt * 1000).format('MMM Do YYYY')
              )}

              {makeDetailsEntry(
                'Holders',
                isLoading ? makeDetailsSkeleton() : token.holders
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
            'Details',
            <div className="flex flex-col h-full">
              <div
                className="grid w-full grid-cols-3 p-5 border-gray-400 gap-7"
                style={{ borderBottomWidth: '1px' }}
              >
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
                  'Supply',
                  isLoading ? (
                    makeDetailsSkeleton()
                  ) : parseFloat(token.supply) <= 0.0 ? (
                    <>&mdash;</>
                  ) : (
                    `${token.supply}`
                  )
                )}

                {makeDetailsEntry(
                  '24H Change',
                  isLoading ? (
                    makeDetailsSkeleton()
                  ) : (
                    <div
                      className={
                        parseFloat(token.dayChange) >= 0.0
                          ? 'text-brand-green'
                          : 'text-brand-red'
                      }
                    >
                      {token.dayChange}%
                    </div>
                  )
                )}

                {makeDetailsEntry(
                  '24H Volume',
                  isLoading ? makeDetailsSkeleton() : `$${token.dayVolume}`
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
                  'Listed at',
                  isLoading
                    ? makeDetailsSkeleton()
                    : moment(token.listedAt * 1000).format('MMM Do YYYY')
                )}

                {makeDetailsEntry(
                  'Holders',
                  isLoading ? makeDetailsSkeleton() : token.holders
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
              <div className="flex-grow mt-5">
                <span className="text-xl">Description</span>
                <div className="mt-2.5 text-sm italic">
                  No description provided by token owner.
                </div>
              </div>
              <div className="text-sm text-gray-500">
                <div
                  className="mb-1 border-gray-400"
                  style={{ borderBottomWidth: '1px' }}
                >
                  Token Owner Options
                </div>
                <div className="text-xs">
                  {isLoading ? (
                    <>
                      <div className="w-full mx-auto bg-gray-400 rounded animate animate-pulse">
                        <div className="invisible">
                          A<br />A
                        </div>
                      </div>
                      <div className="flex justify-center ">
                        <div className="w-20 py-1 mt-1 text-sm font-medium bg-gray-400 border-2 border-gray-400 rounded animate animate-pulse tracking-tightest-2 font-sf-compact-medium">
                          <span className="invisible">A</span>
                        </div>
                      </div>
                    </>
                  ) : token.interestWithdrawer === addresses.ZERO ? (
                    <>
                      <div className="italic">
                        The owner of this token is not yet listed. If this token
                        represents your account you can get listed as owner of
                        this token by verifying access to the account. After
                        successful verification you will be able to withdraw the
                        accumulated interest.
                      </div>
                      <div className="flex justify-center">
                        <button className="w-20 py-1 mt-1 text-sm font-medium bg-white border-2 rounded-lg border-brand-blue text-brand-blue hover:text-white tracking-tightest-2 font-sf-compact-medium hover:bg-brand-blue">
                          Verify
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="italic">
                        {!web3 ||
                        connectedAddress.toLowerCase() !==
                          token.interestWithdrawer.toLowerCase()
                          ? `The owner of this token is listed as ${token.interestWithdrawer.slice(
                              0,
                              8
                            )}...${token.interestWithdrawer.slice(
                              -6
                            )}. This address does not match the wallet you have connected. If you are the owner of this token please connect the correct wallet to be able to withdraw interest.`
                          : 'Your connected wallet is listed as owner of this token. You are able to withdraw the accumulated interest below.'}
                      </div>
                      <div className="italic mt-2.5">
                        Available interest:{' '}
                        {web3BNToFloatString(
                          token.rawInvested
                            .mul(compoundExchangeRate)
                            .sub(token.rawDaiInToken),
                          new BigNumber('10').exponentiatedBy('36'),
                          2
                        )}{' '}
                        DAI
                      </div>
                      <div className="flex justify-center">
                        <button
                          disabled={
                            !web3 ||
                            connectedAddress.toLowerCase() !==
                              token.interestWithdrawer.toLowerCase()
                          }
                          className={classNames(
                            'w-20 py-1 ml-5 text-sm font-medium bg-white border-2 rounded-lg  tracking-tightest-2 font-sf-compact-medium',
                            !web3 ||
                              connectedAddress.toLowerCase() !==
                                token.interestWithdrawer.toLowerCase()
                              ? 'cursor-default'
                              : 'border-brand-blue text-brand-blue hover:text-white hover:bg-brand-blue'
                          )}
                        >
                          Withdraw
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {makeContainerWithHeader(
            'Trade',
            isLoading ? (
              <div
                className="w-full mx-auto bg-gray-400 rounded animate animate-pulse"
                style={{
                  minHeight: '518px',
                  marginTop: '5px',
                  marginBottom: '5px',
                }}
              ></div>
            ) : web3 ? (
              <TradeInterface
                ideaToken={token}
                market={market}
                onTradeSuccessful={() => {}}
                resetOn={false}
              />
            ) : (
              <div
                className="flex items-center justify-center"
                style={{
                  minHeight: '518px',
                }}
              >
                <button
                  onClick={() => {
                    setIsWalletModalOpen(true)
                  }}
                  className="p-2.5 text-base font-medium text-white border-2 rounded-lg border-brand-blue tracking-tightest-2 font-sf-compact-medium bg-brand-blue"
                >
                  Connect wallet to Trade
                </button>
              </div>
            )
          )}
        </div>
      </div>
      <NoSSRWalletModal />
    </div>
  )
}
