import { useTokenIconURL } from 'actions'
import { A } from 'components'
import { useRouter } from 'next/router'
import { useQuery } from 'react-query'
import { querySingleToken } from 'store/ideaMarketsStore'
import { getMarketSpecificsByMarketNameInURLRepresentation } from 'store/markets'
import { formatNumber } from 'utils'

function IframeEmbedSkeleton() {
  return (
    <div className="flex justify-center items-center h-full animate-pulse">
      <div className="flex justify-around items-center w-80 h-14 border bg-white rounded-lg border-black border-opacity-10 p-2">
        <div className="h-10 w-10 p-2.5 bg-black rounded-md border bg-opacity-10 flex justify-center items-center"></div>
        <div className="flex items-center">
          <div className="w-6 h-6 rounded-full overflow-hidden">
            <div className="w-full h-full bg-black bg-opacity-10 animate-pulse" />
          </div>
          <p className="ml-1 h-4 bg-black bg-opacity-10 w-16 rounded-md"></p>
        </div>
        <div className="flex items-center h-full w-[131px] bg-black bg-opacity-10 rounded-md border border-black border-opacity-10">
          <div className="flex-1 flex justify-center items-center h-full"></div>
          <div className="h-full flex-1 rounded-md overflow-hidden">
            <A className="bg-[#1534d9] w-full h-full flex justify-center items-center"></A>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function IframeEmbed() {
  const router = useRouter()
  const rawMarketName = router.query.marketName as string
  const rawTokenName = router.query.tokenName as string

  const marketSpecifics = getMarketSpecificsByMarketNameInURLRepresentation(
    rawMarketName
  )

  const marketName = marketSpecifics?.getMarketName()
  const tokenName = marketSpecifics?.getTokenNameFromURLRepresentation(
    rawTokenName
  )

  const { tokenIconURL, isLoading } = useTokenIconURL({
    marketSpecifics,
    tokenName,
  })

  const { data: token, isLoading: isTokenLoading } = useQuery(
    [`token-${marketName}-${tokenName}`, marketName, tokenName],
    querySingleToken
  )

  if (!router.isReady || isTokenLoading || !token) {
    return <IframeEmbedSkeleton />
  }

  return (
    <div className="flex justify-center items-center h-full">
      <div className="flex justify-around items-center w-80 h-14 border bg-white rounded-lg border-black border-opacity-10 p-2">
        <div className="h-10 w-10 p-2.5 bg-black rounded-md border bg-opacity-10  flex justify-center items-center">
          {marketSpecifics.getMarketOutlineSVG()}
        </div>
        <div className="flex">
          <div className="w-6 h-6 rounded-full overflow-hidden">
            {isLoading ? (
              <div className="w-full h-full bg-gray-400 animate-pulse" />
            ) : (
              <img
                src={tokenIconURL}
                alt={rawTokenName}
                className="object-cover w-full h-full"
              />
            )}
          </div>
          <p className="text-[#323232] font-bold ml-1">{rawTokenName}</p>
        </div>
        <div className="flex items-center h-full w-[131px] bg-black bg-opacity-10 rounded-md border border-black border-opacity-10">
          <div className="flex-1 flex justify-center items-center h-full text-sm font-medium text-[#373737] text-opacity-100">
            ${formatNumber(token.latestPricePoint.price)}
          </div>
          <div className="h-full flex-1 rounded-md overflow-hidden">
            <A
              className="text-sm font-bold text-white bg-[#1534d9] w-full h-full flex justify-center items-center"
              href={`https://app.ideamarket.io/i/${rawMarketName}/${rawTokenName}`}
            >
              Buy
            </A>
          </div>
        </div>
      </div>
    </div>
  )
}
