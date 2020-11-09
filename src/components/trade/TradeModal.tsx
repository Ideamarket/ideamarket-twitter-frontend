import { IdeaToken, IdeaMarket } from '../../store/ideaMarketsStore'
import { Modal, TradeInterface } from '..'

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
      <div className="p-4 bg-top-mobile">
        <p className="text-2xl text-center text-gray-300 md:text-3xl font-gilroy-bold">
          Trade: {ideaToken.name}
        </p>
      </div>
      <TradeInterface
        ideaToken={ideaToken}
        market={market}
        onTradeSuccessful={onTradeSuccessful}
        resetOn={isOpen}
      />
    </Modal>
  )
}
