import classNames from 'classnames'
import { DefaultLayout } from 'components/layouts'
import { GlobalContext } from 'lib/GlobalContext'
import { ReactElement, useContext, useEffect } from 'react'
import { LISTING_TYPE } from './utils/ListingUtils'

const ListingContent = ({
  imPost,
  page,
  urlMetaData,
  useMetaData = false,
}: {
  imPost: any
  page: string // The page this component is being used on
  urlMetaData?: any
  useMetaData?: boolean // Show meta data from URL instead of anything else
}) => {
  const { isTxPending } = useContext(GlobalContext)
  // const listingType = getListingTypeFromIDTURL(imPost?.content)
  const listingType = LISTING_TYPE.TWEET

  useEffect(() => {
    // Can't get it to work without timeout
    const timeout = setTimeout(
      () => (window as any)?.twttr?.widgets?.load(),
      1000
    ) // Load tweets

    return () => {
      clearTimeout(timeout)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTxPending])

  // const showFullContent = page === 'ListingPage'
  // const cutOffContent = !showFullContent && imPost?.content?.length > 280
  const content = imPost?.content

  return (
    <div
      className={classNames(
        page === 'ListingPage' ? 'text-black' : 'text-black/[.5]',
        'w-full'
      )}
    >
      {/* Twitter profile listing content */}
      {/* {!showMetaData && listingType === LISTING_TYPE.TWITTER_PROFILE && (
        <div style={{ height: '400px' }}>
          <TwitterProfileMobileContent twitterUsername={twitterUsername} />
          <TwitterProfileDesktopContent twitterUsername={twitterUsername} />
        </div>
      )} */}

      {/* Tweet listing content */}
      {listingType === LISTING_TYPE.TWEET && (
        <div id={'ListingContent'} className="w-full -mt-3">
          <blockquote className="twitter-tweet">
            <a href={content}>Loading tweet...</a>
          </blockquote>
        </div>
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
