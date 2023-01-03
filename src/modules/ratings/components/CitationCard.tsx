import classNames from 'classnames'
import { A } from 'components'
import ListingContent from 'components/tokens/ListingContent'
import { convertAccountName } from 'lib/utils/stringUtil'
import Image from 'next/image'
import { formatNumberWithCommasAsThousandsSerperator } from 'utils'
import { getIMORatingColors, urlify } from 'utils/display/DisplayUtils'
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

  // const cutOffContent = citationData?.content?.length > 280
  const citationText = true
    ? citationData?.content
    : citationData?.content.slice(0, 280) + '...'

  const displayUsernameOrWalletCitation = convertAccountName(
    citationData?.minterToken?.username ||
      citationData?.minterToken?.walletAddress
  )
  const usernameOrWalletCitation =
    citationData?.minterToken?.username ||
    citationData?.minterToken?.walletAddress

  return (
    <>
      {/* Desktop */}
      <div
        className={classNames(
          bgCardColor,
          shadow,
          'hidden md:block relative px-3 py-2 rounded-lg w-full text-gray-900 dark:text-gray-200 font-normal'
        )}
      >
        <A
          href={`/post/${citationData?.postID}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {/* <span
            className={classNames(
              getIMORatingColors(
                citationData?.totalRatingsCount > 0
                  ? Math.round(citationData?.averageRating)
                  : -1
              ),
              'absolute top-0 right-0 w-14 h-12 flex justify-center items-center rounded-tr-lg rounded-bl-lg font-extrabold text-xl z-[100]'
            )}
          >
            {citationData?.totalRatingsCount > 0
              ? Math.round(citationData?.averageRating) + '%'
              : '—'}
          </span> */}

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
            <div className="pr-6 w-full">
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
          <span
            className={classNames(
              getIMORatingColors(
                citationData?.totalRatingsCount > 0
                  ? Math.round(citationData?.averageRating)
                  : -1
              ),
              'absolute top-0 right-0 w-14 h-12 flex justify-center items-center rounded-tr-lg rounded-bl-lg font-extrabold text-xl z-[100]'
            )}
          >
            {citationData?.totalRatingsCount > 0
              ? Math.round(citationData?.averageRating) + '%'
              : '—'}
          </span>

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
            {/* The citation minter profile image */}
            <div className="mr-4 flex flex-col items-center space-y-2">
              <div className="relative rounded-full w-6 h-6">
                <Image
                  className="rounded-full"
                  src={
                    citationData?.minterToken?.twitterProfilePicURL ||
                    '/default-profile-pic.png'
                  }
                  alt=""
                  layout="fill"
                  objectFit="cover"
                />
              </div>

              {/* <WatchingStar token={token} /> */}
            </div>

            {/* The citation minter username and content */}
            <div className="pr-6 w-full">
              <div className="flex items-center space-x-1 pb-2 flex-wrap">
                <A className="font-bold text-sm">
                  {displayUsernameOrWalletCitation}
                </A>
                {citationData?.minterToken?.twitterUsername && (
                  <A
                    className="flex items-center space-x-1 text-black z-50"
                    href={`/u/${usernameOrWalletCitation}`}
                  >
                    <div className="relative w-4 h-4">
                      <Image
                        src={'/twitter-solid-blue.svg'}
                        alt="twitter-solid-blue-icon"
                        layout="fill"
                      />
                    </div>
                    <span className="text-sm opacity-50">
                      @{citationData?.minterToken?.twitterUsername}
                    </span>
                  </A>
                )}
              </div>

              <div className="relative">
                <div
                  dangerouslySetInnerHTML={{
                    __html: urlify(citationText),
                  }}
                  className="w-full py-2 rounded-lg whitespace-pre-wrap break-words"
                  style={{ wordBreak: 'break-word' }} // Fixes overflow issue on browsers that dont support break-words above
                />

                {/* {cutOffContent && (
                  <A
                    href={`/post/${citationData?.postID}`}
                    className="absolute bottom-0 right-0 text-blue-500 z-[60]"
                  >
                    (More...)
                  </A>
                )} */}
              </div>
            </div>
          </div>
        </A>
      </div>
    </>
  )
}

export default CitationCard
