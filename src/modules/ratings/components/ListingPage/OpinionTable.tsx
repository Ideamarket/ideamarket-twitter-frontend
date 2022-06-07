import { OverviewSearchbar } from 'components/tokens/OverviewSearchbar'
import { A } from 'components'
import { convertAccountName } from 'lib/utils/stringUtil'
import DropdownButtons from 'components/dropdowns/DropdownButtons'
import { useEffect, useRef, useState } from 'react'
import { ChevronDownIcon } from '@heroicons/react/solid'
import {
  getSortOptionDisplayNameByValue,
  SortOptionsListingPageOpinions,
  TABLE_NAMES,
} from 'utils/tables'
import { SortAscendingIcon, SortDescendingIcon } from '@heroicons/react/solid'
import Image from 'next/image'
import EmptyTableBody from 'modules/tables/components/EmptyTableBody'
import { getIMORatingColors, urlify } from 'utils/display/DisplayUtils'
import { formatNumberWithCommasAsThousandsSerperator } from 'utils'
import classNames from 'classnames'

type DropdownButtonProps = {
  toggleOption: (value: any) => void
  orderBy?: string
}

const DropdownButton = ({ toggleOption, orderBy }: DropdownButtonProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const container = useRef(null)

  function handleClickOutside(event) {
    const value = container.current
    if (value && !value.contains(event.target)) {
      setIsDropdownOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div
      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      className="relative w-max h-9 flex items-center px-2 py-1 border-2 rounded-md"
    >
      <span className="mr-1 text-sm text-black/[.5] font-semibold dark:text-white whitespace-nowrap">
        Sort by:
      </span>
      <span className="text-sm text-blue-500 font-semibold flex items-center">
        {getSortOptionDisplayNameByValue(
          orderBy,
          TABLE_NAMES.LISTING_PAGE_OPINIONS
        )}
      </span>
      <span>
        <ChevronDownIcon className="h-5" />
      </span>

      {isDropdownOpen && (
        <DropdownButtons
          container={container}
          filters={Object.values(SortOptionsListingPageOpinions)}
          selectedOptions={new Set([orderBy])}
          toggleOption={toggleOption}
        />
      )}
    </div>
  )
}

type Props = {
  desktopLastElementRef: any
  mobileLastElementRef: any
  opinionPairs: any[]
  orderBy: string
  orderDirection: string
  setOrderBy: (value: string) => void
  setNameSearch: (value: string) => void
  headerClicked: (value: string) => void
}

const userAndCommentColWidth = 'w-[30%]'
const stakedColWidth = 'w-[10%]'
const ratingColWidth = 'w-[10%]'
const citationColWidth = 'w-[50%]'

const OpinionTable = ({
  desktopLastElementRef,
  mobileLastElementRef,
  opinionPairs,
  orderBy,
  orderDirection,
  setOrderBy,
  setNameSearch,
  headerClicked,
}: Props) => {
  return (
    <>
      {/* Desktop and tablet table */}
      <div className="hidden md:block rounded-xl w-full">
        {/* Table header */}
        <div className="rounded-xl flex items-center w-full h-16 text-black/[.5] font-semibold text-xs">
          {/* STAKED column */}
          <div
            onClick={() =>
              headerClicked(SortOptionsListingPageOpinions.STAKED.value)
            }
            className={classNames(
              stakedColWidth,
              `pl-6 flex items-center cursor-pointer`
            )}
          >
            <span className="mr-1 uppercase">
              {SortOptionsListingPageOpinions.STAKED.displayName}
            </span>
            {orderBy === SortOptionsListingPageOpinions.STAKED.value && (
              <div
                className="h-8 z-[42] text-[.65rem] flex justify-center items-center"
                title="SORT"
              >
                {orderDirection === 'desc' ? (
                  <SortDescendingIcon className="w-3.5 text-blue-500" />
                ) : (
                  <SortAscendingIcon className="w-3.5 text-blue-500" />
                )}
              </div>
            )}
          </div>

          {/* User and comment column */}
          <div className={classNames(userAndCommentColWidth, `pl-14 pr-6`)}>
            USER
          </div>

          {/* RATING column */}
          <div
            onClick={() =>
              headerClicked(SortOptionsListingPageOpinions.RATING.value)
            }
            className={classNames(
              ratingColWidth,
              `pl-10 flex items-center cursor-pointer`
            )}
          >
            <span className="mr-1 uppercase">
              {SortOptionsListingPageOpinions.RATING.displayName}
            </span>
            {orderBy === SortOptionsListingPageOpinions.RATING.value && (
              <div
                className="h-8 z-[42] text-[.65rem] flex justify-center items-center"
                title="SORT"
              >
                {orderDirection === 'desc' ? (
                  <SortDescendingIcon className="w-3.5 text-blue-500" />
                ) : (
                  <SortAscendingIcon className="w-3.5 text-blue-500" />
                )}
              </div>
            )}
          </div>

          {/* Citation column */}
          <div
            className={classNames(
              citationColWidth,
              `pl-6 flex justify-between items-center`
            )}
          >
            <span className="mr-1 uppercase">CITATION</span>

            <div className="w-52">
              <OverviewSearchbar
                onNameSearchChanged={(value) => setNameSearch(value)}
              />
            </div>
          </div>
        </div>

        <div className="">
          {opinionPairs?.map((opinion, oIndex) => {
            const displayUsernameOrWallet = convertAccountName(
              opinion?.userToken?.username || opinion?.ratedBy
            )
            const usernameOrWallet =
              opinion?.userToken?.username || opinion?.ratedBy

            const cutOffContent =
              opinion?.citations[0].citation?.content?.length > 280
            const citationText = !cutOffContent
              ? opinion?.citations[0].citation?.content
              : opinion?.citations[0].citation?.content.slice(0, 280) + '...'

            const displayUsernameOrWalletCitation = convertAccountName(
              opinion?.citations[0].citation?.minter?.username ||
                opinion?.citations[0].citation?.minter?.walletAddress
            )
            const usernameOrWalletCitation =
              opinion?.citations[0].citation?.minter?.username ||
              opinion?.citations[0].citation?.minter?.walletAddress

            return (
              <div
                ref={desktopLastElementRef}
                className="bg-white h-min min-h-[5rem] py-4 mb-4 flex items-start w-full text-black rounded-2xl"
                key={oIndex}
              >
                {/* STAKED column */}
                <div
                  className={classNames(
                    stakedColWidth,
                    `text-blue-500 font-semibold pl-6 pr-4`
                  )}
                >
                  {formatNumberWithCommasAsThousandsSerperator(
                    Math.round(opinion?.userToken?.deposits)
                  )}{' '}
                  IMO
                </div>

                {/* User and comment column */}
                <div
                  className={classNames(
                    userAndCommentColWidth,
                    `flex items-center pl-14`
                  )}
                >
                  <div className="relative flex items-start w-3/4 mx-auto md:w-full text-gray-900 dark:text-gray-200">
                    <div className="mr-4 flex flex-col items-center space-y-2">
                      <div className="relative rounded-full w-6 h-6">
                        <Image
                          className="rounded-full"
                          src={
                            opinion?.userToken?.profilePhoto ||
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
                      <div className="flex items-center space-x-1 pb-2 flex-wrap">
                        <A
                          className="font-bold hover:text-blue-600 z-50"
                          href={`/u/${usernameOrWallet}`}
                        >
                          {displayUsernameOrWallet}
                        </A>
                        {opinion?.userToken?.twitterUsername && (
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
                              @{opinion?.userToken?.twitterUsername}
                            </span>
                          </A>
                        )}
                      </div>

                      {/* {opinion?.comment && (
                        <div
                          dangerouslySetInnerHTML={{
                            __html: urlify(opinion?.comment),
                          }}
                          className="w-full px-3 py-2 bg-[#FAFAFA] rounded-lg whitespace-pre-wrap break-words"
                          style={{ wordBreak: 'break-word' }} // Fixes overflow issue on browsers that dont support break-words above
                        />
                      )} */}
                    </div>
                  </div>
                </div>

                {/* RATING column */}
                <div
                  className={classNames(
                    ratingColWidth,
                    `pl-10 text-blue-500 font-semibold`
                  )}
                >
                  {opinion?.rating}
                </div>

                {/* CITATION column */}
                <div
                  className={classNames(
                    citationColWidth,
                    `text-blue-500 font-semibold pl-6 pr-4`
                  )}
                >
                  <div className="relative px-3 py-2 bg-[#FAFAFA] rounded-lg w-3/4 mx-auto md:w-full text-gray-900 dark:text-gray-200">
                    <A
                      href={`/post/${opinion?.citations[0].citation?.tokenID}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span
                        className={classNames(
                          getIMORatingColors(
                            Math.round(
                              opinion?.citations[0].citation?.compositeRating
                            )
                          ),
                          'absolute top-2 right-2 w-10 h-8 flex justify-center items-center rounded-lg font-extrabold text-xl'
                        )}
                      >
                        {Math.round(
                          opinion?.citations[0].citation?.compositeRating
                        )}
                      </span>

                      <div className="text-sm text-black/[.5] mb-4">
                        {opinion?.citations[0].citation?.inFavor
                          ? 'FOR'
                          : 'AGAINST'}
                      </div>

                      <div className="flex items-start">
                        {/* The citation minter profile image */}
                        <div className="mr-4 flex flex-col items-center space-y-2">
                          <div className="relative rounded-full w-6 h-6">
                            <Image
                              className="rounded-full"
                              src={
                                opinion?.citations[0].citation?.minter
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
                            {opinion?.citations[0].citation?.minter
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
                                    opinion?.citations[0].citation?.minter
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
                                href={`/post/${opinion?.citations[0].citation?.tokenID}`}
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
                </div>
              </div>
            )
          })}

          {opinionPairs && opinionPairs.length <= 0 && <EmptyTableBody />}
        </div>
      </div>

      {/* Mobile table */}
      <div className="rounded-t-2xl md:hidden w-full bg-white shadow-lg">
        {/* Table header */}
        <div className="flex items-center w-full h-16 p-3 border-b-[6px]">
          <DropdownButton
            toggleOption={(newSelectedFilterId) =>
              setOrderBy(newSelectedFilterId)
            }
            orderBy={orderBy}
          />

          <div className="w-full h-9 ml-2">
            <OverviewSearchbar
              onNameSearchChanged={(value) => setNameSearch(value)}
            />
          </div>
        </div>

        <div className="divide-y-[6px]">
          {opinionPairs?.map((opinion, oIndex) => {
            const displayUsernameOrWallet = convertAccountName(
              opinion?.userToken?.username || opinion?.ratedBy
            )
            const usernameOrWallet =
              opinion?.userToken?.username || opinion?.ratedBy

            const cutOffContent =
              opinion?.citations[0].citation?.content?.length > 280
            const citationText = !cutOffContent
              ? opinion?.citations[0].citation?.content
              : opinion?.citations[0].citation?.content.slice(0, 280) + '...'

            const displayUsernameOrWalletCitation = convertAccountName(
              opinion?.citations[0].citation?.minter?.username ||
                opinion?.citations[0].citation?.minter?.walletAddress
            )
            const usernameOrWalletCitation =
              opinion?.citations[0].citation?.minter?.username ||
              opinion?.citations[0].citation?.minter?.walletAddress

            return (
              <div
                ref={mobileLastElementRef}
                className="relative bg-white px-3 py-4 flex flex-col justify-center w-full text-black"
                key={oIndex}
              >
                <div className="absolute top-2 right-2 w-10 h-8 flex justify-center items-center rounded-lg bg-blue-100 text-blue-600 font-semibold">
                  {opinion?.rating}
                </div>

                <div className="mb-2 flex items-start space-x-3">
                  <div className="flex items-center pb-2 flex-wrap">
                    <div className="relative rounded-full w-6 h-6">
                      <Image
                        className="rounded-full"
                        src={
                          opinion?.userToken?.profilePhoto ||
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
                    {opinion?.userToken?.twitterUsername && (
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
                          @{opinion?.userToken?.twitterUsername}
                        </span>
                      </A>
                    )}
                  </div>

                  <span className="text-blue-500 font-medium">
                    {formatNumberWithCommasAsThousandsSerperator(
                      Math.round(opinion?.userToken?.deposits)
                    )}{' '}
                    IMO
                  </span>
                </div>

                <div className="relative px-3 py-2 bg-[#FAFAFA] rounded-lg w-full mx-auto md:w-full text-gray-900 dark:text-gray-200">
                  <A
                    href={`/post/${opinion?.citations[0].citation?.tokenID}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span
                      className={classNames(
                        getIMORatingColors(
                          Math.round(
                            opinion?.citations[0].citation?.compositeRating
                          )
                        ),
                        'absolute top-2 right-2 w-10 h-8 flex justify-center items-center rounded-lg font-extrabold text-xl'
                      )}
                    >
                      {Math.round(
                        opinion?.citations[0].citation?.compositeRating
                      )}
                    </span>

                    <div className="text-sm text-black/[.5] mb-4">
                      {opinion?.citations[0].citation?.inFavor
                        ? 'FOR'
                        : 'AGAINST'}
                    </div>

                    <div className="flex items-start">
                      {/* The citation minter profile image */}
                      <div className="mr-4 flex flex-col items-center space-y-2">
                        <div className="relative rounded-full w-6 h-6">
                          <Image
                            className="rounded-full"
                            src={
                              opinion?.citations[0].citation?.minter
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
                          {opinion?.citations[0].citation?.minter
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
                                  opinion?.citations[0].citation?.minter
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
                              href={`/post/${opinion?.citations[0].citation?.tokenID}`}
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
              </div>
            )
          })}

          {opinionPairs && opinionPairs.length <= 0 && <EmptyTableBody />}
        </div>
      </div>
    </>
  )
}

export default OpinionTable
