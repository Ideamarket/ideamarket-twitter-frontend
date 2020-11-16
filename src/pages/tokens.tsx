import { useState } from 'react'
import { useQuery } from 'react-query'
import { MarketSelect, TokenCard } from '../components'
import { useWalletStore } from '../store/walletStore'
import {
  queryOwnedTokensMaybeMarket,
  queryTokens,
} from '../store/ideaMarketsStore'

export default function MyTokens() {
  const address = useWalletStore((state) => state.address)

  const [selectedMarketOwnedTokens, setSelectedMarketOwnedTokens] = useState(
    undefined
  )
  const { data: ownedTokens, isLoading: isOwnedTokensLoading } = useQuery(
    ['query-owned-tokens-maybe-market', selectedMarketOwnedTokens, address],
    queryOwnedTokensMaybeMarket
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
        <div
          className="flex items-center mx-5 border-gray-400"
          style={{ borderBottomWidth: '1px' }}
        >
          <div className="flex-grow text-3xl text-brand-gray-2">
            Tokens I Own
          </div>
          <div className="p-2.5 pr-0" style={{ minWidth: '300px' }}>
            <MarketSelect
              onChange={(value) => {
                setSelectedMarketOwnedTokens(value.market)
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 mx-5 mt-5">
          {isOwnedTokensLoading
            ? 'loading...'
            : ownedTokens.map((pair) => (
                <TokenCard
                  key={pair.token.address}
                  token={pair.token}
                  market={pair.market}
                />
              ))}
        </div>

        <div
          className="flex items-center mx-5 mt-10 border-gray-400"
          style={{ borderBottomWidth: '1px' }}
        >
          <div className="flex-grow text-3xl text-brand-gray-2">My Tokens</div>
          <div className="p-2.5 pr-0" style={{ minWidth: '300px' }}>
            <MarketSelect
              onChange={(value) => {
                setSelectedMarketOwnedTokens(value.market)
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
