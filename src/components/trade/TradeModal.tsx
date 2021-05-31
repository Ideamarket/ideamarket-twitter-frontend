import { IdeaToken, IdeaMarket } from 'store/ideaMarketsStore'
import { Modal, TradeInterface } from 'components'

export default function TradeModal({
  isOpen,
  setIsOpen,
  ideaToken,
  market,
}: {
  isOpen: boolean
  setIsOpen: (b: boolean) => void
  ideaToken: IdeaToken
  market: IdeaMarket
}) {
  function onTradeSuccessful() {
    setIsOpen(false)
  }

  if (!isOpen) {
    return <></>
  }

  return (
    <Modal isOpen={isOpen} close={() => setIsOpen(false)}>
      {/* <div className="p-4 bg-top-mobile">
        <p className="text-2xl text-center text-gray-300 md:text-3xl font-gilroy-bold">
          Trade: {ideaToken.name}
        </p>
      </div> */}
      <div className="pt-2">
        <TradeInterface
          ideaToken={ideaToken}
          market={market}
          onTradeSuccessful={onTradeSuccessful}
          onValuesChanged={() => {}}
          resetOn={isOpen}
          centerTypeSelection={true}
          showTypeSelection={true}
          showTradeButton={true}
          disabled={false}
        />
      </div>
    </Modal>
  )
}
