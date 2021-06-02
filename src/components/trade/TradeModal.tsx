import { IdeaToken, IdeaMarket } from 'store/ideaMarketsStore'
import { Modal, TradeInterface } from 'components'

export default function TradeModal({
  close,
  ideaToken,
  market,
}: {
  close: () => void
  ideaToken: IdeaToken
  market: IdeaMarket
}) {
  return (
    <Modal close={() => close()}>
      <div className="p-4 bg-top-mobile">
        <p className="text-2xl text-center text-gray-300 md:text-3xl font-gilroy-bold">
          Trade: {ideaToken.name}
        </p>
      </div>
      <div className="pt-2">
        <TradeInterface
          ideaToken={ideaToken}
          market={market}
          onTradeSuccessful={close}
          onValuesChanged={() => {}}
          resetOn={true}
          centerTypeSelection={true}
          showTypeSelection={true}
          showTradeButton={true}
          disabled={false}
        />
      </div>
    </Modal>
  )
}
