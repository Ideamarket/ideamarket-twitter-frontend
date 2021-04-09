import classNames from 'classnames'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import ReactTimeAgo from 'react-time-ago'
import { Transition } from '@headlessui/react'
import {
  IdeaToken,
  MutualHoldersData,
  queryMutualHoldersOfToken,
} from 'store/ideaMarketsStore'
import { getMarketSpecificsByMarketName } from 'store/markets'
import WatchingStar from './WatchingStar'
import A from './A'

function DetailsView({
  isOpen,
  setIsOpen,
  token,
}: {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  token: IdeaToken
}) {
  const marketSpecifics = getMarketSpecificsByMarketName(token.marketName)
  if (!isOpen) {
    return <></>
  }
  return (
    <>
      <section
        className="fixed inset-0 z-20 overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        <div className="absolute inset-0 overflow-hidden">
          <Transition
            className="absolute inset-0 transition-opacity bg-gray-500 bg-opacity-75"
            show={isOpen}
            aria-hidden="true"
            enter="ease-in-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
            <Transition
              show={isOpen}
              className="relative w-96"
              enter="transform transition ease-in-out duration-500 sm:duration-700"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-500 sm:duration-700"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <Transition
                show={isOpen}
                className="absolute top-0 left-0 flex pt-4 pr-2 -ml-8 sm:-ml-10 sm:pr-4"
                enter="ease-in-out duration-500"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in-out duration-500"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <button
                  className="text-gray-300 rounded-md hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="sr-only">Close panel</span>
                  <svg
                    className="w-6 h-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </Transition>
              {isOpen && (
                <div className="h-full p-8 overflow-y-auto bg-white">
                  <div className="pb-16 space-y-6">
                    <div>
                      <div className="block w-full overflow-hidden rounded-lg aspect-w-10 aspect-h-7">
                        <img
                          src={`https://unavatar.backend.ideamarket.io/${marketSpecifics.getMarketNameURLRepresentation()}/${marketSpecifics.getTokenNameURLRepresentation(
                            token.name
                          )}`}
                          alt=""
                          className="object-contain"
                        />
                      </div>
                      <div className="flex items-start justify-between mt-4">
                        <div>
                          <h2 className="text-lg font-medium text-gray-900">
                            <span className="sr-only">Details for </span>
                            {token.name}
                          </h2>
                          <p className="text-sm font-medium text-gray-500">
                            Rank {token.rank}
                          </p>
                        </div>
                        <button
                          type="button"
                          className="flex items-center justify-center w-8 h-8 ml-4 text-gray-400 bg-white rounded-full hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <WatchingStar token={token} />
                        </button>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Information</h3>
                      <dl className="mt-2 border-t border-b border-gray-200 divide-y divide-gray-200">
                        <div className="flex justify-between py-3 text-sm font-medium">
                          <dt className="text-gray-500">Price</dt>
                          <dd className="text-gray-900">
                            ${token.latestPricePoint.price.toFixed(2)}
                          </dd>
                        </div>
                        <div className="flex justify-between py-3 text-sm font-medium">
                          <dt className="text-gray-500">Deposits</dt>
                          <dd className="text-gray-900">${token.marketCap}</dd>
                        </div>
                        <div className="flex justify-between py-3 text-sm font-medium">
                          <dt className="text-gray-500">Percentage locked</dt>
                          <dd className="text-gray-900">
                            {token.lockedPercentage}%
                          </dd>
                        </div>
                        <div className="flex justify-between py-3 text-sm font-medium">
                          <dt className="text-gray-500">24H change</dt>
                          <dd className="text-gray-900">{token.dayChange}</dd>
                        </div>
                      </dl>
                    </div>
                    <div className="flex">
                      <A
                        href={`/i/${marketSpecifics.getMarketNameURLRepresentation()}/${marketSpecifics.getTokenNameURLRepresentation(
                          token.name
                        )}`}
                        className="flex-1 px-4 py-2 text-sm font-medium text-center text-white border border-transparent rounded-md shadow-sm bg-brand-blue hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        View Listing
                      </A>
                    </div>
                  </div>
                </div>
              )}
            </Transition>
          </div>
        </div>
      </section>
    </>
  )
}

function Token({
  stats,
  token,
  sortBy,
}: {
  stats: { latestTimestamp: number; totalAmount: number; totalHolders: number }
  token: IdeaToken
  sortBy: SortBy
}) {
  const marketSpecifics = getMarketSpecificsByMarketName(token.marketName)
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <DetailsView isOpen={isOpen} setIsOpen={setIsOpen} token={token} />
      <div className="overflow-hidden bg-white rounded-lg shadow">
        <h2 className="sr-only" id="profile-overview-title">
          Profile Overview
        </h2>
        <div className="p-6 bg-white">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div className="sm:flex sm:space-x-5">
              <div className="flex-shrink-0">
                <img
                  className="w-20 h-20 mx-auto rounded-full"
                  src={`https://unavatar.backend.ideamarket.io/${marketSpecifics.getMarketName()}/${marketSpecifics.getTokenNameURLRepresentation(
                    token.name
                  )}`}
                  alt={token.name}
                />
              </div>
              <div className="mt-4 text-center sm:mt-0 sm:pt-1 sm:text-left">
                <p className="text-sm font-medium text-gray-600">
                  Rank {token.rank}
                </p>
                <p className="text-xl font-bold text-gray-900 sm:text-xl">
                  {token.name}{' '}
                  <span>{marketSpecifics.getMarketSVGBlack()}</span>
                </p>
                <p className="text-sm font-medium text-gray-600">
                  ${token.latestPricePoint.price}
                </p>
              </div>
            </div>
            <div className="flex justify-center mt-5 sm:mt-0">
              <button
                className="flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
                onClick={() => setIsOpen(true)}
              >
                View details
              </button>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 border-t border-gray-200 divide-y divide-gray-200 bg-gray-50 sm:grid-cols-3 sm:divide-y-0 sm:divide-x">
          <div
            className={classNames(
              'px-6 py-5 text-sm font-medium text-center',
              sortBy === 'totalHolders' && 'bg-indigo-100'
            )}
          >
            <span className="text-gray-900">{stats.totalHolders}</span>{' '}
            <span className="text-gray-600">mutual holders</span>
          </div>
          <div
            className={classNames(
              'px-6 py-5 text-sm font-medium text-center',
              sortBy === 'totalAmount' && 'bg-indigo-100'
            )}
          >
            <span className="text-gray-900">{stats.totalAmount}</span>{' '}
            <span className="text-gray-600">tokens bought</span>
          </div>
          <div
            className={classNames(
              'px-6 py-5 text-sm font-medium text-center',
              sortBy === 'latestTimestamp' && 'bg-indigo-100'
            )}
          >
            <span className="text-gray-600">Bought </span>
            <span className="text-gray-900">
              <ReactTimeAgo
                date={new Date(stats.latestTimestamp * 1000)}
                locale="en-US"
              />
            </span>
          </div>
        </div>
      </div>
    </>
  )
}

type SortBy = 'latestTimestamp' | 'totalAmount' | 'totalHolders'

export default function RelatedTokens({
  tokenName,
  marketName,
  rawTokenName,
  rawMarketName,
}: {
  rawTokenName: string
  rawMarketName: string
  tokenName: string
  marketName: string
}) {
  useEffect(() => {
    queryMutualHoldersOfToken({
      marketName,
      tokenName,
    }).then((result) => console.log(result))
  }, [marketName, tokenName])

  const [sortBy, setSortBy] = useState<SortBy>('totalHolders')

  const { data: mutualHoldersList, isLoading, isError } = useQuery<
    MutualHoldersData[]
  >(
    [`token-mutualHolders-${marketName}-${tokenName}`, marketName, tokenName],
    () => queryMutualHoldersOfToken({ marketName, tokenName })
  )

  function sortedMutualHolders() {
    if (isLoading || isError || !mutualHoldersList) {
      return []
    }
    return mutualHoldersList.sort(
      (a, b) => Number(b.stats[sortBy]) - Number(a.stats[sortBy])
    )
  }

  if (isLoading) {
    return <p>loading...</p>
  }
  if (isError) {
    return <p>Something went wrong!!!</p>
  }

  return (
    <>
      <div className="">
        <div>
          <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:space-y-0">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              {sortedMutualHolders().length > 0 && sortBy === 'totalHolders' && (
                <>
                  Most holders of{' '}
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-red-100 text-red-800">
                    {rawTokenName}
                  </span>{' '}
                  also bought
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-sm font-medium bg-purple-100 text-purple-800">
                    {sortedMutualHolders()[0].token.name}
                  </span>{' '}
                  tokens.
                </>
              )}

              {sortedMutualHolders().length > 0 && sortBy === 'totalAmount' && (
                <>
                  Holders of
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-red-100 text-red-800">
                    {rawTokenName}
                  </span>{' '}
                  bought most amount of
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-sm font-medium bg-purple-100 text-purple-800">
                    {sortedMutualHolders()[0].token.name}
                  </span>{' '}
                  tokens.
                </>
              )}

              {sortedMutualHolders().length > 0 &&
                sortBy === 'latestTimestamp' && (
                  <>
                    Holders of
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-red-100 text-red-800">
                      {rawTokenName}
                    </span>{' '}
                    most recently bought
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-sm font-medium bg-purple-100 text-purple-800">
                      {sortedMutualHolders()[0].token.name}
                    </span>{' '}
                    tokens.
                  </>
                )}
            </h3>

            <div className="inline-block">
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700"
              >
                Sort By
              </label>
              <select
                id="location"
                name="location"
                className="block w-full py-2 pl-3 pr-10 mt-1 text-base border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                onChange={(e) => setSortBy(e.target.value as any)}
                value={sortBy}
              >
                <option value="totalHolders">Number of users who bought</option>
                <option value="totalAmount">Amount of tokens bought</option>
                <option value="latestTimestamp">Recently bought first</option>
              </select>
            </div>
          </div>

          <dl className="grid grid-cols-1 gap-10 mt-5 lg:grid-cols-2">
            {sortedMutualHolders().map((mutualHolderData) => (
              <Token
                stats={mutualHolderData.stats}
                token={mutualHolderData.token}
                key={mutualHolderData.token.address}
                sortBy={sortBy}
              />
            ))}
          </dl>
        </div>
      </div>
    </>
  )
}
