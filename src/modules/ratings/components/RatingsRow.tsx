import { A } from 'components'
import { IdeaToken } from 'store/ideaMarketsStore'
import { formatNumberWithCommasAsThousandsSerperator } from 'utils'
import { useQuery } from 'react-query'
import { getURLMetaData } from 'actions/web2/getURLMetaData'
import { ChatIcon } from '@heroicons/react/outline'
import ListingContent from 'components/tokens/ListingContent'
import {
  getListingTypeFromIDTURL,
  LISTING_TYPE,
} from 'components/tokens/utils/ListingUtils'
import { convertAccountName } from 'lib/utils/stringUtil'
import Image from 'next/image'
import { getIMORatingColors, urlify } from 'utils/display/DisplayUtils'
import Link from 'next/link'
import { SortOptionsAccountOpinions } from 'utils/tables'
import classNames from 'classnames'

type Props = {
  opinion: any
  refetch: () => void
  onRateClicked: (idt: IdeaToken, urlMetaData: any) => void
  lastElementRef?: (node) => void
}

export default function RatingsRow({
  opinion,
  refetch,
  onRateClicked,
  lastElementRef,
}: Props) {
  const { data: urlMetaData } = useQuery([opinion?.url], () =>
    getURLMetaData(opinion?.url)
  )

  const { minterAddress } = (opinion || {}) as any

  const displayUsernameOrWallet = convertAccountName(
    opinion?.minterToken?.username || minterAddress
  )
  const usernameOrWallet = opinion?.minterToken?.username || minterAddress

  const cutOffContent = opinion?.citations[0]?.citation?.content?.length > 280
  const citationText = !cutOffContent
    ? opinion?.citations[0]?.citation?.content
    : opinion?.citations[0]?.citation?.content.slice(0, 280) + '...'

  const displayUsernameOrWalletCitation = convertAccountName(
    opinion?.citations[0]?.citation?.minter?.username ||
      opinion?.citations[0]?.citation?.minter?.walletAddress
  )
  const usernameOrWalletCitation =
    opinion?.citations[0]?.citation?.minter?.username ||
    opinion?.citations[0]?.citation?.minter?.walletAddress

  return (
    <div ref={lastElementRef}>
      {/* Desktop row */}
      <div className="hidden relative md:block py-6 hover:bg-black/[.02]">
        {/* Makes so entire row can be clicked to go to Post page */}
        <Link href={`/post/${opinion?.tokenID}`}>
          <a
            className="absolute top-0 left-0 w-full h-full z-40"
            // title="open in new tab"
            // target="_blank"
            // rel="noopener noreferrer"
          >
            <span className="invisible">Go to post page</span>
          </a>
        </Link>

        <div className="flex text-black">
          {/* Icon and Name */}
          <div className="w-[40%] relative pl-6 pr-10">
            <div className="relative flex items-start w-3/4 mx-auto md:w-full text-gray-900 dark:text-gray-200">
              <div className="mr-4 flex flex-col items-center space-y-2">
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

                {/* <WatchingStar token={token} /> */}
              </div>

              <div className="pr-6 w-full">
                <div className="flex items-center space-x-1 text-black pb-2 flex-wrap">
                  <A
                    className="font-bold hover:text-blue-600 z-50"
                    href={`/u/${usernameOrWallet}`}
                  >
                    {displayUsernameOrWallet}
                  </A>
                  {opinion?.minterToken?.twitterUsername && (
                    <A
                      className="flex items-center space-x-1 z-50"
                      href={`/u/${usernameOrWallet}`}
                    >
                      <div className="relative w-4 h-4">
                        <Image
                          src={'/twitter-solid-blue.svg'}
                          alt="twitter-solid-blue-icon"
                          layout="fill"
                        />
                      </div>
                      <span className="text-sm opacity-50">
                        @{opinion?.minterToken?.twitterUsername}
                      </span>
                    </A>
                  )}
                </div>

                <ListingContent
                  ideaToken={opinion}
                  page="HomePage"
                  urlMetaData={urlMetaData}
                  useMetaData={
                    getListingTypeFromIDTURL(opinion?.url) !==
                      LISTING_TYPE.TWEET &&
                    getListingTypeFromIDTURL(opinion?.url) !==
                      LISTING_TYPE.TEXT_POST
                  }
                />
              </div>
            </div>
          </div>

          <div className="w-[60%]">
            <div className="flex items-center w-full">
              {/* Rating By User */}
              <div className="w-[20%] grow">
                <p className="text-sm font-medium md:hidden tracking-tightest text-brand-gray-4 dark:text-gray-300">
                  Rating By User
                </p>
                <div className="font-medium leading-5">{opinion?.rating}</div>
              </div>

              {/* Composite Rating */}
              {/* <div className="w-[12%] pt-12">
                <p className="text-sm font-medium md:hidden tracking-tightest text-brand-gray-4 dark:text-gray-300">
                  Composite Rating
                </p>
                <div className="font-medium leading-5">
                  68
                </div>
              </div> */}

              {/* Market Interest */}
              <div className="w-[20%] grow">
                <div className="flex flex-col justify-start font-medium leading-5">
                  {formatNumberWithCommasAsThousandsSerperator(
                    Math.round(opinion?.marketInterest)
                  )}
                </div>
              </div>

              {/* Rate Button */}
              <div className="w-[20%] grow">
                <div className="flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onRateClicked(opinion, urlMetaData)
                    }}
                    className="flex justify-center items-center w-full mr-10 h-10 text-base font-bold rounded-lg border-brand-blue text-white bg-brand-blue hover:bg-blue-800 z-50"
                  >
                    <span>Rate</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex w-full">
              {opinion?.citations && opinion?.citations.length > 0 && (
                <div className="relative px-3 py-2 mr-10 mt-6 bg-[#FAFAFA] rounded-lg w-full mx-auto md:w-full text-gray-900 dark:text-gray-200">
                  <A
                    href={`/post/${opinion?.citations[0]?.citation?.tokenID}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span
                      className={classNames(
                        getIMORatingColors(
                          Math.round(
                            opinion?.citations[0]?.citation?.compositeRating
                          )
                        ),
                        'absolute top-2 right-2 w-10 h-8 flex justify-center items-center rounded-lg font-extrabold text-xl'
                      )}
                    >
                      {Math.round(
                        opinion?.citations[0]?.citation?.compositeRating
                      )}
                    </span>

                    <div className="text-sm text-black/[.5] mb-4">
                      {opinion?.citations[0]?.inFavor ? 'FOR' : 'AGAINST'}
                    </div>

                    <div className="flex items-start">
                      {/* The citation minter profile image */}
                      <div className="mr-4 flex flex-col items-center space-y-2">
                        <div className="relative rounded-full w-6 h-6">
                          <Image
                            className="rounded-full"
                            src={
                              opinion?.citations[0]?.citation?.minter
                                ?.profilePhoto || '/DefaultProfilePicture.png'
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
                          <A className="font-bold">
                            {displayUsernameOrWalletCitation}
                          </A>
                          {opinion?.citations[0]?.citation?.minter
                            ?.twitterUsername && (
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
                                @
                                {
                                  opinion?.citations[0]?.citation?.minter
                                    ?.twitterUsername
                                }
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

                          {cutOffContent && (
                            <A
                              href={`/post/${opinion?.citations[0]?.citation?.tokenID}`}
                              className="absolute bottom-0 right-0 text-blue-500 z-[60]"
                            >
                              (More...)
                            </A>
                          )}
                        </div>
                      </div>
                    </div>
                  </A>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile row */}
      <div className="md:hidden w-full">
        <div className="w-full relative px-3 py-4">
          {minterAddress && (
            <div className="flex items-center pb-2 flex-wrap">
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
                className="ml-2 font-bold text-black hover:text-blue-600"
                href={`/u/${usernameOrWallet}`}
              >
                {displayUsernameOrWallet}
              </A>

              {opinion?.minterToken?.twitterUsername && (
                <A
                  className="flex items-center space-x-1 text-black ml-1 z-50"
                  href={`/u/${usernameOrWallet}`}
                >
                  <div className="relative w-4 h-4">
                    <Image
                      src={'/twitter-solid-blue.svg'}
                      alt="twitter-solid-blue-icon"
                      layout="fill"
                    />
                  </div>
                  <span className="text-sm opacity-50">
                    @{opinion?.minterToken?.twitterUsername}
                  </span>
                </A>
              )}
            </div>
          )}

          <ListingContent
            ideaToken={opinion}
            page="MobileAccountPage"
            urlMetaData={urlMetaData}
            useMetaData={
              getListingTypeFromIDTURL(opinion?.url) !== LISTING_TYPE.TWEET
            }
          />
        </div>

        <div className="flex justify-between items-start text-center px-10 py-4 border-b border-t">
          <div className="text-left">
            <div className="font-semibold text-black/[.5]">
              {SortOptionsAccountOpinions.MARKET_INTEREST.displayName}
            </div>
            <div className="flex items-center">
              <span className="text-blue-600 dark:text-gray-300 mr-1 font-extrabold text-xl">
                {formatNumberWithCommasAsThousandsSerperator(
                  Math.round(opinion?.marketInterest)
                )}
              </span>
            </div>
          </div>

          <div>
            <div className="font-semibold text-black/[.5]">Comments</div>
            <div className="flex items-center font-medium text-lg text-black">
              <ChatIcon className="w-4 mr-1" />
              {formatNumberWithCommasAsThousandsSerperator(
                opinion?.latestCommentsCount
              )}
            </div>
          </div>
        </div>

        <div className="w-10 h-10 my-4 ml-2 flex justify-center items-center rounded-lg bg-blue-100 text-blue-600 font-semibold text-xl">
          {opinion?.rating}
        </div>

        {/* Citation box */}
        <div className="w-full flex">
          {opinion?.citations && opinion?.citations.length > 0 && (
            <div className="relative px-3 py-2 mb-6 mx-3 bg-[#FAFAFA] rounded-lg w-full text-gray-900 dark:text-gray-200">
              <A
                href={`/post/${opinion?.citations[0]?.citation?.tokenID}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span
                  className={classNames(
                    getIMORatingColors(
                      Math.round(
                        opinion?.citations[0]?.citation?.compositeRating
                      )
                    ),
                    'absolute top-2 right-2 w-8 h-7 flex justify-center items-center rounded-lg font-extrabold'
                  )}
                >
                  {Math.round(opinion?.citations[0]?.citation?.compositeRating)}
                </span>

                <div className="text-sm text-black/[.5] mb-4">
                  {opinion?.citations[0]?.inFavor ? 'FOR' : 'AGAINST'}
                </div>

                <div className="flex items-start">
                  {/* The citation minter profile image */}
                  <div className="mr-4 flex flex-col items-center space-y-2">
                    <div className="relative rounded-full w-6 h-6">
                      <Image
                        className="rounded-full"
                        src={
                          opinion?.citations[0]?.citation?.minter
                            ?.profilePhoto || '/DefaultProfilePicture.png'
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
                      <A className="font-bold">
                        {displayUsernameOrWalletCitation}
                      </A>
                      {opinion?.citations[0]?.citation?.minter
                        ?.twitterUsername && (
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
                            @
                            {
                              opinion?.citations[0]?.citation?.minter
                                ?.twitterUsername
                            }
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

                      {cutOffContent && (
                        <A
                          href={`/post/${opinion?.citations[0]?.citation?.tokenID}`}
                          className="absolute bottom-0 right-0 text-blue-500 z-[60]"
                        >
                          (More...)
                        </A>
                      )}
                    </div>
                  </div>
                </div>
              </A>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center px-10 py-4 border-t">
          {/* <div className="">
            <WatchingStar token={opinion} />
          </div> */}

          <button
            onClick={(e) => {
              e.stopPropagation()
              onRateClicked(opinion, urlMetaData)
            }}
            className="flex justify-center items-center w-20 h-10 text-base font-bold rounded-lg border-brand-blue text-white bg-brand-blue hover:bg-blue-800"
          >
            <span>Rate</span>
          </button>
        </div>
      </div>
    </div>
  )
}
