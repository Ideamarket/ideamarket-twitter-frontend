import { Transition } from '@headlessui/react'
import { ChevronDownIcon, SunIcon, MoonIcon } from '@heroicons/react/solid'
import { WalletStatus, A } from 'components'
import ModalService from 'components/modals/ModalService'
import WalletModal from '../wallet/WalletModal'
import useThemeMode from '../useThemeMode'
import { config } from './constants'

type Props = {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

const MobileNavItems = ({ isOpen, setIsOpen }: Props) => {
  const { theme, setTheme } = useThemeMode()

  return (
    <Transition
      show={isOpen}
      enter="transition ease-out duration-100 transform"
      enterFrom="opacity-0 scale-95"
      enterTo="opacity-100 scale-100"
      leave="transition ease-in duration-75 transform"
      leaveFrom="opacity-100 scale-100"
      leaveTo="opacity-0 scale-95"
      className="md:hidden"
    >
      <div className="px-2 pt-2 pb-3 space-y-3 sm:px-3">
        {config.menu.map((menuItem, i) => (
          <div className="flex items-center" key={i}>
            <div className="block dropdown items-center">
              <span className="rounded-md shadow-sm block">
                <button
                  className="inline-flex justify-center w-full px-4 py-2 text-lg font-large leading-5 text-white transition duration-150 ease-in-out bg-transparent  hover:text-gray-500 focus:outline-none  active:bg-gray-50 active:text-gray-800"
                  type="button"
                  aria-haspopup="true"
                  aria-controls="headlessui-menu-items-117"
                  onClick={() => {
                    if (menuItem.onClick) {
                      menuItem.onClick()
                      setIsOpen(false)
                    }
                  }}
                >
                  <span>{menuItem.name}</span>
                  {menuItem.subMenu && <ChevronDownIcon className="w-5 h-5" />}
                </button>
              </span>
              {menuItem.subMenu && (
                <div className="relative invisible dropdown-menu transition-all transform origin-top-right -translate-y-2 scale-95 bg-white z-20">
                  <div
                    className="absolute left-0 w-60 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg outline-none"
                    aria-labelledby="headlessui-menu-button-1"
                    key={i}
                    id="headlessui-menu-items-117"
                    role="menu"
                  >
                    {menuItem.subMenu &&
                      menuItem.subMenu.map(({ name, onClick }) => (
                        <A
                          key={name}
                          onClick={() => {
                            onClick()
                          }}
                          className="flex flex-row py-4 px-2 w-full leading-5 items-center space-x-2 transform transition-colors hover:bg-gray-100 hover:cursor-pointer"
                          role="menuitem"
                        >
                          <div className="block">
                            <p className="text-black font-medium font-bold">
                              {name}
                            </p>
                          </div>
                        </A>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        <div className="flex px-2 mt-5">
          <WalletStatus openModal={() => ModalService.open(WalletModal)} />
        </div>
        <div className="flex px-1 mt-5">
          <button
            id="switchTheme"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="h-10 w-10 flex justify-center items-center focus:outline-none  text-blue-50"
          >
            {theme === 'dark' ? (
              <SunIcon className="h-5 w-5 text-blue-50" />
            ) : (
              <MoonIcon className="h-5 w-5 text-blue-50" />
            )}
          </button>
        </div>
      </div>
    </Transition>
  )
}

export default MobileNavItems
