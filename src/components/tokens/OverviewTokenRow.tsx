import { IdeaToken } from 'store/ideaMarketsStore'
import {
  formatNumberWithCommasAsThousandsSerperator,
  formatNumberInt,
} from 'utils'
import { useQuery } from 'react-query'
import { getURLMetaData } from 'actions/web2/getURLMetaData'
import { ChatIcon } from '@heroicons/react/outline'
import ListingContent from './ListingContent'
import { getListingTypeFromIDTURL, LISTING_TYPE } from './utils/ListingUtils'
import A from 'components/A'
import { convertAccountName } from 'lib/utils/stringUtil'
import Image from 'next/image'
import { ArrowRightIcon } from '@heroicons/react/solid'
import { useRouter } from 'next/router'

type Props = {
  token: any
  getColumn: (column: string) => any
  lastElementRef?: (node) => void
  onRateClicked: (idt: IdeaToken, urlMetaData: any) => void
  refetch: () => any
}

export default function TokenRow({
  token,
  getColumn,
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
        <a
          href={`/post/${token?.tokenID}`}
          className="absolute top-0 left-0 w-full h-full z-40"
          title="open in new tab"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="invisible">Go to post page</span>
        </a>

        <div className="flex text-black">
          {/* Icon and Name and ListingContent */}
          <div className="w-[45%] lg:w-[55%] relative pl-6 md:pr-10">
            <div className="relative flex items-start w-3/4 p-3 mx-auto md:w-full text-gray-900 dark:text-gray-200 border rounded-lg bg-white z-[60]">
              <div className="mr-4 flex flex-col items-center space-y-2">
                <div className="relative rounded-full w-6 h-6">
                  <Image
                    className="rounded-full"
                    src={
                      token?.minterToken?.profilePhoto ||
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
                {minterAddress && (
                  <div className="flex items-center pb-2 whitespace-nowrap">
                    <A
                      className="font-semibold text-blue hover:text-blue-600 text-sm z-50"
                      href={`/u/${usernameOrWallet}`}
                    >
                      {displayUsernameOrWallet}
                    </A>
                  </div>
                )}

                <ListingContent
                  ideaToken={token}
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
            <div className="w-[11%] lg:w-[9%] grow pr-2">
              <div className="mt-0.5 font-medium">
                {token?.marketInterest} IMO
              </div>
            </div>

            {/* Composite Rating */}
            <div className="w-[11%] lg:w-[9%] grow">
              <span className="w-10 h-8 flex justify-center items-center rounded-lg bg-blue-100 text-blue-600 dark:text-gray-300 font-extrabold text-xl">
                {token?.compositeRating}
              </span>
            </div>

            {/* Average Rating */}
            <div className="w-[11%] lg:w-[9%] grow">
              <div className="text-black font-semibold">
                {formatNumberInt(token?.averageRating)}
              </div>
            </div>

            {/* latestCommentsCount */}
            <div className="w-[11%] lg:w-[9%] grow">
              <div className="flex items-center font-medium text-lg text-black">
                <ChatIcon className="w-4 mr-1" />
                {formatNumberWithCommasAsThousandsSerperator(
                  token?.latestCommentsCount
                )}
              </div>
            </div>

            {/* Rate Button */}
            <div className="w-[11%] lg:w-[9%] grow">
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
      <div className="md:hidden">
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

              <ArrowRightIcon
                onClick={() => router.push(`/post/${token?.tokenID}`)}
                className="ml-auto w-5 text-blue-600"
              />
            </div>
          )}

          <ListingContent
            ideaToken={token}
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
              {token?.marketInterest} IMO
            </span>
          </div>

          {/* Composite rating */}
          <div className="flex flex-col justify-start font-medium leading-5">
            <span className="mb-1">
              <span className="w-10 h-8 flex justify-center items-center rounded-lg bg-blue-100 text-blue-600 dark:text-gray-300 font-extrabold text-xl">
                {token?.compositeRating}
              </span>
            </span>
          </div>

          {/* Latest comments count */}
          <div className="flex items-center font-medium text-lg text-black">
            <ChatIcon className="w-4 mr-1" />
            {formatNumberWithCommasAsThousandsSerperator(
              token?.latestCommentsCount
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation()
              onRateClicked(token, urlMetaData)
            }}
            className="flex justify-center items-center w-20 h-10 text-base font-bold border rounded-lg text-blue-500 bg-transparent"
          >
            <span>Rate</span>
          </button>
        </div>
      </div>
    </div>
  )
}
