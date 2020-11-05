import SidebarItem from './SidebarItem'

export type SidebarItemType = {
  title: string
  value: string
  subItems?: SidebarItemType[]
}

export default function Sidebar({ items }: { items: SidebarItemType[] }) {
  return (
    <>
      <div
        className="fixed left-0 z-20 hidden h-screen bg-gray-100 md:flex"
        style={{ minHeight: '640px' }}
      >
        <div className="flex flex-col w-64">
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
