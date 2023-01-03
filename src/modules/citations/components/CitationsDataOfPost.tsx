import classNames from 'classnames'
import { GlobalContext } from 'lib/GlobalContext'
import { flatten } from 'lodash'
import OpinionTable from 'modules/ratings/components/ListingPage/OpinionTable'
import { getAllTwitterOpinions } from 'modules/ratings/services/TwitterOpinionService'
import { useContext, useState } from 'react'
import { useInfiniteQuery } from 'react-query'
import {
  SortOptionsHomePostsTable,
  SortOptionsListingPageOpinions,
} from 'utils/tables'
import {
  getAllCitationsByPostID,
  getAllCitedOnByTokenID,
} from '../services/CitationService'
import ArgumentsView from './ArgumentsView'
import ArgumentsViewMobile from './ArgumentsViewMobile'
import CitedOnView from './CitedOnView'

type Props = {
  postID: string
  isMobile?: boolean
}

const TOKENS_PER_PAGE = 10

const infiniteQueryConfig = {
  getNextPageParam: (lastGroup, allGroups) => {
    const morePagesExist = lastGroup?.length === TOKENS_PER_PAGE

    if (!morePagesExist) {
      return false
    }

    return allGroups.length * TOKENS_PER_PAGE
  },
  refetchOnMount: false,
  refetchOnWindowFocus: false,
  enabled: true, // This apparently decides if data is loaded on page load or not
  keepPreviousData: true,
}

enum CITATION_VIEWS {
  CITATIONS,
  CITED_BY,
  OPINIONS,
}

const CitationsDataOfPost = ({ postID, isMobile = false }: Props) => {
  const { isTxPending } = useContext(GlobalContext)
  const [viewSelected, setViewSelected] = useState(CITATION_VIEWS.OPINIONS)

  const [orderBy, setOrderBy] = useState(
    SortOptionsListingPageOpinions.RATING.value
  )
  const [orderDirection, setOrderDirection] = useState('desc')
  const [nameSearch, setNameSearch] = useState('')

  async function opinionsQueryFunction(numTokens: number, skip: number = 0) {
    if (
      viewSelected === CITATION_VIEWS.CITATIONS ||
      viewSelected === CITATION_VIEWS.CITED_BY
    )
      return

    const latestOpinions = await getAllTwitterOpinions({
      ratedPostID: postID,
      skip,
      limit: numTokens,
      orderBy: orderBy,
      orderDirection,
      search: nameSearch,
      latest: true,
    })
    return latestOpinions || []
  }

  async function citationsQueryFunction(numTokens: number, skip: number = 0) {
    if (
      viewSelected === CITATION_VIEWS.OPINIONS ||
      viewSelected === CITATION_VIEWS.CITED_BY
    )
      return

    const latestCitations = await getAllCitationsByPostID({
      postID,
      latest: true,
      skip,
      limit: numTokens,
      orderBy: orderBy,
      orderDirection,
    })
    return latestCitations || []
  }

  async function citedByQueryFunction(numTokens: number, skip: number = 0) {
    if (
      viewSelected === CITATION_VIEWS.OPINIONS ||
      viewSelected === CITATION_VIEWS.CITATIONS
    )
      return

    const citedByList = await getAllCitedOnByTokenID({
      tokenID: postID,
      skip,
      limit: numTokens,
      orderBy: SortOptionsHomePostsTable.MARKET_INTEREST.value,
      orderDirection,
    })
    return citedByList || []
  }

  const {
    data: infiniteOpinionsData,
    isFetching: isOpinionsDataLoading,
    fetchNextPage: fetchMoreOpinions,
    // refetch: refetchOpinions,
    hasNextPage: canFetchMoreOpinions,
  } = useInfiniteQuery(
    [
      'opinions',
      orderBy,
      orderDirection,
      nameSearch,
      viewSelected,
      isTxPending,
      postID,
    ],
    ({ pageParam = 0 }) => opinionsQueryFunction(TOKENS_PER_PAGE, pageParam),
    infiniteQueryConfig
  )

  const opinionPairs = flatten(infiniteOpinionsData?.pages || [])

  const {
    data: infiniteCitationsData,
    isFetching: isCitationsDataLoading,
    fetchNextPage: fetchMoreCitations,
    // refetch: refetchCitations,
    hasNextPage: canFetchMoreCitations,
  } = useInfiniteQuery(
    [
      `citations-of-${postID}`,
      orderBy,
      orderDirection,
      nameSearch,
      viewSelected,
      isTxPending,
      postID,
    ],
    ({ pageParam = 0 }) => citationsQueryFunction(TOKENS_PER_PAGE, pageParam),
    infiniteQueryConfig
  )

  const citationPairs = flatten(infiniteCitationsData?.pages || [])

  const {
    data: infiniteCitedByData,
    // isFetching: isCitedByDataLoading,
    fetchNextPage: fetchMoreCitedBy,
    // refetch: refetchCitedBy,
    hasNextPage: canFetchMoreCitedBy,
  } = useInfiniteQuery(
    [
      'cited-by',
      orderBy,
      orderDirection,
      nameSearch,
      viewSelected,
      isTxPending,
      postID,
    ],
    ({ pageParam = 0 }) => citedByQueryFunction(TOKENS_PER_PAGE, pageParam),
    infiniteQueryConfig
  )

  const citedByPairs = flatten(infiniteCitedByData?.pages || [])

  function headerClicked(headerValue: string) {
    if (orderBy === headerValue) {
      if (orderDirection === 'asc') {
        setOrderDirection('desc')
      } else {
        setOrderDirection('asc')
      }
    } else {
      setOrderBy(headerValue)
      setOrderDirection('desc')
    }
  }

  return (
    <div className="max-w-[78rem] md:mt-8 mx-0 md:mx-5 xl:mx-auto pb-96">
      <div className="mb-4 flex justify-center items-center space-x-3">
        <button
          onClick={() => {
            headerClicked(SortOptionsListingPageOpinions.RATING.value)
            setViewSelected(CITATION_VIEWS.OPINIONS)
          }}
          className={classNames(
            viewSelected === CITATION_VIEWS.OPINIONS
              ? 'text-blue-600 bg-blue-100'
              : 'text-black/[.25] hover:bg-gray-200',
            'px-4 py-2 border rounded-lg font-bold'
          )}
        >
          Ratings
        </button>

        <button
          onClick={() => {
            headerClicked(SortOptionsHomePostsTable.LATEST_RATINGS_COUNT.value)
            setViewSelected(CITATION_VIEWS.CITATIONS)
          }}
          className={classNames(
            viewSelected === CITATION_VIEWS.CITATIONS
              ? 'text-blue-600 bg-blue-100'
              : 'text-black/[.25] hover:bg-gray-200',
            'px-4 py-2 border rounded-lg font-bold'
          )}
        >
          All arguments for & against
        </button>

        {/* <button
          onClick={() => {
            headerClicked(SortOptionsHomePostsTable.MARKET_INTEREST.value)
            setViewSelected(CITATION_VIEWS.CITED_BY)
          }}
          className={classNames(
            viewSelected === CITATION_VIEWS.CITED_BY
              ? 'text-blue-600 bg-blue-100'
              : 'text-black/[.25] hover:bg-gray-200',
            'px-4 py-2 border rounded-lg font-bold'
          )}
        >
          Cited By
        </button> */}
      </div>

      {viewSelected === CITATION_VIEWS.CITATIONS && (
        <>
          <ArgumentsView
            isCitationsDataLoading={isCitationsDataLoading}
            citationPairs={citationPairs}
            canFetchMoreCitations={canFetchMoreCitations}
            fetchMoreCitations={fetchMoreCitations}
            key={postID}
          />

          <ArgumentsViewMobile
            isCitationsDataLoading={isCitationsDataLoading}
            citationPairs={citationPairs}
            canFetchMoreCitations={canFetchMoreCitations}
            fetchMoreCitations={fetchMoreCitations}
            key={postID}
          />
        </>
      )}

      {viewSelected === CITATION_VIEWS.OPINIONS && (
        <OpinionTable
          isMobile={isMobile}
          opinionPairs={opinionPairs}
          orderBy={orderBy}
          orderDirection={orderDirection}
          canFetchMoreOpinions={canFetchMoreOpinions}
          isOpinionsDataLoading={isOpinionsDataLoading}
          setOrderBy={setOrderBy}
          setNameSearch={setNameSearch}
          headerClicked={headerClicked}
          fetchMoreOpinions={fetchMoreOpinions}
          key={postID}
        />
      )}

      {viewSelected === CITATION_VIEWS.CITED_BY && (
        <CitedOnView
          citedByPairs={citedByPairs}
          canFetchMoreCitedBy={canFetchMoreCitedBy}
          fetchMoreCitedBy={fetchMoreCitedBy}
          key={postID}
        />
      )}
    </div>
  )
}

export default CitationsDataOfPost
