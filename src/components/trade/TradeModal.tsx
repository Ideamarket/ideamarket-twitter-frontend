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
      <TradeInterface
        ideaToken={ideaToken}
        market={market}
        onTradeSuccessful={onTradeSuccessful}
        resetOn={isOpen}
      />
    </Modal>
  )
}
