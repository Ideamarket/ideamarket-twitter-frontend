import { useContext, useEffect, useState } from 'react'
import Image from 'next/image'
import NProgress from 'nprogress'
import { getNavbarConfig } from './constants'
import { Router } from 'next/dist/client/router'
import { InboxInIcon, MenuIcon, XIcon } from '@heroicons/react/solid'
import { WalletStatusWithConnectButton } from 'components'
import MobileNavItems from './MobileNavItems'
import NavItem from './NavItem'
// import NavThemeButton from './NavThemeButton'
import { ProfileTooltip } from './ProfileTooltip'
import { useWeb3React } from '@web3-react/core'
import { GlobalContext } from 'lib/GlobalContext'
import { PencilIcon as OutlinePencilIcon } from '@heroicons/react/outline'
import { PencilIcon as SolidPencilIcon } from '@heroicons/react/solid'
import ModalService from 'components/modals/ModalService'
import NewPostModal from 'modules/posts/components/NewPostModal'
import WalletModal from 'components/wallet/WalletModal'
import { useWalletStore } from 'store/walletStore'
import A from 'components/A'
import classNames from 'classnames'
import useUserFeesClaimable from 'modules/user-market/hooks/useUserFeesClaimable'
import useTokenToDAI from 'actions/useTokenToDAI'
import withdrawClaimableFees from 'actions/web3/user-market/withdrawClaimableFees'
import { useTransactionManager } from 'utils'
import TradeCompleteModal, {
  TX_TYPES,
} from 'components/trade/TradeCompleteModal'

type Props = {
  bgColor: string
  textColor?: string
}

const ETH_TOKEN = {
  name: 'Ethereum',
  address: '0x0000000000000000000000000000000000000000',
  symbol: 'ETH',
  decimals: 18,
}

const NavMenu = ({ bgColor, textColor = 'text-white' }: Props) => {
  const { setIsTxPending, user } = useContext(GlobalContext)
  const { active, account } = useWeb3React()
  const txManager = useTransactionManager()
  const [isMobileNavOpen, setMobileNavOpen] = useState(false)
  const [visibility, setVisibility] = useState<Boolean>(false)
  const [timerId, setTimerId] = useState(null)

  const navbarConfig = getNavbarConfig(user)

  const [, ethClaimable] = useUserFeesClaimable()
  const [, , selectedTokenDAIValue] = useTokenToDAI(
    ETH_TOKEN as any,
    ethClaimable,
    18
  )

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

  const onMouseLeave = () => {
    setTimerId(
      setTimeout(() => {
        setVisibility(false)
      }, 200)
    )
  }

  const onMouseEnter = () => {
    timerId && clearTimeout(timerId)
    active && setVisibility(true)
  }

  const { setOnWalletConnectedCallback } = useContext(GlobalContext)

  const onNewPostClicked = () => {
    if (!useWalletStore.getState().web3) {
      setOnWalletConnectedCallback(() => () => {
        ModalService.open(NewPostModal)
      })
      ModalService.open(WalletModal)
    } else {
      ModalService.open(NewPostModal)
    }
  }

  function onTradeComplete(
    isSuccess: boolean,
    listingId: string,
    idtValue: string,
    transactionType: TX_TYPES
  ) {
    ModalService.open(TradeCompleteModal, {
      isSuccess,
      listingId,
      idtValue,
      transactionType,
    })
  }

  const onWithdrawUserFeeClicked = async () => {
    if (ethClaimable && ethClaimable > 0) {
      setIsTxPending(true)

      try {
        await txManager.executeTx(
          'Withdraw claimable fees',
          withdrawClaimableFees
        )
      } catch (ex) {
        console.log(ex)
        onTradeComplete(false, 'error', 'error', TX_TYPES.NONE)
        setIsTxPending(false)
        return
      }

      setIsTxPending(false)
      onTradeComplete(
        true,
        'success',
        'success',
        TX_TYPES.WITHDRAW_CLAIMABLE_FEE
      )
    }
  }

  useEffect(() => {
    return () => {
      timerId && clearTimeout(timerId)
    }
  }, [timerId])

  return (
    <div
      className={classNames(
        bgColor ? bgColor : 'bg-top-desktop',
        textColor,
        'absolute z-[200] items-center w-full overflow-none font-inter md:px-20'
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
              onClick={onWithdrawUserFeeClicked}
              className="bg-white border-l border-t border-r-4 border-b-4 border-blue-600 rounded-3xl px-2 py-1 leading-[.5rem]"
            >
              <div className="flex items-center space-x-2">
                <InboxInIcon className="w-5 h-5 text-black" />
                <div>
                  <div className="text-xs text-black/[.5]">
                    Available to Withdraw
                  </div>
                  <div>
                    <span className="text-black font-bold text-xs">
                      {ethClaimable} ETH
                    </span>
                    <span className="text-black/[.5] font-bold text-xs">
                      {' '}
                      (${parseFloat(selectedTokenDAIValue).toFixed(2)})
                    </span>
                  </div>
                </div>
              </div>
            </button>

            <button
              onClick={onNewPostClicked}
              className="flex items-center space-x-2 h-full bg-gradient-to-br from-brand-blue-1 to-brand-blue-2 text-white text-xs font-bold px-3 py-1 ml-3 rounded-xl"
            >
              <span>New Post</span>
              <OutlinePencilIcon className="w-3" />
            </button>

            {/* <NavThemeButton /> */}

            <div
              className="flex h-full"
              onMouseEnter={onMouseEnter}
              onMouseLeave={onMouseLeave}
            >
              <WalletStatusWithConnectButton />
              {visibility && (
                <div className="absolute top-0 mt-10 right-0 mb-1 text-sm text-black rounded-xl shadow bg-white overflow-hidden">
                  <ProfileTooltip />
                </div>
              )}
            </div>
          </div>
        </nav>
      </div>

      {/* Mobile NavMenu */}
      <div className="flex justify-between items-center md:hidden px-3 py-4">
        <button
          onClick={() => setMobileNavOpen(!isMobileNavOpen)}
          type="button"
          className="inline-flex pr-2 mr-1 bg-transparent focus:outline-none "
          aria-controls="mobile-menu"
          aria-expanded="false"
        >
          <span className="sr-only">Open main menu</span>
          {!isMobileNavOpen ? (
            <MenuIcon className="w-6 h-6" />
          ) : (
            <XIcon className="w-6 h-6" />
          )}
        </button>

        <A href="/" className="flex items-center">
          <div className="relative w-10 h-8">
            <Image
              src="/im-logo-1.png"
              alt="IM-nav-logo"
              layout="fill"
              objectFit="contain"
            />
          </div>

          <span className="w-auto h-full mr-2 text-2xl leading-none md:text-3xl">
            Ideamarket
          </span>
        </A>

        <div className="flex">
          <WalletStatusWithConnectButton />
        </div>

        <button
          onClick={onNewPostClicked}
          className="w-8 h-8 flex justify-center items-center text-white bg-gradient-to-br from-brand-blue-1 to-brand-blue-2 rounded-2xl"
        >
          <SolidPencilIcon className="w-5 h-5" />
        </button>
      </div>

      <MobileNavItems
        isMobileNavOpen={isMobileNavOpen}
        user={user}
        account={account}
      />
    </div>
  )
}

export default NavMenu
