import { SortOptionsHomePostsTable } from 'utils/tables'

const defaultColumns = [
  {
    id: 1,
    name: 'Name',
    content: 'Name',
    value: 'name',
    sortable: false,
    isOptional: false,
    isSelectedAtStart: true,
  },
  {
    id: 2,
    name: 'Market Interest',
    content: SortOptionsHomePostsTable.MARKET_INTEREST.displayName,
    value: SortOptionsHomePostsTable.MARKET_INTEREST.value,
    sortable: true,
    isOptional: false,
    isSelectedAtStart: true,
  },
  {
    id: 3,
    name: 'Confidence',
    content: 'Confidence',
    value: SortOptionsHomePostsTable.COMPOSITE_RATING.value,
    sortable: true,
    isOptional: false,
    isSelectedAtStart: true,
  },
  // {
  //   id: 4,
  //   name: 'Average Rating',
  //   content: 'Average Rating',
  //   value: SortOptionsHomePostsTable.AVG_RATING.value,
  //   sortable: true,
  //   isOptional: false,
  //   isSelectedAtStart: true,
  // },
  // {
  //   id: 5,
  //   name: 'Ratings',
  //   content: 'Ratings',
  //   value: SortOptionsHomePostsTable.RATINGS.value,
  //   sortable: true,
  //   isOptional: false,
  //   isSelectedAtStart: true,
  // },
  {
    id: 6,
    name: 'TX Buttons',
    content: 'Rate',
    value: 'txButtons',
    sortable: false,
    isOptional: false,
    isSelectedAtStart: true,
  },
]

export default defaultColumns
