import { IdeamarketPost } from 'modules/posts/services/PostService'
import CitationCard from 'modules/ratings/components/CitationCard'
import { MutableRefObject, useCallback, useRef } from 'react'

type Props = {
  citedByPairs: IdeamarketPost[]
  canFetchMoreCitedBy: boolean
  fetchMoreCitedBy: () => void
}

const CitedOnView = ({
  citedByPairs,
  canFetchMoreCitedBy,
  fetchMoreCitedBy,
}: Props) => {
  // TODO: find better solution than 2 observers for desktop vs mobile
  const desktopObserver: MutableRefObject<any> = useRef()
  // const mobileObserver: MutableRefObject<any> = useRef()
  const desktopLastElementRef = useCallback(
    (node) => {
      if (desktopObserver.current) desktopObserver.current.disconnect()

      desktopObserver.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && canFetchMoreCitedBy) {
          fetchMoreCitedBy()
        }
      })

      if (node) desktopObserver.current.observe(node)
    },
    [canFetchMoreCitedBy, fetchMoreCitedBy]
  )

  // const mobileLastElementRef = useCallback(
  //   (node) => {
  //     if (mobileObserver.current) mobileObserver.current.disconnect()

  //     mobileObserver.current = new IntersectionObserver((entries) => {
  //       if (entries[0].isIntersecting && canFetchMoreCitedBy) {
  //         fetchMoreCitedBy()
  //       }
  //     })

  //     if (node) mobileObserver.current.observe(node)
  //   },
  //   [canFetchMoreCitedBy, fetchMoreCitedBy]
  // )

  return (
    <>
      <div className="text-sm text-black/[.25] flex justify-center mt-6 mx-5 md:mx-0">
        This post has been cited under the ratings for the following posts
      </div>

      <div className="flex flex-col items-center justify-center space-y-4 mt-10">
        {citedByPairs &&
          citedByPairs?.length > 0 &&
          citedByPairs.map((citation, cInd) => {
            return (
              <div
                ref={desktopLastElementRef}
                className="mb-4 w-[24rem]"
                key={cInd}
              >
                {/* shadow = 1st num is horizontal shadow length. 2nd num is vertical shadow length (- and + tell which side to go). 3rd num is blur amount. 4th num is spread */}
                <CitationCard
                  citation={citation}
                  bgCardColor="bg-white"
                  shadow="shadow-[0_2px_7px_2px_rgba(0,0,0,0.15)]"
                />
              </div>
            )
          })}

        {citedByPairs && citedByPairs?.length <= 0 && (
          <div className="opacity-25">This post has never been cited</div>
        )}
      </div>
    </>
  )
}

export default CitedOnView
