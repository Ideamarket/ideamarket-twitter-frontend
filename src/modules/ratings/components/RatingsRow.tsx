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

  return (
    <div ref={lastElementRef}>
      {/* Desktop row */}
      <div className="hidden relative md:block py-6 hover:bg-black/[.02]">
        {/* Makes so entire row can be clicked to go to Post page */}
        <a
          href={`/post/${opinion?.tokenID}`}
          className="absolute top-0 left-0 w-full h-full z-40"
          title="open in new tab"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="invisible">Go to post page</span>
        </a>

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
                {minterAddress && (
                  <div className="flex items-center pb-2 whitespace-nowrap">
                    <A
                      className="font-bold hover:text-blue-600 z-50"
                      href={`/u/${usernameOrWallet}`}
                    >
                      {displayUsernameOrWallet}
                    </A>
                  </div>
                )}

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
                  {opinion?.marketInterest} IMO
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
              {/* The user comment for this opinion */}
              {opinion && opinion?.comment && opinion?.comment.length > 0 && (
                <div className="w-full mt-4">
                  <div className="bg-black/[.02] rounded-lg px-4 py-2 mr-10">
                    <div className="text-black text-sm">{opinion?.comment}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile row */}
      <div className="md:hidden">
        <div className="w-full relative px-3 py-4">
          {minterAddress && (
            <div className="flex items-center pb-2 whitespace-nowrap">
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
            <div className="font-semibold text-black/[.5]">Hot</div>
            <div className="flex items-center">
              <span className="text-blue-600 dark:text-gray-300 mr-1 font-extrabold text-xl">
                {opinion?.marketInterest} IMO
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

        {/* Rating and comment */}
        <div className="flex items-start p-3 m-3 bg-black/[.02] rounded-lg">
          <div className="w-10 h-8 mr-3 flex justify-center items-center rounded-lg bg-blue-100 text-blue-600 font-semibold">
            {opinion?.rating}
          </div>

          <div className="w-[85%] font-medium text-black">
            {opinion?.comment}
          </div>
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
