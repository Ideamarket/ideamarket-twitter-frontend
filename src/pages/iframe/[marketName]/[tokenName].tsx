import { useTokenIconURL } from 'actions'
import { A } from 'components'
import { useRouter } from 'next/router'
import { getMarketSpecificsByMarketNameInURLRepresentation } from 'store/markets'

export default function IframeEmbed() {
  const router = useRouter()
  const rawMarketName = router.query.marketName as string
  const rawTokenName = router.query.tokenName as string

  const marketSpecifics = getMarketSpecificsByMarketNameInURLRepresentation(
    rawMarketName
  )

  const { tokenIconURL, isLoading } = useTokenIconURL({
    marketSpecifics,
    tokenName: marketSpecifics?.getTokenNameFromURLRepresentation(rawTokenName),
  })

  if (!router.isReady) {
    return <p>loading...</p>
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
            $0.79
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
