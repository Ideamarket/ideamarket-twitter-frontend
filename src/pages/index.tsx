import classNames from 'classnames'
import { useContext, useState } from 'react'
import { IdeaMarket, IdeaToken } from 'store/ideaMarketsStore'
import { Table, TradeModal, ListTokenModal, Footer } from 'components'
import dynamic from 'next/dynamic'

import Twitter from '../assets/twitter.svg'
import TwitterBlack from '../assets/twitter-black.svg'
import Search from '../assets/search.svg'
import { GlobalContext } from './_app'
import { useWalletStore } from 'store/walletStore'

export default function Home() {
  const NoSSRWalletModal = dynamic(() => import('../components/WalletModal'), {
    ssr: false,
  })

  const [selectedCategoryId, setSelectedCategoryId] = useState(1)
  const [selectedMarketName, setSelectedMarketName] = useState('Twitter')
  const [nameSearch, setNameSearch] = useState('')
  const {
    setIsWalletModalOpen,
    setOnWalletConnectedCallback,
    isListTokenModalOpen,
    setIsListTokenModalOpen,
  } = useContext(GlobalContext)
  const [tradeModalData, setTradeModalData] = useState({
    show: false,
    token: undefined,
    market: undefined,
  })

  const categories = [
    {
      id: 1,
      value: 'All Tokens',
      mobileValue: 'All',
    },
    {
      id: 2,
      value: 'Trending',
      mobileValue: 'Hot',
    },
    {
      id: 3,
      value: 'New Listings',
      mobileValue: 'New',
    },
    {
      id: 4,
      value: 'Watch List',
      mobileValue: 'Watch',
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
    if (!useWalletStore.getState().web3) {
      setOnWalletConnectedCallback(() => () => {
        setTradeModalData({ show: true, token: token, market: market })
      })
      setIsWalletModalOpen(true)
    } else {
      setTradeModalData({ show: true, token: token, market: market })
    }
  }

  function onListTokenClicked() {
    if (!useWalletStore.getState().web3) {
      setOnWalletConnectedCallback(() => () => {
        setIsListTokenModalOpen(true)
      })
      setIsWalletModalOpen(true)
    } else {
      setIsListTokenModalOpen(true)
    }
  }

  return (
    <div className="overflow-x-hidden bg-brand-gray">
      <div className="w-screen px-6 pt-12 md:pt-10 pb-5 text-center text-white bg-top-mobile md:bg-top-desktop h-156.5 md:h-140">
        <div>
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
        <button
          onClick={() => {
            onListTokenClicked()
          }}
          className="mx-auto mt-7 py-2 text-lg font-bold text-white rounded-lg md:px-5 font-sf-compact-medium bg-brand-blue hover:bg-blue-800"
        >
          Launch Your Token
        </button>
      </div>

      <div className="px-2 mx-auto transform md:px-4 max-w-88 md:max-w-304 -translate-y-60 md:-translate-y-28 font-sf-compact-medium">
        <div className="grid grid-cols-1 md:grid-cols-5">
          <div
            className={classNames(
              'cursor-pointer flex md:justify-center items-center p-5 space-x-2.5 text-white rounded-tl-xlg rounded-tr-xlg md:rounded-tr-none border-2 md:border-r-0 md:border-b-0',
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
              'hidden md:flex md:justify-center items-center p-5 space-x-2.5 text-white rounded-tr-xlg md:rounded-none border-2 border-l-0 md:border-b-0',
              selectedMarketName === 'Medium' && 'bg-white text-very-dark-blue'
            )}
          ></div>
          <div
            className={classNames(
              'hidden md:flex md:justify-center items-center p-5 space-x-2.5 text-white border-2 border-t-0 md:border-t-2 md:border-l-0 md:border-r-2 md:border-b-0',
              selectedMarketName === 'Youtube' && 'bg-white text-very-dark-blue'
            )}
          ></div>
          <div
            className={classNames(
              'hidden md:flex md:justify-center items-center p-5 space-x-2.5 text-white border-2 border-l-0 border-t-0 md:border-t-2 md:border-l-0 md:border-r-2 md:border-b-0 ',
              selectedMarketName === 'Patreon' && 'bg-white text-very-dark-blue'
            )}
          ></div>
          <div className="hidden md:flex md:justify-center items-center p-5 space-x-2.5 text-white border-l-2 md:border-t-2 md:border-l-0 md:border-r-2 md:border-b-0 md:rounded-tr-xlg"></div>
          <div className="border-r-2 md:hidden"></div>
        </div>
        <div className="bg-white border border-brand-gray-3 rounded-b-xlg shadow-home">
          <div className="flex flex-col border-b md:flex-row border-brand-gray-3">
            <div className="px-4 md:px-10">
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
                          : 'font-medium text-brand-gray-2 border-transparent hover:text-gray-700 hover:border-gray-300 focus:text-gray-700 focus:border-gray-300'
                      )}
                    >
                      <span className="hidden md:inline">{cat.value}</span>
                      <span className="md:hidden">{cat.mobileValue}</span>
                    </a>
                  ))}
                </nav>
              </div>
            </div>
            <div className="w-full mt-2 ml-auto md:mt-0 md:w-2/5 md:block">
              <label htmlFor="search-input" className="sr-only">
                Search
              </label>
              <div className="relative h-full rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="w-4 h-4 text-gray-400" />
                </div>
                <input
                  id="search-input"
                  className="block w-full h-full pl-10 border-0 rounded-none md:border-l form-input sm:text-sm sm:leading-5"
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

        <Footer />
      </div>
      <TradeModal
        isOpen={tradeModalData.show}
        setIsOpen={() => setTradeModalData({ ...tradeModalData, show: false })}
        ideaToken={tradeModalData.token}
        market={tradeModalData.market}
      />
      <NoSSRWalletModal />
      <ListTokenModal
        isOpen={isListTokenModalOpen}
        setIsOpen={setIsListTokenModalOpen}
      />
    </div>
  )
}
