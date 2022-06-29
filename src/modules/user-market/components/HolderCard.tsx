import classNames from 'classnames'
import { A } from 'components'
import { convertAccountName } from 'lib/utils/stringUtil'
import Image from 'next/image'
import { formatNumberWithCommasAsThousandsSerperator } from 'utils'
import { urlify } from 'utils/display/DisplayUtils'

type Props = {
  holder: any
  bgCardColor?: string
  shadow?: string
}

const HolderCard = ({
  holder,
  bgCardColor = 'bg-[#FAFAFA]',
  shadow = '',
}: Props) => {
  const displayUsernameOrWallet = convertAccountName(
    holder?.username || holder?.walletAddress
  )
  const usernameOrWallet = holder?.username || holder?.walletAddress

  return (
    <>
      {/* Desktop and mobile */}
      <A
        href={`/u/${usernameOrWallet}`}
        target="_blank"
        rel="noopener noreferrer"
        className={classNames(
          bgCardColor,
          shadow,
          'relative block px-4 py-4 rounded-lg w-full text-gray-900 dark:text-gray-200 font-normal'
        )}
      >
        <div className="flex items-start">
          {/* The citation minter profile image */}
          <div className="mr-4 flex flex-col items-center space-y-2">
            <div className="relative rounded-full w-6 h-6">
              <Image
                className="rounded-full"
                src={holder?.profilePhoto || '/DefaultProfilePicture.png'}
                alt=""
                layout="fill"
                objectFit="cover"
              />
            </div>
          </div>

          {/* The citation minter username and content */}
          <div className="pr-6 w-full border-r ">
            <div className="flex items-center space-x-1 pb-2 flex-wrap text-sm text-black">
              <A className="font-bold text-sm">{displayUsernameOrWallet}</A>

              {holder?.twitterUsername && (
                <A
                  className="flex items-center space-x-1 text-black z-50"
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
                    @{holder?.twitterUsername}
                  </span>
                </A>
              )}

              {/* {holder && holder?.deposits >= 0 && (
                <span className="font-bold ml-2">{formatNumberWithCommasAsThousandsSerperator(
                  Math.round(holder?.deposits)
                ) || 0} IMO</span>
              )} */}
            </div>

            <div className="relative">
              <div
                dangerouslySetInnerHTML={{
                  __html: urlify(holder?.bio),
                }}
                className="w-full py-2 rounded-lg whitespace-pre-wrap break-words text-sm italic opacity-70"
                style={{ wordBreak: 'break-word' }} // Fixes overflow issue on browsers that dont support break-words above
              />
            </div>
          </div>

          <div className="w-[10rem] h-full my-auto pl-8 pr-2 flex justify-center items-center text-blue-600 font-bold">
            {formatNumberWithCommasAsThousandsSerperator(
              Math.round(holder?.holdingAmount)
            )}{' '}
            IMO
          </div>
        </div>
      </A>
    </>
  )
}

export default HolderCard
