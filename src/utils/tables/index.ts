export enum TABLE_NAMES {
  HOME_POSTS,
  HOME_USERS,
  ACCOUNT_HOLDINGS,
  ACCOUNT_TRADES,
  ACCOUNT_OPINIONS,
  ACCOUNT_POSTS,
  LISTING_PAGE_OPINIONS,
}

// To change string value being passed into orderBy to backend, you need to change "value" on SortOptions objects
const orderByIndividualRating = 'rating'
const orderByAverageRating = 'averageRating'
const orderByLatestCommentsCount = 'latestCommentsCount'
// const orderByLatestRatingsCount = 'latestRatingsCount'
const orderByCompositeRating = 'compositeRating'
const orderByMarketInterest = 'marketInterest'
const orderByDeposits = 'deposits'
const orderBy7DChange = 'weekChange'
const orderByHolderCount = 'holders'

export const SortOptionsHomePostsTable = {
  COMPOSITE_RATING: {
    id: 1,
    value: orderByCompositeRating,
    displayName: 'Composite Rating',
  },
  AVG_RATING: {
    id: 2,
    value: orderByAverageRating,
    displayName: 'Average Rating',
  },
  MARKET_INTEREST: {
    id: 3,
    value: orderByMarketInterest,
    displayName: 'Market Interest',
  },
  COMMENTS: {
    id: 4,
    value: orderByLatestCommentsCount,
    displayName: 'Comments',
  },
}

export const SortOptionsHomeUsersTable = {
  STAKED: {
    id: 1,
    value: orderByDeposits,
    displayName: 'STAKED',
  },
  WEEK_CHANGE: {
    id: 2,
    value: orderBy7DChange,
    displayName: '7D CHANGE',
  },
  HOLDERS: {
    id: 3,
    value: orderByHolderCount,
    displayName: 'HOLDERS',
  },
}

// All columns for HomeUsersTable
export const HomeUsersTableColumns = [
  {
    content: '',
    value: 'name',
    sortable: false,
  },
  {
    content: SortOptionsHomeUsersTable.STAKED.displayName,
    value: SortOptionsHomeUsersTable.STAKED.value,
    sortable: true,
  },
  {
    content: SortOptionsHomeUsersTable.WEEK_CHANGE.displayName,
    value: SortOptionsHomeUsersTable.WEEK_CHANGE.value,
    sortable: true,
  },
  {
    content: SortOptionsHomeUsersTable.HOLDERS.displayName,
    value: SortOptionsHomeUsersTable.HOLDERS.value,
    sortable: true,
  },
  {
    content: 'STAKE',
    value: 'stakeButton',
    sortable: false,
  },
]

// Sorting options for opinion table on listing page
export const SortOptionsListingPageOpinions = {
  // Individual user rating for 1 IDT
  RATING: {
    id: 1,
    value: orderByIndividualRating,
    displayName: 'Rating',
  },
  STAKED: {
    id: 2,
    value: orderByDeposits,
    displayName: 'Staked',
  },
}

// Sorting options for posts table on account page
export const SortOptionsAccountPosts = {
  COMPOSITE_RATING: {
    id: 1,
    value: orderByCompositeRating,
    displayName: 'Composite Rating',
  },
  AVG_RATING: {
    id: 2,
    value: orderByAverageRating,
    displayName: 'Average Rating',
  },
  MARKET_INTEREST: {
    id: 3,
    value: orderByMarketInterest,
    displayName: 'Market Interest',
  },
  COMMENTS: {
    id: 4,
    value: orderByLatestCommentsCount,
    displayName: 'Comments',
  },
}

// Sorting options for opinion table on account page
export const SortOptionsAccountOpinions = {
  AVG_RATING: {
    id: 1,
    value: orderByAverageRating,
    displayName: 'Average Rating',
  },
  // Individual user rating for 1 IDT
  RATING: {
    id: 2,
    value: orderByIndividualRating,
    displayName: 'Rating',
  },
  COMMENTS: {
    id: 3,
    value: orderByLatestCommentsCount,
    displayName: 'Comments',
  },
}

const getSortOptionsByTable = (tableName: TABLE_NAMES) => {
  switch (tableName) {
    case TABLE_NAMES.HOME_POSTS:
      return SortOptionsHomePostsTable
    case TABLE_NAMES.HOME_USERS:
      return SortOptionsHomeUsersTable
    case TABLE_NAMES.ACCOUNT_OPINIONS:
      return SortOptionsAccountOpinions
    case TABLE_NAMES.ACCOUNT_POSTS:
      return SortOptionsAccountPosts
    case TABLE_NAMES.LISTING_PAGE_OPINIONS:
      return SortOptionsListingPageOpinions
  }
}

export const getSortOptionDisplayNameByID = (
  sortOptionID: number,
  tableName: TABLE_NAMES
) => {
  const sortOptions = getSortOptionsByTable(tableName)
  const displayName = Object.values(sortOptions).find(
    (option) => option.id === sortOptionID
  )?.displayName
  return displayName
}

/**
 * @param sortOptionValue The value that the backend/subgraph use for sorting (passed in orderBy)
 */
export const getSortOptionDisplayNameByValue = (
  sortOptionValue: string,
  tableName: TABLE_NAMES
) => {
  const sortOptions = getSortOptionsByTable(tableName)
  const displayName = Object.values(sortOptions).find(
    (option) => option.value === sortOptionValue
  )?.displayName
  return displayName
}
