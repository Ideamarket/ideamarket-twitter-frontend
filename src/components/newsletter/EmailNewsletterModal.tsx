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
        <div
          className="sendgrid-subscription-widget widget-1717"
          data-emailerror="Please enter a valid email address"
          data-nameerror="Please enter your name"
          data-checkboxerror="Please tick the box to accept our conditions"
        >
          <form
            className="sg-widget"
            data-token="f42932d52a46ee072ac1454ae875dedd"
            onSubmit={() => {}}
          >
            <div className="flex space-between">
              <input
                className="flex-grow ml-5 leading-tight bg-gray-200 border-2 border-gray-200 rounded appearance-none focus:border-brand-blue sg_email focus:bg-white focus:outline-none"
                type="email"
                name="sg_email"
                placeholder="you@example.com"
                required={true}
              />
              <input
                type="submit"
                className="p-2 mx-5 text-lg font-bold text-white rounded-lg cursor-pointer font-sf-compact-medium bg-brand-blue hover:bg-blue-800 sg-submit-btn"
                id="widget-1717"
                value="Subscribe"
              />
            </div>
            <div className="mx-5 mt-2.5 font-bold">
              <div className="sg-response"></div>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  )
}
