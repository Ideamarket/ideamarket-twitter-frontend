import classNames from 'classnames'
import { IdeamarketPost } from 'modules/posts/services/PostService'
import CitationCard from 'modules/ratings/components/CitationCard'
import { MutableRefObject, useCallback, useRef, useState } from 'react'

type Props = {
  forCitationsPairs: IdeamarketPost[]
  againstCitationsPairs: IdeamarketPost[]
  canFetchMoreCitations: boolean
  fetchMoreCitations: () => void
}

const ArgumentsView = ({
  forCitationsPairs,
  againstCitationsPairs,
  canFetchMoreCitations,
  fetchMoreCitations,
}: Props) => {
  // TODO: find better solution than 2 observers for desktop vs mobile
  const desktopObserver: MutableRefObject<any> = useRef()
  const mobileObserver: MutableRefObject<any> = useRef()
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

  const mobileLastElementRef = useCallback(
    (node) => {
      if (mobileObserver.current) mobileObserver.current.disconnect()

      mobileObserver.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && canFetchMoreCitations) {
          fetchMoreCitations()
        }
      })

      if (node) mobileObserver.current.observe(node)
    },
    [canFetchMoreCitations, fetchMoreCitations]
  )

  const [mobileIsForSelected, setMobileIsForSelected] = useState(true)

  const mobileCitationPairs = mobileIsForSelected
    ? forCitationsPairs
    : againstCitationsPairs

  return (
    <>
      {/* Desktop and tablet */}
      <div className="hidden md:flex justify-between space-x-28">
        <div className="w-1/2 flex flex-col">
          <div className="font-black text-black/[.2] text-3xl mb-6 self-end">
            For
          </div>

          <div className="">
            {forCitationsPairs &&
              forCitationsPairs?.length > 0 &&
              forCitationsPairs.map((forCitation, fcInd) => {
                return (
                  <div ref={desktopLastElementRef} className="mb-4" key={fcInd}>
                    {/* shadow = 1st num is horizontal shadow length. 2nd num is vertical shadow length (- and + tell which side to go). 3rd num is blur amount. 4th num is spread */}
                    <CitationCard
                      citation={forCitation}
                      bgCardColor="bg-white"
                      shadow="shadow-[0_2px_7px_2px_rgba(0,0,0,0.15)]"
                    />
                  </div>
                )
              })}

            {forCitationsPairs && forCitationsPairs?.length <= 0 && (
              <div className="opacity-25">No citations FOR this post</div>
            )}
          </div>
        </div>

        <div className="w-1/2">
          <div className="font-black text-black/[.2] text-3xl mb-6">
            Against
          </div>

          <div className="">
            {againstCitationsPairs &&
              againstCitationsPairs?.length > 0 &&
              againstCitationsPairs.map((againstCitation, acInd) => {
                return (
                  <div className="mb-4" key={acInd}>
                    <CitationCard
                      citation={againstCitation}
                      bgCardColor="bg-white"
                      shadow="shadow-[0_2px_7px_2px_rgba(0,0,0,0.15)]"
                    />
                  </div>
                )
              })}

            {againstCitationsPairs && againstCitationsPairs?.length <= 0 && (
              <div className="opacity-25">No citations AGAINST this post</div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile */}
      <div className="md:hidden w-full flex flex-col">
        <div className="flex justify-between mb-6 mx-10">
          <div
            onClick={() => setMobileIsForSelected(true)}
            className={classNames(
              mobileIsForSelected ? 'text-black' : 'text-black/[.25]',
              'font-black text-3xl'
            )}
          >
            For
          </div>
          <div
            onClick={() => setMobileIsForSelected(false)}
            className={classNames(
              !mobileIsForSelected ? 'text-black' : 'text-black/[.25]',
              'font-black text-3xl'
            )}
          >
            Against
          </div>
        </div>

        <div className="">
          {mobileCitationPairs &&
            mobileCitationPairs?.length > 0 &&
            mobileCitationPairs.map((citation, cInd) => {
              return (
                <div ref={mobileLastElementRef} className="mb-4" key={cInd}>
                  <CitationCard
                    citation={citation}
                    bgCardColor="bg-white"
                    shadow="shadow-[0_2px_7px_2px_rgba(0,0,0,0.15)]"
                  />
                </div>
              )
            })}

          {mobileCitationPairs && mobileCitationPairs?.length <= 0 && (
            <div className="opacity-25 w-full flex justify-center">
              No citations {mobileIsForSelected ? 'FOR' : 'AGAINST'} this post
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default ArgumentsView
