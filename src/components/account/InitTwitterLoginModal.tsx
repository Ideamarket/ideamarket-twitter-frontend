import { twitterLogin } from 'modules/user-market/services/TwitterUserService'
import Modal from '../modals/Modal'

export default function InitTwitterLoginModal({
  close,
}: {
  close: () => void
}) {
  return (
    <Modal close={close}>
      <div className="p-6 bg-white w-96 md:w-[30rem]">
        <div className="flex justify-between items-center">
          <span className="text-xl text-left text-black font-bold">
            Click below to login. You will be sent to Twitter and redirected
            back here once you are logged in.
          </span>
        </div>

        <div
          onClick={() => twitterLogin(null)}
          className="relative w-full z-[500] flex justify-center items-center px-4 py-2 mt-4 font-bold text-white rounded-xl bg-[#1DA1F2] rounded-xl cursor-pointer"
        >
          Connect Twitter
        </div>
      </div>
    </Modal>
  )
}
