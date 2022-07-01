import { Modal } from 'components'
import RateUI from 'modules/ratings/components/RateUI'

export default function RateModal({
  close,
  imPost,
  urlMetaData,
  defaultRating = 50,
}: {
  close: () => void
  imPost: any
  urlMetaData: any
  defaultRating?: number
}) {
  return (
    <Modal close={close}>
      <div className="w-full md:w-[34rem]">
        <RateUI
          close={close}
          imPost={imPost}
          urlMetaData={urlMetaData}
          defaultRating={defaultRating}
        />
      </div>
    </Modal>
  )
}
