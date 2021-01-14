import { useState } from 'react'
import classNames from 'classnames'

export default function AdvancedOptions({
  disabled,
  isUnlockOnceChecked,
  setIsUnlockOnceChecked,
  isUnlockPermanentChecked,
  setIsUnlockPermanentChecked,
}: {
  disabled: boolean
  isUnlockOnceChecked: boolean
  setIsUnlockOnceChecked: (b: boolean) => void
  isUnlockPermanentChecked: boolean
  setIsUnlockPermanentChecked: (b: boolean) => void
}) {
  const [show, setShow] = useState(false)

  return (
    <>
      <div
        className="mt-5 text-xs text-center underline cursor-pointer text-brand-gray-2"
        onClick={() => {
          setShow(!show)
        }}
      >
        {show ? 'Hide' : 'Show'} Advanced Options
      </div>
      <div className={classNames('text-sm mx-5 mt-2', !show && 'hidden')}>
        <div>
          <input
            type="checkbox"
            id="unlockOnceCheckbox"
            className="cursor-pointer"
            disabled={disabled}
            checked={isUnlockOnceChecked}
            onChange={(e) => {
              setIsUnlockOnceChecked(e.target.checked)
              setIsUnlockPermanentChecked(!e.target.checked)
            }}
          />
          <label
            htmlFor="unlockOnceCheckbox"
            className={classNames(
              'ml-2 cursor-pointer',
              isUnlockOnceChecked
                ? 'text-brand-blue font-medium'
                : 'text-brand-gray-2'
            )}
          >
            Unlock once
          </label>
        </div>

        <div>
          <input
            type="checkbox"
            id="unlockPermanentCheckbox"
            className="cursor-pointer"
            disabled={disabled}
            checked={isUnlockPermanentChecked}
            onChange={(e) => {
              setIsUnlockPermanentChecked(e.target.checked)
              setIsUnlockOnceChecked(!e.target.checked)
            }}
          />
          <label
            htmlFor="unlockPermanentCheckbox"
            className={classNames(
              'ml-2 cursor-pointer',
              isUnlockPermanentChecked
                ? 'text-brand-blue font-medium'
                : 'text-brand-gray-2'
            )}
          >
            Unlock permanent
          </label>
        </div>
      </div>
    </>
  )
}