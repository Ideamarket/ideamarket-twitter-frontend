import classNames from 'classnames'
import { useState } from 'react'
import Modal from './modals/Modal'

export default function ColumnsModal({
  close,
  headerData,
  toggleHeader,
}: {
  close: () => void
  headerData: Array<any>
  toggleHeader: (headerValue: string) => void
}) {
  const optionalHeaders = headerData.filter((h) => h.isOptional)
  const initialValue = {}
  optionalHeaders.forEach((h) => {
    initialValue[h.value] = h.isActive
  })
  const [columnVisibility, setColumnVisibility] = useState(initialValue)

  return (
    <Modal close={() => close()}>
      <div className="p-4 max-h-56">
        <b>Select optional metric columns to display</b>

        <div className="flex flex-col flex-wrap max-h-36 mt-1">
          {optionalHeaders.map((h) => (
            <span key={h.value}>
              <input
                type="checkbox"
                id={`checkbox-${h.value}`}
                className="cursor-pointer border-2 border-gray-200 rounded-sm"
                checked={columnVisibility[h.value]}
                onChange={(e) => {
                  const headerObject = { ...columnVisibility }
                  headerObject[h.value] = e.target.checked
                  setColumnVisibility(headerObject)
                }}
              />
              <label
                htmlFor={`checkbox-${h.value}`}
                className={classNames(
                  'ml-2 cursor-pointer',
                  columnVisibility[h.value]
                    ? 'text-brand-blue font-medium'
                    : 'text-brand-gray-2'
                )}
              >
                {h.name}
              </label>
            </span>
          ))}
        </div>

        <button
          onClick={() => {
            Object.keys(columnVisibility).forEach((key) => {
              optionalHeaders.forEach((h) => {
                if (key === h.value && h.isActive !== columnVisibility[key]) {
                  toggleHeader(key)
                }
              })
            })

            close()
          }}
          className="py-1 px-3 my-2 float-right text-white rounded-md bg-brand-blue hover:bg-blue-800"
        >
          Confirm
        </button>
      </div>
    </Modal>
  )
}
