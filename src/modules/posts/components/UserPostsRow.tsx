import { IdeaToken } from 'store/ideaMarketsStore'
import { formatNumberWithCommasAsThousandsSerperator } from 'utils'
import { useQuery } from 'react-query'
import { getURLMetaData } from 'actions/web2/getURLMetaData'
import ListingContent from 'components/tokens/ListingContent'
import {
  getListingTypeFromIDTURL,
  LISTING_TYPE,
} from 'components/tokens/utils/ListingUtils'
import A from 'components/A'
import { convertAccountName } from 'lib/utils/stringUtil'
import Image from 'next/image'
import { ArrowRightIcon } from '@heroicons/react/solid'
import { useRouter } from 'next/router'
import Link from 'next/link'
import classNames from 'classnames'
import { getIMORatingColors } from 'utils/display/DisplayUtils'

type Props = {
  token: any
  lastElementRef?: (node) => void
  onRateClicked: (idt: IdeaToken, urlMetaData: any) => void
  refetch: () => any
}

export default function UserPostsRow({
  token,
  onRateClicked,
  lastElementRef,
  refetch,
}: Props) {
  const router = useRouter()

  const { data: urlMetaData } = useQuery([token?.url], () =>
    getURLMetaData(token?.url)
  )

  const { minterAddress } = (token || {}) as any

  const displayUsernameOrWallet = convertAccountName(
    token?.minterToken?.username || minterAddress
  )
  const usernameOrWallet = token?.minterToken?.username || minterAddress

  return (
    <div ref={lastElementRef}>
      {/* Desktop row */}
      <div className="hidden relative md:block py-6 hover:bg-black/[.02]">
        {/* Makes so entire row can be clicked to go to Post page */}
        <Link href={`/post/${token?.tokenID}`}>
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
          {/* Icon and Name and ListingContent */}
          <div className="w-[45%] lg:w-[55%] relative pl-6 md:pr-10">
            <div className="relative flex items-start w-3/4 p-3 mx-auto md:w-full text-gray-900 dark:text-gray-200 border rounded-lg bg-white">
              <div className="mr-4 flex flex-col items-center space-y-2">
                <div className="relative rounded-full w-6 h-6">
                  <Image
                    className="rounded-full"
                    src={
                      token?.minterToken?.profilePhoto ||
                      '/default-profile-pic.png'
                    }
                    alt=""
                    layout="fill"
                    objectFit="cover"
                  />
                </div>

                {/* <WatchingStar token={token} /> */}
              </div>

              <div className="pr-6 w-full">
                {minterAddress && (
                  <div className="flex items-center pb-2 flex-wrap space-x-1">
                    <A
                      className="font-bold text-black hover:text-blue-600 z-50"
                      href={`/u/${usernameOrWallet}`}
                    >
                      {displayUsernameOrWallet}
                    </A>
                    {token?.minterToken?.twitterUsername && (
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
                          @{token?.minterToken?.twitterUsername}
                        </span>
                      </A>
                    )}
                  </div>
                )}

                <ListingContent
                  imPost={token}
                  page="HomePage"
                  urlMetaData={urlMetaData}
                  useMetaData={
                    getListingTypeFromIDTURL(token?.url) !==
                      LISTING_TYPE.TWEET &&
                    getListingTypeFromIDTURL(token?.url) !==
                      LISTING_TYPE.TEXT_POST
                  }
                />
              </div>
            </div>
          </div>

          <div className="w-[55%] lg:w-[45%] h-max flex items-center">
            {/* Market Interest */}
            <div className="w-[13.75%] lg:w-[11.25%] grow pr-2">
              <div className="flex flex-col justify-start font-medium leading-5">
                {formatNumberWithCommasAsThousandsSerperator(
                  Math.round(token?.marketInterest)
                )}
              </div>
            </div>

            {/* Composite Rating */}
            <div className="w-[13.75%] lg:w-[11.25%] grow flex items-start">
              <div className="flex flex-col justify-center font-medium leading-5">
                <span>
                  <span
                    className={classNames(
                      getIMORatingColors(
                        token?.totalRatingsCount > 0
                          ? Math.round(token?.averageRating)
                          : -1
                      ),
                      'w-14 h-12 flex justify-center items-center rounded-lg font-extrabold text-xl'
                    )}
                  >
                    {token?.totalRatingsCount > 0
                      ? Math.round(token?.averageRating) + '%'
                      : '—'}
                  </span>
                </span>
              </div>
            </div>

            {/* Average Rating */}
            {/* <div className="w-[11%] lg:w-[9%] grow">
              <div className="text-black font-semibold">
                {formatNumberInt(token?.averageRating)}
              </div>
            </div> */}

            {/* latestRatingsCount */}
            <div className="w-[13.75%] lg:w-[11.25%] grow">
              <div className="flex items-center font-medium text-lg text-black">
                {formatNumberWithCommasAsThousandsSerperator(
                  token?.latestRatingsCount
                )}
              </div>
            </div>

            {/* Rate Button */}
            <div className="w-[13.75%] lg:w-[11.25%] grow">
              <div className="flex space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onRateClicked(token, urlMetaData)
                  }}
                  className="flex justify-center items-center w-20 h-10 text-base font-bold rounded-lg border-brand-blue text-white bg-brand-blue hover:bg-blue-800 z-50"
                >
                  <span>Rate</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile row */}
      <div
        onClick={() => router.push(`/post/${token?.tokenID}`)}
        className="md:hidden"
      >
        <div className="px-3 pt-4">
          {minterAddress && (
            <div className="flex items-center pb-2 whitespace-nowrap">
              {/* <div className="mr-3">
                <WatchingStar token={token} />
              </div> */}

              <div className="relative rounded-full w-6 h-6">
                <Image
                  className="rounded-full"
                  src={
                    token?.minterToken?.profilePhoto ||
                    '/default-profile-pic.png'
                  }
                  alt=""
                  layout="fill"
                  objectFit="cover"
                />
              </div>

              <div className="flex items-center flex-wrap space-x-1 text-black">
                <A
                  className="ml-2 font-bold hover:text-blue-600"
                  href={`/u/${usernameOrWallet}`}
                >
                  {displayUsernameOrWallet}
                </A>
                {token?.minterToken?.twitterUsername && (
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
                      @{token?.minterToken?.twitterUsername}
                    </span>
                  </A>
                )}
              </div>

              <ArrowRightIcon
                onClick={() => router.push(`/post/${token?.tokenID}`)}
                className="ml-auto w-5 text-blue-600"
              />
            </div>
          )}

          <ListingContent
            imPost={token}
            page="HomePage"
            urlMetaData={urlMetaData}
            useMetaData={
              getListingTypeFromIDTURL(token?.url) !== LISTING_TYPE.TWEET
            }
          />
        </div>

        <div className="flex justify-between items-center text-center px-3 py-4">
          {/* Market interest */}
          <div className="flex items-center">
            <span className="text-base text-black/[.5] font-medium">
              {formatNumberWithCommasAsThousandsSerperator(
                Math.round(token?.marketInterest)
              )}
            </span>
          </div>

          {/* Composite rating */}
          <div className="flex flex-col justify-start font-medium leading-5">
            <span className="mb-1">
              <span
                className={classNames(
                  getIMORatingColors(
                    token?.totalRatingsCount > 0
                      ? Math.round(token?.averageRating)
                      : -1
                  ),
                  'w-14 h-12 flex justify-center items-center rounded-lg font-extrabold text-xl'
                )}
              >
                {token?.totalRatingsCount > 0
                  ? Math.round(token?.averageRating) + '%'
                  : '—'}
              </span>
            </span>
          </div>

          {/* latestRatingsCount */}
          <div className="flex items-center font-medium text-lg text-black">
            {formatNumberWithCommasAsThousandsSerperator(
              token?.latestRatingsCount
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation()
              onRateClicked(token, urlMetaData)
            }}
            className="flex justify-center items-center w-20 h-10 text-base font-bold border rounded-lg text-blue-500 bg-transparent z-[500]"
          >
            <span>Rate</span>
          </button>
        </div>
      </div>
    </div>
  )
}
