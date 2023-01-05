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
import { A, CircleSpinner } from 'components'
import classNames from 'classnames'
import { HOME_PAGE_VIEWS } from 'pages'
import OpenRateModal from 'modules/ratings/components/OpenRateModal'
// import { formatNumberWithCommasAsThousandsSerperator } from 'utils'
// import { getIMORatingColors } from 'utils/display/DisplayUtils'
// import { ExternalLinkIcon } from '@heroicons/react/outline'
import EmptyTableBody from 'modules/tables/components/EmptyTableBody'
import { getAllTwitterPosts } from 'modules/posts/services/TwitterPostService'
import { formatNumberWithCommasAsThousandsSerperator } from 'utils'
import Image from 'next/image'
import { convertAccountName } from 'lib/utils/stringUtil'

const AdvancedPostColWidth = 'w-[45%]'
const AdvancedCitationsColWidth = 'w-[35%]'
const AdvancedRatingsColWidth = 'w-[20%]'

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

const IMPostsView = ({
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
  const TOKENS_PER_PAGE = 3

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
    <div className="hidden md:block mx-auto">
      {isAdvancedView && (
        <div className={classNames(isNoPosts ? '' : 'pb-40', 'flex flex-col')}>
          <div className="py-3 mt-5 mb-8 flex space-x-10 text-sm text-black/[.5] border-y-2 border-black/[0.05]">
            <div className={classNames(AdvancedPostColWidth, '')}>
              <div className="font-semibold">Post</div>
            </div>

            <div className={classNames(AdvancedCitationsColWidth, '')}>
              <div className="font-semibold">Top citations</div>
              <div className="text-xs italic">
                Top posts in favor (green) or against (red) the post.
              </div>
            </div>

            <div className={classNames(AdvancedRatingsColWidth, '')}>
              <div className="font-semibold">Top raters</div>
              <div className="text-xs italic">
                Top users who rated the post.
              </div>
            </div>
          </div>

          {imPostPairs &&
            imPostPairs.length > 0 &&
            imPostPairs.map((imPost, pInd) => {
              return (
                <div
                  ref={lastElementRef}
                  className="flex space-x-10 pb-8 mb-8 border-b border-black/[0.05]"
                  key={imPost?.postID}
                >
                  <div className={classNames(AdvancedPostColWidth, '')}>
                    {/* The actual Post card */}
                    <div className="relative">
                      <A
                        href={`/post/${imPost?.postID}`}
                        className="relative block px-8 pt-4 pb-6 bg-[#0857E0]/[0.05] border-2 border-[#0857E0]/[0.05] hover:border-blue-600 rounded-2xl cursor-pointer"
                      >
                        <div className="py-6 border-b font-bold">
                          <ListingContent
                            imPost={imPost}
                            page="HomePage"
                            urlMetaData={null}
                            useMetaData={false}
                          />
                        </div>

                        <div className="flex items-center pt-6">
                          <div className="w-1/3">
                            <div className="flex justify-start items-center space-x-2">
                              {/* <div className="relative w-6 h-6">
                                <Image
                                  src={'/eye-icon.svg'}
                                  alt="eye-icon"
                                  layout="fill"
                                />
                              </div> */}

                              <div>
                                <div className="flex items-center space-x-2">
                                  <div className="text-xs text-black/[.5] font-medium">
                                    # ratings
                                  </div>
                                </div>
                                <div className="font-bold">
                                  {formatNumberWithCommasAsThousandsSerperator(
                                    Math.round(imPost.latestRatingsCount)
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="w-1/3">
                            <div className="flex justify-start items-center space-x-2">
                              {/* <div className="relative w-6 h-6">
                                <Image
                                  src={'/eye-icon.svg'}
                                  alt="eye-icon"
                                  layout="fill"
                                />
                              </div> */}

                              <div>
                                <div className="flex items-center space-x-2">
                                  <div className="text-xs text-black/[.5] font-medium">
                                    Average Rating
                                  </div>
                                </div>
                                <div className="font-bold">
                                  {imPost.latestRatingsCount > 0
                                    ? formatNumberWithCommasAsThousandsSerperator(
                                        Math.round(imPost.averageRating)
                                      )
                                    : '-'}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="w-1/3">
                            <A
                              href={`/post/${imPost?.postID}`}
                              className="text-blue-500 text-sm hover:underline"
                            >
                              View more details...
                            </A>
                          </div>
                        </div>
                      </A>
                    </div>

                    <div className="mt-2">
                      <OpenRateModal imPost={imPost as any} />
                    </div>
                  </div>

                  <div
                    className={classNames(AdvancedCitationsColWidth, 'text-xs')}
                  >
                    {imPost?.topCitations?.length > 0 &&
                      imPost?.topCitations.map((citation: any, cInd) => {
                        return (
                          <A
                            href={`/post/${citation?.postID}`}
                            className={classNames(
                              citation?.isPostInFavorOfParent
                                ? 'bg-gradient-to-b from-[#0cae741a] to-[#1fbfbf1a]'
                                : 'bg-gradient-to-b from-[#fee8e9] to-[#fceaeb]',
                              'relative block p-4 rounded-2xl font-bold mb-2'
                            )}
                            key={cInd}
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

                  <div className={classNames(AdvancedRatingsColWidth, '')}>
                    {imPost?.topRatings?.length > 0 &&
                      imPost?.topRatings.map((rating, rInd) => {
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
                                  rating?.userToken?.twitterProfilePicURL ||
                                  '/default-profile-pic.png'
                                }
                                alt=""
                                layout="fill"
                                objectFit="cover"
                              />
                            </div>

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
                </div>
              )
            })}
        </div>
      )}

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
    </div>
  )
}

export default IMPostsView
