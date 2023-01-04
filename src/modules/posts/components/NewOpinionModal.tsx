import { Modal } from 'components'
import ModalService from 'components/modals/ModalService'
import { IdeamarketTwitterPost } from '../services/TwitterPostService'
import NewOpinionUI from './NewOpinionUI'
import PostAndRateCompleteModal, { TX_TYPES } from './PostAndRateCompleteModal'

export default function NewOpinionModal({
  close,
  defaultRatedPost,
  defaultRating,
}: {
  close: () => void
  defaultRatedPost: IdeamarketTwitterPost
  defaultRating: number
}) {
  function onPostOrRateComplete(isSuccess: boolean, txType: TX_TYPES) {
    close()
    ModalService.open(PostAndRateCompleteModal, {
      isSuccess,
      txType,
    })
  }

  return (
    <Modal close={close}>
      <div className="w-full md:w-[40rem] mx-auto bg-white dark:bg-gray-700 rounded-xl">
        <NewOpinionUI
          onPostOrRateComplete={onPostOrRateComplete}
          defaultRatedPost={defaultRatedPost}
          defaultRating={defaultRating}
        />
      </div>
    </Modal>
  )
}
