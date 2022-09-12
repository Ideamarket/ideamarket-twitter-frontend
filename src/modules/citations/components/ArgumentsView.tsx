import { ExternalLinkIcon } from '@heroicons/react/outline'
import classNames from 'classnames'
import { A, CircleSpinner, Tooltip } from 'components'
import ListingContent from 'components/tokens/ListingContent'
import { convertAccountName } from 'lib/utils/stringUtil'
import { IdeamarketPost } from 'modules/posts/services/PostService'
import OpenRateModal from 'modules/ratings/components/OpenRateModal'
import EmptyTableBody from 'modules/tables/components/EmptyTableBody'
import Image from 'next/image'
import { MutableRefObject, useCallback, useRef } from 'react'
import { NETWORK } from 'store/networks'
import { formatNumberWithCommasAsThousandsSerperator } from 'utils'
import { getIMORatingColors } from 'utils/display/DisplayUtils'

type Props = {
  isCitationsDataLoading: boolean
  citationPairs: IdeamarketPost[]
  canFetchMoreCitations: boolean
  fetchMoreCitations: () => void
}

const AdvancedPostColWidth = 'w-[45%]'
const AdvancedCitationsColWidth = 'w-[35%]'
const AdvancedRatingsColWidth = 'w-[20%]'

const ArgumentsView = ({
  isCitationsDataLoading,
  citationPairs,
  canFetchMoreCitations,
  fetchMoreCitations,
}: Props) => {
  // TODO: find better solution than 2 observers for desktop vs mobile
  const desktopObserver: MutableRefObject<any> = useRef()
  const desktopLastElementRef = useCallback(
    (node) => {
      if (desktopObserver.current) desktopObserver.current.disconnect()

      desktopObserver.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && canFetchMoreCitations) {
          fetchMoreCitations()
        }
      })

      if (node) desktopObserver.current.observe(node)
    },
    [canFetchMoreCitations, fetchMoreCitations]
  )

  const isNoPosts = !citationPairs || citationPairs?.length <= 0

  return (
    <div className="hidden md:block mx-auto">
      {/* {!isAdvancedView && (
        <div className={classNames(isNoPosts ? '' : "pb-40", 'w-full')}>
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
                          className="w-full relative block px-8 pt-8 pb-10 bg-[#0857E0]/[0.05]  rounded-2xl cursor-pointer"
                        >
                          <span
                            className={classNames(
                              getIMORatingColors(
                                imPost?.totalRatingsCount > 0
                                  ? Math.round(imPost?.averageRating)
                                  : -1
                              ),
                              'absolute top-0 right-0 w-14 h-14 flex justify-center items-center rounded-tr-2xl rounded-bl-2xl font-extrabold text-lg border-l-2 border-b-2 border-white'
                            )}
                          >
                            {imPost?.totalRatingsCount > 0
                              ? Math.round(imPost?.averageRating) + '%'
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
                                      Hot
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
                                    Earned
                                  </div>
                                  <div>
                                    <span className="font-bold">
                                      {formatNumberWithCommasAsThousandsSerperator(
                                        postIncome.toFixed(3)
                                      )}
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
      )} */}

      {
        <div className={classNames(isNoPosts ? '' : 'pb-40', 'flex flex-col')}>
          <div className="py-3 mt-5 mb-8 flex space-x-10 text-sm text-black/[.5] border-y-2 border-black/[0.05]">
            <div className={classNames(AdvancedPostColWidth, '')}>
              <div className="font-semibold">Post</div>
              <div className="text-xs italic">
                Sorted by amount of $IMO staked on all users who rated.
              </div>
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

          {citationPairs &&
            citationPairs.length > 0 &&
            citationPairs.map((imPost, pInd) => {
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
                  ref={desktopLastElementRef}
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
                        className={classNames(
                          imPost?.isPostInFavorOfParent
                            ? 'bg-gradient-to-b from-[#0cae741a]/[0.05] to-[#1fbfbf1a]/[0.05]'
                            : 'bg-gradient-to-b from-[#fee8e9]/[0.5] to-[#fceaeb]/[0.5]',
                          'relative block px-8 pt-8 pb-10 rounded-2xl font-bold mb-2 cursor-pointer'
                        )}
                      >
                        <span
                          className={classNames(
                            getIMORatingColors(
                              imPost?.totalRatingsCount > 0
                                ? Math.round(imPost?.averageRating)
                                : -1
                            ),
                            'absolute top-0 right-0 w-14 h-14 flex justify-center items-center rounded-tr-2xl rounded-bl-2xl font-extrabold text-lg border-l-2 border-b-2 border-white'
                          )}
                        >
                          {imPost?.totalRatingsCount > 0
                            ? Math.round(imPost?.averageRating) + '%'
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

                        <div className="py-6 border-b font-bold">
                          <ListingContent
                            imPost={imPost}
                            page="HomePage"
                            urlMetaData={null}
                            useMetaData={false}
                          />
                        </div>

                        <div className="flex items-center pt-6">
                          {/* <div className="w-1/3">
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
                          </div> */}

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
                                    Hot
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
                                  Earned
                                </div>
                                <div>
                                  <span className="font-bold">
                                    {formatNumberWithCommasAsThousandsSerperator(
                                      postIncome.toFixed(3)
                                    )}
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
                            className={classNames(
                              citation?.isPostInFavorOfParent
                                ? 'bg-gradient-to-b from-[#0cae741a] to-[#1fbfbf1a]'
                                : 'bg-gradient-to-b from-[#fee8e9] to-[#fceaeb]',
                              'relative block p-4 rounded-2xl font-bold mb-2'
                            )}
                            key={cInd}
                          >
                            <span
                              className={classNames(
                                getIMORatingColors(
                                  citation?.totalRatingsCount > 0
                                    ? Math.round(citation?.averageRating)
                                    : -1
                                ),
                                'absolute top-0 right-0 w-10 h-10 flex justify-center items-center rounded-tr-2xl rounded-bl-2xl font-extrabold text-base border-l-2 border-b-2 border-white'
                              )}
                            >
                              {citation?.totalRatingsCount > 0
                                ? Math.round(citation?.averageRating) + '%'
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
      }

      {isNoPosts && (
        <div className="flex flex-col justify-center items-center pb-40">
          {isCitationsDataLoading && (
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

export default ArgumentsView
