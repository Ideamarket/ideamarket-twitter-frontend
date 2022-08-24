import React, {
  MutableRefObject,
  useCallback,
  // MutableRefObject,
  // useCallback,
  useContext,
  useEffect,
  useRef,
  // useRef,
} from 'react'
import { useInfiniteQuery } from 'react-query'

import { flatten } from 'utils/lodash'
import { GlobalContext } from 'lib/GlobalContext'
import { TIME_FILTER } from 'utils/tables'
import { getAllPosts } from 'modules/posts/services/PostService'
import ListingContent from 'components/tokens/ListingContent'
import Image from 'next/image'
import { A } from 'components'
import { convertAccountName } from 'lib/utils/stringUtil'
// import { PlusIcon, XIcon } from '@heroicons/react/solid'
import classNames from 'classnames'
import { HOME_PAGE_VIEWS } from 'pages'
import OpenRateModal from 'modules/ratings/components/OpenRateModal'
import { formatNumberWithCommasAsThousandsSerperator } from 'utils'
import { getIMORatingColors } from 'utils/display/DisplayUtils'
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ExternalLinkIcon,
} from '@heroicons/react/outline'

type Props = {
  activeOverlayPostID: string
  nameSearch: string
  orderBy: string
  orderDirection: string
  selectedCategories: string[]
  selectedView: HOME_PAGE_VIEWS
  timeFilter: TIME_FILTER
  isAdvancedView: boolean
  setActiveOverlayPostID: (activeOverlayPostID: string) => void
}

const IMPostsViewMobile = ({
  activeOverlayPostID,
  nameSearch,
  orderBy,
  orderDirection,
  selectedCategories,
  selectedView,
  timeFilter,
  isAdvancedView,
  setActiveOverlayPostID,
}: Props) => {
  const TOKENS_PER_PAGE = 10

  const { jwtToken, isTxPending } = useContext(GlobalContext)

  const {
    data: infiniteData,
    // isFetching: isTokenDataLoading,
    fetchNextPage: fetchMore,
    refetch,
    hasNextPage: canFetchMore,
  } = useInfiniteQuery(
    [TOKENS_PER_PAGE, orderBy, orderDirection, selectedCategories, nameSearch],
    ({ pageParam = 0 }) =>
      getAllPosts(
        [
          TOKENS_PER_PAGE,
          orderBy,
          orderDirection,
          selectedCategories,
          null,
          nameSearch,
          null,
          timeFilter,
        ],
        pageParam
      ),
    {
      getNextPageParam: (lastGroup, allGroups) => {
        const morePagesExist = lastGroup?.length === 10

        if (!morePagesExist) {
          return false
        }

        return allGroups.length * TOKENS_PER_PAGE
      },
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      enabled: false,
      keepPreviousData: true,
    }
  )

  const imPostPairs = flatten(infiniteData?.pages || [])

  const observer: MutableRefObject<any> = useRef()
  const lastElementRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect()

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && canFetchMore) {
          fetchMore()
        }
      })

      if (node) observer.current.observe(node)
    },
    [canFetchMore, fetchMore]
  )

  const scrollCards = (direction: string) => {
    const container = document.getElementById('scrolling-cards')
    const cardSize = container.querySelector('div').clientWidth
    const xAmountToMove =
      direction === 'left'
        ? container.scrollLeft - cardSize
        : container.scrollLeft + cardSize
    container.scrollTo({ left: xAmountToMove, top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    refetch()
  }, [
    orderBy,
    orderDirection,
    nameSearch,
    refetch,
    jwtToken,
    selectedCategories,
    timeFilter,
    isTxPending, // If any transaction starts or stop, refresh home table data
  ])

  return (
    <>
      <div className="mt-6 text-xs text-blue-600 text-center font-bold">
        Swipe to see more posts
      </div>
      <div
        id="scrolling-cards"
        className="w-full overflow-x-auto mt-6 mb-10 flex items-start snap-x snap-mandatory"
      >
        {imPostPairs &&
          imPostPairs.length > 0 &&
          imPostPairs.map((imPost, pInd) => {
            const { minterAddress } = (imPost || {}) as any

            const displayUsernameOrWallet = convertAccountName(
              imPost?.minterToken?.username || minterAddress
            )
            const usernameOrWallet =
              imPost?.minterToken?.username || minterAddress

            // const isThisPostOverlaySelected =
            //   activeOverlayPostID &&
            //   activeOverlayPostID === imPost.tokenID.toString()

            const postIncome = imPost.totalRatingsCount * 0.001

            return (
              <div
                ref={lastElementRef}
                className="snap-start snap-always shrink-0 grow-0 basis-[95%] w-full pl-2 mb-10"
                key={pInd}
              >
                {/* The actual Post card */}
                <div className="relative">
                  <span
                    className={classNames(
                      'absolute bottom-0 right-0 w-28 h-6 flex justify-center items-center rounded-br-2xl rounded-tl-2xl font-extrabold text-xs bg-blue-100 text-blue-600 z-[200]'
                    )}
                  >
                    Buy this NFT
                    <ExternalLinkIcon className="w-3 h-3 ml-2" />
                  </span>
                  <A
                    href={`/post/${imPost?.tokenID}`}
                    className="w-full relative block p-4 bg-[#0857E0]/[0.05] rounded-2xl"
                  >
                    <span
                      className={classNames(
                        getIMORatingColors(
                          imPost?.totalRatingsCount > 0 &&
                            imPost?.marketInterest > 0
                            ? Math.round(imPost?.compositeRating)
                            : -1
                        ),
                        'absolute top-0 right-0 w-14 h-14 flex justify-center items-center rounded-tr-2xl rounded-bl-2xl font-extrabold text-lg border-l-2 border-b-2 border-white'
                      )}
                    >
                      {imPost?.totalRatingsCount > 0 &&
                      imPost?.marketInterest > 0
                        ? Math.round(imPost?.compositeRating) + '%'
                        : '—'}
                    </span>

                    <div className="flex items-center whitespace-nowrap text-xs">
                      <div className="relative rounded-full w-5 h-5">
                        <Image
                          className="rounded-full"
                          src={
                            imPost?.minterToken?.profilePhoto ||
                            '/default-profile-pic.png'
                          }
                          alt=""
                          layout="fill"
                          objectFit="cover"
                        />
                      </div>

                      {/* Post minter IM name/wallet and twitter name */}
                      <div className="flex items-center space-x-1 flex-wrap z-50 text-black">
                        <A
                          className="ml-1 font-medium hover:text-blue-500"
                          href={`/u/${usernameOrWallet}`}
                        >
                          {displayUsernameOrWallet}
                        </A>
                        {imPost?.minterToken?.twitterUsername && (
                          <A
                            className="flex items-center space-x-1 hover:text-blue-500"
                            href={`/u/${usernameOrWallet}`}
                          >
                            <div className="relative w-4 h-4">
                              <Image
                                src={'/twitter-solid-blue.svg'}
                                alt="twitter-solid-blue-icon"
                                layout="fill"
                              />
                            </div>
                            <span className="text-xs opacity-50">
                              @{imPost?.minterToken?.twitterUsername}
                            </span>
                          </A>
                        )}
                      </div>
                    </div>

                    <div className="py-6 border-b font-bold text-xl">
                      <ListingContent
                        imPost={imPost}
                        page="HomePage"
                        urlMetaData={null}
                        useMetaData={false}
                      />
                    </div>

                    {/* Stats */}
                    <div className="py-8">
                      {/* Ratings */}
                      <div className="flex justify-between items-center">
                        <div className="flex justify-start items-center space-x-2">
                          <div className="relative w-6 h-6">
                            <Image
                              src={'/people-icon.svg'}
                              alt="people-icon"
                              layout="fill"
                            />
                          </div>

                          <div className="text-xs text-black/[.5] font-semibold">
                            Ratings
                          </div>
                        </div>

                        <div className="font-bold">
                          {formatNumberWithCommasAsThousandsSerperator(
                            imPost.totalRatingsCount
                          )}
                        </div>
                      </div>

                      {/* Hot */}
                      <div className="flex justify-between items-center">
                        <div className="flex justify-start items-center space-x-2">
                          <div className="relative w-6 h-6">
                            <Image
                              src={'/eye-icon.svg'}
                              alt="eye-icon"
                              layout="fill"
                            />
                          </div>

                          <div className="flex items-center space-x-2">
                            <div className="text-xs text-black/[.5] font-semibold">
                              Hot
                            </div>
                            {/* Removing tooltip on mobile because card clicks to Post page */}
                            {/* <Tooltip
                              className="text-black/[.5] z-[200]"
                              iconComponentClassNames="w-3"
                            >
                              <div className="w-64">
                                The total amount of IMO staked on all users who rated a post
                              </div>
                            </Tooltip> */}
                          </div>
                        </div>

                        <div className="font-bold">
                          {formatNumberWithCommasAsThousandsSerperator(
                            Math.round(imPost.marketInterest)
                          )}
                        </div>
                      </div>

                      {/* Earned */}
                      <div className="flex justify-between items-center">
                        <div className="flex justify-start items-center space-x-2">
                          <div className="relative w-6 h-6">
                            <Image
                              src={'/income-icon.svg'}
                              alt="eye-icon"
                              layout="fill"
                            />
                          </div>

                          <div className="text-xs text-black/[.5] font-semibold">
                            Earned
                          </div>
                        </div>

                        <div>
                          <span className="font-bold">{postIncome} ETH</span>
                          <span className="text-black/[.5] font-bold text-xs">
                            {' '}
                            (${imPost?.incomeInDAI?.toFixed(2)})
                          </span>
                        </div>
                      </div>
                    </div>

                    {imPost?.topCitations?.length > 0 && (
                      <div className={classNames('text-xs mt-6')}>
                        <div className="text-black/[.5] mb-2 font-semibold">
                          Top Citations
                        </div>

                        {imPost?.topCitations.map((citation, cInd) => {
                          const { minterAddress } = (citation || {}) as any

                          const displayUsernameOrWalletCitation =
                            convertAccountName(
                              citation?.minterToken?.username || minterAddress
                            )
                          const usernameOrWalletCitation =
                            citation?.minterToken?.username || minterAddress

                          return (
                            <A
                              href={`/post/${citation?.tokenID}`}
                              className="relative block p-4 bg-gradient-to-b from-[#0cae741a] to-[#1fbfbf1a] rounded-2xl font-bold mb-2"
                              key={cInd}
                            >
                              <span
                                className={classNames(
                                  getIMORatingColors(
                                    citation?.totalRatingsCount > 0 &&
                                      citation?.marketInterest > 0
                                      ? Math.round(citation?.compositeRating)
                                      : -1
                                  ),
                                  'absolute top-0 right-0 w-10 h-10 flex justify-center items-center rounded-tr-2xl rounded-bl-2xl font-extrabold text-base border-l-2 border-b-2 border-white'
                                )}
                              >
                                {citation?.totalRatingsCount > 0 &&
                                citation?.marketInterest > 0
                                  ? Math.round(citation?.compositeRating) + '%'
                                  : '—'}
                              </span>

                              {/* Citation username/wallet/pic */}
                              <div className="flex items-center whitespace-nowrap text-xs mb-2">
                                <div className="relative rounded-full w-5 h-5">
                                  <Image
                                    className="rounded-full"
                                    src={
                                      citation?.minterToken?.profilePhoto ||
                                      '/default-profile-pic.png'
                                    }
                                    alt=""
                                    layout="fill"
                                    objectFit="cover"
                                  />
                                </div>

                                {/* Post minter IM name/wallet and twitter name */}
                                <div className="flex items-center space-x-1 flex-wrap z-50 text-black">
                                  <A
                                    className="ml-1 font-medium hover:text-blue-500"
                                    href={`/u/${usernameOrWalletCitation}`}
                                  >
                                    {displayUsernameOrWalletCitation}
                                  </A>
                                  {citation?.minterToken?.twitterUsername && (
                                    <A
                                      className="flex items-center space-x-1 hover:text-blue-500"
                                      href={`/u/${usernameOrWalletCitation}`}
                                    >
                                      <div className="relative w-4 h-4">
                                        <Image
                                          src={'/twitter-solid-blue.svg'}
                                          alt="twitter-solid-blue-icon"
                                          layout="fill"
                                        />
                                      </div>
                                      <span className="text-xs opacity-50">
                                        @
                                        {citation?.minterToken?.twitterUsername}
                                      </span>
                                    </A>
                                  )}
                                </div>
                              </div>

                              <ListingContent
                                imPost={citation}
                                page="HomePage"
                                urlMetaData={null}
                                useMetaData={false}
                              />
                            </A>
                          )
                        })}
                      </div>
                    )}

                    {imPost?.topRatings?.length > 0 && (
                      <div className={classNames('text-xs mt-6 mb-6')}>
                        <div className="text-black/[.5] mb-2 font-semibold">
                          Top Raters
                        </div>

                        {imPost?.topRatings.map((rating, rInd) => {
                          const displayUsernameOrWallet = convertAccountName(
                            rating?.userToken?.username || rating?.ratedBy
                          )
                          const usernameOrWallet =
                            rating?.userToken?.username || rating?.ratedBy

                          return (
                            <div
                              className="flex items-center whitespace-nowrap text-xs mb-2"
                              key={rInd}
                            >
                              <div className="relative rounded-full w-5 h-5">
                                <Image
                                  className="rounded-full"
                                  src={
                                    rating?.userToken?.profilePhoto ||
                                    '/default-profile-pic.png'
                                  }
                                  alt=""
                                  layout="fill"
                                  objectFit="cover"
                                />
                              </div>

                              {/* Post minter IM name/wallet and twitter name */}
                              <div className="flex items-center space-x-1 flex-wrap z-50 text-black">
                                <A
                                  className="ml-1 font-medium hover:text-blue-500"
                                  href={`/u/${usernameOrWallet}`}
                                >
                                  {displayUsernameOrWallet}
                                </A>
                              </div>

                              <div className="ml-auto text-sm font-bold">
                                {rating.rating}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </A>
                </div>

                <div className={classNames('mt-2')}>
                  <OpenRateModal imPost={imPost} />
                </div>
              </div>
            )
          })}
      </div>

      {/* Bottom 2 buttons for cycling cards as user */}
      <div className="fixed bottom-0 w-full h-20 px-4 flex justify-between items-center z-[600] active:bg-black/[.05]">
        <button
          onClick={() => scrollCards('left')}
          className="w-12 h-12 bg-white rounded-3xl flex justify-center items-center shadow-lg border"
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </button>

        <button
          onClick={() => scrollCards('right')}
          className="w-12 h-12 bg-white rounded-3xl flex justify-center items-center shadow-lg border"
        >
          <ArrowRightIcon className="w-5 h-5" />
        </button>
      </div>
    </>
  )
}

export default IMPostsViewMobile
