import { CircleSpinner, Modal } from 'components'
import classNames from 'classnames'

export const TWITTER_VERIFY_STATE = {
  TWITTER_LOGIN: 0, // State shown when user clicked to verify, it is temporary (currently not used)
  SUCCESS: 1,
  ERROR: 2,
}

type Props = {
  close: () => void
  initialVerifyState: number
}

const VerifyTwitterModal = ({
  close,
  initialVerifyState = TWITTER_VERIFY_STATE.TWITTER_LOGIN,
}: Props) => {
  return (
    <Modal close={close}>
      <div
        className={classNames(
          initialVerifyState === TWITTER_VERIFY_STATE.SUCCESS
            ? "bg-[url('/VerifySuccessBg.png')] bg-cover"
            : 'bg-white dark:bg-gray-700',
          'w-full md:w-136 px-8 pt-6 pb-10 mx-auto rounded-lg'
        )}
      >
        {initialVerifyState === TWITTER_VERIFY_STATE.TWITTER_LOGIN && (
          <div className="flex items-center">
            <CircleSpinner color="#0857e0" />
            <span>Transfering you to the Twitter authentication page</span>
          </div>
        )}

        {initialVerifyState === TWITTER_VERIFY_STATE.SUCCESS && (
          <>
            <div className="text-white font-bold text-2xl flex items-center">
              You have been successfully verified on Ideamarket!
            </div>
          </>
        )}

        {initialVerifyState === TWITTER_VERIFY_STATE.ERROR && (
          <>
            <div className="text-red-500">Verification failed.</div>
          </>
        )}
      </div>
    </Modal>
  )
}

export default VerifyTwitterModal
