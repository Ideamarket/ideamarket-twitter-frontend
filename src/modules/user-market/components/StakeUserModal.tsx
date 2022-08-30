import {
  IdeaMarket,
  querySingleIDTByTokenAddress,
} from 'store/ideaMarketsStore'
import { Modal } from 'components'
import ModalService from 'components/modals/ModalService'
import TradeCompleteModal, {
  TX_TYPES,
} from 'components/trade/TradeCompleteModal'
import StakeUserUI from './StakeUserUI'
import { useQuery } from 'react-query'

export default function StakeUserModal({
  close,
  ideaToken,
  market,
  startingTradeType = TX_TYPES.STAKE_USER,
}: {
  close: () => void
  ideaToken: any
  market: IdeaMarket
  startingTradeType: TX_TYPES
}) {
  // ideaToken passed in takes data from DB, so may not be up to date. So, we fetch directly from subgraph instead
  const { data: userToken } = useQuery(
    ['single-listing', ideaToken?.tokenAddress],
    () => querySingleIDTByTokenAddress(ideaToken?.tokenAddress)
  )

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
    })
  }

  const isOnChain = ideaToken?.tokenAddress

  return (
    <Modal close={close}>
      <StakeUserUI
        isOnChain={isOnChain}
        web2UserToken={ideaToken}
        web3UserToken={userToken}
        market={market}
        onTradeComplete={onTradeComplete}
        onValuesChanged={() => {}} // Used when UI is used somewhere that is not a modal
        resetOn={true} // Used when UI is used somewhere that is not a modal
        showTradeButton={true}
        disabled={false}
        startingTradeType={startingTradeType}
      />
    </Modal>
  )
}
