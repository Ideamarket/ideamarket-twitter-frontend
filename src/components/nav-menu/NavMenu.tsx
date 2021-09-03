import { useEffect, useState } from 'react'
import Image from 'next/image'
import NProgress from 'nprogress'
import { config } from './constants'
import { Router, useRouter } from 'next/dist/client/router'
import {
  ChevronDownIcon,
  SunIcon,
  MoonIcon,
  MenuIcon,
  XIcon,
} from '@heroicons/react/solid'
import { WalletStatus, A } from 'components'
import ModalService from 'components/modals/ModalService'
import WalletModal from '../wallet/WalletModal'
import useThemeMode from '../useThemeMode'
import MobileNavItems from './MobileNavItems'

const NavMenu = () => {
  const router = useRouter()
  const { theme, resolvedTheme, setTheme } = useThemeMode()
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    NProgress.configure({ trickleSpeed: 100 })
  }, [])

  useEffect(() => {
    Router.events.on('routeChangeStart', () => NProgress.start())
    Router.events.on('routeChangeComplete', () => NProgress.done())
    Router.events.on('routeChangeError', () => NProgress.done())

    return () => {
      Router.events.on('routeChangeStart', () => NProgress.start())
      Router.events.on('routeChangeComplete', () => NProgress.done())
      Router.events.on('routeChangeError', () => NProgress.done())
    }
  }, [])

  return (
    <div className="relative bg-top-desktop items-center w-full shadow overflow-none font-inter">
      <div className="py-3 px-2 md:px-24">
        <nav className="flex relative w-full justify-between items-center">
          <div
            className="flex items-center cursor-pointer"
            onClick={() => router.push('/')}
          >
            <div className="relative w-10 h-8">
              <Image
                src="/logo.png"
                alt="Workflow logo"
                layout="fill"
                objectFit="contain"
              />
            </div>
            <span className="w-auto h-full text-2xl leading-none text-white md:text-3xl">
              Ideamarket
            </span>
          </div>

          {/* Desktop START */}
          <div className="hidden md:flex relative items-center justify-center">
            {config.menu.map((menuItem, i) => (
              <div className="dropdown" key={i}>
                <span className="rounded-md shadow-sm">
                  <button
                    className="inline-flex justify-center w-full px-4 py-2 text-lg font-large leading-5 text-white transition duration-150 ease-in-out bg-transparent hover:text-gray-500 focus:outline-none active:bg-gray-50 active:text-gray-800"
                    type="button"
                    aria-haspopup="true"
                    aria-controls="headlessui-menu-items-117"
                    onClick={() => {
                      if (menuItem.onClick) {
                        menuItem.onClick()
                      }
                    }}
                  >
                    <span className="capitalize">{menuItem.name}</span>
                    {menuItem.subMenu && (
                      <ChevronDownIcon className="w-5 h-5" />
                    )}
                  </button>
                </span>
                {menuItem.subMenu && (
                  <div className="relative invisible dropdown-menu transition-all transform origin-top-right -translate-y-2 scale-95 bg-white z-20">
                    <div
                      className="absolute left-0 w-48 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg outline-none"
                      aria-labelledby="headlessui-menu-button-1"
                      key={i}
                      id="headlessui-menu-items-117"
                      role="menu"
                    >
                      {menuItem.subMenu &&
                        menuItem.subMenu.map(({ name, onClick }, idx) => (
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
            ))}
          </div>
          <div className="hidden md:flex">
            <button
              id="switchTheme"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="h-10 w-10 flex justify-center items-center focus:outline-none text-blue-50"
            >
              {resolvedTheme === 'dark' ? (
                <SunIcon className="h-5 w-5 text-blue-50" />
              ) : (
                <MoonIcon className="h-5 w-5 text-blue-50" />
              )}
            </button>
            <WalletStatus openModal={() => ModalService.open(WalletModal)} />
          </div>
          {/* Desktop END */}

          {/* Mobile START */}
          <div className="flex ml-auto md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="bg-transparent inline-flex p-2 mr-1 text-white focus:outline-none "
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <MenuIcon className="w-6 h-6" />
              ) : (
                <XIcon className="w-6 h-6" />
              )}
            </button>
          </div>
          {/* Mobile END */}
        </nav>
      </div>
      <MobileNavItems isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  )
}

export default NavMenu
