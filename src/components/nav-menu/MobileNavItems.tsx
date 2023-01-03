import { Transition } from '@headlessui/react'
import { getNavbarConfig } from './constants'
import NavItem from './NavItem'

type Props = {
  isMobileNavOpen: boolean
  user: any
}

const MobileNavItems = ({ isMobileNavOpen, user }: Props) => {
  let navbarConfig = getNavbarConfig(user)

  // const userNameOrWallet =
  //   user && user.username
  //     ? user.username
  //     : user?.walletAddress
  //     ? user?.walletAddress
  //     : account

  return (
    <div className="absolute left-0 right-0 z-[900]">
      <Transition
        show={isMobileNavOpen}
        enter="transition ease-out duration-100 transform"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="transition ease-in duration-75 transform"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
        className="md:hidden"
      >
        <div className="flex flex-col px-3 pt-2 pb-4 space-y-3 text-black text-right bg-white z-[900]">
          {navbarConfig.menu.map((menuItem, i) => (
            <NavItem menuItem={menuItem} key={i} />
          ))}

          {/* {account && (
            <div className="relative bg-white">
              <A
                className="px-3 py-2 text-sm font-bold cursor-pointer hover:text-gray-500 active:text-gray-800"
                href={`/u/${userNameOrWallet}`}
              >
                <span>My Profile</span>
              </A>
            </div>
          )} */}

          {/* <div className="flex px-1 mt-5">
            <NavThemeButton />
          </div> */}
        </div>
      </Transition>
    </div>
  )
}

export default MobileNavItems
