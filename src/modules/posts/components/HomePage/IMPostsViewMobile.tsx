import React, {
  MutableRefObject,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from 'react'
import { useInfiniteQuery } from 'react-query'

import { flatten } from 'utils/lodash'
import { GlobalContext } from 'lib/GlobalContext'
import { TIME_FILTER } from 'utils/tables'
import ListingContent from 'components/tokens/ListingContent'
import Image from 'next/image'
import { A, CircleSpinner } from 'components'
import { convertAccountName } from 'lib/utils/stringUtil'
import classNames from 'classnames'
import { HOME_PAGE_VIEWS } from 'pages'
import OpenRateModal from 'modules/ratings/components/OpenRateModal'
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ExternalLinkIcon,
} from '@heroicons/react/outline'
import { getAllTwitterPosts } from 'modules/posts/services/TwitterPostService'
import { formatNumberWithCommasAsThousandsSerperator } from 'utils'
import EmptyTableBody from 'modules/tables/components/EmptyTableBody'

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
    isFetching: isTokenDataLoading,
    fetchNextPage: fetchMore,
    refetch,
    hasNextPage: canFetchMore,
  } = useInfiniteQuery(
    [
      TOKENS_PER_PAGE,
      orderBy,
      orderDirection,
      selectedCategories,
      nameSearch,
      timeFilter,
    ],
    ({ pageParam = 0 }) =>
      getAllTwitterPosts(
        [
          TOKENS_PER_PAGE,
          orderBy,
          orderDirection,
          selectedCategories,
          null,
          nameSearch,
          timeFilter,
        ],
        pageParam
      ),
    {
      getNextPageParam: (lastGroup, allGroups) => {
        const morePagesExist = lastGroup?.length === TOKENS_PER_PAGE

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

  const isNoPosts = !imPostPairs || imPostPairs?.length <= 0

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
            return (
              <div
                ref={lastElementRef}
                className="snap-start snap-always shrink-0 grow-0 basis-[95%] w-full pl-2 mb-10"
                key={imPost?.postID}
              >
                {/* The actual Post card */}
                <div className="relative">
                  <span
                    className={classNames(
                      'absolute bottom-0 right-0 w-28 h-6 flex justify-center items-center rounded-br-2xl rounded-tl-2xl font-extrabold text-xs bg-blue-100 text-blue-600'
                    )}
                  >
                    View details...
                    <ExternalLinkIcon className="w-3 h-3 ml-2" />
                  </span>

                  <A
                    href={`/post/${imPost?.postID}`}
                    className="w-full relative block p-4 bg-[#0857E0]/[0.05] rounded-2xl"
                  >
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
                      {/* <div className="flex justify-between items-center">
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
                      </div> */}

                      {/* # Ratings */}
                      <div className="flex justify-between items-center">
                        <div className="flex justify-start items-center space-x-2">
                          {/* <div className="relative w-6 h-6">
                            <Image
                              src={'/eye-icon.svg'}
                              alt="eye-icon"
                              layout="fill"
                            />
                          </div> */}

                          <div className="flex items-center space-x-2">
                            <div className="text-xs text-black/[.5] font-semibold">
                              # Ratings
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
                            Math.round(imPost.latestRatingsCount)
                          )}
                        </div>
                      </div>

                      {/* Average Rating */}
                      <div className="flex justify-between items-center">
                        <div className="flex justify-start items-center space-x-2">
                          {/* <div className="relative w-6 h-6">
                            <Image
                              src={'/income-icon.svg'}
                              alt="eye-icon"
                              layout="fill"
                            />
                          </div> */}

                          <div className="text-xs text-black/[.5] font-semibold">
                            Average Rating
                          </div>
                        </div>

                        <div>
                          <span className="font-bold">
                            {imPost.latestRatingsCount > 0
                              ? formatNumberWithCommasAsThousandsSerperator(
                                  Math.round(imPost.averageRating)
                                )
                              : '-'}
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
                          return (
                            <A
                              href={`/post/${citation?.postID}`}
                              className={classNames(
                                citation?.isPostInFavorOfParent
                                  ? 'bg-gradient-to-b from-[#0cae741a] to-[#1fbfbf1a]'
                                  : 'bg-gradient-to-b from-[#fee8e9] to-[#fceaeb]',
                                'relative block p-4 rounded-2xl font-bold mb-2'
                              )}
                              key={citation?.postID}
                            >
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
                          const displayTwitterUsernameOrWallet =
                            convertAccountName(
                              rating?.userToken?.twitterUsername ||
                                rating?.ratedBy
                            )
                          const twitterUsernameOrWallet =
                            rating?.userToken?.twitterUsername ||
                            rating?.ratedBy

                          return (
                            <div
                              className="flex items-center whitespace-nowrap text-xs mb-2"
                              key={rInd}
                            >
                              <div className="relative rounded-full w-5 h-5">
                                <Image
                                  className="rounded-full"
                                  src={
                                    rating?.userToken?.twitterProfilePicURL ||
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
                                  href={`/u/${twitterUsernameOrWallet}`}
                                >
                                  {displayTwitterUsernameOrWallet}
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

      {isNoPosts && (
        <div className="flex flex-col justify-center items-center pb-40">
          {isTokenDataLoading && (
            <div className="flex justify-center pt-8">
              <CircleSpinner color="#0857e0" />
            </div>
          )}
          <EmptyTableBody />
        </div>
      )}

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
