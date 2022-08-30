import { Modal } from 'components'
import TradeCompleteModal, {
  TX_TYPES,
} from 'components/trade/TradeCompleteModal'
import ModalService from 'components/modals/ModalService'
import NewPostUI from './NewPostUI'
import StakeUserModal from 'modules/user-market/components/StakeUserModal'
import { USER_MARKET } from 'modules/user-market/utils/UserMarketUtils'
import { useContext } from 'react'
import { GlobalContext } from 'lib/GlobalContext'

export default function NewPostModal({ close }: { close: () => void }) {
  const { user } = useContext(GlobalContext)

  const onStakeClicked = () => {
    ModalService.open(StakeUserModal, {
      ideaToken: user,
      market: USER_MARKET,
    })
  }

  function onTradeComplete(
    isSuccess: boolean,
    listingId: string,
    idtValue: string,
    txType: TX_TYPES
  ) {
    close()
    ModalService.open(TradeCompleteModal, {
      isSuccess,
      listingId,
      idtValue,
      txType,
      onStakeClicked, // Putting this inside TradeCompleteModal causes memory issue, so have to pass as prop
    })
  }

  return (
    <Modal close={close}>
      <div className="w-full md:w-136 mx-auto bg-white dark:bg-gray-700 rounded-xl">
        <NewPostUI onTradeComplete={onTradeComplete} />
      </div>
    </Modal>
  )
}
