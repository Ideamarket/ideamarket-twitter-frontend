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
import { getAllPosts } from 'modules/posts/services/PostService'
import ListingContent from 'components/tokens/ListingContent'
import Image from 'next/image'
import { A, Tooltip } from 'components'
import { convertAccountName } from 'lib/utils/stringUtil'
import classNames from 'classnames'
import { HOME_PAGE_VIEWS } from 'pages'
import OpenRateModal from 'modules/ratings/components/OpenRateModal'
import { formatNumberWithCommasAsThousandsSerperator } from 'utils'
import { getIMORatingColors } from 'utils/display/DisplayUtils'
import { ExternalLinkIcon } from '@heroicons/react/outline'
import { NETWORK } from 'store/networks'

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
  const TOKENS_PER_PAGE = 10

  const { jwtToken, isTxPending } = useContext(GlobalContext)

  const {
    data: infiniteData,
    // isFetching: isTokenDataLoading,
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
    <div className="hidden md:block mx-auto">
      {!isAdvancedView && (
        <div className="w-full pb-40">
          <div className="flex flex-col w-[36rem] mx-auto mt-6">
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
                    className="w-full flex space-x-10 mb-10"
                    key={pInd}
                  >
                    <div
                      className={classNames(
                        'w-full flex flex-col space-y-2 mx-auto'
                      )}
                    >
                      {/* The actual Post card */}
                      <div className="relative">
                        <span
                          className={classNames(
                            'absolute bottom-0 right-0 w-28 h-6 flex justify-center items-center rounded-br-2xl rounded-tl-2xl font-extrabold text-xs bg-blue-100 text-blue-600 z-[200] cursor-pointer hover:text-blue-800'
                          )}
                        >
                          <A
                            href={`https://stratosnft.io/asset/${
                              NETWORK.getDeployedAddresses().ideamarketPosts
                            }/${imPost.tokenID}`}
                          >
                            Buy this NFT
                            <ExternalLinkIcon className="w-3 h-3 ml-2" />
                          </A>
                        </span>
                        <A
                          href={`/post/${imPost?.tokenID}`}
                          className="w-full relative block p-8 bg-[#0857E0]/[0.05]  rounded-2xl cursor-pointer"
                        >
                          <span
                            className={classNames(
                              getIMORatingColors(
                                imPost?.totalRatingsCount > 0
                                  ? Math.round(imPost?.compositeRating)
                                  : -1
                              ),
                              'absolute top-0 right-0 w-14 h-14 flex justify-center items-center rounded-tr-2xl rounded-bl-2xl font-extrabold text-lg border-l-2 border-b-2 border-white'
                            )}
                          >
                            {imPost?.totalRatingsCount > 0
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

                          <div className="py-4 border-b font-bold">
                            <ListingContent
                              imPost={imPost}
                              page="HomePage"
                              urlMetaData={null}
                              useMetaData={false}
                            />
                          </div>

                          <div className="flex items-center pt-4">
                            <div className="w-1/3">
                              <div className="flex justify-start items-center space-x-2">
                                <div className="relative w-6 h-6">
                                  <Image
                                    src={'/people-icon.svg'}
                                    alt="people-icon"
                                    layout="fill"
                                  />
                                </div>

                                <div>
                                  <div className="text-xs text-black/[.5] font-medium">
                                    Ratings
                                  </div>
                                  <div className="font-bold">
                                    {formatNumberWithCommasAsThousandsSerperator(
                                      imPost.totalRatingsCount
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="w-1/3">
                              <div className="flex justify-start items-center space-x-2">
                                <div className="relative w-6 h-6">
                                  <Image
                                    src={'/eye-icon.svg'}
                                    alt="eye-icon"
                                    layout="fill"
                                  />
                                </div>

                                <div>
                                  <div className="flex items-center space-x-2">
                                    <div className="text-xs text-black/[.5] font-medium">
                                      Controversial
                                    </div>
                                    <Tooltip
                                      className="text-black/[.5] z-[200]"
                                      iconComponentClassNames="w-3"
                                    >
                                      <div className="w-64">
                                        The total amount of IMO staked on all
                                        users who rated a post
                                      </div>
                                    </Tooltip>
                                  </div>

                                  <div className="font-bold">
                                    {formatNumberWithCommasAsThousandsSerperator(
                                      Math.round(imPost.marketInterest)
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="w-1/3">
                              <div className="flex justify-start items-center space-x-2">
                                <div className="relative w-6 h-6">
                                  <Image
                                    src={'/income-icon.svg'}
                                    alt="eye-icon"
                                    layout="fill"
                                  />
                                </div>

                                <div>
                                  <div className="text-xs text-black/[.5] font-medium">
                                    Income
                                  </div>
                                  <div>
                                    <span className="font-bold">
                                      {postIncome} ETH
                                    </span>
                                    <span className="text-black/[.5] font-bold text-xs">
                                      {' '}
                                      (${imPost?.incomeInDAI?.toFixed(2)})
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </A>
                      </div>

                      <OpenRateModal imPost={imPost} />
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      )}

      {isAdvancedView && (
        <div className="flex flex-col pb-40">
          <div className="py-3 mt-5 mb-8 flex space-x-10 text-sm text-black/[.5] border-y-2 border-black/[0.05]">
            <div className={classNames(AdvancedPostColWidth, '')}>
              <div className="font-semibold">Post</div>
              <div className="text-xs italic">A collectible belief NFT.</div>
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
                  className="flex space-x-10 pb-8 mb-8 border-b border-black/[0.05]"
                  key={pInd}
                >
                  <div className={classNames(AdvancedPostColWidth, '')}>
                    {/* The actual Post card */}
                    <div className="relative">
                      <span
                        className={classNames(
                          'absolute bottom-0 right-0 w-28 h-6 flex justify-center items-center rounded-br-2xl rounded-tl-2xl font-extrabold text-xs bg-blue-100 text-blue-600 z-[200] cursor-pointer hover:text-blue-800'
                        )}
                      >
                        <A
                          href={`https://stratosnft.io/asset/${
                            NETWORK.getDeployedAddresses().ideamarketPosts
                          }/${imPost.tokenID}`}
                        >
                          Buy this NFT
                          <ExternalLinkIcon className="w-3 h-3 ml-2" />
                        </A>
                      </span>

                      <A
                        href={`/post/${imPost?.tokenID}`}
                        className="relative block p-8 bg-[#0857E0]/[0.05]  rounded-2xl cursor-pointer"
                      >
                        <span
                          className={classNames(
                            getIMORatingColors(
                              imPost?.totalRatingsCount > 0
                                ? Math.round(imPost?.compositeRating)
                                : -1
                            ),
                            'absolute top-0 right-0 w-14 h-14 flex justify-center items-center rounded-tr-2xl rounded-bl-2xl font-extrabold text-lg border-l-2 border-b-2 border-white'
                          )}
                        >
                          {imPost?.totalRatingsCount > 0
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

                        <div className="py-4 border-b font-bold">
                          <ListingContent
                            imPost={imPost}
                            page="HomePage"
                            urlMetaData={null}
                            useMetaData={false}
                          />
                        </div>

                        <div className="flex items-center pt-4">
                          <div className="w-1/3">
                            <div className="flex justify-start items-center space-x-2">
                              <div className="relative w-6 h-6">
                                <Image
                                  src={'/people-icon.svg'}
                                  alt="people-icon"
                                  layout="fill"
                                />
                              </div>

                              <div>
                                <div className="text-xs text-black/[.5] font-medium">
                                  Ratings
                                </div>
                                <div className="font-bold">
                                  {formatNumberWithCommasAsThousandsSerperator(
                                    imPost.totalRatingsCount
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="w-1/3">
                            <div className="flex justify-start items-center space-x-2">
                              <div className="relative w-6 h-6">
                                <Image
                                  src={'/eye-icon.svg'}
                                  alt="eye-icon"
                                  layout="fill"
                                />
                              </div>

                              <div>
                                <div className="flex items-center space-x-2">
                                  <div className="text-xs text-black/[.5] font-medium">
                                    Controversial
                                  </div>
                                  <Tooltip
                                    className="text-black/[.5] z-[200]"
                                    iconComponentClassNames="w-3"
                                  >
                                    <div className="w-64">
                                      The total amount of IMO staked on all
                                      users who rated a post
                                    </div>
                                  </Tooltip>
                                </div>
                                <div className="font-bold">
                                  {formatNumberWithCommasAsThousandsSerperator(
                                    Math.round(imPost.marketInterest)
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="w-1/3">
                            <div className="flex justify-start items-center space-x-2">
                              <div className="relative w-6 h-6">
                                <Image
                                  src={'/income-icon.svg'}
                                  alt="eye-icon"
                                  layout="fill"
                                />
                              </div>

                              <div>
                                <div className="text-xs text-black/[.5] font-medium">
                                  Income
                                </div>
                                <div>
                                  <span className="font-bold">
                                    {postIncome} ETH
                                  </span>
                                  <span className="text-black/[.5] font-bold text-xs">
                                    {' '}
                                    (${imPost?.incomeInDAI?.toFixed(2)})
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </A>
                    </div>

                    <div className="mt-2">
                      <OpenRateModal imPost={imPost} />
                    </div>
                  </div>

                  <div
                    className={classNames(AdvancedCitationsColWidth, 'text-xs')}
                  >
                    {imPost?.topCitations?.length > 0 &&
                      imPost?.topCitations.map((citation, cInd) => {
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
                                  citation?.totalRatingsCount > 0
                                    ? Math.round(citation?.compositeRating)
                                    : -1
                                ),
                                'absolute top-0 right-0 w-10 h-10 flex justify-center items-center rounded-tr-2xl rounded-bl-2xl font-extrabold text-base border-l-2 border-b-2 border-white'
                              )}
                            >
                              {citation?.totalRatingsCount > 0
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
                                      @{citation?.minterToken?.twitterUsername}
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
                </div>
              )
            })}
        </div>
      )}
    </div>
  )
}

export default IMPostsView
