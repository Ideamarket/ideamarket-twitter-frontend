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
        <div className="flex justify-center">
          <iframe
            src="https://ideamarkets.substack.com/embed"
            width="350"
            height="320"
            style={{ border: '1px solid #EEE', backgroundColor: 'white' }}
            frameBorder="0"
            scrolling="no"
          />
        </div>
      </div>
    </Modal>
  )
}
