import { formatNumberWithCommasAsThousandsSerperator } from 'utils'
import A from 'components/A'
import { convertAccountName } from 'lib/utils/stringUtil'
import Image from 'next/image'
import { ArrowRightIcon } from '@heroicons/react/solid'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { IdeamarketUser, RecommendedUser } from '../services/UserMarketService'

type Props = {
  recommendedUser: RecommendedUser
  lastElementRef?: (node) => void
  onStakeClicked: (idt: IdeamarketUser) => void
  refetch: () => any
}

export default function UserRecommendedRow({
  recommendedUser,
  onStakeClicked,
  lastElementRef,
  refetch,
}: Props) {
  const router = useRouter()

  const { walletAddress } = (recommendedUser?.partnerUserToken || {}) as any

  const displayUsernameOrWallet = convertAccountName(
    recommendedUser?.partnerUserToken?.username || walletAddress
  )
  const usernameOrWallet =
    recommendedUser?.partnerUserToken?.username || walletAddress

  return (
    <div ref={lastElementRef}>
      {/* Desktop row */}
      <div className="hidden relative md:block py-6 hover:bg-black/[.02]">
        {/* Makes so entire row can be clicked to go to User page */}
        <Link href={`/u/${usernameOrWallet}`}>
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
          {/* Icon and Name and bio */}
          <div className="w-[45%] lg:w-[55%] relative pl-6 md:pr-10">
            <div className="relative flex items-start w-3/4 p-3 mx-auto md:w-full text-gray-900 dark:text-gray-200 border rounded-lg bg-white">
              <div className="mr-4 flex flex-col items-center space-y-2">
                <div className="relative rounded-full w-6 h-6">
                  <Image
                    className="rounded-full"
                    src={
                      recommendedUser?.partnerUserToken?.profilePhoto ||
                      '/default-profile-pic.png'
                    }
                    alt=""
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
              </div>

              <div className="pr-6 w-full">
                {walletAddress && (
                  <div className="flex items-center pb-2 flex-wrap space-x-1">
                    <A
                      className="font-bold text-black hover:text-blue-600 z-50"
                      href={`/u/${usernameOrWallet}`}
                    >
                      {displayUsernameOrWallet}
                    </A>
                    {recommendedUser?.partnerUserToken?.twitterUsername && (
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
                          @{recommendedUser?.partnerUserToken?.twitterUsername}
                        </span>
                      </A>
                    )}
                  </div>
                )}

                <div className="whitespace-pre-wrap break-words text-sm italic">
                  {recommendedUser?.partnerUserToken?.bio}
                </div>
              </div>
            </div>
          </div>

          <div className="w-[55%] lg:w-[45%] h-max flex items-center">
            {/* % MATCH */}
            <div className="w-[18.33%] lg:w-[15%] grow flex items-start">
              <div className="flex flex-col justify-center font-medium leading-5">
                <span>
                  {formatNumberWithCommasAsThousandsSerperator(
                    Math.round(recommendedUser?.relation?.matchScore)
                  )}
                  %
                </span>
              </div>
            </div>

            {/* STAKED */}
            <div className="w-[18.33%] lg:w-[11.25%] grow pr-2">
              <div className="flex flex-col justify-start leading-5 text-blue-500 font-bold">
                {formatNumberWithCommasAsThousandsSerperator(
                  Math.round(recommendedUser?.partnerUserToken?.deposits)
                )}{' '}
                IMO
              </div>
            </div>

            {/* Stake Button */}
            <div className="w-[18.33%] lg:w-[15%] grow">
              <div className="flex space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onStakeClicked(recommendedUser?.partnerUserToken)
                  }}
                  className="flex justify-center items-center w-20 h-10 text-base font-bold rounded-lg border-brand-blue text-white bg-brand-blue hover:bg-blue-800 z-50"
                >
                  <span>Stake</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile row */}
      <div
        onClick={() => router.push(`/u/${usernameOrWallet}`)}
        className="md:hidden text-black"
      >
        <div className="px-3 pt-4">
          {walletAddress && (
            <div className="flex items-center pb-2 whitespace-nowrap">
              <div className="relative rounded-full w-6 h-6">
                <Image
                  className="rounded-full"
                  src={
                    recommendedUser?.partnerUserToken?.profilePhoto ||
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
                {recommendedUser?.partnerUserToken?.twitterUsername && (
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
                      @{recommendedUser?.partnerUserToken?.twitterUsername}
                    </span>
                  </A>
                )}
              </div>

              <ArrowRightIcon
                onClick={() => router.push(`/u/${usernameOrWallet}`)}
                className="ml-auto w-5 text-blue-600"
              />
            </div>
          )}

          <div className="whitespace-pre-wrap break-words text-sm italic">
            {recommendedUser?.partnerUserToken?.bio}
          </div>
        </div>

        <div className="flex justify-between items-center text-center px-3 py-4">
          {/* % MATCH */}
          <div className="flex flex-col justify-start font-medium leading-5">
            <span className="mb-1">
              {formatNumberWithCommasAsThousandsSerperator(
                Math.round(recommendedUser?.relation?.matchScore)
              )}
              %
            </span>
          </div>

          {/* STAKED */}
          <div className="flex items-center">
            <span className="text-base text-black/[.5] text-blue-500 font-bold">
              {formatNumberWithCommasAsThousandsSerperator(
                Math.round(recommendedUser?.partnerUserToken?.deposits)
              )}{' '}
              IMO
            </span>
          </div>

          {/* Stake Button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              onStakeClicked(recommendedUser?.partnerUserToken)
            }}
            className="flex justify-center items-center w-20 h-10 text-base font-bold border rounded-lg text-blue-500 bg-transparent z-[500]"
          >
            <span>Stake</span>
          </button>
        </div>
      </div>
    </div>
  )
}
