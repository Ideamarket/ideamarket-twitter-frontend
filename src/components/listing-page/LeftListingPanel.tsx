import WatchingStar from 'components/WatchingStar'
import { investmentTokenToUnderlying } from 'store/compoundStore'
import { bigNumberTenPow18, web3BNToFloatString, ZERO_ADDRESS } from 'utils'
import { IdeaMarket, IdeaToken } from 'store/ideaMarketsStore'
import BN from 'bn.js'
import { IMarketSpecifics } from 'store/markets'
import { LeftListingSkeleton } from './LeftListingSkeleton'
import UnverifiedListing from './UnverifiedListing'
import VerifiedListing from './VerifiedListing'
import Permalink from './Permalink'
import ListingIframe from './ListingIframe'

type LeftListingPanelProps = {
  isLoading: boolean
  market: IdeaMarket
  token: IdeaToken
  compoundExchangeRate: BN
  marketSpecifics: IMarketSpecifics
  refetch: any
  rawMarketName: string
  rawTokenName: string
}

export default function LeftListingPanel({
  isLoading,
  market,
  token,
  compoundExchangeRate,
  marketSpecifics,
  refetch,
  rawMarketName,
  rawTokenName,
}: LeftListingPanelProps) {
  const claimableInterest = token
    ? web3BNToFloatString(
        investmentTokenToUnderlying(
          token.rawInvested,
          compoundExchangeRate
        ).sub(token.rawDaiInToken),
        bigNumberTenPow18,
        2
      )
    : '0.00'

  return (
    <div className="flex flex-col">
      <div className="h-full p-5 mb-5 bg-white dark:bg-gray-700 dark:border-gray-500 border rounded-md md:mr-5 border-brand-border-gray">
        <div className="relative">
          {isLoading ? (
            <LeftListingSkeleton token={token} />
          ) : (
            <>
              {token.tokenOwner === ZERO_ADDRESS ? (
                <UnverifiedListing
                  claimableInterest={claimableInterest}
                  marketSpecifics={marketSpecifics}
                  market={market}
                  token={token}
                />
              ) : (
                <VerifiedListing
                  token={token}
                  refetch={refetch}
                  claimableInterest={claimableInterest}
                />
              )}

              <WatchingStar className="absolute top-0 right-0" token={token} />
            </>
          )}
        </div>

        <div>
          <Permalink token={token} />

          <ListingIframe
            rawMarketName={rawMarketName}
            rawTokenName={rawTokenName}
          />
        </div>
      </div>
    </div>
  )
}
