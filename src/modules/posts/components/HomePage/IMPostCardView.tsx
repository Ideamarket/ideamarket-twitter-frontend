import React, {
  // MutableRefObject,
  // useCallback,
  useContext,
  useEffect,
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
import { HOME_PAGE_VIEWS } from 'pages/home-cards'
import { PlusIcon, XIcon } from '@heroicons/react/solid'
import classNames from 'classnames'

type Props = {
  activeOverlayPostID: string
  nameSearch: string
  orderBy: string
  orderDirection: string
  selectedCategories: string[]
  selectedView: HOME_PAGE_VIEWS
  timeFilter: TIME_FILTER
  setActiveOverlayPostID: (activeOverlayPostID: string) => void
}

const IMPostCardView = ({
  activeOverlayPostID,
  nameSearch,
  orderBy,
  orderDirection,
  selectedCategories,
  selectedView,
  timeFilter,
  setActiveOverlayPostID,
}: Props) => {
  const TOKENS_PER_PAGE = 10

  const { jwtToken, isTxPending } = useContext(GlobalContext)

  // const observer: MutableRefObject<any> = useRef()

  const {
    data: infiniteData,
    // isFetching: isTokenDataLoading,
    // fetchNextPage: fetchMore,
    refetch,
    // hasNextPage: canFetchMore,
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

  // const lastElementRef = useCallback(
  //   (node) => {
  //     if (observer.current) observer.current.disconnect()

  //     observer.current = new IntersectionObserver((entries) => {
  //       if (entries[0].isIntersecting && canFetchMore) {
  //         fetchMore()
  //       }
  //     })

  //     if (node) observer.current.observe(node)
  //   },
  //   [canFetchMore, fetchMore]
  // )

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
    <div className="flex flex-col space-y-4">
      {imPostPairs &&
        imPostPairs.length > 0 &&
        imPostPairs.map((imPost, pInd) => {
          const { minterAddress } = (imPost || {}) as any

          const displayUsernameOrWallet = convertAccountName(
            imPost?.minterToken?.username || minterAddress
          )
          const usernameOrWallet =
            imPost?.minterToken?.username || minterAddress

          const isThisPostOverlaySelected =
            activeOverlayPostID &&
            activeOverlayPostID === imPost.tokenID.toString()

          return (
            <div className="rounded-xl border p-4 w-[30rem]" key={pInd}>
              <div className="w-full">
                <ListingContent
                  imPost={imPost}
                  page="HomePage"
                  urlMetaData={null}
                  useMetaData={false}
                />

                <div className="flex justify-end items-center space-x-2 text-xs mt-2">
                  <span className="italic text-black/[.25] font-semibold">
                    NFT minted by
                  </span>

                  <div className="flex items-center whitespace-nowrap">
                    <div className="relative rounded-full w-5 h-5">
                      <Image
                        className="rounded-full"
                        src={
                          imPost?.minterToken?.profilePhoto ||
                          '/DefaultProfilePicture.png'
                        }
                        alt=""
                        layout="fill"
                        objectFit="cover"
                      />
                    </div>

                    {/* Post minter IM name/wallet and twitter name */}
                    <div className="flex items-center space-x-1 flex-wrap z-50 text-black">
                      <A
                        className="ml-1 font-bold hover:text-blue-500"
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
                </div>

                <div
                  onClick={() => {
                    const newValue = activeOverlayPostID
                      ? null
                      : imPost.tokenID.toString()
                    setActiveOverlayPostID(newValue)
                  }}
                  className={classNames(
                    isThisPostOverlaySelected && 'bg-blue-100',
                    'relative flex justify-center items-center border rounded-3xl w-10 h-10 ml-auto mt-2 cursor-pointer'
                  )}
                >
                  {isThisPostOverlaySelected ? (
                    <XIcon className="w-3 h-3" />
                  ) : (
                    <PlusIcon className="w-3 h-3" />
                  )}
                </div>
              </div>
            </div>
          )
        })}
    </div>
  )
}

export default IMPostCardView
