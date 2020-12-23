import { useContext } from 'react'
import { GlobalContext } from '../../pages/_app'
import { Modal } from '..'

export default function EmailNewsletterModal() {
  const {
    isEmailNewsletterModalOpen,
    setIsEmailNewsletterModalOpen,
  } = useContext(GlobalContext)

  return (
    <Modal
      isOpen={isEmailNewsletterModalOpen}
      close={() => {
        setIsEmailNewsletterModalOpen(false)
      }}
    >
      <div className="mb-5 w-100 max-w-100">
        <div className="p-4 bg-top-mobile">
          <p className="text-2xl text-center text-gray-300 md:text-3xl font-gilroy-bold">
            New Markets
          </p>
        </div>
        <p className="m-5 break-normal">
          If you missed the mad rush to list your favorite Twitter accounts,
          don't worry. More <strong>new markets are on the way</strong>.<br />
          <br />
          Sign up to be notified 24 hours before they launch:
        </p>
        <iframe
          className="w-full"
          style={{ height: '260px' }}
          src="https://cdn.forms-content.sg-form.com/61e4a0fe-4506-11eb-b308-8a2567f282a7"
        />
      </div>
    </Modal>
  )
}
