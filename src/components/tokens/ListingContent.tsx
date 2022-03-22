import classNames from 'classnames'
import { DefaultLayout } from 'components/layouts'
import TwitterProfileDesktopContent from 'components/listing-page/TwitterProfileDesktopContent'
import TwitterProfileMobileContent from 'components/listing-page/TwitterProfileMobileContent'
import WikiContent from 'components/listing-page/WikiContent'
import { ReactElement } from 'react'
import { IdeaToken } from 'store/ideaMarketsStore'
import { getMarketSpecificsByMarketName } from 'store/markets'
import { getListingTypeFromIDTURL, LISTING_TYPE } from './utils/ListingUtils'

const ListingContent = ({
  ideaToken,
  page,
  urlMetaData,
  useMetaData = false,
}: {
  ideaToken: IdeaToken
  page: string // The page this component is being used on
  urlMetaData?: any
  useMetaData?: boolean // Show meta data from URL instead of anything else
}) => {
  const listingType = getListingTypeFromIDTURL(ideaToken?.url)
  const showMetaData =
    (useMetaData || listingType === LISTING_TYPE.GENERAL_URL) &&
    urlMetaData &&
    urlMetaData?.ogImage

  const marketSpecifics = getMarketSpecificsByMarketName(ideaToken?.marketName)
  const twitterUsername = marketSpecifics?.getTokenNameURLRepresentation(
    ideaToken?.name
  )

  return (
    <div
      className={classNames(
        page === 'ListingPage' ? 'text-white' : 'text-black/[.5]',
        'my-4'
      )}
    >
      {/* Wikipedia listing content */}
      {!showMetaData && listingType === LISTING_TYPE.WIKI && (
        <WikiContent wikiTitle={ideaToken?.name} />
      )}

      {/* Twitter profile listing content */}
      {!showMetaData && listingType === LISTING_TYPE.TWITTER_PROFILE && (
        <div style={{ height: '400px' }}>
          <TwitterProfileMobileContent twitterUsername={twitterUsername} />
          <TwitterProfileDesktopContent twitterUsername={twitterUsername} />
        </div>
      )}

      {showMetaData && (
        <a
          href={`/i/${ideaToken?.listingId}`}
          className="px-4 md:px-0 cursor-pointer"
          target="_blank"
          rel="noopener noreferrer"
        >
          {/* Didn't use Next image because can't do wildcard domain allow in next config file */}
          <img
            className="rounded-xl mt-4 h-full md:h-56"
            src={
              urlMetaData && urlMetaData?.ogImage
                ? urlMetaData.ogImage
                : '/gray.svg'
            }
            alt=""
            referrerPolicy="no-referrer"
          />
          <div className="w-full my-4 text-sm text-left leading-5 whitespace-normal">
            {urlMetaData &&
              urlMetaData?.ogDescription &&
              urlMetaData.ogDescription}
          </div>
        </a>
      )}
    </div>
  )
}

ListingContent.getLayout = (page: ReactElement) => (
  <DefaultLayout bgColor="bg-theme-blue-1 dark:bg-gray-900">
    {page}
  </DefaultLayout>
)

export default ListingContent
