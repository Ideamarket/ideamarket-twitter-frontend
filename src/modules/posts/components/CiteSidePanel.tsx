import { useInfiniteQuery } from 'react-query'
import { PencilIcon, PlusCircleIcon } from '@heroicons/react/outline'
import NewPostUI from 'modules/posts/components/NewPostUI'
import { getUsersLatestOpinions } from 'modules/ratings/services/OpinionService'
import { useWeb3React } from '@web3-react/core'
import { flatten } from 'lodash'
import { TX_TYPES } from 'components/trade/TradeCompleteModal'
import { useEffect, useState } from 'react'
import classNames from 'classnames'
import { convertAccountName } from 'lib/utils/stringUtil'
import Image from 'next/image'
import { A } from 'components'
import { getAllPosts } from '../services/PostService'

export enum CITE_TYPE {
  NEW_POST = 1,
  SEARCH,
}

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
  enabled: false,
  keepPreviousData: true,
}

type CiteSidePanelProps = {
  citeType: CITE_TYPE
  onTradeComplete: (
    isSuccess: boolean,
    listingId: string,
    idtValue: string,
    transactionType: TX_TYPES
  ) => void
  setInputTextPost: (inputContent: string) => void
}

const CiteSidePanel = ({ citeType, onTradeComplete, setInputTextPost }: CiteSidePanelProps) => {
  const { account } = useWeb3React()
  const [ratedByYouActive, setRatedByYouActive] = useState(false)

  const [postSearchText, setPostSearchText] = useState('')

  const {
    data: infiniteRatingsData,
    isFetching: isRatingsDataLoading,
    fetchNextPage: fetchMoreRatings,
    refetch: refetchRatings,
    hasNextPage: canFetchMoreRatings,
  } = useInfiniteQuery(
    ['ratings'],
    ({ pageParam = 0 }) => ratingsQueryFunction(TOKENS_PER_PAGE, pageParam),
    infiniteQueryConfig
  )

  const ratingPairs = flatten(infiniteRatingsData?.pages || [])

  async function ratingsQueryFunction(numTokens: number, skip: number = 0) {
    const latestUserOpinions = await getUsersLatestOpinions({
      walletAddress: account,
      skip,
      limit: numTokens,
      orderBy: '', // TODO: make this dynamic
      orderDirection: 'desc',
      filterTokens: [],
      search: '',
    })

    return latestUserOpinions || []
  }

  const {
    data: infiniteData,
    isFetching: ispostsSearchedLoading,
    fetchNextPage: fetchMore,
    refetch,
    hasNextPage: canFetchMore,
  } = useInfiniteQuery(
    [
      TOKENS_PER_PAGE,
      // orderBy,
      // orderDirection,
      // selectedCategories,
      // filterTokens,
      postSearchText,
    ],
    ({ pageParam = 0 }) =>
      getAllPosts(
        [
          TOKENS_PER_PAGE,
          'marketInterest',
          'desc',
          [],
          [],
          postSearchText,
          null,
        ],
        pageParam
      ),
    infiniteQueryConfig
  )

  const postsSearched = flatten(infiniteData?.pages || [])

  useEffect(() => {
    refetch()
  }, [
    postSearchText,
    refetch,
  ])

  // Called when any input in NewPostUI changes
  const onNewPostUIInputChanged = (
    inputContent: string,
  ) => {
    setInputTextPost(inputContent)
  }

  if (citeType === CITE_TYPE.NEW_POST) {
    return (
      <div className="w-full md:w-136 ml-2 bg-white dark:bg-gray-700 rounded-xl">
        <NewPostUI isTxButtonActive={false} onTradeComplete={onTradeComplete} onInputChanged={onNewPostUIInputChanged} />
      </div>
    )
  } else if (citeType === CITE_TYPE.SEARCH) {
    return (
      <div className="w-full md:w-136 ml-2 bg-white dark:bg-gray-700 rounded-xl">

        <div className="px-6 py-4 bg-black/[.05]">
          <input
            onChange={(event) => setPostSearchText(event.target.value)}
            placeholder="Search posts to cite..."
            className="bg-transparent px-2 py-1"
          />
        </div>

        <div className="">

          <div className="px-6 py-4 mb-4 flex items-center space-x-2 text-sm ">

            <button
              onClick={() => setRatedByYouActive(!ratedByYouActive)}
              className={classNames(
                ratedByYouActive ? 'bg-blue-600 text-white' : 'text-black',
                "border px-3 py-2 flex items-center rounded-2xl"
              )}
            >
              <PencilIcon className="w-4 mr-1" />
              <span>Rated By You</span>
            </button>

          </div>

          {/* Show this when user text searches for a Post */}
          {postSearchText?.length > 0 && (
            <div>
              {postsSearched && postsSearched.map(post => {
                const { minterAddress } = (post || {}) as any

                const displayUsernameOrWallet = convertAccountName(
                  post?.minterToken?.username || minterAddress
                )
                const usernameOrWallet = post?.minterToken?.username || minterAddress

                return (
                  <div className="flex items-center">
                    <div className="bg-black/[.05] rounded-lg p-4">

                      <div className="flex items-center pb-2 whitespace-nowrap">
                        <div className="relative rounded-full w-6 h-6">
                          <Image
                            className="rounded-full"
                            src={
                              post?.minterToken?.profilePhoto ||
                              '/DefaultProfilePicture.png'
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

                      <div>{post.content}</div>

                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {ratedByYouActive && (
            <div>
              {ratingPairs && ratingPairs.filter(opinion => opinion.comment.length > 0).map(opinion => {
                const { minterAddress } = (opinion || {}) as any

                const displayUsernameOrWallet = convertAccountName(
                  opinion?.minterToken?.username || minterAddress
                )
                const usernameOrWallet = opinion?.minterToken?.username || minterAddress

                return (
                  <div className="flex items-center">
                    <div className="bg-black/[.05] rounded-lg p-4">

                      <div className="flex items-center pb-2 whitespace-nowrap">
                        <div className="relative rounded-full w-6 h-6">
                          <Image
                            className="rounded-full"
                            src={
                              opinion?.minterToken?.profilePhoto ||
                              '/DefaultProfilePicture.png'
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

                      <div>{opinion.comment}</div>

                    </div>
                  </div>
                )
              })}
            </div>
          )}

        </div>

      </div>
    )
  }

  // return (
  //   <div className="w-full md:w-136 ml-2 bg-white dark:bg-gray-700 rounded-xl">

  //     <div className="px-6 py-4 bg-black/[.05]">
  //       <input placeholder="Search posts to cite..." className="bg-transparent px-2 py-1" />
  //     </div>

  //     <div className="">

  //       <div className="px-6 py-4 mb-4 flex items-center space-x-2 text-sm ">

  //         <button
  //           onClick={() => setCiteType(CITE_TYPE.RATED_BY_YOU)}
  //           className={classNames(
  //             citeType === CITE_TYPE.RATED_BY_YOU ? 'bg-blue-600 text-white' : 'text-black',
  //             "border px-3 py-2 flex items-center rounded-2xl"
  //           )}
  //         >
  //           <PencilIcon className="w-4 mr-1" />
  //           <span>Rated By You</span>
  //         </button>

  //         <button
  //           onClick={() => setCiteType(CITE_TYPE.NEW_POST)}
  //           className={classNames(
  //             citeType === CITE_TYPE.NEW_POST ? 'bg-blue-600 text-white' : 'text-black',
  //             "border px-3 py-2 flex items-center rounded-2xl"
  //           )}
  //         >
  //           <PencilIcon className="w-4 mr-1" />
  //           <span>Create New Post</span>
  //         </button>

  //       </div>

  //       {citeType === CITE_TYPE.NEW_POST && (
  //         <NewPostUI onTradeComplete={onTradeComplete} />
  //       )}

  //       {citeType === CITE_TYPE.RATED_BY_YOU && (
  //         <div>
  //           {ratingPairs && ratingPairs.filter(opinion => opinion.comment.length > 0).map(opinion => {
  //             const { minterAddress } = (opinion || {}) as any

  //             const displayUsernameOrWallet = convertAccountName(
  //               opinion?.minterToken?.username || minterAddress
  //             )
  //             const usernameOrWallet = opinion?.minterToken?.username || minterAddress

  //             return (
  //               <div className="flex items-center">
  //                 <div className="bg-black/[.05] rounded-lg p-4">

  //                   <div className="flex items-center pb-2 whitespace-nowrap">
  //                     <div className="relative rounded-full w-6 h-6">
  //                       <Image
  //                         className="rounded-full"
  //                         src={
  //                           opinion?.minterToken?.profilePhoto ||
  //                           '/DefaultProfilePicture.png'
  //                         }
  //                         alt=""
  //                         layout="fill"
  //                         objectFit="cover"
  //                       />
  //                     </div>
  //                     <A
  //                       className="ml-2 font-bold hover:text-blue-600"
  //                       href={`/u/${usernameOrWallet}`}
  //                     >
  //                       {displayUsernameOrWallet}
  //                     </A>
  //                   </div>

  //                   <div>{opinion.comment}</div>

  //                 </div>
  //               </div>
  //             )
  //           })}
  //         </div>
  //       )}

  //     </div>

  //   </div>
  // )
}

export default CiteSidePanel
