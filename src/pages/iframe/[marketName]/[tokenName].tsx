import { ArrowCircleUpIcon } from '@heroicons/react/solid'
import { useTokenIconURL } from 'actions'
import { A } from 'components'
import { useRouter } from 'next/router'
import { useQuery } from 'react-query'
import { querySingleToken } from 'store/ideaMarketsStore'
import { getMarketSpecificsByMarketNameInURLRepresentation } from 'store/markets'
import { formatNumber } from 'utils'

export function IframeEmbedSkeleton() {
  return (
    <div className="flex flex-col justify-center space-y-4 items-center h-full">
      <div className="flex items-center w-[663px] bg-white rounded-2xl p-5 animate-pulse shadow-embed">
        <div className="p-3">
          <div className="block w-9 h-9 rounded-full bg-gray-400" />
        </div>
        <div className="flex items-center ml-2">
          <div className="w-12 h-12 rounded-full overflow-hidden">
            <div className="w-full h-full bg-gray-400 animate-pulse" />
          </div>
          <p className="bg-gray-400 h-6 w-24 rounded-md ml-4"></p>
        </div>

        <div className="ml-auto flex items-center h-full w-[200px] bg-brand-gray-white rounded-md border border-brand-border-gray-2">
          <div className="flex-1 flex justify-center items-center h-full"></div>
          <div className="h-full flex-1 rounded-md overflow-hidden">
            <div className="bg-brand-new-blue w-full h-full px-4"></div>
          </div>
        </div>

        <div className="ml-4">
          <p className="w-16 bg-gray-400 h-4 rounded"></p>
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
    <div className="flex flex-col justify-center space-y-4 items-center h-full">
      <div className="flex items-center w-[663px] bg-white rounded-2xl p-5 shadow-embed">
        <div className="p-3">
          <img
            className="block w-auto h-9"
            src="/logo.png"
            alt="Ideamarket Logo"
          />
        </div>
        <div className="flex items-center ml-2">
          <div className="w-12 h-12 rounded-full overflow-hidden">
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
          <p className="text-brand-new-dark font-medium text-2xl ml-4">
            {tokenName}
          </p>
        </div>

        <div className="ml-auto flex items-center h-full w-[200px] bg-brand-gray-white rounded-md border border-brand-border-gray-2">
          <div className="flex-1 flex justify-center items-center h-full text-2xl font-medium text-brand-new-dark">
            ${formatNumber(token.latestPricePoint.price)}
          </div>
          <div className="h-full flex-1 rounded-md overflow-hidden">
            <A
              className="text-2xl font-medium text-white bg-brand-new-blue w-full h-full flex justify-center items-center px-4"
              href={`https://app.ideamarket.io/i/${rawMarketName}/${rawTokenName}`}
            >
              <ArrowCircleUpIcon className="w-7 h-7 mr-1 text-[#a5bbfb]" />
              Buy
            </A>
          </div>
        </div>

        <div className="ml-4">
          <A
            className="underline cursor-pointer text-brand-gray-white-2 font-medium text-xs"
            href="https://ideamarket.io"
          >
            What's this?
          </A>
        </div>
      </div>
    </div>
  )
}
