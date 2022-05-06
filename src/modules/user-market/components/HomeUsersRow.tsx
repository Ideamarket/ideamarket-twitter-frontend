import { IdeaToken } from 'store/ideaMarketsStore'
import {
  formatNumberWithCommasAsThousandsSerperator,
  formatNumberInt,
} from 'utils'
import { useQuery } from 'react-query'
import { getURLMetaData } from 'actions/web2/getURLMetaData'
import { UsersIcon } from '@heroicons/react/outline'
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

export default function HomeUsersRow({
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

  const displayUsernameOrWallet = convertAccountName(
    token?.username || token?.walletAddress
  )
  const usernameOrWallet = token?.username || token?.walletAddress

  return (
    <>
      {/* Desktop row */}
      <div
        ref={lastElementRef}
        className="hidden relative md:block py-6 hover:bg-black/[.02]"
      >
        {/* Makes so entire row can be clicked to go to Post page */}
        <a
          href={`/u/${usernameOrWallet}`}
          className="absolute top-0 left-0 w-full h-full z-40"
        >
          <span className="invisible">Go to post page</span>
        </a>

        <div className="flex text-black">
          {/* Icon and Name and ListingContent */}
          <div className="w-[45%] lg:w-[55%] relative pl-6 lg:pr-10">
            <div className="relative flex items-start w-3/4 mx-auto md:w-full text-gray-900 dark:text-gray-200">
              <div className="mr-4 flex flex-col items-center space-y-2">
                <div className="relative rounded-full w-6 h-6">
                  <Image
                    className="rounded-full"
                    src={token?.profilePhoto || '/DefaultProfilePicture.png'}
                    alt=""
                    layout="fill"
                    objectFit="cover"
                  />
                </div>

                {/* <WatchingStar token={token} /> */}
              </div>

              <div className="pr-6 w-full">
                <div className="flex items-center pb-2 whitespace-nowrap">
                  <A
                    className="font-bold hover:text-blue-600 z-50"
                    href={`/u/${usernameOrWallet}`}
                  >
                    {displayUsernameOrWallet}
                  </A>
                </div>

                <div>{token?.bio}</div>
              </div>
            </div>
          </div>

          {/* STAKED */}
          <div className="w-[13.75%] lg:w-[11.25%] flex items-start">
            <span className="text-base text-blue-500 font-bold">
              {token?.deposits}
            </span>
            <div className="relative w-5 h-5 mr-1">
              <Image
                src="/im-logo-1.png"
                alt="IM-logo-composite-rating"
                layout="fill"
                objectFit="cover"
              />
            </div>
          </div>

          {/* 7D CHANGE */}
          <div className="w-[13.75%] lg:w-[11.25%]">
            <div className="text-black font-semibold">
              {formatNumberInt(token?.weekChange)}
            </div>
          </div>

          {/* HOLDERS */}
          <div className="w-[13.75%] lg:w-[11.25%] pr-2">
            <div className="flex flex-col justify-start font-medium leading-5">
              {token?.holders}
            </div>
          </div>

          {/* STAKE Button */}
          <div className="w-[13.75%] lg:w-[11.25%]">
            <div className="flex space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  // onRateClicked(token, urlMetaData)
                }}
                className="flex justify-center items-center w-20 h-10 text-base rounded-lg text-white font-medium bg-black/[.8] hover:bg-blue-800 z-50"
              >
                <span>Stake</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile row */}
      <div ref={lastElementRef} className="md:hidden">
        <div className="px-3 pt-4">
          <div className="flex items-center pb-2 whitespace-nowrap">
            {/* <div className="mr-3">
              <WatchingStar token={token} />
            </div> */}

            <div className="relative rounded-full w-6 h-6">
              <Image
                className="rounded-full"
                src={token?.profilePhoto || '/DefaultProfilePicture.png'}
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
              onClick={() => router.push(`/u/${usernameOrWallet}`)}
              className="ml-auto w-5 text-blue-600"
            />
          </div>

          <div>{token?.bio}</div>
        </div>

        <div className="flex justify-between items-center text-center px-3 py-4">
          {/* STAKED */}
          <div className="w-1/4 flex items-center">
            <span className="text-base text-blue-600 font-semibold">
              {token?.deposits} IMO
            </span>
            <div className="relative w-4 h-4 ml-1">
              <Image
                src={'/imo-logo.png'}
                alt="token"
                layout="fill"
                objectFit="contain"
              />
            </div>
          </div>

          {/* 7D CHANGE */}
          <div className="w-1/4 flex items-center">
            <span className="">{token?.weekChange}%</span>
          </div>

          {/* HOLDERS */}
          <div className="w-1/4 flex items-center font-medium text-lg text-black">
            <UsersIcon className="w-4 mr-1" />
            {formatNumberWithCommasAsThousandsSerperator(token?.holders)}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation()
              onRateClicked(token, urlMetaData)
            }}
            className="w-1/4 flex justify-center items-center w-20 h-10 text-base border rounded-lg text-black bg-transparent font-bold"
          >
            <span>Stake</span>
          </button>
        </div>
      </div>
    </>
  )
}
