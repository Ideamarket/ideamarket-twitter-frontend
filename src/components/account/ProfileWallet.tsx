import { flatten } from 'lodash'
import classNames from 'classnames'
import { useState, useEffect, useContext } from 'react'
import { useInfiniteQuery } from 'react-query'
import { Tooltip } from '../../components'
import ModalService from 'components/modals/ModalService'
import WalletFilters from './WalletFilters'
import RatingsTable from 'modules/ratings/components/RatingsTable'
import { GlobalContext } from 'lib/GlobalContext'
import { SortOptionsAccountOpinions, TABLE_NAMES } from 'utils/tables'
import { getAllTwitterOpinions } from 'modules/ratings/services/TwitterOpinionService'
import InitTwitterLoginModal from './InitTwitterLoginModal'
import NewOpinionModal from 'modules/posts/components/NewOpinionModal'
import { IdeamarketTwitterPost } from 'modules/posts/services/TwitterPostService'

const TOKENS_PER_PAGE = 10

const infiniteQueryConfig = {
  getNextPageParam: (lastGroup, allGroups) => {
    const morePagesExist = lastGroup?.length === TOKENS_PER_PAGE

    if (!morePagesExist) {
      return false
    }

    return allGroups.length * TOKENS_PER_PAGE
  },
  refetchOnMount: false,
  refetchOnWindowFocus: false,
  enabled: true,
  keepPreviousData: true,
}

type Props = {
  userData?: any
}

export default function ProfileWallet({ userData }: Props) {
  const { isTxPending, jwtToken } = useContext(GlobalContext)

  const [isVerifiedFilterActive, setIsVerifiedFilterActive] = useState(false)
  const [isStarredFilterActive, setIsStarredFilterActive] = useState(false)
  const [isLockedFilterActive, setIsLockedFilterActive] = useState(false)
  const [nameSearch, setNameSearch] = useState('')

  const [selectedView, setSelectedView] = useState(TABLE_NAMES.ACCOUNT_OPINIONS)
  const [orderBy, setOrderBy] = useState(
    SortOptionsAccountOpinions.RATING.value
  )
  const [orderDirection, setOrderDirection] = useState('desc')

  // const {
  //   data: infiniteUserRecommendedData,
  //   isFetching: isUserRecommendedDataLoading,
  //   fetchNextPage: fetchMoreUserRecommended,
  //   refetch: refetchUserRecommended,
  //   hasNextPage: canFetchMoreUserRecommended,
  // } = useInfiniteQuery(
  //   ['user-recommended'],
  //   ({ pageParam = 0 }) =>
  //     userRecommendedQueryFunction(TOKENS_PER_PAGE, pageParam),
  //   infiniteQueryConfig
  // )

  // const userRecommendedPairs = flatten(infiniteUserRecommendedData?.pages || [])

  // const {
  //   data: infiniteUserPostData,
  //   isFetching: isUserPostDataLoading,
  //   fetchNextPage: fetchMoreUserPosts,
  //   refetch: refetchUserPosts,
  //   hasNextPage: canFetchMoreUserPosts,
  // } = useInfiniteQuery(
  //   ['user-posts', selectedView, userData?.twitterUsername],
  //   ({ pageParam = 0 }) => userPostsQueryFunction(TOKENS_PER_PAGE, pageParam),
  //   infiniteQueryConfig
  // )

  // const userPostPairs = flatten(infiniteUserPostData?.pages || [])

  const {
    data: infiniteRatingsData,
    isFetching: isRatingsDataLoading,
    fetchNextPage: fetchMoreRatings,
    refetch: refetchRatings,
    hasNextPage: canFetchMoreRatings,
  } = useInfiniteQuery(
    ['ratings', selectedView, userData?.twitterUsername],
    ({ pageParam = 0 }) => ratingsQueryFunction(TOKENS_PER_PAGE, pageParam),
    infiniteQueryConfig
  )

  const ratingPairs = flatten(infiniteRatingsData?.pages || [])

  function refetch() {
    refetchRatings()
    // refetchUserPosts()
    // refetchUserRecommended()
  }

  useEffect(() => {
    refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    orderBy,
    orderDirection,
    userData,
    isStarredFilterActive,
    isLockedFilterActive,
    nameSearch,
    isTxPending, // If any transaction starts or stop, refresh data
  ])

  // async function userRecommendedQueryFunction(
  //   numTokens: number,
  //   skip: number = 0
  // ) {
  //   if (selectedView !== TABLE_NAMES.ACCOUNT_RECOMMENDED) return []
  //   if (!userData || !userData?.walletAddress) return []

  //   const recommendedUsers = await getRecommendedUsersByWallet({
  //     walletAddress: userData?.walletAddress,
  //     limit: numTokens,
  //     orderBy,
  //     orderDirection,
  //     skip,
  //   })

  //   return recommendedUsers || []
  // }

  // async function userPostsQueryFunction(numTokens: number, skip: number = 0) {
  //   if (selectedView !== TABLE_NAMES.ACCOUNT_POSTS) return []
  //   if (!userData || !userData?.walletAddress) return []

  //   const latestUserOpinions = await getAllPosts(
  //     [
  //       numTokens,
  //       orderBy,
  //       orderDirection,
  //       null,
  //       filterTokens,
  //       nameSearch,
  //       userData?.walletAddress,
  //       TIME_FILTER.ALL_TIME,
  //     ],
  //     skip
  //   )

  //   return latestUserOpinions || []
  // }

  async function ratingsQueryFunction(numTokens: number, skip: number = 0) {
    if (
      selectedView !== TABLE_NAMES.ACCOUNT_OPINIONS ||
      !userData?.twitterUsername
    )
      return []

    const latestUserOpinions = await getAllTwitterOpinions({
      ratedPostID: null,
      ratedBy: userData?.twitterUsername,
      skip,
      limit: numTokens,
      orderBy: orderBy,
      orderDirection,
      search: nameSearch,
      latest: true,
    })

    return latestUserOpinions || []
  }

  function headerClicked(headerValue: string) {
    if (orderBy === headerValue) {
      if (orderDirection === 'asc') {
        setOrderDirection('desc')
      } else {
        setOrderDirection('asc')
      }
    } else {
      setOrderBy(headerValue)
      setOrderDirection('desc')
    }
  }

  const onRateClicked = (post: IdeamarketTwitterPost) => {
    if (!jwtToken) {
      ModalService.open(InitTwitterLoginModal)
    } else {
      ModalService.open(NewOpinionModal, { defaultRatedPost: post })
    }
  }

  return (
    <div className="w-full h-full mt-8 pb-20">
      <div className="flex flex-col overflow-auto justify-between sm:flex-row mb-0 md:mb-4">
        <div className="flex order-1 md:order-none mx-4">
          {/* <div
            className={classNames(
              selectedView === TABLE_NAMES.ACCOUNT_RECOMMENDED
                ? 'text-white'
                : 'text-brand-gray text-opacity-60 cursor-pointer',
              'text-lg font-semibold flex flex-col justify-end mb-2.5 pr-6'
            )}
            onClick={() => {
              setSelectedView(TABLE_NAMES.ACCOUNT_RECOMMENDED)
              setOrderBy(SortOptionsAccountRecommended.MATCH_SCORE.value)
              setOrderDirection('desc')
            }}
          >
            Similar Users
          </div> */}

          <div
            className={classNames(
              selectedView === TABLE_NAMES.ACCOUNT_OPINIONS
                ? 'text-white'
                : 'text-brand-gray text-opacity-60 cursor-pointer',
              'text-lg font-semibold flex flex-col justify-end mb-2.5 pr-6'
            )}
            onClick={() => {
              setSelectedView(TABLE_NAMES.ACCOUNT_OPINIONS)
              setOrderBy(SortOptionsAccountOpinions.MARKET_INTEREST.value)
              setOrderDirection('desc')
            }}
          >
            Ratings
          </div>

          {/* <div
            className={classNames(
              selectedView === TABLE_NAMES.ACCOUNT_POSTS
                ? 'text-white'
                : 'text-brand-gray text-opacity-60 cursor-pointer',
              'text-lg font-semibold flex flex-col justify-end mb-2.5 pr-6'
            )}
            onClick={() => {
              setSelectedView(TABLE_NAMES.ACCOUNT_POSTS)
              setOrderBy(SortOptionsAccountPosts.MARKET_INTEREST.value)
              setOrderDirection('desc')
            }}
          >
            Posts
          </div> */}
        </div>
      </div>

      {/* Don't show table HTML if selected view is not table */}
      {selectedView !== TABLE_NAMES.ACCOUNT_HOLDERS &&
        selectedView !== TABLE_NAMES.ACCOUNT_STAKED_ON && (
          <div className="bg-white border rounded-md dark:bg-gray-700 dark:border-gray-500 border-brand-border-gray ">
            <WalletFilters
              selectedView={selectedView}
              isVerifiedFilterActive={isVerifiedFilterActive}
              isStarredFilterActive={isStarredFilterActive}
              isLockedFilterActive={isLockedFilterActive}
              nameSearch={nameSearch}
              orderBy={orderBy}
              onMarketChanged={() => null}
              onNameSearchChanged={setNameSearch}
              setIsVerifiedFilterActive={setIsVerifiedFilterActive}
              setIsStarredFilterActive={setIsStarredFilterActive}
              setIsLockedFilterActive={setIsLockedFilterActive}
              setOrderBy={setOrderBy}
            />

            {/* Mobile header to explain columns */}
            {selectedView === TABLE_NAMES.ACCOUNT_POSTS && (
              <div className="md:hidden w-full flex gap-x-3 px-3 py-3 border-t-[6px] leading-4 text-xs text-black/[.5] font-semibold">
                <div className="w-1/4 flex items-start">
                  <span className="mr-1 break-all">HOT</span>
                  <Tooltip>
                    <div className="w-40 md:w-64">
                      The total amount of IMO staked on all users who rated a
                      post
                    </div>
                  </Tooltip>
                </div>

                <div className="w-1/4 flex items-start">
                  <span className="mr-1">AVERAGE RATING</span>
                  {/* <Tooltip>
                    <div className="w-full md:w-64">
                      Rating weighted by IMO staked on each user. The more IMO
                      staked on a user, the more that user’s ratings affect the
                      IMO Rating of every post they rate.
                    </div>
                  </Tooltip> */}
                </div>

                <div className="w-1/4 break-all">RATINGS</div>

                <div className="w-1/4"></div>
              </div>
            )}

            {/* Mobile header to explain columns for Similar Users */}
            {selectedView === TABLE_NAMES.ACCOUNT_RECOMMENDED && (
              <div className="md:hidden w-full flex gap-x-3 px-3 py-3 border-t-[6px] leading-4 text-xs text-black/[.5] font-semibold">
                <div className="w-[20%] flex items-start">
                  <span className="mr-1 break-all">% MATCH</span>
                </div>

                <div className="w-[20%] flex items-start">
                  <span className="mr-1">POSTS IN COMMON</span>
                </div>

                <div className="w-[30%] flex items-start">
                  <span className="mr-1 break-all">STAKED</span>
                </div>

                <div className="w-[30%]"></div>
              </div>
            )}

            <div className="border-t border-brand-border-gray dark:border-gray-500 shadow-home ">
              {/* {selectedView === TABLE_NAMES.ACCOUNT_RECOMMENDED &&
                web3 !== undefined && (
                  <UserRecommendedTable
                    rawPairs={userRecommendedPairs}
                    isPairsDataLoading={isUserRecommendedDataLoading}
                    refetch={refetch}
                    canFetchMore={canFetchMoreUserRecommended}
                    orderDirection={orderDirection}
                    orderBy={orderBy}
                    fetchMore={fetchMoreUserRecommended}
                    headerClicked={headerClicked}
                    onStakeClicked={onStakeClicked}
                  />
                )} */}

              {/* {selectedView === TABLE_NAMES.ACCOUNT_POSTS &&
                web3 !== undefined && (
                  <UserPostsTable
                    rawPairs={userPostPairs}
                    isPairsDataLoading={isUserPostDataLoading}
                    refetch={refetch}
                    canFetchMore={canFetchMoreUserPosts}
                    orderDirection={orderDirection}
                    orderBy={orderBy}
                    fetchMore={fetchMoreUserPosts}
                    headerClicked={headerClicked}
                    onRateClicked={onRateClicked}
                  />
                )} */}

              {selectedView === TABLE_NAMES.ACCOUNT_OPINIONS && userData && (
                <RatingsTable
                  rawPairs={ratingPairs}
                  isPairsDataLoading={isRatingsDataLoading}
                  refetch={refetch}
                  canFetchMore={canFetchMoreRatings}
                  orderDirection={orderDirection}
                  orderBy={orderBy}
                  fetchMore={fetchMoreRatings}
                  headerClicked={headerClicked}
                  onRateClicked={onRateClicked}
                />
              )}
            </div>
          </div>
        )}
    </div>
  )
}
