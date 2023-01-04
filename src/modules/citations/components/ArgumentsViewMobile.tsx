import React, { MutableRefObject, useCallback, useRef } from 'react'
import ListingContent from 'components/tokens/ListingContent'
import { A } from 'components'
import classNames from 'classnames'
import OpenRateModal from 'modules/ratings/components/OpenRateModal'
import { formatNumberWithCommasAsThousandsSerperator } from 'utils'
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/outline'
import { IdeamarketTwitterPost } from 'modules/posts/services/TwitterPostService'

type Props = {
  isCitationsDataLoading: boolean
  citationPairs: IdeamarketTwitterPost[]
  canFetchMoreCitations: boolean
  fetchMoreCitations: () => void
}

const ArgumentsViewMobile = ({
  isCitationsDataLoading,
  citationPairs,
  canFetchMoreCitations,
  fetchMoreCitations,
}: Props) => {
  const observer: MutableRefObject<any> = useRef()
  const lastElementRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect()

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && canFetchMoreCitations) {
          fetchMoreCitations()
        }
      })

      if (node) observer.current.observe(node)
    },
    [canFetchMoreCitations, fetchMoreCitations]
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

  return (
    <div className="md:hidden">
      <div className="mt-6 text-xs text-blue-600 text-center font-bold">
        Swipe to see more posts
      </div>
      <div
        id="scrolling-cards"
        className="w-full overflow-x-auto mt-6 mb-10 flex items-start snap-x snap-mandatory"
      >
        {citationPairs &&
          citationPairs.length > 0 &&
          citationPairs.map((imPost, pInd) => {
            return (
              <div
                ref={lastElementRef}
                className="snap-start snap-always shrink-0 grow-0 basis-[95%] w-full pl-2 mb-10"
                key={imPost?.postID}
              >
                {/* The actual Post card */}
                <div className="relative">
                  <A
                    href={`/post/${imPost?.postID}`}
                    className={classNames(
                      imPost?.isPostInFavorOfParent
                        ? 'bg-gradient-to-b from-[#0cae741a]/[0.05] to-[#1fbfbf1a]/[0.05] border-2 border-[#1fbfbf1a]/[0.05] hover:border-green-600'
                        : 'bg-gradient-to-b from-[#fee8e9]/[0.5] to-[#fceaeb]/[0.5] border-2 border-[#fee8e9]/[0.05] hover:border-red-600',
                      'relative block px-3 pt-2 pb-4 rounded-2xl font-bold mb-2 cursor-pointer'
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
    </div>
  )
}

export default ArgumentsViewMobile
