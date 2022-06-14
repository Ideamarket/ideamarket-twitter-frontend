import { ChevronDownIcon } from '@heroicons/react/solid'
import useOnClickOutside from 'utils/useOnClickOutside'
import SelectableButton from 'components/buttons/SelectableButton'
// import { getIconVersion } from 'utils/icons'
import { OverviewSearchbar } from 'components/tokens/OverviewSearchbar'
import DropdownButtons from 'components/dropdowns/DropdownButtons'
import { useContext, useRef, useState } from 'react'
import {
  getSortOptionDisplayNameByValue,
  SortOptionsHomePostsTable,
  SortOptionsHomeUsersTable,
  TABLE_NAMES,
} from 'utils/tables'
import Tooltip from 'components/tooltip/Tooltip'
import { PencilIcon } from '@heroicons/react/outline'
import { useWalletStore } from 'store/walletStore'
import ModalService from 'components/modals/ModalService'
import NewPostModal from 'modules/posts/components/NewPostModal'
import WalletModal from 'components/wallet/WalletModal'
import { GlobalContext } from 'lib/GlobalContext'

type Props = {
  orderBy: string
  isStarredFilterActive: boolean
  categoriesData: any[]
  selectedCategories: string[]
  selectedTable: TABLE_NAMES
  setOrderBy: (value: string) => void
  onNameSearchChanged: (value: string) => void
  setIsStarredFilterActive: (isActive: boolean) => void
  onCategoryClicked: (newClickedCategoryId: string) => void
}

const OverviewFiltersMobile = ({
  orderBy,
  isStarredFilterActive,
  categoriesData,
  selectedCategories,
  selectedTable,
  setOrderBy,
  onNameSearchChanged,
  setIsStarredFilterActive,
  onCategoryClicked,
}: Props) => {
  const [isSortingDropdownOpen, setIsSortingDropdownOpen] = useState(false)
  const ref = useRef()
  useOnClickOutside(ref, () => setIsSortingDropdownOpen(false))

  const { setOnWalletConnectedCallback } = useContext(GlobalContext)

  const onNewPostClicked = () => {
    if (!useWalletStore.getState().web3) {
      setOnWalletConnectedCallback(() => () => {
        ModalService.open(NewPostModal)
      })
      ModalService.open(WalletModal)
    } else {
      ModalService.open(NewPostModal)
    }
  }

  return (
    <div className="md:hidden bg-white dark:bg-gray-700 rounded-t-xl">
      <div className="p-3 border-b-[6px]">
        <button
          onClick={onNewPostClicked}
          className="flex justify-center items-center space-x-2 h-10 w-full px-3 py-1 mb-2 bg-gradient-to-br from-brand-blue-1 to-brand-blue-2 text-white text-sm font-bold rounded-lg"
        >
          <span>New Post</span>
          <PencilIcon className="w-3" />
        </button>

        <div className="flex justify-between space-x-2 w-full h-10 mb-2">
          {/* <SelectableButton
            onClick={setIsStarredFilterActive}
            isSelected={isStarredFilterActive}
            label={<StarIcon className="w-5 h-5" />}
            joined={JOINED_TYPES.NONE}
            className="rounded-lg"
          /> */}
          <div
            onClick={() => setIsSortingDropdownOpen(!isSortingDropdownOpen)}
            className="relative w-full flex justify-center items-center px-2 py-1 ml-auto border rounded-md"
          >
            <span className="mr-1 text-sm text-black/[.5] font-semibold dark:text-white whitespace-nowrap">
              Sort by:
            </span>
            <span className="text-sm text-blue-500 font-semibold flex items-center">
              {/* <span>{getSortByIcon(selectedSortOptionID)}</span> */}
              <span>
                {getSortOptionDisplayNameByValue(orderBy, selectedTable)}
              </span>
            </span>
            <span>
              <ChevronDownIcon className="h-5" />
            </span>

            {isSortingDropdownOpen && (
              <DropdownButtons
                container={ref}
                filters={Object.values(
                  selectedTable === TABLE_NAMES.HOME_POSTS
                    ? SortOptionsHomePostsTable
                    : SortOptionsHomeUsersTable
                )}
                selectedOptions={new Set([orderBy])}
                toggleOption={setOrderBy}
              />
            )}
          </div>
        </div>

        <OverviewSearchbar onNameSearchChanged={onNameSearchChanged} />
      </div>

      {selectedTable === TABLE_NAMES.HOME_POSTS && (
        <div className="flex gap-x-2 pl-2 py-3 overflow-x-scroll border-b-[6px]">
          {categoriesData &&
            categoriesData.map((cat: any) => (
              <SelectableButton
                label={`${cat}`}
                isSelected={selectedCategories.includes(cat)}
                onClick={() => onCategoryClicked(cat)}
                roundedSize="3xl"
                key={cat}
              />
            ))}
        </div>
      )}

      {selectedTable === TABLE_NAMES.HOME_POSTS ? (
        <div className="w-full flex gap-x-3 px-3 py-3 leading-4 text-xs text-black/[.5] font-semibold">
          <div className="w-1/4 flex items-start">
            <span className="mr-1">SCRUTINY</span>
            <Tooltip>
              <div className="w-40 md:w-64">
                The total amount of IMO staked on all users who rated a post
              </div>
            </Tooltip>
          </div>

          <div className="w-1/4 flex items-start">
            <span className="mr-1">
              IMO
              <br />
              RATING
            </span>
            <Tooltip>
              <div className="w-full md:w-64">
                Rating weighted by IMO staked on each user. The more IMO staked
                on a user, the more that user’s ratings affect the IMO Rating of
                every post they rate.
              </div>
            </Tooltip>
          </div>

          <div className="w-1/4">RATINGS</div>

          <div className="w-1/4"></div>
        </div>
      ) : (
        <div className="w-full flex px-3 py-3 leading-4 text-xs text-black/[.5] font-semibold">
          <div className="w-1/4 flex items-start">
            <span className="mr-1">STAKED</span>
            <Tooltip>
              <div className="w-40 md:w-64">
                The total amount of IMO staked on a user
              </div>
            </Tooltip>
          </div>

          {/* <div className="w-1/4 flex items-start">
            <span className="mr-1">7D CHANGE</span>
          </div> */}

          <div className="w-1/4">HOLDERS</div>

          <div className="w-1/4">RATINGS</div>

          <div className="w-1/4"></div>
        </div>
      )}
    </div>
  )
}

export default OverviewFiltersMobile
