import { useTokenIconURL } from 'actions'
import { useRouter } from 'next/router'
import { getMarketSpecificsByMarketNameInURLRepresentation } from 'store/markets'
import SubstackBlack from '../../../assets/substack-black.svg'

export default function IframeEmbed() {
  const router = useRouter()
  const marketName = router.query.marketName as string
  const tokenName = router.query.tokenName as string

  const marketSpecifics = getMarketSpecificsByMarketNameInURLRepresentation(
    marketName
  )

  const { tokenIconURL, isLoading: isTokenIconURLLoading } = useTokenIconURL({
    marketSpecifics,
    tokenName: marketSpecifics?.getTokenNameFromURLRepresentation(tokenName),
  })

  if (!router.isReady) {
    return <p>loading...</p>
  }

  return (
    <div className="flex justify-center items-center h-full">
      <div className="flex justify-around items-center w-80 h-14 border bg-white rounded-lg border-black border-opacity-10 p-2">
        <div className="h-10 w-10 bg-black rounded-md border bg-opacity-10  flex justify-center items-center">
          <SubstackBlack />
        </div>
        <div className="flex">
          <div className="w-6 h-6 rounded-full overflow-hidden">
            <img
              src={tokenIconURL}
              alt={tokenName}
              className="object-cover w-full h-full"
            />
          </div>
          <p className="text-[#323232] font-bold ml-1">{tokenName}</p>
        </div>
        <div className="flex items-center h-full w-[131px] bg-black bg-opacity-10 rounded-md border border-black border-opacity-10">
          <div className="flex-1 flex justify-center items-center h-full text-sm font-medium text-[#373737] text-opacity-100">
            $0.79
          </div>
          <div className="h-full flex-1 rounded-md overflow-hidden">
            <button className="text-sm font-bold text-white bg-[#1534d9] w-full h-full">
              Buy
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
