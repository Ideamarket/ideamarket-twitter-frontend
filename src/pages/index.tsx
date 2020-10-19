import classNames from 'classnames'

import YouTube from '../assets/youtube.svg'
import Medium from '../assets/medium.svg'
import Twitter from '../assets/twitter.svg'
import Patreon from '../assets/patreon.svg'
import More from '../assets/more.svg'
import Star from '../assets/star.svg'

import WalletStatus from '../components/WalletStatus'

import { useState } from 'react'

export default function Home() {
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
  ]
  const [selectedTabId, setSelectedTabId] = useState(1)

  return (
    <div className="bg-brand-gray max-h-home">
      <div className="w-screen p-5 text-center text-white bg-top-mobile h-158">
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
            <div className="w-20">
              <p className="text-xs text-gray-600">as seen in</p>
              <img src="/coindesk.png" alt="" />
            </div>
            <div className="w-20">
              <img src="/ethereum.png" alt="" />
            </div>
          </div>
          <h2 className="mt-8 text-3xl font-gilroy-bold">
            Cash in on your <span className="text-brand-blue">clout.</span>
          </h2>
          <p className="mt-8 text-lg font-sf-compact-medium">
            Earn passive income from your community's confidence in you.
          </p>
        </div>
        <div className="inline-flex flex-col space-y-3 mt-7">
          <button className="px-4 py-1 text-lg font-bold text-white rounded-lg font-sf-compact-medium bg-brand-blue hover:bg-blue-800">
            Launch Your Token
          </button>
          <p className="text-lg font-sf-compact-medium">How it Works</p>
        </div>
      </div>
      <div className="px-5 transform -translate-y-60 font-sf-compact-medium">
        <div className="grid grid-cols-2">
          <div className="flex items-center p-5 space-x-2.5 text-white border border-t-2 border-l-2 rounded-tl-xlg">
            <div>
              <YouTube className="h-5" />
            </div>
            <p className="text-lg leading-none">YouTube</p>
          </div>
          <div className="flex items-center p-5 space-x-2.5 text-white border border-t-2 border-r-2 rounded-tr-xlg">
            <div>
              <Medium className="h-5" />
            </div>
            <p className="text-lg leading-none">Medium</p>
          </div>
          <div className="flex items-center p-5 space-x-2.5 text-white border border-l-2">
            <div>
              <Twitter className="h-5" />
            </div>
            <p className="text-lg leading-none">Twitter</p>
          </div>
          <div className="flex items-center p-5 space-x-2.5 text-white border border-r-2">
            <div>
              <Patreon className="h-5" />
            </div>
            <p className="text-lg leading-none">Patreon</p>
          </div>
          <div className="flex items-center p-5 space-x-2.5 text-white border border-b-2 border-l-2 border-r-0">
            <div>
              <More className="h-5" />
            </div>
            <p className="text-lg leading-none">More</p>
          </div>
          <div className="border border-b-2 border-l-0 border-r-2"></div>
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
                          : 'font-medium text-brand-gray-2 border-transparent hover:text-gray-700 hover:border-gray-300 focus:text-gray-700 focus:border-gray-300'
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
            <div className="p-5">
              <div className="flex">
                <div className="flex items-center">
                  <div className="w-7.5 h-7.5 rounded-full border"></div>
                  <div className="ml-2.5">
                    <h2 className="text-base font-medium leading-none tracking-tightest-2 text-very-dark-blue font-sf-pro-text">
                      Harvest Finance
                    </h2>
                    <p className="text-sm font-medium tracking-tighter font-sf-pro-text text-brand-gray-2">
                      FARM
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-center ml-auto">
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
              <div className="grid grid-cols-3 gap-5 mt-5 font-sf-pro-text">
                <div>
                  <p className="text-sm font-medium tracking-tightest text-brand-gray-4">
                    Price
                  </p>
                  <p className="text-base font-medium tracking-tightest-2 text-very-dark-blue">
                    $150.25
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium tracking-tightest text-brand-gray-4">
                    Deposits
                  </p>
                  <p className="text-base font-medium tracking-tightest-2 text-very-dark-blue">
                    $506
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium tracking-tightest text-brand-gray-4">
                    24H Change
                  </p>
                  <p className="text-base font-medium tracking-tightest-2 text-very-dark-blue">
                    +35%
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium tracking-tightest text-brand-gray-4">
                    24H Volume
                  </p>
                  <p className="text-base font-medium tracking-tightest-2 text-very-dark-blue">
                    $15,543,667
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium tracking-tightest text-brand-gray-4">
                    1YR Income
                  </p>
                  <p className="text-base font-medium tracking-tightest-2 text-very-dark-blue">
                    $478.55
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium tracking-tightest text-brand-gray-4">
                    Watch
                  </p>
                  <Star className="w-5" />
                </div>
              </div>
            </div>

            <div className="p-5 border-t">
              <div className="flex">
                <div className="flex items-center">
                  <div className="w-7.5 h-7.5 rounded-full border"></div>
                  <div className="ml-2.5">
                    <h2 className="text-base font-medium leading-none tracking-tightest-2 text-very-dark-blue font-sf-pro-text">
                      Chainlink
                    </h2>
                    <p className="text-sm font-medium tracking-tighter font-sf-pro-text text-brand-gray-2">
                      LINK
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-center ml-auto">
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

              <div className="grid grid-cols-3 gap-5 mt-5 font-sf-pro-text">
                <div>
                  <p className="text-sm font-medium tracking-tightest text-brand-gray-4">
                    Price
                  </p>
                  <p className="text-base font-medium tracking-tightest-2 text-very-dark-blue">
                    $150.25
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium tracking-tightest text-brand-gray-4">
                    Deposits
                  </p>
                  <p className="text-base font-medium tracking-tightest-2 text-very-dark-blue">
                    $506
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium tracking-tightest text-brand-gray-4">
                    24H Change
                  </p>
                  <p className="text-base font-medium tracking-tightest-2 text-very-dark-blue">
                    +35%
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium tracking-tightest text-brand-gray-4">
                    24H Volume
                  </p>
                  <p className="text-base font-medium tracking-tightest-2 text-very-dark-blue">
                    $15,543,667
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium tracking-tightest text-brand-gray-4">
                    1YR Income
                  </p>
                  <p className="text-base font-medium tracking-tightest-2 text-very-dark-blue">
                    $478.55
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium tracking-tightest text-brand-gray-4">
                    Watch
                  </p>
                  <Star className="w-5 fill-current text-brand-gray-4" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
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
          <p className="mt-5 text-sm leading-none text-center tracking-tightest-2 text-brand-gray-2">
            &copy;2020 IdeaMarkets
          </p>
        </div>
      </div>
    </div>
  )
}
