import classNames from 'classnames'
import { useState } from 'react'
import { listToken } from '../actions/listToken'
import BigNumber from 'bignumber.js'

import { WalletStatus, PriceChart } from '../components'

import YouTube from '../assets/youtube.svg'
import Medium from '../assets/medium.svg'
import Twitter from '../assets/twitter.svg'
import Patreon from '../assets/patreon.svg'
import More from '../assets/more.svg'
import Star from '../assets/star.svg'
import StarOn from '../assets/star-on.svg'

import { web3BNToFloatString, calculateCurrentPriceBN } from '../util'
import { useCompoundStore } from '../store/compoundStore'
import {
  useIdeaMarketsStore,
  setIsWatching,
  IdeaToken,
  IdeaMarket,
} from '../store/ideaMarketsStore'

const tenPow18 = new BigNumber('10').pow(new BigNumber('18'))

export function TokenRow({
  token,
  market,
  hideInMobile = false,
}: {
  token: IdeaToken
  market: IdeaMarket
  hideInMobile?: boolean
}) {
  const yearIncome = (
    parseFloat(token.daiInToken) *
    parseFloat(useCompoundStore((state) => state.supplyRate))
  ).toFixed(2)

  return (
    <div
      className={classNames(
        'flex flex-col p-5 space-x-2 md:flex-row md:items-center border-b overflow-x-scroll md:h-18 md:overflow-y-hidden',
        hideInMobile && 'hidden md:flex'
      )}
    >
      <div className="flex md:w-48">
        <div className="flex items-center">
          <div className="w-7.5 h-7.5 rounded-full border overflow-hidden">
            <img src={`${token.iconURL}`} />
          </div>
          <div className="ml-2.5">
            <h2 className="text-base font-medium leading-none tracking-tightest-2 text-very-dark-blue font-sf-pro-text">
              {token.name}
            </h2>
          </div>
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
      <div className="grid grid-cols-3 gap-5 mt-5 md:mt-0 md:grid-cols-8 md:place-items-center font-sf-pro-text">
        <div className="md:w-20">
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
        </div>
        <div className="md:w-20">
          <p className="text-sm font-medium md:hidden tracking-tightest text-brand-gray-4">
            Deposits
          </p>
          <p className="text-base font-medium leading-4 tracking-tightest-2 text-very-dark-blue">
            {parseFloat(token.daiInToken) > 0.0 ? (
              token.daiInToken
            ) : (
              <>&mdash;</>
            )}
          </p>
        </div>
        <div className="md:w-20">
          <p className="text-sm font-medium md:hidden tracking-tightest text-brand-gray-4">
            24H Change
          </p>
          <p
            className={classNames(
              'text-base leading-4  font-medium tracking-tightest-2 text-very-dark-blue',
              parseFloat(token.dayChange) >= 0.0
                ? 'text-brand-green'
                : 'text-brand-red'
            )}
          >
            {parseFloat(token.dayChange) >= 0.0 ? '+' : '-'} {token.dayChange}%
          </p>
        </div>
        <div className="md:w-20">
          <p className="text-sm font-medium md:hidden tracking-tightest text-brand-gray-4">
            24H Volume
          </p>
          <p className="text-base font-medium leading-4 tracking-tightest-2 text-very-dark-blue">
            ${token.dayVolume}
          </p>
        </div>
        <div className="md:w-20">
          <p className="text-sm font-medium md:hidden tracking-tightest text-brand-gray-4">
            1YR Income
          </p>
          <p className="text-base font-medium leading-4 tracking-tightest-2 text-very-dark-blue">
            ${yearIncome}
          </p>
        </div>
        <div className="md:w-20 md:col-start-8 md:col-span-1 md:row-start-1 md:row-span-1 md:ml-10">
          <p className="text-sm font-medium md:hidden tracking-tightest text-brand-gray-4">
            Watch
          </p>
          {token.isWatching ? (
            <StarOn
              className="w-5 cursor-pointer fill-current text-brand-gray-4"
              onClick={() => {
                setIsWatching(market.marketID, token.tokenID, false)
              }}
            />
          ) : (
            <Star
              className="w-5 cursor-pointer fill-current text-brand-gray-4"
              onClick={() => {
                setIsWatching(market.marketID, token.tokenID, true)
              }}
            />
          )}
        </div>
        <div className="md:-ml-10 md:mr-2">
          <p className="text-sm font-medium md:hidden tracking-tightest text-brand-gray-4">
            Price Chart
          </p>
          <div>
            <PriceChart />
          </div>
        </div>
        <div className="hidden md:block">
          <p className="text-sm font-medium md:hidden tracking-tightest text-brand-gray-4">
            Trade
          </p>
          <button className="w-32 h-10 text-base font-medium text-white rounded-lg tracking-tightest-2 font-sf-compact-medium bg-brand-blue hover:bg-blue-800">
            Trade
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  async function clicked() {
    await listToken('medium.com', 1)
  }

  const TOKENS_PER_PAGE = 10

  const [selectedTabId, setSelectedTabId] = useState(1)
  const [currentPage, setCurrentPage] = useState(0)
  const [selectedMarketID, setSelectedMarketID] = useState(1)

  const selectedMarket = useIdeaMarketsStore(
    (state) => state.markets[selectedMarketID]
  )
  const tokensInSelectedMarket = useIdeaMarketsStore(
    (state) => state.tokens[selectedMarketID]
  )

  const currentTokens = !tokensInSelectedMarket
    ? []
    : Object.values(tokensInSelectedMarket).slice(
        currentPage * TOKENS_PER_PAGE,
        (currentPage + 1) * TOKENS_PER_PAGE - 1
      )

  const tabs = [
    {
      id: 1,
      value: 'Top Tokens',
    },
    {
      id: 2,
      value: 'Trending',
    },
    {
      id: 3,
      value: 'New Listings',
    },
    {
      id: 4,
      value: 'Watch List',
    },
  ]

  return (
    <div className="bg-brand-gray max-h-home">
      <div className="w-screen p-5 text-center text-white bg-top-mobile md:bg-top-desktop h-156.5">
        <div className="flex items-center">
          <img className="w-8" src="/logo.png" alt="Logo" />
          <h2 className="text-xl leading-none font-gilroy-bold">IdeaMarkets</h2>
          <WalletStatus />
          <svg
            className="w-6 h-6 ml-auto"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </div>
        <div className="mt-8">
          <div className="flex items-center justify-center space-x-5">
            <div className="w-20 md:w-36">
              <p className="text-xs text-gray-600">as seen in</p>
              <img src="/coindesk.png" alt="" />
            </div>
            <div className="w-20 md:w-36">
              <img src="/ethereum.png" alt="" />
            </div>
          </div>
          <h2 className="mt-8 md:mt-18 text-3xl md:text-6+xl font-gilroy-bold">
            Cash in on your <span className="text-brand-blue">clout.</span>
          </h2>
          <p className="mt-8 text-lg md:text-2xl font-sf-compact-medium">
            Earn passive income from your community's confidence in you.
          </p>
        </div>
        <div className="inline-flex flex-col space-y-3 md:flex-row md:space-x-10 md:space-y-0 md:items-center mt-7">
          <button
            onClick={clicked}
            className="px-4 py-1 text-lg font-bold text-white rounded-lg md:px-3 md:px-5 font-sf-compact-medium bg-brand-blue hover:bg-blue-800"
          >
            Launch Your Token
          </button>
          <p className="text-lg font-sf-compact-medium">How it Works</p>
        </div>
      </div>

      <div className="px-2 mx-auto transform md:px-4 max-w-88 md:max-w-304 -translate-y-60 md:-translate-y-28 font-sf-compact-medium">
        <div className="grid grid-cols-2 md:grid-cols-5">
          <div className="flex md:justify-center items-center p-5 space-x-2.5 text-white rounded-tl-xlg border-2 md:border-b-0">
            <div>
              <YouTube className="h-5" />
            </div>
            <p className="text-lg leading-none">YouTube</p>
          </div>
          <div className="flex md:justify-center items-center p-5 space-x-2.5 text-white rounded-tr-xlg md:rounded-none border-2 border-l-0 md:border-b-0">
            <div>
              <Medium className="h-5" />
            </div>
            <p className="text-lg leading-none">Medium</p>
          </div>
          <div className="flex md:justify-center items-center p-5 space-x-2.5 text-white border-2 border-t-0 md:border-t-2 md:border-l-0 md:border-r-2 md:border-b-0">
            <div>
              <Twitter className="h-5" />
            </div>
            <p className="text-lg leading-none">Twitter</p>
          </div>
          <div className="flex md:justify-center items-center p-5 space-x-2.5 text-white border-2 border-l-0 border-t-0 md:border-t-2 md:border-l-0 md:border-r-2 md:border-b-0">
            <div>
              <Patreon className="h-5" />
            </div>
            <p className="text-lg leading-none">Patreon</p>
          </div>
          <div className="flex md:justify-center items-center p-5 space-x-2.5 text-white border-l-2 md:border-t-2 md:border-l-0 md:border-r-2 md:border-b-0 md:rounded-tr-xlg">
            <div>
              <More className="h-5" />
            </div>
            <p className="text-lg leading-none">More</p>
          </div>
          <div className="border-r-2 md:hidden"></div>
        </div>
        <div className="bg-white border border-brand-gray-3 rounded-b-xlg shadow-home">
          <div className="px-5 border-b border-brand-gray-3">
            <div>
              <div className="font-sf-pro-text">
                <nav className="flex -mb-px space-x-5">
                  {tabs.map((tab) => (
                    <a
                      onClick={() => setSelectedTabId(tab.id)}
                      key={tab.id}
                      className={classNames(
                        'px-1 py-4 text-base leading-none tracking-tightest whitespace-no-wrap border-b-2 focus:outline-none',
                        tab.id === selectedTabId
                          ? 'font-semibold text-very-dark-blue border-very-dark-blue focus:text-very-dark-blue-3 focus:border-very-dark-blue-2'
                          : 'font-medium text-brand-gray-2 border-transparent hover:text-gray-700 hover:border-gray-300 focus:text-gray-700 focus:border-gray-300',
                        tab.id === 4 && 'hidden md:block'
                      )}
                    >
                      {tab.value}
                    </a>
                  ))}
                </nav>
              </div>
            </div>
          </div>
          <div>
            <div className="hidden md:flex md:px-10 md:py-5 md:border-b md:space-x-10">
              <div className="text-sm font-medium leading-none font-sf-pro-text text-brand-gray-4 tracking-tightest md:w-43">
                Name
              </div>
              <div className="text-sm font-medium leading-none font-sf-pro-text text-brand-gray-4 tracking-tightest md:w-30">
                Price
              </div>
              <div className="text-sm font-medium leading-none font-sf-pro-text text-brand-gray-4 tracking-tightest md:w-30">
                Deposits
              </div>
              <div className="text-sm font-medium leading-none font-sf-pro-text text-brand-gray-4 tracking-tightest md:w-30">
                24H Change
              </div>
              <div className="text-sm font-medium leading-none font-sf-pro-text text-brand-gray-4 tracking-tightest md:w-30">
                24H Volume
              </div>
              <div className="text-sm font-medium leading-none font-sf-pro-text text-brand-gray-4 tracking-tightest md:w-30">
                1YR Income
              </div>
              <div className="text-sm font-medium leading-none font-sf-pro-text text-brand-gray-4 tracking-tightest md:w-30">
                Price Chart
              </div>
              <div className="text-sm font-medium leading-none font-sf-pro-text text-brand-gray-4 tracking-tightest md:w-36">
                Trade
              </div>
              <div className="text-sm font-medium leading-none font-sf-pro-text text-brand-gray-4 tracking-tightest md:w-30">
                Watch
              </div>
            </div>
            {currentTokens.map((token: IdeaToken, index: number) => (
              <TokenRow
                key={token.tokenID}
                hideInMobile={index > 1}
                token={token}
                market={selectedMarket}
              />
            ))}
          </div>
        </div>

        <div className="md:flex">
          <div className="flex justify-center mt-10 space-x-5 font-sf-pro-text">
            <p className="text-sm leading-none tracking-tightest-2 text-brand-gray-2">
              Need Help?
            </p>
            <p className="text-sm leading-none tracking-tightest-2 text-brand-gray-2">
              Contact
            </p>
            <p className="text-sm leading-none tracking-tightest-2 text-brand-gray-2">
              Legal &amp; Privacy
            </p>
          </div>
          <p className="mt-5 text-sm leading-none text-center md:ml-auto md:mt-10 tracking-tightest-2 text-brand-gray-2">
            &copy;2020 IdeaMarkets
          </p>
        </div>
      </div>
    </div>
  )
}
