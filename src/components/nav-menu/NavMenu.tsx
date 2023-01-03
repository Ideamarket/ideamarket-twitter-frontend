import { useContext, useEffect, useState } from 'react'
import Image from 'next/image'
import NProgress from 'nprogress'
import { getNavbarConfig } from './constants'
import { Router } from 'next/dist/client/router'
import { MenuIcon, XIcon } from '@heroicons/react/solid'
import { WalletStatusWithConnectButton } from 'components'
import MobileNavItems from './MobileNavItems'
import NavItem from './NavItem'
import { GlobalContext } from 'lib/GlobalContext'
import { PencilIcon as OutlinePencilIcon } from '@heroicons/react/outline'
import { PencilIcon as SolidPencilIcon } from '@heroicons/react/solid'
import ModalService from 'components/modals/ModalService'
import NewOpinionModal from 'modules/posts/components/NewOpinionModal'
import A from 'components/A'
import classNames from 'classnames'
import InitTwitterLoginModal from 'components/account/InitTwitterLoginModal'

type Props = {
  bgColor: string
  textColor?: string
}

const NavMenu = ({ bgColor, textColor = 'text-white' }: Props) => {
  const { user, jwtToken } = useContext(GlobalContext)
  const [isMobileNavOpen, setMobileNavOpen] = useState(false)

  const navbarConfig = getNavbarConfig(user)

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

  const onNewPostClicked = () => {
    if (!jwtToken) {
      ModalService.open(InitTwitterLoginModal)
    } else {
      ModalService.open(NewOpinionModal /*, { onStakeClicked }*/)
    }
  }

  // function onTradeComplete(
  //   isSuccess: boolean,
  //   listingId: string,
  //   idtValue: string,
  //   txType: TX_TYPES
  // ) {
  //   ModalService.open(TradeCompleteModal, {
  //     isSuccess,
  //     listingId,
  //     idtValue,
  //     txType,
  //   })
  // }

  return (
    <div
      className={classNames(
        bgColor ? bgColor : 'bg-top-desktop',
        textColor,
        'absolute z-[900] top-0 left-0 items-center w-full font-inter md:px-20'
      )}
    >
      {/* Desktop NavMenu */}
      <div className="hidden md:block px-2 py-3 border-b border-black/[0.05]">
        <nav className="relative h-10 flex flex-wrap items-center justify-center md:justify-between w-full mx-auto max-w-7xl">
          <div className="hidden md:flex space-x-3 items-center cursor-pointer ml-auto mr-auto md:ml-0 md:mr-0">
            <A href="/" className="flex items-center">
              <div className="relative w-10 h-8">
                <Image
                  src="/im-logo-1.png"
                  alt="IM-nav-logo"
                  layout="fill"
                  objectFit="contain"
                />
              </div>

              <span className="w-auto h-full mr-2 text-lg font-bold leading-none">
                Ideamarket
              </span>
            </A>

            {/* Desktop START */}
            <div className="relative items-center justify-center hidden lg:flex space-x-3">
              {navbarConfig.menu.map((menuItem, i) => (
                <NavItem menuItem={menuItem} key={i} />
              ))}
            </div>
            {/* Desktop END */}
          </div>

          <div className="h-9 hidden md:flex items-center">
            <button
              onClick={onNewPostClicked}
              className="flex items-center space-x-2 h-full bg-gradient-to-br from-brand-blue-1 to-brand-blue-2 text-white text-xs font-bold px-3 py-1 ml-3 rounded-xl"
            >
              <span>Rate Tweet</span>
              <OutlinePencilIcon className="w-3" />
            </button>

            {/* <NavThemeButton /> */}

            <WalletStatusWithConnectButton />
          </div>
        </nav>
      </div>

      {/* Mobile NavMenu */}
      <div className="relative flex justify-between items-center md:hidden px-3 py-4 border-b">
        <A href="/" className="flex items-center">
          <div className="relative w-10 h-8">
            <Image
              src="/im-logo-1.png"
              alt="IM-nav-logo"
              layout="fill"
              objectFit="contain"
            />
          </div>
        </A>

        <div className="flex justify-between items-center space-x-4">
          <div className="flex">
            <WalletStatusWithConnectButton />
          </div>

          <button
            onClick={onNewPostClicked}
            className="w-8 h-8 flex justify-center items-center text-white bg-gradient-to-br from-brand-blue-1 to-brand-blue-2 rounded-2xl"
          >
            <SolidPencilIcon className="w-5 h-5" />
          </button>

          <button
            onClick={() => setMobileNavOpen(!isMobileNavOpen)}
            type="button"
            className="inline-flex p-2 mr-2 mr-1 bg-transparent focus:outline-none border rounded-3xl"
            aria-controls="mobile-menu"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            {!isMobileNavOpen ? (
              <MenuIcon className="w-5 h-5" />
            ) : (
              <XIcon className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      <MobileNavItems isMobileNavOpen={isMobileNavOpen} user={user} />
    </div>
  )
}

export default NavMenu
