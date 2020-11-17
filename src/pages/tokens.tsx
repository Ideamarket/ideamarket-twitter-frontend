import { useState } from 'react'
import { useQuery } from 'react-query'
import { useRouter } from 'next/router'
import { MarketSelect, TokenCard } from '../components'
import { useWalletStore } from '../store/walletStore'
import {
  queryOwnedTokensMaybeMarket,
  queryTokensInterestReceiverMaybeMarket,
} from '../store/ideaMarketsStore'

export default function MyTokens() {
  const router = useRouter()

  const address = useWalletStore((state) => state.address)

  const [selectedMarketOwnedTokens, setSelectedMarketOwnedTokens] = useState(
    undefined
  )
  const { data: ownedTokens, isLoading: isOwnedTokensLoading } = useQuery(
    ['query-owned-tokens-maybe-market', selectedMarketOwnedTokens, address],
    queryOwnedTokensMaybeMarket
  )

  const [
    selectedMarketInterestReceiverTokens,
    setSelectedMarketInterestReceiverTokens,
  ] = useState(undefined)
  const {
    data: interestReceiverTokens,
    isLoading: isInterestReceiverTokensLoading,
  } = useQuery(
    [
      'query-interest-receiver-tokens-maybe-market',
      selectedMarketInterestReceiverTokens,
      address,
    ],
    queryTokensInterestReceiverMaybeMarket
  )

  return (
    <div className="min-h-screen bg-brand-gray">
      <div
        className="min-h-screen pt-5 mx-auto bg-white border-gray-400"
        style={{
          maxWidth: '1500px',
          borderLeftWidth: '1px',
          borderRightWidth: '1px',
        }}
      >
        <div className="flex items-center mx-5 border-gray-400 pb-2.5 border-b">
          <div className="flex-grow text-2xl sm:text-3xl text-brand-gray-2">
            Tokens I Own
          </div>
          <div className="w-48 pr-0 md:w-64">
            <MarketSelect
              onChange={(value) => {
                setSelectedMarketOwnedTokens(value.market)
              }}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-2 mx-5 mt-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {isOwnedTokensLoading
            ? 'loading...'
            : ownedTokens.map((pair) => (
                <div
                  onClick={() => {
                    router.push(`/details/${pair.token.address}`)
                  }}
                >
                  <TokenCard
                    key={pair.token.address}
                    token={pair.token}
                    market={pair.market}
                    enabled={true}
                    classes={'bg-brand-gray'}
                  />
                </div>
              ))}
        </div>

        <div className="flex items-center mx-5 border-gray-400 pb-2.5 border-b mt-10">
          <div className="flex-grow text-2xl sm:text-3xl text-brand-gray-2">
            My Tokens
          </div>
          <div className="w-48 pr-0 md:w-64">
            <MarketSelect
              onChange={(value) => {
                setSelectedMarketInterestReceiverTokens(value.market)
              }}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-2 mx-5 mt-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {isInterestReceiverTokensLoading
            ? 'loading...'
            : interestReceiverTokens.map((pair) => (
                <div
                  onClick={() => {
                    router.push(`/details/${pair.token.address}`)
                  }}
                >
                  <TokenCard
                    key={pair.token.address}
                    token={pair.token}
                    market={pair.market}
                    enabled={true}
                    classes={'bg-brand-gray'}
                  />
                </div>
              ))}
        </div>
      </div>
    </div>
  )
}
