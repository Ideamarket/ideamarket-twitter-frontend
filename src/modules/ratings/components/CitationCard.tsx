import classNames from 'classnames'
import { A } from 'components'
import { convertAccountName } from 'lib/utils/stringUtil'
import Image from 'next/image'
import { getIMORatingColors, urlify } from 'utils/display/DisplayUtils'
import { Citation, IdeamarketOpinion } from '../services/OpinionService'

type Props = {
  citation: Citation
  opinion: IdeamarketOpinion
}

const CitationCard = ({ citation, opinion }: Props) => {
  // const cutOffContent = citation?.citation?.content?.length > 280
  const citationText = true
    ? citation?.citation?.content
    : citation?.citation?.content.slice(0, 280) + '...'

  const displayUsernameOrWalletCitation = convertAccountName(
    citation?.citation?.minter?.username ||
      citation?.citation?.minter?.walletAddress
  )
  const usernameOrWalletCitation =
    citation?.citation?.minter?.username ||
    citation?.citation?.minter?.walletAddress

  return (
    <>
      {/* Desktop */}
      <div className="hidden md:block relative px-3 py-2 bg-[#FAFAFA] rounded-lg w-full text-gray-900 dark:text-gray-200 font-normal">
        <A
          href={`/post/${citation?.citation?.tokenID}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span
            className={classNames(
              getIMORatingColors(
                citation.citation?.totalRatingsCount > 0
                  ? Math.round(citation?.citation?.compositeRating)
                  : -1
              ),
              'absolute top-0 right-0 w-14 h-12 flex justify-center items-center rounded-tr-lg rounded-bl-lg font-extrabold text-xl'
            )}
          >
            {citation.citation?.totalRatingsCount > 0
              ? Math.round(citation?.citation?.compositeRating) + '%'
              : '—'}
          </span>

          <div className="flex items-center text-sm text-black/[.5] mb-4">
            <span className="mr-2">
              {citation?.inFavor ? 'FOR' : 'AGAINST'}
            </span>

            <div className="flex items-center">
              {opinion?.citations?.length > 1 &&
                opinion?.citations?.map((c) => {
                  if (c.citation.tokenID === citation.citation.tokenID) {
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

          <div className="flex items-start">
            {/* The citation minter profile image */}
            <div className="mr-4 flex flex-col items-center space-y-2">
              <div className="relative rounded-full w-6 h-6">
                <Image
                  className="rounded-full"
                  src={
                    citation?.citation?.minter?.profilePhoto ||
                    '/DefaultProfilePicture.png'
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
                {citation?.citation?.minter?.twitterUsername && (
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
                      @{citation?.citation?.minter?.twitterUsername}
                    </span>
                  </A>
                )}
              </div>

              <div className="relative">
                <div
                  dangerouslySetInnerHTML={{
                    __html: urlify(citationText),
                  }}
                  className="w-full py-2 bg-[#FAFAFA] rounded-lg whitespace-pre-wrap break-words"
                  style={{ wordBreak: 'break-word' }} // Fixes overflow issue on browsers that dont support break-words above
                />

                {/* {cutOffContent && (
                  <A
                    href={`/post/${citation?.citation?.tokenID}`}
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

      {/* Mobile (really don't need separate mobile version right now, but keeping just in case) */}
      <div className="md:hidden relative px-3 py-2 bg-[#FAFAFA] rounded-lg w-full text-gray-900 dark:text-gray-200 font-normal">
        <A
          href={`/post/${citation?.citation?.tokenID}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span
            className={classNames(
              getIMORatingColors(
                citation.citation?.totalRatingsCount > 0
                  ? Math.round(citation?.citation?.compositeRating)
                  : -1
              ),
              'absolute top-0 right-0 w-14 h-12 flex justify-center items-center rounded-tr-lg rounded-bl-lg font-extrabold text-xl'
            )}
          >
            {citation.citation?.totalRatingsCount > 0
              ? Math.round(citation?.citation?.compositeRating) + '%'
              : '—'}
          </span>

          <div className="flex items-center text-sm text-black/[.5] mb-4">
            <span className="mr-2">
              {citation?.inFavor ? 'FOR' : 'AGAINST'}
            </span>
            <div className="flex items-center">
              {opinion?.citations?.length > 1 &&
                opinion?.citations?.map((c) => {
                  if (c.citation.tokenID === citation.citation.tokenID) {
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

          <div className="flex items-start">
            {/* The citation minter profile image */}
            <div className="mr-4 flex flex-col items-center space-y-2">
              <div className="relative rounded-full w-6 h-6">
                <Image
                  className="rounded-full"
                  src={
                    citation?.citation?.minter?.profilePhoto ||
                    '/DefaultProfilePicture.png'
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
                {citation?.citation?.minter?.twitterUsername && (
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
                      @{citation?.citation?.minter?.twitterUsername}
                    </span>
                  </A>
                )}
              </div>

              <div className="relative">
                <div
                  dangerouslySetInnerHTML={{
                    __html: urlify(citationText),
                  }}
                  className="w-full py-2 bg-[#FAFAFA] rounded-lg whitespace-pre-wrap break-words"
                  style={{ wordBreak: 'break-word' }} // Fixes overflow issue on browsers that dont support break-words above
                />

                {/* {cutOffContent && (
                  <A
                    href={`/post/${citation?.citation?.tokenID}`}
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
