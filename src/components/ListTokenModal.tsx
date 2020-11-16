import classNames from 'classnames'
import { useState, useEffect } from 'react'
import { useQuery } from 'react-query'
import { listToken, verifyTokenName } from 'actions'
import { queryMarkets, userInputToTokenName } from 'store/ideaMarketsStore'
import { NETWORK } from 'utils'
import { Modal, MarketSelect } from './'

export default function ListTokenModal({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean
  setIsOpen: (b: boolean) => void
}) {
  const { data: markets, isLoading: isMarketsLoading } = useQuery(
    'all-markets',
    queryMarkets
  )

  const [selectMarketValues, setSelectMarketValues] = useState([])
  const [selectedMarket, setSelectedMarket] = useState(undefined)

  const [pendingTxHash, setPendingTxHash] = useState('')
  const [isTxPending, setIsTxPending] = useState(false)

  useEffect(() => {
    if (markets) {
      setSelectMarketValues(
        markets.map((market) => ({
          value: market.marketID.toString(),
          market: market,
        }))
      )
      setSelectedMarket(markets[0])
    } else {
      setSelectMarketValues([])
      setSelectedMarket(undefined)
    }
  }, [markets])

  const [tokenName, setTokenName] = useState('')
  const [isValidTokenName, setIsValidTokenName] = useState(true)

  async function tokenNameInputChanged(val) {
    setTokenName(val)
    const finalTokenName = userInputToTokenName(selectedMarket.name, val)
    setIsValidTokenName(
      await verifyTokenName(finalTokenName, selectedMarket.marketID)
    )
  }

  async function listClicked() {
    const finalTokenName = userInputToTokenName(selectedMarket.name, tokenName)

    setIsTxPending(true)
    try {
      await listToken(finalTokenName, selectedMarket.marketID).on(
        'transactionHash',
        (hash) => {
          setPendingTxHash(hash)
        }
      )
    } catch (ex) {
      console.log(ex)
      return
    } finally {
      setPendingTxHash('')
      setIsTxPending(false)
    }

    setIsOpen(false)
  }

  if (!isOpen) {
    return <></>
  }

  return (
    <Modal isOpen={isOpen} close={() => setIsOpen(false)}>
      <div className="p-4 bg-top-mobile min-w-100">
        <p className="text-2xl text-center text-gray-300 md:text-3xl font-gilroy-bold">
          List Token
        </p>
      </div>
      <p className="mx-5 mt-5 text-sm text-brand-gray-2">Market</p>
      <div className="mx-5">
        {isMarketsLoading ? (
          ''
        ) : (
          <MarketSelect
            onChange={(value) => {
              setSelectedMarket(value.market)
            }}
            options={selectMarketValues}
            defaultValue={selectMarketValues[0]}
          />
        )}
      </div>
      <p className="mx-5 mt-5 text-sm text-brand-gray-2">Token Name</p>
      <div className="flex items-center mx-5">
        <div className="text-base text-brand-gray-2 text-semibold">@</div>
        <div className="flex-grow ml-0.5">
          <input
            disabled={isTxPending}
            className={classNames(
              'w-full py-2 pl-1 pr-4 leading-tight bg-gray-200 border-2 rounded appearance-none focus:bg-white focus:outline-none',
              !isValidTokenName && tokenName.length > 0
                ? 'border-brand-red focus:border-brand-red'
                : 'border-gray-200 focus:border-brand-blue'
            )}
            onChange={(e) => {
              tokenNameInputChanged(e.target.value)
            }}
          />
        </div>
      </div>
      <div className="flex justify-center mb-5">
        <button
          disabled={!isValidTokenName || isTxPending}
          onClick={listClicked}
          className={classNames(
            'w-32 h-10 mt-5 text-base font-medium bg-white border-2 rounded-lg  text-brand-blue  tracking-tightest-2 font-sf-compact-medium',
            isValidTokenName
              ? 'border-brand-blue hover:bg-brand-blue hover:text-white'
              : 'border-brand-gray-2 text-brand-gray-2 cursor-default'
          )}
        >
          List Token
        </button>
      </div>
      <div
        className={classNames(
          'grid grid-cols-3 my-5 text-sm text-brand-gray-2',
          isTxPending ? '' : 'invisible'
        )}
      >
        <div className="font-bold justify-self-center">List Token</div>
        <div className="justify-self-center">
          <a
            className={classNames(
              'underline',
              pendingTxHash === '' ? 'hidden' : ''
            )}
            href={`https://${
              NETWORK === 'kovan' ? 'kovan.' : ''
            }etherscan.io/tx/${pendingTxHash}`}
            target="_blank"
          >
            {pendingTxHash.slice(0, 8)}...{pendingTxHash.slice(-6)}
          </a>
        </div>
        <div className="justify-self-center">
          <svg
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 animate-spin"
          >
            <circle
              cx="50"
              cy="50"
              r="45"
              style={{
                fill: 'transparent',
                stroke: '#0857e0', // brand-blue
                strokeWidth: '10',
              }}
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              style={{
                fill: 'transparent',
                stroke: 'white',
                strokeWidth: '10',
                strokeDasharray: '283',
                strokeDashoffset: '75',
              }}
            />
          </svg>
        </div>
      </div>
    </Modal>
  )
}
