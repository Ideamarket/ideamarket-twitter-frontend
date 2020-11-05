import { useState } from 'react'
import classNames from 'classnames'
import { SidebarItemType } from '.'
import { scrollToContentWithId } from 'utils'

export default function SidebarItem({
  item,
  position,
}: {
  item: SidebarItemType
  position: number
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  if (!item.subItems) {
    return (
      <>
        <div>
          <a
            onClick={() => scrollToContentWithId(item.value)}
            className="flex items-center w-full py-2 pl-2 text-sm font-medium leading-5 text-gray-900 transition duration-150 ease-in-out rounded-md cursor-pointer group focus:outline-none focus:bg-gray-200"
          >
            {`${position}. ${item.title}`}
          </a>
        </div>
      </>
    )
  }
  return (
    <div>
      <button
        className="flex items-center w-full py-2 pl-2 pr-1 mt-1 text-sm font-medium leading-5 text-gray-600 transition duration-150 ease-in-out bg-white rounded-md group hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:text-gray-900 focus:bg-gray-50"
        onClick={(e) => {
          e.preventDefault()
          setIsExpanded(!isExpanded)
          scrollToContentWithId(item.value)
        }}
        aria-expanded={isExpanded}
      >
        {`${position}. ${item.title}`}
        <svg
          data-todo-x-state-on="Expanded"
          data-todo-x-state-off="Collapsed"
          className={classNames(
            'w-5 h-5 ml-auto transition-colors duration-150 ease-in-out transform group-hover:text-gray-400 group-focus:text-gray-400',
            isExpanded ? 'text-gray-400 rotate-90' : 'text-gray-300'
          )}
          viewBox="0 0 20 20"
        >
          <path d="M6 6L14 10L6 14V6Z" fill="currentColor" />
        </svg>
      </button>
      {isExpanded && (
        <div
          data-todo-x-description="Expandable link section, show/hide based on state."
          className="mt-1 space-y-1"
        >
          {item.subItems.map((subItem: SidebarItemType, index) => (
            <a
              key={subItem.value}
              className="flex items-center w-full py-2 pr-2 text-sm font-medium leading-5 text-gray-600 transition duration-150 ease-in-out rounded-md cursor-pointer group pl-11 hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:text-gray-900 focus:bg-gray-50"
              onClick={() => scrollToContentWithId(subItem.value)}
            >
              {`${position}.${index + 1}. ${subItem.title}`}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
