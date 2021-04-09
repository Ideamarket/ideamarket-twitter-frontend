import { useState } from 'react'
import { useQuery } from 'react-query'
import {
  MutualHoldersData,
  queryMutualHoldersOfToken,
} from 'store/ideaMarketsStore'
import { MutualToken, MutualTokenSkeleton } from 'components'

export type MutualTokensListSortBy =
  | 'latestTimestamp'
  | 'totalAmount'
  | 'totalHolders'

export default function MutualTokensList({
  tokenName,
  marketName,
}: {
  tokenName: string
  marketName: string
}) {
  const [sortBy, setSortBy] = useState<MutualTokensListSortBy>('totalHolders')

  const { data: mutualHoldersList, isLoading, isError } = useQuery<
    MutualHoldersData[]
  >(
    [`token-mutualHolders-${marketName}-${tokenName}`, marketName, tokenName],
    () => queryMutualHoldersOfToken({ marketName, tokenName })
  )

  function sortedMutualHolders() {
    if (isLoading || isError || !mutualHoldersList) {
      return []
    }
    return mutualHoldersList.sort(
      (a, b) => Number(b.stats[sortBy]) - Number(a.stats[sortBy])
    )
  }

  if (isError) {
    return <p>Something went wrong!!!</p>
  }

  if (
    !isLoading &&
    !isError &&
    mutualHoldersList &&
    mutualHoldersList.length === 0
  ) {
    return <></>
  }

  return (
    <>
      <div className="pb-5 mb-12 border-b border-gray-200 sm:flex sm:items-end sm:justify-between">
        <h3 className="text-2xl font-medium leading-6 text-brand-blue">
          Mutual Holders
        </h3>
        <div className="mt-3 sm:mt-0 sm:ml-4">
          <div className="flex flex-col mt-10 space-y-4 md:flex-row md:justify-between md:space-y-0">
            <div className="inline-block">
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700"
              >
                Sort By
              </label>
              <select
                disabled={isLoading}
                id="location"
                name="location"
                className="block w-full py-2 pl-3 pr-10 mt-1 text-base border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                onChange={(e) => setSortBy(e.target.value as any)}
                value={sortBy}
              >
                <option value="totalHolders">Mutual Holders</option>
                <option value="totalAmount">Mutual Tokens</option>
                <option value="latestTimestamp">Most Recent</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <dl className="grid grid-cols-1 gap-10 mt-5 md:grid-cols-2">
        {isLoading && (
          <>
            <MutualTokenSkeleton />
            <MutualTokenSkeleton />
            <MutualTokenSkeleton />
            <MutualTokenSkeleton />
            <MutualTokenSkeleton />
            <MutualTokenSkeleton />
            <MutualTokenSkeleton />
            <MutualTokenSkeleton />
            <MutualTokenSkeleton />
            <MutualTokenSkeleton />
          </>
        )}
        {!isLoading &&
          sortedMutualHolders().map((mutualHolderData) => (
            <MutualToken
              stats={mutualHolderData.stats}
              token={mutualHolderData.token}
              key={mutualHolderData.token.address}
              sortBy={sortBy}
            />
          ))}
      </dl>
    </>
  )
}
