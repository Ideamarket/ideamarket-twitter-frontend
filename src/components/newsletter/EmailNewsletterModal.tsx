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
            Email Newsletter
          </p>
        </div>
        <p className="m-5 break-normal">
          Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
          nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat,
          sed diam voluptua. At vero eos et accusam et justo duo dolores et ea
          rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem
          ipsum dolor sit amet.
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
