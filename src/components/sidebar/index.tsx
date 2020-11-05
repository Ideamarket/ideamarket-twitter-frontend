import { Transition } from '@headlessui/react'
import SidebarItem from './SidebarItem'
import Close from '../../assets/close.svg'

export type SidebarItemType = {
  title: string
  value: string
  subItems?: SidebarItemType[]
}

export default function Sidebar({
  items,
  sidebarOpen,
  setSidebarOpen,
}: {
  items: SidebarItemType[]
  sidebarOpen: boolean
  setSidebarOpen: (val: boolean) => void
}) {
  return (
    <>
      <div
        className="fixed left-0 z-20 h-screen bg-gray-100 md:flex"
        style={{ minHeight: '640px' }}
      >
        {sidebarOpen && (
          <div
            className="md:hidden"
            data-todo-x-description="Off-canvas menu for mobile, show/hide based on off-canvas menu state."
          >
            <div className="fixed inset-0 z-40 flex">
              <Transition
                onClick={() => setSidebarOpen(false)}
                show={sidebarOpen}
                data-todo-x-description="Off-canvas menu overlay, show/hide based on off-canvas menu state."
                enter="transition-opacity ease-linear duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity ease-linear duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                className="fixed inset-0"
              >
                <div className="absolute inset-0 bg-gray-600 opacity-75"></div>
              </Transition>
              <Transition
                show={sidebarOpen}
                data-todo-x-description="Off-canvas menu, show/hide based on off-canvas menu state."
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
                className="relative flex flex-col flex-1 w-full max-w-xs bg-white"
              >
                <div className="absolute top-0 right-0 p-1 -mr-14">
                  {sidebarOpen && (
                    <button
                      onClick={() => setSidebarOpen(false)}
                      className="flex items-center justify-center w-12 h-12 rounded-full focus:outline-none focus:bg-gray-600"
                      aria-label="Close sidebar"
                    >
                      <Close className="w-6 h-6 text-white" />
                    </button>
                  )}
                </div>
                <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                  <nav className="px-2 mt-5 space-y-1">
                    {items.map((item: SidebarItemType, index) => (
                      <SidebarItem
                        key={item.value}
                        position={index + 1}
                        item={item}
                      />
                    ))}
                  </nav>
                </div>
              </Transition>
              <div className="flex-shrink-0 w-14">
                {/* Force sidebar to shrink to fit close icon */}
              </div>
            </div>
          </div>
        )}
        <div className="flex-col hidden w-64 md:flex">
          <div className="flex flex-col flex-grow pb-4 overflow-y-auto bg-white border-r border-gray-200">
            <div className="flex flex-col flex-grow mt-5">
              <nav className="flex-1 px-2 bg-white">
                {items.map((item: SidebarItemType, index) => (
                  <SidebarItem
                    key={item.value}
                    position={index + 1}
                    item={item}
                  />
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
