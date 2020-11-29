import { useState } from 'react'
import classNames from 'classnames'

import { requestVerification } from 'actions'
import {
  IdeaMarket,
  IdeaToken,
  getMarketVerificationExplanation,
  getMarketUUIDPrompt,
  getMarketUUIDPromptExplanation,
  getMarketConfirmCheckboxText,
} from 'store/ideaMarketsStore'
import { useWalletStore } from 'store/walletStore'
import { isAddress } from '../utils'
import { Modal } from './'

export default function VerifyModal({
  isOpen,
  setIsOpen,
  market,
  token,
}: {
  isOpen: boolean
  setIsOpen: (b: boolean) => void
  market: IdeaMarket
  token: IdeaToken
}) {
  const PAGES = {
    OWNER_ADDRESS: 0,
    SHOW_UUID: 1,
  }

  const [page, setPage] = useState(PAGES.SHOW_UUID)

  const connectedAddress = useWalletStore((state) => state.address)
  const [ownerAddress, setOwnerAddress] = useState('')
  const isValidOwnerAddress = isAddress(ownerAddress)

  const [uuid, setUUID] = useState('')
  const marketVerificationExplanation = getMarketVerificationExplanation(market)
  const uuidPromptExplanation = getMarketUUIDPromptExplanation(market)
  const uuidPrompt = getMarketUUIDPrompt(market, uuid)
  const confirmCheckboxText = getMarketConfirmCheckboxText(market)

  const [confirmCheckboxChecked, setConfirmCheckboxChecked] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  async function initiateVerification() {
    setDisabled(true)
    try {
      setUUID(await requestVerification(token, ownerAddress))
      setPage(PAGES.SHOW_UUID)
    } catch (ex) {
      setErrorMessage(ex)
    } finally {
      setDisabled(false)
    }
  }

  if (!isOpen) {
    return <></>
  }

  return (
    <Modal isOpen={isOpen} close={() => setIsOpen(false)}>
      <div className="md:min-w-150 md:max-w-150">
        <div className="p-4 bg-top-mobile ">
          <p className="text-2xl text-center text-gray-300 md:text-3xl font-gilroy-bold">
            Verify: {token.name}
          </p>
        </div>
        <div className="p-5 text-brand-gray-2">
          {page === PAGES.OWNER_ADDRESS && (
            <>
              <p className="text-sm">
                If this listing represents your account you have the possibility
                to verify ownership of this listing. Ownership will allow you to
                withdraw the accumulated interest at any time.
              </p>
              <br />
              <p>{marketVerificationExplanation}</p>
              <div className="text-center mt-10 text-lg">
                <strong>Address to be listed as owner</strong>
              </div>
              <div className="flex flex-col md:flex-row md:mx-2 mt-1 items-center justify-center">
                <div className="w-full md:flex-grow">
                  <input
                    className={classNames(
                      'pl-2 w-full h-10 leading-tight bg-gray-200 border-2 rounded appearance-none focus:outline-none focus:bg-white',
                      ownerAddress.length === 0
                        ? 'border-gray-200 focus:border-brand-blue'
                        : isValidOwnerAddress
                        ? 'border-brand-green'
                        : 'border-brand-red'
                    )}
                    disabled={disabled}
                    value={ownerAddress}
                    onChange={(e: any) => {
                      setOwnerAddress(e.target.value)
                    }}
                    placeholder="0x..."
                  />
                </div>
                <button
                  className="mt-2 md:mt-0 md:ml-2.5 w-32 h-10 text-sm text-brand-blue bg-white border border-brand-blue rounded-lg tracking-tightest-2 font-sf-compact-medium hover:bg-brand-blue hover:text-white"
                  disabled={disabled}
                  onClick={() => {
                    setOwnerAddress(connectedAddress)
                  }}
                >
                  Use connected
                </button>
              </div>
              <div className="mt-10 flex justify-center">
                <button
                  disabled={disabled || !isValidOwnerAddress}
                  className={classNames(
                    'w-32 h-10 text-base border-2 rounded-lg tracking-tightest-2 font-sf-compact-medium',
                    isValidOwnerAddress
                      ? 'bg-brand-blue text-white border-brand-blue'
                      : 'bg-white border-brand-gray-2 text-brand-gray-2 cursor-not-allowed'
                  )}
                  onClick={initiateVerification}
                >
                  Next
                </button>
              </div>
              <div className="text-brand-red text-base">
                <strong>{errorMessage}</strong>
              </div>
            </>
          )}
          {page === PAGES.SHOW_UUID && (
            <>
              <p>{uuidPromptExplanation}</p>
              <div className="mt-7.5 p-5 border border-brand-gray-2 bg-gray-200 rounded text-black">
                {uuidPrompt}
              </div>
              <div className="mt-10 flex justify-center items-center">
                <input
                  type="checkbox"
                  id="confirmCheckbox"
                  onChange={(e) => {
                    setConfirmCheckboxChecked(e.target.checked)
                  }}
                />
                <label htmlFor="confirmCheckbox" className="ml-2">
                  {confirmCheckboxText}
                </label>
              </div>
              <div className="flex justify-center">
                <button
                  disabled={disabled || !confirmCheckboxChecked}
                  className={classNames(
                    'mt-2 w-32 h-10 text-base border-2 rounded-lg tracking-tightest-2 font-sf-compact-medium',
                    confirmCheckboxChecked
                      ? 'bg-brand-blue text-white border-brand-blue'
                      : 'bg-white border-brand-gray-2 text-brand-gray-2 cursor-not-allowed'
                  )}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </Modal>
  )
}
