type Props = {
  twitterUsername: string
}

const TwitterProfileMobileContent = ({ twitterUsername }: Props) => {
  return (
    <>
      <div className="flex md:hidden h-full">
        <div className="w-full h-full overflow-y-auto">
          <a
            className="twitter-timeline h-full"
            href={`https://twitter.com/${twitterUsername}`}
          >
            No tweets found for {twitterUsername}
          </a>
        </div>
        {/* <div
          className={classNames(
            relatedOrTweets === 'related' ? 'visible' : 'hidden',
            'w-full'
          )}
        >
          <MutualTokensList tokenName={tokenName} marketName={marketName} />
        </div> */}
      </div>
    </>
  )
}

export default TwitterProfileMobileContent
