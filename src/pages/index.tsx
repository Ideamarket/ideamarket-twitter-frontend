import classNames from 'classnames'
import { useState } from 'react'
import { listToken } from 'actions/listToken'
import { buyToken } from 'actions/buyToken'
import { IdeaMarket, IdeaToken } from 'store/ideaMarketsStore'
import { WalletStatus, Table, TradeModal } from 'components'

import YouTube from '../assets/youtube.svg'
import Medium from '../assets/medium.svg'
import Twitter from '../assets/twitter.svg'
import Patreon from '../assets/patreon.svg'
import More from '../assets/more.svg'
import YouTubeBlack from '../assets/youtube-black.svg'
import MediumBlack from '../assets/medium-black.svg'
import TwitterBlack from '../assets/twitter-black.svg'
import PatreonBlack from '../assets/patreon-black.svg'
import Search from '../assets/search.svg'

export default function Home() {
  async function clicked() {
    buyToken(1, 1, 12)
    /*listToken('google.com', 1)
    listToken('microsoft.com', 1)
    listToken('apple.com', 1)
    listToken('medium.com', 1)
    listToken('hardhat.org', 1)
    listToken('github.com', 1)
    listToken('youtube.com', 1)
    listToken('twitter.com', 1)*/
  }

  const [selectedCategoryId, setSelectedCategoryId] = useState(1)
  const [selectedMarketName, setSelectedMarketName] = useState('TestMarket')
  const [nameSearch, setNameSearch] = useState('')
  const [tradeModalData, setTradeModalData] = useState({
    show: false,
    token: undefined,
    market: undefined,
  })

  const categories = [
    {
      id: 1,
      value: 'All Tokens',
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

  function onOrderByChanged(orderBy: string, direction: string) {
    if (selectedCategoryId === 4) {
      return
    }

    if (orderBy === 'dayChange' && direction === 'desc') {
      setSelectedCategoryId(2)
    } else if (orderBy === 'listedAt' && direction === 'desc') {
      setSelectedCategoryId(3)
    } else {
      setSelectedCategoryId(1)
    }
  }

  function onTradeClicked(token: IdeaToken, market: IdeaMarket) {
    setTradeModalData({ show: true, token: token, market: market })
  }

  return (
    <div className="bg-brand-gray">
      <div className="w-screen p-5 pt-8 text-center text-white bg-top-mobile md:bg-top-desktop h-156.5">
        <div
          className="grid mx-auto auto-cols-max max-w-88 md:max-w-304"
          style={{ gridTemplateColumns: '1fr auto 1fr' }}
        >
          <div className="flex flex-row items-center">
            <img className="w-8" src="/logo.png" alt="Logo" />
            <h2 className="text-3xl leading-none font-gilroy-bold">
              IdeaMarkets
            </h2>
          </div>
          <nav className="hidden md:block">
            <ul className="flex justify-center font-sf-compact-medium">
              <li className="mr-10 text-lg tracking-tighter cursor-pointer">
                Overview
              </li>
              <li className="mr-10 text-lg tracking-normal cursor-pointer text-brand-gray text-opacity-60">
                My Tokens
              </li>
              <li className="mr-10 text-lg tracking-normal cursor-pointer text-brand-gray text-opacity-60">
                My Wallet
              </li>
              <li className="mr-5 text-lg tracking-normal cursor-pointer text-brand-gray text-opacity-60">
                Launch Token
              </li>
            </ul>
          </nav>
          <WalletStatus />
          <svg
            className="w-6 h-6 ml-auto md:opacity-0"
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
        <div className="mt-20">
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
            className="px-4 py-1 text-lg font-bold text-white rounded-lg md:px-5 font-sf-compact-medium bg-brand-blue hover:bg-blue-800"
          >
            Launch Your Token
          </button>
          <p className="text-lg font-sf-compact-medium">How it Works</p>
        </div>
      </div>

      <div className="px-2 mx-auto transform md:px-4 max-w-88 md:max-w-304 -translate-y-60 md:-translate-y-28 font-sf-compact-medium">
        <div className="grid grid-cols-2 md:grid-cols-5">
          <div
            className={classNames(
              'cursor-pointer flex md:justify-center items-center p-5 space-x-2.5 text-white rounded-tl-xlg border-2 md:border-b-0',
              selectedMarketName === 'TestMarket' &&
                'bg-white text-very-dark-blue'
            )}
            onClick={() => {
              setSelectedMarketName('TestMarket')
            }}
          >
            <div>
              {selectedMarketName === 'TestMarket' ? (
                <YouTubeBlack className="h-5" />
              ) : (
                <YouTube className="h-5" />
              )}
            </div>
            <p className="text-lg leading-none">YouTube</p>
          </div>
          <div
            className={classNames(
              'cursor-pointer flex md:justify-center items-center p-5 space-x-2.5 text-white rounded-tr-xlg md:rounded-none border-2 border-l-0 md:border-b-0',
              selectedMarketName === 'Medium' && 'bg-white text-very-dark-blue'
            )}
            onClick={() => {
              setSelectedMarketName('Medium')
            }}
          >
            <div>
              {selectedMarketName === 'Medium' ? (
                <MediumBlack className="h-5" />
              ) : (
                <Medium className="h-5" />
              )}
            </div>
            <p className="text-lg leading-none">Medium</p>
          </div>
          <div
            className={classNames(
              'cursor-pointer flex md:justify-center items-center p-5 space-x-2.5 text-white border-2 border-t-0 md:border-t-2 md:border-l-0 md:border-r-2 md:border-b-0',
              selectedMarketName === 'Twitter' && 'bg-white text-very-dark-blue'
            )}
            onClick={() => {
              setSelectedMarketName('Twitter')
            }}
          >
            <div>
              {selectedMarketName === 'Twitter' ? (
                <TwitterBlack className="h-5" />
              ) : (
                <Twitter className="h-5" />
              )}
            </div>
            <p className="text-lg leading-none">Twitter</p>
          </div>
          <div
            className={classNames(
              'cursor-pointer flex md:justify-center items-center p-5 space-x-2.5 text-white border-2 border-l-0 border-t-0 md:border-t-2 md:border-l-0 md:border-r-2 md:border-b-0 ',
              selectedMarketName === 'Patreon' && 'bg-white text-very-dark-blue'
            )}
            onClick={() => {
              setSelectedMarketName('Patreon')
            }}
          >
            <div>
              {selectedMarketName === 'Patreon' ? (
                <PatreonBlack className="h-5" />
              ) : (
                <Patreon className="h-5" />
              )}
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
          <div className="flex pl-5 border-b md:pl-10 border-brand-gray-3">
            <div>
              <div className="font-sf-pro-text">
                <nav className="flex -mb-px space-x-5">
                  {categories.map((cat) => (
                    <a
                      onClick={() => setSelectedCategoryId(cat.id)}
                      key={cat.id}
                      className={classNames(
                        'px-1 py-4 text-base leading-none tracking-tightest whitespace-no-wrap border-b-2 focus:outline-none cursor-pointer',
                        cat.id === selectedCategoryId
                          ? 'font-semibold text-very-dark-blue border-very-dark-blue focus:text-very-dark-blue-3 focus:border-very-dark-blue-2'
                          : 'font-medium text-brand-gray-2 border-transparent hover:text-gray-700 hover:border-gray-300 focus:text-gray-700 focus:border-gray-300',
                        cat.id === 4 && 'hidden md:block'
                      )}
                    >
                      {cat.value}
                    </a>
                  ))}
                </nav>
              </div>
            </div>
            <div className="hidden w-2/5 ml-auto md:block">
              <label htmlFor="search-input" className="sr-only">
                Search
              </label>
              <div className="relative h-full rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="w-4 h-4 text-gray-400" />
                </div>
                <input
                  id="search-input"
                  className="block w-full h-full pl-10 border-0 border-l rounded-none form-input sm:text-sm sm:leading-5"
                  placeholder="Search"
                  onChange={(event) => {
                    setNameSearch(
                      event.target.value.length >= 2 ? event.target.value : ''
                    )
                  }}
                />
              </div>
            </div>
          </div>
          <Table
            nameSearch={nameSearch}
            selectedMarketName={selectedMarketName}
            selectedCategoryId={selectedCategoryId}
            onOrderByChanged={onOrderByChanged}
            onTradeClicked={onTradeClicked}
          />
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
      <TradeModal
        isOpen={tradeModalData.show}
        setIsOpen={() => {}}
        token={tradeModalData.token}
        market={tradeModalData.market}
      />
    </div>
  )
}
