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
import { urlify } from 'utils/display/DisplayUtils'

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
  opinionPairs: any[]
  orderBy: string
  orderDirection: string
  setOrderBy: (value: string) => void
  setNameSearch: (value: string) => void
  headerClicked: (value: string) => void
}

const OpinionTable = ({
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
      <div className="hidden md:block rounded-xl w-full shadow-lg">
        {/* Table header */}
        <div className="rounded-xl bg-[#FAFAFA] flex items-center w-full h-16 text-black/[.5] font-semibold text-xs">
          <div className="w-[26%] pl-6">
            <span>USER</span>
          </div>

          <div
            onClick={() =>
              headerClicked(SortOptionsListingPageOpinions.STAKED.value)
            }
            className="w-[7%] flex items-center cursor-pointer"
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

          <div
            onClick={() =>
              headerClicked(SortOptionsListingPageOpinions.RATING.value)
            }
            className="w-[7%] flex items-center cursor-pointer"
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

          <div className="w-[60%] flex items-center pr-6">
            <span>COMMENT</span>
            <div className="flex w-2/6 h-full ml-auto">
              <OverviewSearchbar
                onNameSearchChanged={(value) => setNameSearch(value)}
              />
            </div>
          </div>
        </div>

        <div className="divide-y-4">
          {opinionPairs?.map((opinion, oIndex) => {
            const displayUsernameOrWallet = convertAccountName(
              opinion?.userToken?.username || opinion?.ratedBy
            )
            const usernameOrWallet =
              opinion?.userToken?.username || opinion?.ratedBy

            return (
              <div
                className="bg-white h-min min-h-[5rem] py-4 flex items-start w-full text-black"
                key={oIndex}
              >
                {/* Icon and Name */}
                <div className="w-[26%] flex items-center pl-6">
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
                      <div className="flex items-center pb-2 whitespace-nowrap">
                        <A
                          className="font-bold hover:text-blue-600 z-50"
                          href={`/u/${usernameOrWallet}`}
                        >
                          {displayUsernameOrWallet}
                        </A>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-[7%] text-blue-500 font-semibold">
                  {Math.round(opinion?.userToken?.deposits)} IMO
                </div>

                <div className="w-[7%] text-blue-500 font-semibold">
                  {opinion?.rating}
                </div>

                <div className="w-[60%] flex items-center pr-6">
                  {opinion?.comment && (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: urlify(opinion?.comment),
                      }}
                      className="w-full px-3 py-2 bg-[#FAFAFA] rounded-lg whitespace-pre-wrap break-words "
                    />
                  )}
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

            return (
              <div
                className="bg-white px-3 py-4 flex flex-col justify-center w-full text-black"
                key={oIndex}
              >
                <div className="mb-2 flex items-start space-x-3">
                  <div className="flex items-center pb-2 whitespace-nowrap">
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
                  </div>

                  <span className="text-blue-500 font-medium">
                    {Math.round(opinion?.userToken?.deposits)} IMO
                  </span>
                </div>

                <div className="flex items-start w-full p-3 bg-black/[.02] rounded-lg">
                  <div className="w-10 h-8 mr-3 flex justify-center items-center rounded-lg bg-blue-100 text-blue-600 font-semibold">
                    {opinion?.rating}
                  </div>

                  <div
                    dangerouslySetInnerHTML={{
                      __html: urlify(opinion?.comment),
                    }}
                    className="w-[85%] font-medium whitespace-pre-wrap break-words "
                  />
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
