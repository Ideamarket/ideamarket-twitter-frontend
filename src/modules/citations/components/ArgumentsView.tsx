import classNames from 'classnames'
import { A, CircleSpinner } from 'components'
import ListingContent from 'components/tokens/ListingContent'
import { convertAccountName } from 'lib/utils/stringUtil'
import { IdeamarketTwitterPost } from 'modules/posts/services/TwitterPostService'
import OpenRateModal from 'modules/ratings/components/OpenRateModal'
import EmptyTableBody from 'modules/tables/components/EmptyTableBody'
import Image from 'next/image'
import { MutableRefObject, useCallback, useRef } from 'react'
import { formatNumberWithCommasAsThousandsSerperator } from 'utils'

type Props = {
  isCitationsDataLoading: boolean
  citationPairs: IdeamarketTwitterPost[]
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
      {
        <div className={classNames(isNoPosts ? '' : 'pb-40', 'flex flex-col')}>
          <div className="py-3 mt-5 mb-8 flex space-x-10 text-sm text-black/[.5] border-y-2 border-black/[0.05]">
            <div className={classNames(AdvancedPostColWidth, '')}>
              <div className="font-semibold">Post</div>
              <div className="text-xs italic">Sorted by number of ratings.</div>
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
              // const { minterAddress } = (imPost || {}) as any

              // const displayUsernameOrWallet = convertAccountName(
              //   imPost?.minterToken?.username || minterAddress
              // )
              // const usernameOrWallet =
              //   imPost?.minterToken?.username || minterAddress

              return (
                <div
                  ref={desktopLastElementRef}
                  className="flex space-x-10 pb-8 mb-8 border-b border-black/[0.05]"
                  key={pInd}
                >
                  <div className={classNames(AdvancedPostColWidth, '')}>
                    {/* The actual Post card */}
                    <div className="relative">
                      <A
                        href={`/post/${imPost?.postID}`}
                        className={classNames(
                          imPost?.isPostInFavorOfParent
                            ? 'bg-gradient-to-b from-[#0cae741a]/[0.05] to-[#1fbfbf1a]/[0.05] border-2 border-[#1fbfbf1a]/[0.05] hover:border-green-600'
                            : 'bg-gradient-to-b from-[#fee8e9]/[0.5] to-[#fceaeb]/[0.5] border-2 border-[#fee8e9]/[0.05] hover:border-red-600',
                          'relative block px-8 pt-8 pb-10 rounded-2xl font-bold mb-2 cursor-pointer'
                        )}
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
                                    Math.round(imPost?.latestRatingsCount)
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
                                  {imPost?.latestRatingsCount > 0
                                    ? formatNumberWithCommasAsThousandsSerperator(
                                        Math.round(imPost?.averageRating)
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
                      <OpenRateModal imPost={imPost} />
                    </div>
                  </div>

                  <div
                    className={classNames(AdvancedCitationsColWidth, 'text-xs')}
                  >
                    {imPost?.topCitations?.length > 0 &&
                      imPost?.topCitations.map((citation, cInd) => {
                        // const { minterAddress } = (citation || {}) as any

                        // const displayUsernameOrWalletCitation =
                        //   convertAccountName(
                        //     citation?.minterToken?.username || minterAddress
                        //   )
                        // const usernameOrWalletCitation =
                        //   citation?.minterToken?.username || minterAddress

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
                          rating?.userToken?.twitterUsername || rating?.ratedBy
                        )
                        const usernameOrWallet =
                          rating?.userToken?.twitterUsername || rating?.ratedBy

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
