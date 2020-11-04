import classNames from 'classnames'
import { useRouter } from 'next/dist/client/router'
import { useContext, useState } from 'react'
import { WalletStatus } from 'components'
import { GlobalContext } from 'pages/_app'

export default function Nav() {
  const [IsMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const router = useRouter()
  const closeMenu = () => setIsMobileNavOpen(false)
  const { setIsWalletModalOpen } = useContext(GlobalContext)
  const menuItems = [
    {
      name: 'Overview',
      value: 'overview',
      onClick: () => router.push('/'),
      isSelected: router.pathname === '/',
    },
    {
      name: 'My Tokens',
      value: 'my-tokens',
      onClick: () => router.push('/tokens'),
      isSelected: router.pathname === '/tokens',
    },
    {
      name: 'My Wallet',
      value: 'my-wallet',
      onClick: () => router.push('/wallet'),
      isSelected: router.pathname === '/wallet',
    },
    {
      name: 'Launch Token',
      value: 'launch-token',
      onClick: () => router.push('/launch'),
      isSelected: router.pathname === '/launch',
    },
  ]
  return (
    <>
      <nav className="fixed top-0 z-20 w-full shadow bg-top-desktop">
        <div className="px-4 mx-auto max-w-7xl md:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-2">
              <div
                className="flex items-center flex-shrink-0 cursor-pointer"
                onClick={() => router.push('/')}
              >
                <img
                  className="block w-auto h-8"
                  src="/logo.png"
                  alt="Workflow logo"
                />
                <div className="w-auto h-8 mt-2 text-2xl leading-none text-white md:text-3xl font-gilroy-bold">
                  IdeaMarkets
                </div>
              </div>
              <div className="md:hidden">
                <WalletStatus openModal={() => setIsWalletModalOpen(true)} />
              </div>

              <div className="hidden md:ml-6 md:flex">
                {menuItems.map((menuItem) => (
                  <a
                    key={menuItem.value}
                    onClick={() => {
                      menuItem.onClick()
                      closeMenu()
                    }}
                    className={classNames(
                      'cursor-pointer inline-flex items-center px-1 pt-1 ml-8 text-lg font-medium leading-5 tracking-tighter transition duration-150 ease-in-out focus:outline-none focus:text-gray-700 focus:border-gray-300',
                      menuItem.isSelected
                        ? 'text-white'
                        : 'text-brand-gray text-opacity-60 hover:text-brand-gray-2'
                    )}
                  >
                    {menuItem.name}
                  </a>
                ))}
              </div>
            </div>
            <div className="hidden md:ml-6 md:flex md:items-center">
              <WalletStatus openModal={() => setIsWalletModalOpen(true)} />
            </div>
            <div className="flex items-center -mr-2 md:hidden">
              <button
                className="inline-flex items-center justify-center p-2 text-gray-400 transition duration-150 ease-in-out rounded-md hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500"
                aria-label="Main menu"
                aria-expanded="false"
                onClick={() => setIsMobileNavOpen(!IsMobileNavOpen)}
              >
                <svg
                  className={classNames(
                    'w-6 h-6',
                    IsMobileNavOpen ? 'hidden' : 'block'
                  )}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
                <svg
                  className={classNames(
                    'w-6 h-6',
                    IsMobileNavOpen ? 'block' : 'hidden'
                  )}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div
          className={classNames(
            'md:hidden',
            IsMobileNavOpen ? 'block' : 'hidden'
          )}
        >
          <div className="pt-2 pb-3">
            {menuItems.map((menuItem) => (
              <a
                onClick={() => {
                  menuItem.onClick()
                  closeMenu()
                }}
                key={menuItem.value}
                className={classNames(
                  'cursor-pointer block py-2 pl-3 pr-4 mt-1 text-base font-medium transition duration-150 ease-in-out border-l-4 border-transparent hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:text-gray-800 focus:bg-gray-50 focus:border-gray-300',
                  menuItem.isSelected
                    ? 'text-white'
                    : 'text-brand-gray text-opacity-60'
                )}
              >
                {menuItem.name}
              </a>
            ))}
          </div>
        </div>
      </nav>
    </>
  )
}
