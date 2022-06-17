import client from 'lib/axios'
import { TIME_FILTER } from 'utils/tables'

const subDays = function (isoDate: string, daysToAdd: number) {
  const myDate = new Date(isoDate)
  myDate.setDate(myDate.getDate() - daysToAdd)
  return myDate.toISOString().slice(0, 10)
}

const getStartAndEndDateFromTimeFilter = (timeFilter: TIME_FILTER) => {
  const today = new Date().toISOString().slice(0, 10) // Ex: "2018-08-03"
  switch (timeFilter) {
    case TIME_FILTER.ONE_DAY:
      const dayBeforeToday = subDays(today, 1)
      return { startDate: dayBeforeToday, endDate: today }
    case TIME_FILTER.ONE_WEEK:
      const weekBeforeToday = subDays(today, 7)
      return { startDate: weekBeforeToday, endDate: today }
    case TIME_FILTER.ONE_MONTH:
      const monthBeforeToday = subDays(today, 30) // TODO: use exact # days in current month eventually instead of 30
      return { startDate: monthBeforeToday, endDate: today }
    case TIME_FILTER.ONE_YEAR:
      const yearBeforeToday = subDays(today, 365)
      return { startDate: yearBeforeToday, endDate: today }
    case TIME_FILTER.ALL_TIME:
      return null
    default:
      return null
  }
}

/**
 * Get all posts (URLs and text posts)
 */
export default async function apiGetAllPosts({
  skip,
  limit,
  orderBy,
  orderDirection,
  categories, // array of strings representing category tags to add to this new onchain listing (OPTIONAL)
  filterTokens,
  search,
  minterAddress,
  timeFilter,
}) {
  try {
    const categoriesString =
      categories && categories.length > 0 ? categories.join(',') : null
    const filterTokensString =
      filterTokens && filterTokens?.length > 0 ? filterTokens?.join(',') : null
    const response = await client.get(`/post`, {
      params: {
        skip,
        limit,
        orderBy,
        orderDirection,
        categories: categoriesString,
        filterTokens: filterTokensString,
        search,
        minterAddress,
        ...getStartAndEndDateFromTimeFilter(timeFilter),
      },
    })

    return response?.data?.data?.posts
  } catch (error) {
    console.error('Could not get all posts', error)
    return []
  }
}
