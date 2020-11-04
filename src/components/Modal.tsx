import { Transition } from '@headlessui/react'
import { ReactNode } from 'react'
import Close from '../assets/close.svg'

export default function Modal({
  className = '',
  children,
  isOpen,
  close,
}: {
  className?: string
  children?: ReactNode
  isOpen: boolean
  close: () => void
}) {
  if (!isOpen) {
    return <></>
  }
  return (
    <div className={className}>
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
          <Transition
            show={isOpen}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            className="fixed inset-0 transition-opacity"
          >
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          </Transition>
          <span className="inline-block h-screen align-middle"></span>
          &#8203;
          <Transition
            show={isOpen}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            className="inline-block overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl w-76"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-headline"
          >
            <div className="absolute top-0 right-0 pr-1 md:pr-4 md:pt-4">
              <button
                type="button"
                className="text-gray-400 transition duration-150 ease-in-out hover:text-gray-500 focus:outline-none focus:text-gray-500"
                aria-label="Close"
                onClick={() => close()}
              >
                <Close className="w-6 h-6" />
              </button>
            </div>
            <div>{children}</div>
          </Transition>
        </div>
      </div>
    </div>
  )
}
