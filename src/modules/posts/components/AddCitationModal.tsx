import {
  ArrowCircleLeftIcon,
  ArrowCircleRightIcon,
  ChevronDownIcon,
  PencilIcon,
} from '@heroicons/react/outline'
import { useWeb3React } from '@web3-react/core'
import classNames from 'classnames'
import { A, Modal } from 'components'
import DropdownButtons from 'components/dropdowns/DropdownButtons'
import { GlobalContext } from 'lib/GlobalContext'
import { convertAccountName } from 'lib/utils/stringUtil'
import { flatten } from 'lodash'
import { getAllCitationsByPostID } from 'modules/citations/services/CitationService'
import { getUsersLatestOpinions } from 'modules/ratings/services/OpinionService'
import Image from 'next/image'
import {
  MutableRefObject,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useInfiniteQuery } from 'react-query'
import { getIMORatingColors, urlify } from 'utils/display/DisplayUtils'
import {
  getSortOptionDisplayNameByValue,
  SortOptionsAddCitationsModal,
  TABLE_NAMES,
  TIME_FILTER,
} from 'utils/tables'
import useOnClickOutside from 'utils/useOnClickOutside'
import { getAllPosts, IdeamarketPost } from '../services/PostService'

const TOKENS_PER_PAGE = 5

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
  enabled: false,
  keepPreviousData: true,
}

enum FILTER_BY {
  NONE,
  MY_RATINGS,
  MY_POSTS,
}

type AddCitationModalProps = {
  close: () => void
  rootPost: any
  citations: number[]
  inFavorArray: boolean[]
  selectedPosts: IdeamarketPost[]
  setCitations: (citations: number[]) => void
  setInFavorArray: (inFavorArray: boolean[]) => void
  setSelectedPosts: (selectedPosts: IdeamarketPost[]) => void
}

export default function AddCitationModal({
  close,
  rootPost,
  citations,
  inFavorArray,
  selectedPosts,
  setCitations,
  setInFavorArray,
  setSelectedPosts,
}: AddCitationModalProps) {
  const { isTxPending } = useContext(GlobalContext)
  const { account } = useWeb3React()

  const [isSortingDropdownOpen, setIsSortingDropdownOpen] = useState(false)
  const ref = useRef()
  useOnClickOutside(ref, () => setIsSortingDropdownOpen(false))

  const [orderBy, setOrderBy] = useState(
    SortOptionsAddCitationsModal.MARKET_INTEREST.value
  )
  const [filterBy, setFilterBy] = useState(FILTER_BY.NONE)

  const [postSearchText, setPostSearchText] = useState('')

  const [localCitations, setLocalCitations] = useState(citations)
  const [localInFavorArray, setLocalInFavorArray] = useState(inFavorArray)
  const [localSelectedPosts, setLocalSelectedPosts] = useState(selectedPosts)

  const {
    data: infiniteRatingsData,
    fetchNextPage: fetchMoreRatings,
    refetch: refetchRatings,
    hasNextPage: canFetchMoreRatings,
  } = useInfiniteQuery(
    ['ratings'],
    ({ pageParam = 0 }) => ratingsQueryFunction(100, pageParam),
    infiniteQueryConfig
  )

  const ratingPairs = flatten(infiniteRatingsData?.pages || [])

  useEffect(() => {
    refetchRatings()
  }, [filterBy, orderBy, postSearchText, refetchRatings, isTxPending])

  async function ratingsQueryFunction(numTokens: number, skip: number = 0) {
    const latestUserOpinions = await getUsersLatestOpinions({
      walletAddress: account,
      skip,
      limit: numTokens,
      orderBy,
      orderDirection: 'desc',
      filterTokens: [],
      search: postSearchText,
    })

    return latestUserOpinions || []
  }

  const {
    data: infiniteSearchedPosts,
    fetchNextPage: fetchMoreSearchedPosts,
    refetch: refetchSearchedPosts,
    hasNextPage: canFetchMoreSearchedPosts,
  } = useInfiniteQuery(
    [
      TOKENS_PER_PAGE,
      orderBy,
      // orderDirection,
      // selectedCategories,
      // filterTokens,
      postSearchText,
    ],
    ({ pageParam = 0 }) =>
      getAllPosts(
        [TOKENS_PER_PAGE, orderBy, 'desc', [], [], postSearchText, null, null],
        pageParam
      ),
    infiniteQueryConfig
  )

  const searchedPosts = flatten(infiniteSearchedPosts?.pages || [])

  useEffect(() => {
    refetchSearchedPosts()
  }, [orderBy, postSearchText, refetchSearchedPosts, isTxPending])

  async function citationsQueryFunction(numTokens: number, skip: number = 0) {
    const latestCitations = await getAllCitationsByPostID({
      postID: rootPost?.tokenID,
      latest: false,
      skip,
      limit: numTokens,
      orderBy: orderBy,
      orderDirection: 'desc',
    })

    return latestCitations || []
  }

  const {
    data: infiniteCitationsData,
    // isFetching: isCitationsDataLoading,
    fetchNextPage: fetchMoreCitations,
    refetch: refetchCitations,
    hasNextPage: canFetchMoreCitations,
  } = useInfiniteQuery(
    ['citations-of-post'],
    ({ pageParam = 0 }) => citationsQueryFunction(TOKENS_PER_PAGE, pageParam),
    infiniteQueryConfig
  )

  const combinedCitationsPairs = infiniteCitationsData?.pages[0] || []

  useEffect(() => {
    refetchCitations()
  }, [orderBy, postSearchText, refetchCitations, isTxPending])

  async function userPostsQueryFunction(numTokens: number, skip: number = 0) {
    if (filterBy !== FILTER_BY.MY_POSTS) return []

    const latestUserPosts = await getAllPosts(
      [numTokens, orderBy, 'desc', null, [], '', account, TIME_FILTER.ALL_TIME],
      skip
    )

    return latestUserPosts || []
  }

  const {
    data: infiniteUserPostData,
    // isFetching: isUserPostDataLoading,
    fetchNextPage: fetchMoreUserPosts,
    refetch: refetchUserPosts,
    hasNextPage: canFetchMoreUserPosts,
  } = useInfiniteQuery(
    ['user-posts'],
    ({ pageParam = 0 }) => userPostsQueryFunction(100, pageParam),
    infiniteQueryConfig
  )

  const userPostPairs = infiniteUserPostData?.pages[0] || []

  useEffect(() => {
    refetchUserPosts()
  }, [filterBy, orderBy, postSearchText, refetchUserPosts, isTxPending])

  const onAddCitationClicked = () => {
    setCitations(localCitations)
    setInFavorArray(localInFavorArray)
    setSelectedPosts(localSelectedPosts)
    close()
  }

  const onLocalCitationChanged = (
    post: IdeamarketPost,
    isForReasoning: boolean
  ) => {
    const isCitationAlreadyCited = localCitations.includes(post.tokenID)
    const indexOfAlreadyCited = localCitations.indexOf(post.tokenID)
    const citationsWithOldCitationRemoved = localCitations.filter(
      (c) => c !== post.tokenID
    )
    const inFavorArrayWithOldRemoved = isCitationAlreadyCited
      ? localInFavorArray.filter((ele, ind) => ind !== indexOfAlreadyCited)
      : localInFavorArray
    const selectedPostsWithOldRemoved = isCitationAlreadyCited
      ? localSelectedPosts.filter((ele, ind) => ind !== indexOfAlreadyCited)
      : localSelectedPosts

    const newLocalCitations = isCitationAlreadyCited
      ? [...citationsWithOldCitationRemoved]
      : [...citationsWithOldCitationRemoved, post.tokenID]
    const newLocalInFavorArray = isCitationAlreadyCited
      ? [...inFavorArrayWithOldRemoved]
      : [...inFavorArrayWithOldRemoved, isForReasoning]
    const newLocalSelectedPosts = isCitationAlreadyCited
      ? [...selectedPostsWithOldRemoved]
      : [...selectedPostsWithOldRemoved, post]

    setLocalCitations(newLocalCitations)
    setLocalInFavorArray(newLocalInFavorArray)
    setLocalSelectedPosts(newLocalSelectedPosts)
  }

  const observer: MutableRefObject<any> = useRef()

  const lastElementRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect()

      observer.current = new IntersectionObserver(
        (entries) => {
          // entries[0].target.style.backgroundColor = 'green'
          if (entries[0].isIntersecting && canFetchMoreSearchedPosts) {
            // console.log('isIntersecting is true')
            fetchMoreSearchedPosts()
          }
          if (entries[0].isIntersecting && canFetchMoreRatings) {
            fetchMoreRatings()
          }
          if (entries[0].isIntersecting && canFetchMoreCitations) {
            fetchMoreCitations()
          }
          if (entries[0].isIntersecting && canFetchMoreUserPosts) {
            fetchMoreUserPosts()
          }
        },
        {
          // root: rootObserver.current
        }
      )

      if (node) {
        observer.current.observe(node)
      }
    },
    [
      canFetchMoreSearchedPosts,
      canFetchMoreRatings,
      canFetchMoreCitations,
      canFetchMoreUserPosts,
      fetchMoreSearchedPosts,
      fetchMoreRatings,
      fetchMoreCitations,
      fetchMoreUserPosts,
    ]
  )

  return (
    <Modal close={close}>
      <div className="w-full md:w-136 mx-auto bg-white dark:bg-gray-700 rounded-xl">
        <div className="px-6 py-4 bg-black/[.05]">
          <input
            onChange={(event) => setPostSearchText(event.target.value)}
            placeholder="Search posts to cite..."
            className="bg-transparent focus:outline-none px-2 py-1"
          />
        </div>

        <div className="px-6 py-4">
          <div className="pb-6">
            <button
              onClick={onAddCitationClicked}
              disabled={localCitations?.length <= 0}
              className={classNames(
                localCitations?.length <= 0
                  ? 'text-brand-gray-2 dark:text-gray-300 bg-brand-gray dark:bg-gray-500 cursor-default'
                  : 'text-white bg-blue-600 hover:bg-blue-800',
                'py-4 mt-4 text-lg font-bold rounded-2xl w-full'
              )}
            >
              Add Citation
            </button>
          </div>

          {/* Filters */}
          <div className="mb-4 flex items-center space-x-2 text-sm ">
            <button
              onClick={() =>
                setFilterBy(
                  filterBy === FILTER_BY.MY_POSTS
                    ? FILTER_BY.NONE
                    : FILTER_BY.MY_POSTS
                )
              }
              className={classNames(
                filterBy === FILTER_BY.MY_POSTS
                  ? 'bg-blue-600 text-white'
                  : 'text-black',
                'border px-3 py-2 flex items-center rounded-2xl font-medium'
              )}
            >
              <span>My Posts</span>
            </button>

            <button
              onClick={() =>
                setFilterBy(
                  filterBy === FILTER_BY.MY_RATINGS
                    ? FILTER_BY.NONE
                    : FILTER_BY.MY_RATINGS
                )
              }
              className={classNames(
                filterBy === FILTER_BY.MY_RATINGS
                  ? 'bg-blue-600 text-white'
                  : 'text-black',
                'border px-3 py-2 flex items-center rounded-2xl font-medium'
              )}
            >
              <PencilIcon className="w-4 mr-1" />
              <span>Rated By You</span>
            </button>

            <div
              onClick={() =>
                setIsSortingDropdownOpen((prevState) => !prevState)
              }
              className="relative px-3 py-2 border rounded-2xl flex justify-center items-center cursor-pointer font-medium"
            >
              <span>
                Sort By:{' '}
                {getSortOptionDisplayNameByValue(
                  orderBy,
                  TABLE_NAMES.ADD_CITATION_MODAL
                )}
              </span>
              <span className="ml-1">
                <ChevronDownIcon className="h-3" />
              </span>
              {isSortingDropdownOpen && (
                <DropdownButtons
                  container={ref}
                  filters={Object.values(SortOptionsAddCitationsModal)}
                  selectedOptions={new Set([orderBy])}
                  toggleOption={setOrderBy}
                />
              )}
            </div>
          </div>

          {/* Against - Selected - For HEADER */}
          <div className="mb-4 flex justify-between items-center font-bold">
            <span className="text-[#e63b3b] text-sm">
              <ArrowCircleLeftIcon className="w-5 cursor-pointer mr-1" />
              <span>AGAINST</span>
              <span className="ml-1">
                ({localInFavorArray.filter((ele) => !ele).length})
              </span>
            </span>

            <span className=" text-sm">
              Selected{' '}
              <span className="font-semibold">{localCitations?.length}</span>{' '}
              <span className="text-black/[.3]">(Maximum 10)</span>
            </span>

            <span className="text-[#0cae74] text-sm flex items-center">
              <span className="mr-1">
                ({localInFavorArray.filter((ele) => ele).length})
              </span>
              <span>FOR</span>
              <ArrowCircleRightIcon className="w-5 cursor-pointer ml-1" />
            </span>
          </div>

          {/* Show this (all citations of post) by default if there are citations */}
          {combinedCitationsPairs?.length > 0 && filterBy === FILTER_BY.NONE && (
            <div className="">
              {combinedCitationsPairs &&
                combinedCitationsPairs.map((post, postInd) => {
                  const { minterAddress } = (post || {}) as any

                  const displayUsernameOrWallet = convertAccountName(
                    post?.minterToken?.username || minterAddress
                  )
                  const usernameOrWallet =
                    post?.minterToken?.username || minterAddress

                  const isCitationAlreadyCited = localCitations.includes(
                    post.tokenID
                  )
                  const indexOfAlreadyCited = localCitations.indexOf(
                    post.tokenID
                  )
                  const isInFavor = localInFavorArray[indexOfAlreadyCited]

                  // const cutOffContent = post?.content?.length > 280
                  const postText = true
                    ? post?.content
                    : post?.content.slice(0, 280) + '...'

                  if (isCitationAlreadyCited && !isInFavor) {
                    return (
                      <div
                        ref={lastElementRef}
                        className="flex items-center w-full mb-2"
                        key={postInd}
                      >
                        <div className="relative w-[85%] bg-[#ec4a4a]/[.25] rounded-lg p-4 cursor-pointer">
                          <A
                            href={`/post/${post?.tokenID}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <span
                              className={classNames(
                                getIMORatingColors(
                                  post?.totalRatingsCount > 0
                                    ? // && post?.marketInterest > 0
                                      Math.round(post?.averageRating)
                                    : -1
                                ),
                                'absolute top-0 right-0 w-14 h-12 flex justify-center items-center rounded-tr-lg rounded-bl-lg font-extrabold text-xl'
                              )}
                            >
                              {post?.totalRatingsCount > 0
                                ? Math.round(post?.averageRating) + '%'
                                : '—'}
                            </span>

                            <div className="flex items-center pb-2 whitespace-nowrap">
                              <div className="relative rounded-full w-6 h-6">
                                <Image
                                  className="rounded-full"
                                  src={
                                    post?.minterToken?.profilePhoto ||
                                    '/default-profile-pic.png'
                                  }
                                  alt=""
                                  layout="fill"
                                  objectFit="cover"
                                />
                              </div>
                              <A
                                className="ml-2 font-bold hover:text-blue-600"
                                href={`/u/${usernameOrWallet}`}
                              >
                                {displayUsernameOrWallet}
                              </A>
                            </div>

                            <div className="relative">
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: urlify(postText),
                                }}
                                className="whitespace-pre-wrap break-words relative z-50 text-base text-black font-medium"
                                style={{ wordBreak: 'break-word' }} // Fixes overflow issue on browsers that dont support break-words above
                              />

                              {/* {cutOffContent && (
                                <A
                                  href={`/post/${post?.tokenID}`}
                                  className="absolute bottom-0 right-0 text-blue-500 z-[60]"
                                >
                                  (More...)
                                </A>
                              )} */}
                            </div>
                          </A>
                        </div>

                        <div className="w-[15%] flex justify-end">
                          <ArrowCircleRightIcon
                            onClick={() => onLocalCitationChanged(post, true)}
                            className="w-5 cursor-pointer"
                          />
                        </div>
                      </div>
                    )
                  }

                  if (isCitationAlreadyCited && isInFavor) {
                    return (
                      <div
                        ref={lastElementRef}
                        className="flex items-center w-full mb-2"
                        key={postInd}
                      >
                        <div className="w-[15%]">
                          <ArrowCircleLeftIcon
                            onClick={() => onLocalCitationChanged(post, false)}
                            className="w-5 cursor-pointer"
                          />
                        </div>

                        <div className="relative w-[85%] bg-[#0cae74]/[.25] rounded-lg p-4 cursor-pointer">
                          <A
                            href={`/post/${post?.tokenID}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <span
                              className={classNames(
                                getIMORatingColors(
                                  post?.totalRatingsCount > 0
                                    ? Math.round(post?.averageRating)
                                    : -1
                                ),
                                'absolute top-0 right-0 w-14 h-12 flex justify-center items-center rounded-tr-lg rounded-bl-lg font-extrabold text-xl'
                              )}
                            >
                              {post?.totalRatingsCount > 0
                                ? Math.round(post?.averageRating) + '%'
                                : '—'}
                            </span>

                            <div className="flex items-center pb-2 whitespace-nowrap">
                              <div className="relative rounded-full w-6 h-6">
                                <Image
                                  className="rounded-full"
                                  src={
                                    post?.minterToken?.profilePhoto ||
                                    '/default-profile-pic.png'
                                  }
                                  alt=""
                                  layout="fill"
                                  objectFit="cover"
                                />
                              </div>
                              <A
                                className="ml-2 font-bold hover:text-blue-600"
                                href={`/u/${usernameOrWallet}`}
                              >
                                {displayUsernameOrWallet}
                              </A>
                            </div>

                            <div className="relative">
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: urlify(postText),
                                }}
                                className="whitespace-pre-wrap break-words relative z-50 text-base text-black font-medium"
                                style={{ wordBreak: 'break-word' }} // Fixes overflow issue on browsers that dont support break-words above
                              />

                              {/* {cutOffContent && (
                                <A
                                  href={`/post/${post?.tokenID}`}
                                  className="absolute bottom-0 right-0 text-blue-500 z-[60]"
                                >
                                  (More...)
                                </A>
                              )} */}
                            </div>
                          </A>
                        </div>
                      </div>
                    )
                  }

                  // If !isCitationAlreadyCited
                  return (
                    <div
                      ref={lastElementRef}
                      className="flex items-center w-full mb-2"
                      key={postInd}
                    >
                      <div className="w-[15%]">
                        <ArrowCircleLeftIcon
                          onClick={() => onLocalCitationChanged(post, false)}
                          className="w-5 cursor-pointer"
                        />
                      </div>

                      <div className="relative w-[70%] bg-black/[.05] rounded-lg p-4 cursor-pointer">
                        <A
                          href={`/post/${post?.tokenID}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <span
                            className={classNames(
                              getIMORatingColors(
                                post?.totalRatingsCount > 0
                                  ? Math.round(post?.averageRating)
                                  : -1
                              ),
                              'absolute top-0 right-0 w-14 h-12 flex justify-center items-center rounded-tr-lg rounded-bl-lg font-extrabold text-xl'
                            )}
                          >
                            {post?.totalRatingsCount > 0
                              ? Math.round(post?.averageRating) + '%'
                              : '—'}
                          </span>

                          <div className="flex items-center pb-2 whitespace-nowrap">
                            <div className="relative rounded-full w-6 h-6">
                              <Image
                                className="rounded-full"
                                src={
                                  post?.minterToken?.profilePhoto ||
                                  '/default-profile-pic.png'
                                }
                                alt=""
                                layout="fill"
                                objectFit="cover"
                              />
                            </div>
                            <A
                              className="ml-2 font-bold hover:text-blue-600"
                              href={`/u/${usernameOrWallet}`}
                            >
                              {displayUsernameOrWallet}
                            </A>
                          </div>

                          <div className="relative">
                            <div
                              dangerouslySetInnerHTML={{
                                __html: urlify(postText),
                              }}
                              className="whitespace-pre-wrap break-words relative z-50 text-base text-black font-medium"
                              style={{ wordBreak: 'break-word' }} // Fixes overflow issue on browsers that dont support break-words above
                            />

                            {/* {cutOffContent && (
                              <A
                                href={`/post/${post?.tokenID}`}
                                className="absolute bottom-0 right-0 text-blue-500 z-[60]"
                              >
                                (More...)
                              </A>
                            )} */}
                          </div>
                        </A>
                      </div>

                      <div className="w-[15%] flex justify-end">
                        <ArrowCircleRightIcon
                          onClick={() => onLocalCitationChanged(post, true)}
                          className="w-5 cursor-pointer"
                        />
                      </div>
                    </div>
                  )
                })}
            </div>
          )}

          {/* Show this (search of all Posts on IM) when user text searches for a Post or if there are no citations */}
          {(postSearchText?.length > 0 ||
            combinedCitationsPairs?.length <= 0) && (
            <div className="">
              {searchedPosts &&
                searchedPosts.map((post, postInd) => {
                  const { minterAddress } = (post || {}) as any

                  const displayUsernameOrWallet = convertAccountName(
                    post?.minterToken?.username || minterAddress
                  )
                  const usernameOrWallet =
                    post?.minterToken?.username || minterAddress

                  const isCitationAlreadyCited = localCitations.includes(
                    post.tokenID
                  )
                  const indexOfAlreadyCited = localCitations.indexOf(
                    post.tokenID
                  )
                  const isInFavor = localInFavorArray[indexOfAlreadyCited]

                  // const cutOffContent = post?.content?.length > 280
                  const postText = true
                    ? post?.content
                    : post?.content.slice(0, 280) + '...'

                  if (isCitationAlreadyCited && !isInFavor) {
                    return (
                      <div
                        ref={lastElementRef}
                        className="flex items-center w-full mb-2"
                        key={postInd}
                      >
                        <div className="relative w-[85%] bg-[#ec4a4a]/[.25] rounded-lg p-4 cursor-pointer">
                          <A
                            href={`/post/${post?.tokenID}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <span
                              className={classNames(
                                getIMORatingColors(
                                  post?.totalRatingsCount > 0
                                    ? Math.round(post?.averageRating)
                                    : -1
                                ),
                                'absolute top-0 right-0 w-14 h-12 flex justify-center items-center rounded-tr-lg rounded-bl-lg font-extrabold text-xl'
                              )}
                            >
                              {post?.totalRatingsCount > 0
                                ? Math.round(post?.averageRating) + '%'
                                : '—'}
                            </span>

                            <div className="flex items-center pb-2 whitespace-nowrap">
                              <div className="relative rounded-full w-6 h-6">
                                <Image
                                  className="rounded-full"
                                  src={
                                    post?.minterToken?.profilePhoto ||
                                    '/default-profile-pic.png'
                                  }
                                  alt=""
                                  layout="fill"
                                  objectFit="cover"
                                />
                              </div>
                              <A
                                className="ml-2 font-bold hover:text-blue-600"
                                href={`/u/${usernameOrWallet}`}
                              >
                                {displayUsernameOrWallet}
                              </A>
                            </div>

                            <div className="relative">
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: urlify(postText),
                                }}
                                className="whitespace-pre-wrap break-words relative z-50 text-base text-black font-medium"
                                style={{ wordBreak: 'break-word' }} // Fixes overflow issue on browsers that dont support break-words above
                              />

                              {/* {cutOffContent && (
                                <A
                                  href={`/post/${post?.tokenID}`}
                                  className="absolute bottom-0 right-0 text-blue-500 z-[60]"
                                >
                                  (More...)
                                </A>
                              )} */}
                            </div>
                          </A>
                        </div>

                        <div className="w-[15%] flex justify-end">
                          <ArrowCircleRightIcon
                            onClick={() => onLocalCitationChanged(post, true)}
                            className="w-5 cursor-pointer"
                          />
                        </div>
                      </div>
                    )
                  }

                  if (isCitationAlreadyCited && isInFavor) {
                    return (
                      <div
                        ref={lastElementRef}
                        className="flex items-center w-full mb-2"
                        key={postInd}
                      >
                        <div className="w-[15%]">
                          <ArrowCircleLeftIcon
                            onClick={() => onLocalCitationChanged(post, false)}
                            className="w-5 cursor-pointer"
                          />
                        </div>

                        <div className="relative w-[85%] bg-[#0cae74]/[.25] rounded-lg p-4 cursor-pointer">
                          <A
                            href={`/post/${post?.tokenID}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <span
                              className={classNames(
                                getIMORatingColors(
                                  post?.totalRatingsCount > 0
                                    ? Math.round(post?.averageRating)
                                    : -1
                                ),
                                'absolute top-0 right-0 w-14 h-12 flex justify-center items-center rounded-tr-lg rounded-bl-lg font-extrabold text-xl'
                              )}
                            >
                              {post?.totalRatingsCount > 0
                                ? Math.round(post?.averageRating) + '%'
                                : '—'}
                            </span>

                            <div className="flex items-center pb-2 whitespace-nowrap">
                              <div className="relative rounded-full w-6 h-6">
                                <Image
                                  className="rounded-full"
                                  src={
                                    post?.minterToken?.profilePhoto ||
                                    '/default-profile-pic.png'
                                  }
                                  alt=""
                                  layout="fill"
                                  objectFit="cover"
                                />
                              </div>
                              <A
                                className="ml-2 font-bold hover:text-blue-600"
                                href={`/u/${usernameOrWallet}`}
                              >
                                {displayUsernameOrWallet}
                              </A>
                            </div>

                            <div className="relative">
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: urlify(postText),
                                }}
                                className="whitespace-pre-wrap break-words relative z-50 text-base text-black font-medium"
                                style={{ wordBreak: 'break-word' }} // Fixes overflow issue on browsers that dont support break-words above
                              />

                              {/* {cutOffContent && (
                                <A
                                  href={`/post/${post?.tokenID}`}
                                  className="absolute bottom-0 right-0 text-blue-500 z-[60]"
                                >
                                  (More...)
                                </A>
                              )} */}
                            </div>
                          </A>
                        </div>
                      </div>
                    )
                  }

                  // If !isCitationAlreadyCited
                  return (
                    <div
                      ref={lastElementRef}
                      className="flex items-center w-full mb-2"
                      key={postInd}
                    >
                      <div className="w-[15%]">
                        <ArrowCircleLeftIcon
                          onClick={() => onLocalCitationChanged(post, false)}
                          className="w-5 cursor-pointer"
                        />
                      </div>

                      <div className="relative w-[70%] bg-black/[.05] rounded-lg p-4 cursor-pointer">
                        <A
                          href={`/post/${post?.tokenID}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <span
                            className={classNames(
                              getIMORatingColors(
                                post?.totalRatingsCount > 0
                                  ? Math.round(post?.averageRating)
                                  : -1
                              ),
                              'absolute top-0 right-0 w-14 h-12 flex justify-center items-center rounded-tr-lg rounded-bl-lg font-extrabold text-xl'
                            )}
                          >
                            {post?.totalRatingsCount > 0
                              ? Math.round(post?.averageRating) + '%'
                              : '—'}
                          </span>

                          <div className="flex items-center pb-2 whitespace-nowrap">
                            <div className="relative rounded-full w-6 h-6">
                              <Image
                                className="rounded-full"
                                src={
                                  post?.minterToken?.profilePhoto ||
                                  '/default-profile-pic.png'
                                }
                                alt=""
                                layout="fill"
                                objectFit="cover"
                              />
                            </div>
                            <A
                              className="ml-2 font-bold hover:text-blue-600"
                              href={`/u/${usernameOrWallet}`}
                            >
                              {displayUsernameOrWallet}
                            </A>
                          </div>

                          <div className="relative">
                            <div
                              dangerouslySetInnerHTML={{
                                __html: urlify(postText),
                              }}
                              className="whitespace-pre-wrap break-words relative z-50 text-base text-black font-medium"
                              style={{ wordBreak: 'break-word' }} // Fixes overflow issue on browsers that dont support break-words above
                            />

                            {/* {cutOffContent && (
                              <A
                                href={`/post/${post?.tokenID}`}
                                className="absolute bottom-0 right-0 text-blue-500 z-[60]"
                              >
                                (More...)
                              </A>
                            )} */}
                          </div>
                        </A>
                      </div>

                      <div className="w-[15%] flex justify-end">
                        <ArrowCircleRightIcon
                          onClick={() => onLocalCitationChanged(post, true)}
                          className="w-5 cursor-pointer"
                        />
                      </div>
                    </div>
                  )
                })}
            </div>
          )}

          {filterBy === FILTER_BY.MY_RATINGS && (
            <div>
              {ratingPairs &&
                ratingPairs.map((opinion, oInd) => {
                  const { minterAddress } = (opinion || {}) as any

                  const displayUsernameOrWallet = convertAccountName(
                    opinion?.minterToken?.username || minterAddress
                  )
                  const usernameOrWallet =
                    opinion?.minterToken?.username || minterAddress

                  const isCitationAlreadyCited = localCitations.includes(
                    opinion.tokenID
                  )
                  const indexOfAlreadyCited = localCitations.indexOf(
                    opinion.tokenID
                  )
                  const isInFavor = localInFavorArray[indexOfAlreadyCited]

                  // const cutOffContent = opinion?.content?.length > 280
                  const postText = true
                    ? opinion?.content
                    : opinion?.content.slice(0, 280) + '...'

                  if (isCitationAlreadyCited && !isInFavor) {
                    return (
                      <div
                        ref={lastElementRef}
                        className="flex items-center w-full mb-2"
                        key={oInd}
                      >
                        <div className="relative w-[85%] bg-[#ec4a4a]/[.25] rounded-lg p-4 cursor-pointer">
                          <A
                            href={`/post/${opinion?.tokenID}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <span
                              className={classNames(
                                getIMORatingColors(
                                  opinion?.totalRatingsCount > 0
                                    ? Math.round(opinion?.averageRating)
                                    : -1
                                ),
                                'absolute top-0 right-0 w-14 h-12 flex justify-center items-center rounded-tr-lg rounded-bl-lg font-extrabold text-xl'
                              )}
                            >
                              {opinion?.totalRatingsCount > 0
                                ? Math.round(opinion?.averageRating) + '%'
                                : '—'}
                            </span>

                            <div className="flex items-center pb-2 whitespace-nowrap">
                              <div className="relative rounded-full w-6 h-6">
                                <Image
                                  className="rounded-full"
                                  src={
                                    opinion?.minterToken?.profilePhoto ||
                                    '/default-profile-pic.png'
                                  }
                                  alt=""
                                  layout="fill"
                                  objectFit="cover"
                                />
                              </div>
                              <A
                                className="ml-2 font-bold hover:text-blue-600"
                                href={`/u/${usernameOrWallet}`}
                              >
                                {displayUsernameOrWallet}
                              </A>
                            </div>

                            <div className="relative">
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: urlify(postText),
                                }}
                                className="whitespace-pre-wrap break-words relative z-50 text-base text-black font-medium"
                                style={{ wordBreak: 'break-word' }} // Fixes overflow issue on browsers that dont support break-words above
                              />

                              {/* {cutOffContent && (
                                <A
                                  href={`/post/${opinion?.tokenID}`}
                                  className="absolute bottom-0 right-0 text-blue-500 z-[60]"
                                >
                                  (More...)
                                </A>
                              )} */}
                            </div>
                          </A>
                        </div>

                        <div className="w-[15%] flex justify-end">
                          <ArrowCircleRightIcon
                            onClick={() =>
                              onLocalCitationChanged(opinion, true)
                            }
                            className="w-5 cursor-pointer"
                          />
                        </div>
                      </div>
                    )
                  }

                  if (isCitationAlreadyCited && isInFavor) {
                    return (
                      <div
                        ref={lastElementRef}
                        className="flex items-center w-full mb-2"
                        key={oInd}
                      >
                        <div className="w-[15%]">
                          <ArrowCircleLeftIcon
                            onClick={() =>
                              onLocalCitationChanged(opinion, false)
                            }
                            className="w-5 cursor-pointer"
                          />
                        </div>

                        <div className="relative w-[85%] bg-[#0cae74]/[.25] rounded-lg p-4 cursor-pointer">
                          <A
                            href={`/post/${opinion?.tokenID}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <span
                              className={classNames(
                                getIMORatingColors(
                                  opinion?.totalRatingsCount > 0
                                    ? Math.round(opinion?.averageRating)
                                    : -1
                                ),
                                'absolute top-0 right-0 w-14 h-12 flex justify-center items-center rounded-tr-lg rounded-bl-lg font-extrabold text-xl'
                              )}
                            >
                              {opinion?.totalRatingsCount > 0
                                ? Math.round(opinion?.averageRating) + '%'
                                : '—'}
                            </span>

                            <div className="flex items-center pb-2 whitespace-nowrap">
                              <div className="relative rounded-full w-6 h-6">
                                <Image
                                  className="rounded-full"
                                  src={
                                    opinion?.minterToken?.profilePhoto ||
                                    '/default-profile-pic.png'
                                  }
                                  alt=""
                                  layout="fill"
                                  objectFit="cover"
                                />
                              </div>
                              <A
                                className="ml-2 font-bold hover:text-blue-600"
                                href={`/u/${usernameOrWallet}`}
                              >
                                {displayUsernameOrWallet}
                              </A>
                            </div>

                            <div className="relative">
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: urlify(postText),
                                }}
                                className="whitespace-pre-wrap break-words relative z-50 text-base text-black font-medium"
                                style={{ wordBreak: 'break-word' }} // Fixes overflow issue on browsers that dont support break-words above
                              />

                              {/* {cutOffContent && (
                                <A
                                  href={`/post/${opinion?.tokenID}`}
                                  className="absolute bottom-0 right-0 text-blue-500 z-[60]"
                                >
                                  (More...)
                                </A>
                              )} */}
                            </div>
                          </A>
                        </div>
                      </div>
                    )
                  }

                  // If !isCitationAlreadyCited
                  return (
                    <div
                      ref={lastElementRef}
                      className="flex items-center w-full mb-2"
                      key={oInd}
                    >
                      <div className="w-[15%]">
                        <ArrowCircleLeftIcon
                          onClick={() => onLocalCitationChanged(opinion, false)}
                          className="w-5 cursor-pointer"
                        />
                      </div>

                      <div className="relative w-[70%] bg-black/[.05] rounded-lg p-4 cursor-pointer">
                        <A
                          href={`/post/${opinion?.tokenID}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <span
                            className={classNames(
                              getIMORatingColors(
                                opinion?.totalRatingsCount > 0
                                  ? Math.round(opinion?.averageRating)
                                  : -1
                              ),
                              'absolute top-0 right-0 w-14 h-12 flex justify-center items-center rounded-tr-lg rounded-bl-lg font-extrabold text-xl'
                            )}
                          >
                            {opinion?.totalRatingsCount > 0
                              ? Math.round(opinion?.averageRating) + '%'
                              : '—'}
                          </span>

                          <div className="flex items-center pb-2 whitespace-nowrap">
                            <div className="relative rounded-full w-6 h-6">
                              <Image
                                className="rounded-full"
                                src={
                                  opinion?.minterToken?.profilePhoto ||
                                  '/default-profile-pic.png'
                                }
                                alt=""
                                layout="fill"
                                objectFit="cover"
                              />
                            </div>
                            <A
                              className="ml-2 font-bold hover:text-blue-600"
                              href={`/u/${usernameOrWallet}`}
                            >
                              {displayUsernameOrWallet}
                            </A>
                          </div>

                          <div className="relative">
                            <div
                              dangerouslySetInnerHTML={{
                                __html: urlify(postText),
                              }}
                              className="whitespace-pre-wrap break-words relative z-50 text-base text-black font-medium"
                              style={{ wordBreak: 'break-word' }} // Fixes overflow issue on browsers that dont support break-words above
                            />

                            {/* {cutOffContent && (
                              <A
                                href={`/post/${opinion?.tokenID}`}
                                className="absolute bottom-0 right-0 text-blue-500 z-[60]"
                              >
                                (More...)
                              </A>
                            )} */}
                          </div>
                        </A>
                      </div>

                      <div className="w-[15%] flex justify-end">
                        <ArrowCircleRightIcon
                          onClick={() => onLocalCitationChanged(opinion, true)}
                          className="w-5 cursor-pointer"
                        />
                      </div>
                    </div>
                  )
                })}
            </div>
          )}

          {filterBy === FILTER_BY.MY_POSTS && (
            <div>
              {userPostPairs &&
                userPostPairs.map((opinion, oInd) => {
                  const { minterAddress } = (opinion || {}) as any

                  const displayUsernameOrWallet = convertAccountName(
                    opinion?.minterToken?.username || minterAddress
                  )
                  const usernameOrWallet =
                    opinion?.minterToken?.username || minterAddress

                  const isCitationAlreadyCited = localCitations.includes(
                    opinion.tokenID
                  )
                  const indexOfAlreadyCited = localCitations.indexOf(
                    opinion.tokenID
                  )
                  const isInFavor = localInFavorArray[indexOfAlreadyCited]

                  // const cutOffContent = opinion?.content?.length > 280
                  const postText = true
                    ? opinion?.content
                    : opinion?.content.slice(0, 280) + '...'

                  if (isCitationAlreadyCited && !isInFavor) {
                    return (
                      <div
                        ref={lastElementRef}
                        className="flex items-center w-full mb-2"
                        key={oInd}
                      >
                        <div className="relative w-[85%] bg-[#ec4a4a]/[.25] rounded-lg p-4 cursor-pointer">
                          <A
                            href={`/post/${opinion?.tokenID}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <span
                              className={classNames(
                                getIMORatingColors(
                                  opinion?.totalRatingsCount > 0
                                    ? Math.round(opinion?.averageRating)
                                    : -1
                                ),
                                'absolute top-0 right-0 w-14 h-12 flex justify-center items-center rounded-tr-lg rounded-bl-lg font-extrabold text-xl'
                              )}
                            >
                              {opinion?.totalRatingsCount > 0
                                ? Math.round(opinion?.averageRating) + '%'
                                : '—'}
                            </span>

                            <div className="flex items-center pb-2 whitespace-nowrap">
                              <div className="relative rounded-full w-6 h-6">
                                <Image
                                  className="rounded-full"
                                  src={
                                    opinion?.minterToken?.profilePhoto ||
                                    '/default-profile-pic.png'
                                  }
                                  alt=""
                                  layout="fill"
                                  objectFit="cover"
                                />
                              </div>
                              <A
                                className="ml-2 font-bold hover:text-blue-600"
                                href={`/u/${usernameOrWallet}`}
                              >
                                {displayUsernameOrWallet}
                              </A>
                            </div>

                            <div className="relative">
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: urlify(postText),
                                }}
                                className="whitespace-pre-wrap break-words relative z-50 text-base text-black font-medium"
                                style={{ wordBreak: 'break-word' }} // Fixes overflow issue on browsers that dont support break-words above
                              />

                              {/* {cutOffContent && (
                                <A
                                  href={`/post/${opinion?.tokenID}`}
                                  className="absolute bottom-0 right-0 text-blue-500 z-[60]"
                                >
                                  (More...)
                                </A>
                              )} */}
                            </div>
                          </A>
                        </div>

                        <div className="w-[15%] flex justify-end">
                          <ArrowCircleRightIcon
                            onClick={() =>
                              onLocalCitationChanged(opinion, true)
                            }
                            className="w-5 cursor-pointer"
                          />
                        </div>
                      </div>
                    )
                  }

                  if (isCitationAlreadyCited && isInFavor) {
                    return (
                      <div
                        ref={lastElementRef}
                        className="flex items-center w-full mb-2"
                        key={oInd}
                      >
                        <div className="w-[15%]">
                          <ArrowCircleLeftIcon
                            onClick={() =>
                              onLocalCitationChanged(opinion, false)
                            }
                            className="w-5 cursor-pointer"
                          />
                        </div>

                        <div className="relative w-[85%] bg-[#0cae74]/[.25] rounded-lg p-4 cursor-pointer">
                          <A
                            href={`/post/${opinion?.tokenID}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <span
                              className={classNames(
                                getIMORatingColors(
                                  opinion?.totalRatingsCount > 0
                                    ? Math.round(opinion?.averageRating)
                                    : -1
                                ),
                                'absolute top-0 right-0 w-14 h-12 flex justify-center items-center rounded-tr-lg rounded-bl-lg font-extrabold text-xl'
                              )}
                            >
                              {opinion?.totalRatingsCount > 0
                                ? Math.round(opinion?.averageRating) + '%'
                                : '—'}
                            </span>

                            <div className="flex items-center pb-2 whitespace-nowrap">
                              <div className="relative rounded-full w-6 h-6">
                                <Image
                                  className="rounded-full"
                                  src={
                                    opinion?.minterToken?.profilePhoto ||
                                    '/default-profile-pic.png'
                                  }
                                  alt=""
                                  layout="fill"
                                  objectFit="cover"
                                />
                              </div>
                              <A
                                className="ml-2 font-bold hover:text-blue-600"
                                href={`/u/${usernameOrWallet}`}
                              >
                                {displayUsernameOrWallet}
                              </A>
                            </div>

                            <div className="relative">
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: urlify(postText),
                                }}
                                className="whitespace-pre-wrap break-words relative z-50 text-base text-black font-medium"
                                style={{ wordBreak: 'break-word' }} // Fixes overflow issue on browsers that dont support break-words above
                              />

                              {/* {cutOffContent && (
                                <A
                                  href={`/post/${opinion?.tokenID}`}
                                  className="absolute bottom-0 right-0 text-blue-500 z-[60]"
                                >
                                  (More...)
                                </A>
                              )} */}
                            </div>
                          </A>
                        </div>
                      </div>
                    )
                  }

                  // If !isCitationAlreadyCited
                  return (
                    <div
                      ref={lastElementRef}
                      className="flex items-center w-full mb-2"
                      key={oInd}
                    >
                      <div className="w-[15%]">
                        <ArrowCircleLeftIcon
                          onClick={() => onLocalCitationChanged(opinion, false)}
                          className="w-5 cursor-pointer"
                        />
                      </div>

                      <div className="relative w-[70%] bg-black/[.05] rounded-lg p-4 cursor-pointer">
                        <A
                          href={`/post/${opinion?.tokenID}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <span
                            className={classNames(
                              getIMORatingColors(
                                opinion?.totalRatingsCount > 0
                                  ? Math.round(opinion?.averageRating)
                                  : -1
                              ),
                              'absolute top-0 right-0 w-14 h-12 flex justify-center items-center rounded-tr-lg rounded-bl-lg font-extrabold text-xl'
                            )}
                          >
                            {opinion?.totalRatingsCount > 0
                              ? Math.round(opinion?.averageRating) + '%'
                              : '—'}
                          </span>

                          <div className="flex items-center pb-2 whitespace-nowrap">
                            <div className="relative rounded-full w-6 h-6">
                              <Image
                                className="rounded-full"
                                src={
                                  opinion?.minterToken?.profilePhoto ||
                                  '/default-profile-pic.png'
                                }
                                alt=""
                                layout="fill"
                                objectFit="cover"
                              />
                            </div>
                            <A
                              className="ml-2 font-bold hover:text-blue-600"
                              href={`/u/${usernameOrWallet}`}
                            >
                              {displayUsernameOrWallet}
                            </A>
                          </div>

                          <div className="relative">
                            <div
                              dangerouslySetInnerHTML={{
                                __html: urlify(postText),
                              }}
                              className="whitespace-pre-wrap break-words relative z-50 text-base text-black font-medium"
                              style={{ wordBreak: 'break-word' }} // Fixes overflow issue on browsers that dont support break-words above
                            />

                            {/* {cutOffContent && (
                              <A
                                href={`/post/${opinion?.tokenID}`}
                                className="absolute bottom-0 right-0 text-blue-500 z-[60]"
                              >
                                (More...)
                              </A>
                            )} */}
                          </div>
                        </A>
                      </div>

                      <div className="w-[15%] flex justify-end">
                        <ArrowCircleRightIcon
                          onClick={() => onLocalCitationChanged(opinion, true)}
                          className="w-5 cursor-pointer"
                        />
                      </div>
                    </div>
                  )
                })}
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}
