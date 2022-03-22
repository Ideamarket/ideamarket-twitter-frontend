type Props = {
  wikiSnapshot: any
}

const WikiDesktopContent = ({ wikiSnapshot }: Props) => {
  return (
    <div className="hidden md:flex h-full">
      <div className="w-full h-full">
        {wikiSnapshot?.type === 'wikipedia' && (
          <iframe
            id="wiki-iframe"
            src={wikiSnapshot.url}
            key="wiki-iframe"
            title="wiki-iframe"
          />
        )}

        {wikiSnapshot?.type === 'local' && (
          <embed
            id="wiki-iframe"
            src={`${wikiSnapshot.url}#toolbar=0&navpanes=0&scrollbar=0`}
            type="application/pdf"
            style={{ height: '500px' }}
          />
        )}
      </div>
      {/* <div className="w-1/2 ml-5">
        <MutualTokensList tokenName={tokenName} marketName={marketName} />
      </div> */}
    </div>
  )
}

export default WikiDesktopContent
