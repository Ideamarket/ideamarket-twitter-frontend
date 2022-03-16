import { IdeaToken, IdeaMarket } from 'store/ideaMarketsStore'
import { Modal, TradeInterface } from 'components'
import ModalService from 'components/modals/ModalService'
import TradeCompleteModal, { TX_TYPES } from './TradeCompleteModal'

export default function TradeModal({
  close,
  ideaToken,
  market,
  parentComponent,
  startingTradeType = TX_TYPES.BUY,
}: {
  close: () => void
  ideaToken: IdeaToken
  market: IdeaMarket
  parentComponent?: string
  startingTradeType: TX_TYPES
}) {
  function onTradeComplete(
    isSuccess: boolean,
    listingId: string,
    idtValue: string,
    transactionType: TX_TYPES
  ) {
    close()
    ModalService.open(TradeCompleteModal, {
      isSuccess,
      listingId,
      idtValue,
      transactionType,
    })
  }

  return (
    <Modal close={close}>
      <div className="pt-2">
        <TradeInterface
          ideaToken={ideaToken}
          market={market}
          onTradeComplete={onTradeComplete}
          onValuesChanged={() => {}}
          resetOn={true}
          centerTypeSelection={true}
          showTypeSelection={true}
          showTradeButton={true}
          disabled={false}
          parentComponent={parentComponent || 'TradeModal'}
          startingTradeType={startingTradeType}
        />
      </div>
    </Modal>
  )
}
