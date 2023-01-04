import classNames from 'classnames'
import { A } from 'components'
import ListingContent from 'components/tokens/ListingContent'
import { formatNumberWithCommasAsThousandsSerperator } from 'utils'
import { IdeamarketTwitterOpinion } from '../services/TwitterOpinionService'

type Props = {
  citation: any // Citation | CitationData
  opinion?: IdeamarketTwitterOpinion
  bgCardColor?: string
  shadow?: string
}

const CitationCard = ({
  citation,
  opinion,
  bgCardColor = 'bg-[#FAFAFA]',
  shadow = '',
}: Props) => {
  // Mainly deals with how citation fetched. If citation fetched with opinion, then data is different than when fetched as a solo citation
  const isCitationOnOpinion = Boolean(opinion)

  const citationData = isCitationOnOpinion ? citation?.citation : citation

  return (
    <>
      {/* Desktop */}
      <div
        className={classNames(
          bgCardColor,
          shadow,
          'hidden md:block relative px-8 pt-4 pb-6 border-2 border-[#0857E0]/[0.05] hover:border-blue-600 rounded-lg w-full text-gray-900 dark:text-gray-200 font-normal'
        )}
      >
        <A
          href={`/post/${citationData?.postID}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {isCitationOnOpinion && (
            <div className="flex items-center text-sm text-black/[.5] mb-4">
              <span className="mr-2">
                {citation?.inFavor ? 'FOR' : 'AGAINST'}
              </span>

              <div className="flex items-center">
                {opinion?.citations?.length > 1 &&
                  opinion?.citations?.map((c) => {
                    if (c.citation.postID === citation.citation.postID) {
                      return (
                        <div className="w-2.5 h-2.5 mr-1 rounded-3xl bg-blue-600"></div>
                      )
                    } else {
                      return (
                        <div className="w-2.5 h-2.5 mr-1 rounded-3xl border"></div>
                      )
                    }
                  })}
              </div>
            </div>
          )}

          <div className="flex items-start">
            {/* The citation content */}
            <div className="w-full">
              <div className="py-6 border-b font-bold">
                <ListingContent
                  imPost={citationData}
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
                          Math.round(citationData?.latestRatingsCount)
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
                        {citationData.latestRatingsCount > 0
                          ? formatNumberWithCommasAsThousandsSerperator(
                              Math.round(citationData?.averageRating)
                            )
                          : '-'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-1/3">
                  <A
                    href={`/post/${citationData?.postID}`}
                    className="text-blue-500 text-sm hover:underline"
                  >
                    View more details...
                  </A>
                </div>
              </div>
            </div>
          </div>
        </A>
      </div>

      {/* Mobile (really don't need separate mobile version right now, but keeping just in case) */}
      <div
        className={classNames(
          bgCardColor,
          shadow,
          'md:hidden relative px-3 py-2 rounded-lg w-full text-gray-900 dark:text-gray-200 font-normal'
        )}
      >
        <A
          href={`/post/${citationData?.postID}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {isCitationOnOpinion && (
            <div className="flex items-center text-sm text-black/[.5] mb-4">
              <span className="mr-2">
                {citation?.inFavor ? 'FOR' : 'AGAINST'}
              </span>

              <div className="flex items-center">
                {opinion?.citations?.length > 1 &&
                  opinion?.citations?.map((c) => {
                    if (c.citation.postID === citation.citation.postID) {
                      return (
                        <div className="w-2.5 h-2.5 mr-1 rounded-3xl bg-blue-600"></div>
                      )
                    } else {
                      return (
                        <div className="w-2.5 h-2.5 mr-1 rounded-3xl border"></div>
                      )
                    }
                  })}
              </div>
            </div>
          )}

          <div className="flex items-start">
            {/* The citation content */}
            <div className="w-full">
              <div className="py-6 border-b font-bold">
                <ListingContent
                  imPost={citationData}
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
                          Math.round(citationData?.latestRatingsCount)
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
                        {citationData.latestRatingsCount > 0
                          ? formatNumberWithCommasAsThousandsSerperator(
                              Math.round(citationData?.averageRating)
                            )
                          : '-'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-1/3">
                  <A
                    href={`/post/${citationData?.postID}`}
                    className="text-blue-500 text-sm hover:underline"
                  >
                    View more details...
                  </A>
                </div>
              </div>
            </div>
          </div>
        </A>
      </div>
    </>
  )
}

export default CitationCard
