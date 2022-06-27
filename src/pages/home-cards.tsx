import { DefaultLayout } from 'components'
import React, { ReactElement, useContext, useState } from 'react'
import { IdeaToken } from 'store/ideaMarketsStore'
import { WalletModal } from 'components'
import ModalService from 'components/modals/ModalService'

import { useWalletStore } from 'store/walletStore'
import { NextSeo } from 'next-seo'
import { GlobalContext } from 'pages/_app'
import { startingOptionalColumns } from 'components/home/utils'
import { CheckboxFilters } from 'components/tokens/utils/OverviewUtils'
import RateModal from 'components/trade/RateModal'
import {
  HomeUsersTableColumns,
  SortOptionsHomePostsTable,
  SortOptionsHomeUsersTable,
  TIME_FILTER,
} from 'utils/tables'
import classNames from 'classnames'
import HomeUsersTable from 'modules/user-market/components/HomeUsersTable'
import StakeUserModal from 'modules/user-market/components/StakeUserModal'
import { USER_MARKET } from 'modules/user-market/utils/UserMarketUtils'
import IMPostCardView from 'modules/posts/components/HomePage/IMPostCardView'
import IMPostOverlay from 'modules/posts/components/HomePage/IMPostOverlay'

export enum HOME_PAGE_VIEWS {
  POSTS,
  USERS,
}

const HomeCards = () => {
  // After trade or list success, the token data needs to be refetched. This toggle does that.
  const [tradeOrListSuccessToggle, setTradeOrListSuccessToggle] =
    useState(false)
  const [isStarredFilterActive, setIsStarredFilterActive] = useState(false)
  const [nameSearch, setNameSearch] = useState('')
  const [orderBy, setOrderBy] = useState(
    SortOptionsHomePostsTable.MARKET_INTEREST.value
  )
  const [orderDirection, setOrderDirection] = useState<'desc' | 'asc'>('desc')
  const [selectedCategories, setSelectedCategories] = useState([])
  const [selectedView, setSelectedView] = useState(HOME_PAGE_VIEWS.POSTS)
  const [timeFilter, setTimeFilter] = useState(TIME_FILTER.ALL_TIME)

  const [activeOverlayPostID, setActiveOverlayPostID] = useState(null)

  if (
    startingOptionalColumns.length ===
    CheckboxFilters.COLUMNS.values.length - 1
  ) {
    startingOptionalColumns.push('All')
  }

  const { setOnWalletConnectedCallback } = useContext(GlobalContext)

  const onNameSearchChanged = (nameSearch) => {
    setOrderBy(
      selectedView === HOME_PAGE_VIEWS.POSTS
        ? SortOptionsHomePostsTable.MARKET_INTEREST.value
        : SortOptionsHomeUsersTable.STAKED.value
    )
    setNameSearch(nameSearch)
  }

  const onOrderByChanged = (orderBy: string, direction: string) => {
    setOrderBy(orderBy)
    setOrderDirection(direction as any)
  }

  const onRateClicked = (token: IdeaToken, urlMetaData: any) => {
    const onClose = () => setTradeOrListSuccessToggle(!tradeOrListSuccessToggle)

    if (!useWalletStore.getState().web3) {
      setOnWalletConnectedCallback(() => () => {
        ModalService.open(RateModal, { ideaToken: token, urlMetaData }, onClose)
      })
      ModalService.open(WalletModal)
    } else {
      ModalService.open(RateModal, { ideaToken: token, urlMetaData }, onClose)
    }
  }

  const onStakeClicked = (token: IdeaToken) => {
    const onClose = () => setTradeOrListSuccessToggle(!tradeOrListSuccessToggle)

    if (!useWalletStore.getState().web3) {
      setOnWalletConnectedCallback(() => () => {
        ModalService.open(
          StakeUserModal,
          { ideaToken: token, market: USER_MARKET },
          onClose
        )
      })
      ModalService.open(WalletModal)
    } else {
      ModalService.open(
        StakeUserModal,
        { ideaToken: token, market: USER_MARKET },
        onClose
      )
    }
  }

  const tableProps = {
    nameSearch,
    orderBy,
    orderDirection,
    isStarredFilterActive,
    columnData:
      selectedView === HOME_PAGE_VIEWS.POSTS ? null : HomeUsersTableColumns,
    selectedCategories,
    selectedView,
    timeFilter,
    getColumn: (column) => null,
    onOrderByChanged,
    onRateClicked,
    onStakeClicked,
    tradeOrListSuccessToggle,
    setSelectedCategories,
    setIsStarredFilterActive,
    onNameSearchChanged,
    setTimeFilter,
  }

  return (
    <>
      <NextSeo title="HomeCards" />

      {activeOverlayPostID && <IMPostOverlay postID={activeOverlayPostID} />}

      {/* TODO: Create entirely separate mobile template */}

      <div className="w-full flex space-x-20 px-20 mt-20">
        <div className="w-[20%]">
          <div className="flex flex-col space-y-2">
            <div
              onClick={() => {
                onOrderByChanged(
                  SortOptionsHomePostsTable.MARKET_INTEREST.value,
                  'desc'
                )
                setSelectedView(HOME_PAGE_VIEWS.POSTS)
              }}
              className={classNames(
                selectedView === HOME_PAGE_VIEWS.POSTS
                  ? 'bg-blue-600 text-white'
                  : '',
                'p-4 rounded-xl border cursor-pointer'
              )}
            >
              Posts
            </div>

            <div
              onClick={() => {
                onOrderByChanged(SortOptionsHomeUsersTable.STAKED.value, 'desc')
                setSelectedView(HOME_PAGE_VIEWS.USERS)
              }}
              className={classNames(
                selectedView === HOME_PAGE_VIEWS.USERS
                  ? 'bg-blue-600 text-white'
                  : '',
                'p-4 rounded-xl border cursor-pointer'
              )}
            >
              Users
            </div>
          </div>
        </div>

        <div className="w-[80%]">
          {selectedView === HOME_PAGE_VIEWS.POSTS && (
            <IMPostCardView
              activeOverlayPostID={activeOverlayPostID}
              nameSearch={nameSearch}
              orderBy={orderBy}
              orderDirection={orderDirection}
              selectedCategories={selectedCategories}
              selectedView={selectedView}
              timeFilter={timeFilter}
              setActiveOverlayPostID={setActiveOverlayPostID}
            />
          )}

          {selectedView === HOME_PAGE_VIEWS.USERS && (
            <div className="mx-auto md:px-4 md:max-w-304 font-inter">
              <div className="border-brand-gray-3 dark:border-gray-500 rounded-b-xlg">
                <HomeUsersTable {...tableProps} />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default HomeCards

HomeCards.getLayout = (page: ReactElement) => (
  <DefaultLayout bgHeaderColor="bg-white" headerTextColor="text-black">
    {page}
  </DefaultLayout>
)
