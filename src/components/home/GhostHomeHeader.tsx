import React, { useContext, useRef, useState } from 'react'
import { GlobalContext } from 'pages/_app'
import Image from 'next/image'
import ModalService from 'components/modals/ModalService'
import CreateAccountModal from 'components/account/CreateAccountModal'
import { CircleSpinner, WalletModal } from 'components'
import A from 'components/A'
import { GlobeAltIcon, PlusCircleIcon, XIcon } from '@heroicons/react/outline'
import useOnClickOutside from 'utils/useOnClickOutside'
import { getURLMetaData } from 'actions/web2/getURLMetaData'
import { useMutation, useQuery } from 'react-query'
import classNames from 'classnames'
import { ghostListToken } from 'actions/web2/ghostListToken'
import { getMarketFromURL } from 'utils/markets'
import { useMarketStore } from 'store/markets'
import { listToken, verifyTokenName } from 'actions'
import { useWeb3React } from '@web3-react/core'
import { onChainListToken } from 'actions/web2/onChainListToken'
import { useMixPanel } from 'utils/mixPanel'
import BN from 'bn.js'
import {
  bigNumberTenPow18,
  formatNumberWithCommasAsThousandsSerperator,
  useTransactionManager,
  web3BNToFloatString,
} from 'utils'
import TradeCompleteModal, {
  TRANSACTION_TYPES,
} from 'components/trade/TradeCompleteModal'
import useAuth from 'components/account/useAuth'
import { getSignedInWalletAddress } from 'lib/utils/web3-eth'
import { queryDaiBalance } from 'store/daiStore'
import { NETWORK } from 'store/networks'
import { getValidURL } from 'actions/web2/getValidURL'

const HomeHeader = ({
  setTradeOrListSuccessToggle,
  tradeOrListSuccessToggle,
}: any) => {
  const { mixpanel } = useMixPanel()
  const txManager = useTransactionManager()
  const { active, account, library } = useWeb3React()
  const { jwtToken } = useContext(GlobalContext)
  const [showListingCards, setShowListingCards] = useState(false)
  const [finalURL, setFinalURL] = useState('')
  const [urlInput, setURLInput] = useState('')
  const [finalTokenValue, setFinalTokenValue] = useState('')
  // const [isWantBuyChecked, setIsWantBuyChecked] = useState(false)
  const [isListing, setIsListing] = useState(false) // Is a listing in progress? (API call for Ghost List and contract call for OnChain List)
  const [isValidToken, setIsValidToken] = useState(false)
  const [isAlreadyGhostListed, setIsAlreadyGhostListed] = useState(false)
  const [isAlreadyOnChain, setIsAlreadyOnChain] = useState(false)

  const { interestManagerAVM: interestManagerAddress } =
    NETWORK.getDeployedAddresses()

  const { data: interestManagerDaiBalance } = useQuery(
    ['interest-manager-dai-balance', interestManagerAddress],
    queryDaiBalance,
    {
      refetchOnWindowFocus: false,
    }
  )

  const daiBalance = formatNumberWithCommasAsThousandsSerperator(
    web3BNToFloatString(
      interestManagerDaiBalance || new BN('0'),
      bigNumberTenPow18,
      0
    )
  )

  const ref = useRef()
  useOnClickOutside(ref, () => setShowListingCards(false))

  const onURLInputClicked = () => {
    // mixpanel.track('ADD_LISTING_START')
    setShowListingCards(true)
  }

  const markets = useMarketStore((state) => state.markets)

  const onURLTyped = async (event: any) => {
    const typedURL = event.target.value

    setURLInput(typedURL)

    const canonical = await getValidURL(typedURL)

    const market = getMarketFromURL(canonical, markets)

    // console.log('market from typed URL==', market)  // Keep here for debug purposes

    const { isValid, isAlreadyGhostListed, isAlreadyOnChain, finalTokenValue } =
      await verifyTokenName(canonical, market, active)

    setFinalURL(canonical)
    setFinalTokenValue(finalTokenValue)

    setIsValidToken(isValid)
    setIsAlreadyGhostListed(isAlreadyGhostListed)
    setIsAlreadyOnChain(isAlreadyOnChain)
  }

  const onTradeComplete = (
    isSuccess: boolean,
    tokenName: string,
    transactionType: TRANSACTION_TYPES,
    selectedMarket: any
  ) => {
    ModalService.open(TradeCompleteModal, {
      isSuccess,
      tokenName,
      marketName: selectedMarket.name,
      transactionType,
    })
  }

  const [walletVerificationRequest] = useMutation<{
    message: string
    data: any
  }>(() =>
    fetch('/api/walletVerificationRequest', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(async (res) => {
      if (!res.ok) {
        const response = await res.json()
        throw new Error(response.message)
      }
      return res.json()
    })
  )

  const { loginByWallet } = useAuth()

  const onLoginClicked = async () => {
    if (active) {
      const signedWalletAddress = await getSignedInWalletAddress({
        walletVerificationRequest,
        account,
        library,
      })
      await loginByWallet(signedWalletAddress)
    }
  }

  /**
   * User clicked the button to list token on Ghost Market
   */
  const onClickGhostList = async () => {
    // if jwtToken is not present, then popup modal and MM popup to ask user to create account or sign in
    if (!jwtToken) {
      onLoginClicked()
      ModalService.open(CreateAccountModal, {}, () => setShowListingCards(true))
      return
    }

    setIsListing(true)
    const market = getMarketFromURL(finalURL, markets)

    mixpanel.track(`LIST_GHOST_${market.name.toUpperCase()}`)

    const ghostListResponse = await ghostListToken(finalURL, market, jwtToken)

    setIsListing(false)
    setFinalURL('')
    setURLInput('')
    setIsValidToken(false)
    setShowListingCards(false)

    if (!ghostListResponse) {
      return // Do not show success modal if it was a failed ghost list
    }

    mixpanel.track(`LIST_GHOST_${market.name.toUpperCase()}_COMPLETED`)

    setTradeOrListSuccessToggle(!tradeOrListSuccessToggle)
    onTradeComplete(true, finalTokenValue, TRANSACTION_TYPES.GHOST_LIST, market)
  }

  /**
   * User clicked the button to list token on chain
   */
  const onClickOnChainList = async () => {
    setIsListing(true)
    const market = getMarketFromURL(finalURL, markets)

    mixpanel.track(`LIST_ONCHAIN_${market.name.toUpperCase()}`)

    // if (isWantBuyChecked) {
    //   const giftAddress = isENSAddressValid ? hexAddress : recipientAddress
    //   try {
    //     await txManager.executeTx(
    //       'List and buy',
    //       listAndBuyToken,
    //       tokenName,
    //       market,
    //       buyPayWithAddress,
    //       buyOutputAmountBN,
    //       buyInputAmountBN,
    //       buySlippage,
    //       buyLock ? 31556952 : 0,
    //       isGiftChecked ? giftAddress : account
    //     )
    //   } catch (ex) {
    //     console.log(ex)
    //     onTradeComplete(false, tokenName, TRANSACTION_TYPES.NONE)
    //     return
    //   }

    //   close()
    //   onTradeComplete(true, tokenName, TRANSACTION_TYPES.BUY)
    //   mixpanel.track(
    //     `ADD_LISTING_${selectedMarket.name.toUpperCase()}_COMPLETED`
    //   )
    // } else {

    try {
      await txManager.executeTxWithCallbacks(
        'List Token',
        listToken,
        {
          onReceipt: async (receipt: any) => {
            // TODO: call trigger API and send marketID and tokenID (get from receipt), remove onchain list api below
            // const tokenID = receipt?.events?.NewToken?.returnValues[0]
            // console.log('tokenID==', tokenID)
          },
        },
        finalTokenValue,
        market.marketID
      )
    } catch (ex) {
      console.error(ex)
      setIsListing(false)
      setFinalURL('')
      setURLInput('')
      setIsValidToken(false)
      setShowListingCards(false)
      onTradeComplete(false, finalTokenValue, TRANSACTION_TYPES.NONE, market)
      return
    }
    // close()
    // }

    await onChainListToken(
      finalTokenValue,
      finalURL,
      market?.marketID,
      jwtToken
    )

    onTradeComplete(true, finalTokenValue, TRANSACTION_TYPES.LIST, market)
    mixpanel.track(`LIST_ONCHAIN_${market.name.toUpperCase()}_COMPLETED`)

    setIsListing(false)
    setFinalURL('')
    setURLInput('')
    setIsValidToken(false)
    setShowListingCards(false)
    setTradeOrListSuccessToggle(!tradeOrListSuccessToggle)
  }

  const { data: urlMetaData, isLoading: isURLMetaDataLoading } = useQuery(
    [finalURL],
    getURLMetaData
  )

  return (
    <div className="px-6 pt-10 pb-40 text-center text-white font-inter bg-cover dark:text-gray-200 bg-top-mobile md:bg-top-desktop">
      <div>
        <div className="flex flex-wrap justify-center mt-4">
          <div
            className="flex justify-center flex-grow-0 flex-shrink-0 mt-4"
            data-aos="zoom-y-out"
          >
            <A href="https://www.nasdaq.com/articles/ideamarket-is-a-literal-marketplace-for-ideas-and-online-reputation-2021-02-19">
              <div className="relative h-8 opacity-50 w-36">
                <Image
                  src="/nasdaq.png"
                  alt="Nasdaq"
                  layout="fill"
                  objectFit="contain"
                  className="rounded-full"
                />
              </div>
            </A>
          </div>
          <div
            className="flex justify-center flex-grow-0 flex-shrink-0 mt-4"
            data-aos="zoom-y-out"
          >
            <A href="https://www.vice.com/en/article/pkd8nb/people-have-spent-over-dollar1-million-on-a-literal-marketplace-of-ideas">
              <div className="relative w-32 h-8 opacity-50">
                <Image
                  src="/vice.png"
                  alt="Vice"
                  layout="fill"
                  objectFit="contain"
                  className="rounded-full"
                />
              </div>
            </A>
          </div>
          <div
            className="flex justify-center flex-grow-0 flex-shrink-0 mt-4"
            data-aos="zoom-y-out"
          >
            <A href="https://www.coindesk.com/ideamarket-online-ideas-online-reputation">
              <div className="relative h-8 opacity-50 w-36">
                <Image
                  src="/coindesk.png"
                  alt="Coindesk"
                  layout="fill"
                  objectFit="contain"
                  priority={true}
                  className="rounded-full"
                />
              </div>
            </A>
          </div>
        </div>
        <h2 className="mt-8 text-3xl md:text-6xl font-gilroy-bold">
          Make lying
          <span className="text-brand-blue"> expensive.</span>
        </h2>
        <p className="mt-8 text-md md:text-xl">
          <p>Ideamarket values the world's information,</p>
          <span>creating public narratives without third parties. </span>
          <A
            href="https://docs.ideamarket.io"
            className="underline hover:text-brand-blue cursor-pointer"
          >
            (How it works)
          </A>
        </p>
      </div>
      <div className="flex flex-col items-center justify-center mt-4 md:mt-10 text-md md:text-3xl font-gilroy-bold md:flex-row">
        <div className="text-2xl text-brand-blue md:text-5xl">
          ${daiBalance}
        </div>
        <div className="md:ml-2">of information valued</div>
        <div
          className="flex justify-center flex-grow-0 flex-shrink-0 mt-8 md:mt-0 md:ml-6 mr-8 md:mr-0"
          data-aos="zoom-y-out"
        >
          <A href="https://docs.ideamarket.io/contracts/audit">
            <div className="relative h-8 opacity-50 w-40">
              <Image
                src="/Quantstamp.svg"
                alt="Quantstamp"
                layout="fill"
                objectFit="contain"
                priority={true}
                className="rounded-full"
              />
            </div>
          </A>
        </div>
      </div>
      <div className="relative flex flex-col items-center justify-center mt-10 md:flex-row md:w-136 w-full mx-auto">
        <div className="relative w-full">
          {showListingCards ? (
            <XIcon
              onClick={() => setShowListingCards(false)}
              className="absolute w-7 h-7 cursor-pointer"
              style={{ top: 12, right: 10 }}
            />
          ) : (
            <PlusCircleIcon
              onClick={onURLInputClicked}
              className="absolute w-7 h-7 cursor-pointer"
              style={{ top: 12, right: 10 }}
            />
          )}
          <input
            className="py-3 pl-4 pr-12 text-lg font-bold text-white rounded-lg w-full bg-white/[.1]"
            onFocus={onURLInputClicked}
            onChange={onURLTyped}
            value={urlInput}
            placeholder="Paste a URL here to add a listing..."
          />
        </div>
        {showListingCards && (
          // Needed wrapper div so hover-over container doesn't disappear when moving from button to container. Used random height, this can change if needed
          <div className="absolute top-0 left-0 w-full h-36">
            <div
              ref={ref}
              className="absolute left-0 flex flex-col w-full h-96 z-50 text-left font-inter"
              style={{ top: 64 }}
            >
              <div className="w-full p-4 text-black bg-white rounded-lg shadow-2xl">
                {isAlreadyGhostListed && !isAlreadyOnChain ? (
                  <div className="font-bold">
                    Listing Found on Ghost Market!
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 mb-4 text-lg">
                    <div className="font-bold">Listing on</div>
                    <div className="bg-gray-200 flex items-center rounded-lg px-2 py-1 text-sm">
                      <GlobeAltIcon className="w-5 mr-1" />
                      URLs
                    </div>
                    <div className="font-bold">Market</div>
                  </div>
                )}

                <div className="bg-gray-200 flex items-center rounded-lg p-4 mt-2">
                  {isValidToken && (
                    <>
                      {/* <GhostIcon className="w-6 h-6 mr-4" /> */}
                      {/* Didn't use Next image because can't do wildcard domain allow in next config file */}
                      <div className="flex flex-col w-full">
                        <div className="leading-5">
                          <div className="inline font-medium mr-1">
                            {!isURLMetaDataLoading &&
                            urlMetaData &&
                            urlMetaData?.ogTitle
                              ? urlMetaData.ogTitle
                              : 'loading'}
                          </div>
                        </div>

                        <a
                          href={finalURL}
                          className="text-brand-blue font-normal text-sm mt-1"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {finalURL?.substr(
                            0,
                            finalURL?.length > 60 ? 60 : finalURL?.length
                          ) + (finalURL?.length > 60 ? '...' : '')}
                        </a>
                        <a
                          href={finalURL}
                          className="h-56 mb-4 cursor-pointer"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img
                            className="rounded-xl mt-4 h-full"
                            src={
                              !isURLMetaDataLoading &&
                              urlMetaData &&
                              urlMetaData?.ogImage
                                ? urlMetaData.ogImage
                                : '/gray.svg'
                            }
                            alt=""
                            referrerPolicy="no-referrer"
                          />
                        </a>
                        <div className="mt-4 text-gray-400 text-sm text-left leading-5">
                          {!isURLMetaDataLoading &&
                          urlMetaData &&
                          urlMetaData?.ogDescription
                            ? urlMetaData?.ogDescription.substr(
                                0,
                                urlMetaData?.ogDescription.length > 150
                                  ? 150
                                  : urlMetaData?.ogDescription.length
                              ) +
                              (urlMetaData?.ogDescription.length > 150
                                ? '...'
                                : '')
                            : 'No description found'}
                        </div>
                      </div>
                    </>
                  )}
                  {!isValidToken &&
                    !isAlreadyGhostListed &&
                    !isAlreadyOnChain && (
                      <div className="text-red-400">
                        {finalURL === ''
                          ? 'Enter a URL to list'
                          : 'INVALID URL'}
                      </div>
                    )}
                  {isAlreadyOnChain && (
                    <div className="text-red-400">
                      THIS URL IS ALREADY LISTED ON-CHAIN
                    </div>
                  )}
                </div>

                {/* <div className="flex items-center mt-4 text-sm">
                  <input
                    type="checkbox"
                    id="listAndBuyCheckbox"
                    className="cursor-pointer"
                    checked={isWantBuyChecked}
                    onChange={(e) => {
                      setIsWantBuyChecked(e.target.checked)
                    }}
                  />
                  <label
                    htmlFor="listAndBuyCheckbox"
                    className={classNames(
                      'ml-2 font-bold cursor-pointer',
                      isWantBuyChecked
                        ? 'text-brand-blue dark:text-blue-400'
                        : 'text-black dark:text-gray-300'
                    )}
                  >
                    I want to immediately buy this token
                  </label>
                </div> */}

                {active ? (
                  <div className="flex justify-between items-center space-x-4 mt-4">
                    {!isAlreadyGhostListed && (
                      <button
                        onClick={onClickGhostList}
                        disabled={!isValidToken || isListing}
                        className={classNames(
                          'flex flex-col justify-center items-center w-full h-20 rounded-lg',
                          !isValidToken || isListing
                            ? 'text-brand-gray-2 dark:text-gray-300 bg-brand-gray dark:bg-gray-500 cursor-default border-brand-gray'
                            : 'text-white bg-brand-navy'
                        )}
                      >
                        <div className="font-bold text-lg">
                          List on Ghost Market
                        </div>
                        <div className="text-sm">Free & instant</div>
                      </button>
                    )}

                    <button
                      onClick={onClickOnChainList}
                      disabled={!isValidToken || isListing}
                      className={classNames(
                        'flex flex-col justify-center items-center w-full h-20 font-bold rounded-lg',
                        !isValidToken || isListing
                          ? 'text-brand-gray-2 dark:text-gray-300 bg-brand-gray dark:bg-gray-500 cursor-default border-brand-gray'
                          : 'text-white bg-blue-500 '
                      )}
                    >
                      <div className="font-bold text-lg">List On-Chain</div>
                      <div className="text-sm">
                        Tradeable Ideamarket listing
                      </div>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() =>
                      ModalService.open(WalletModal, {}, () =>
                        setShowListingCards(true)
                      )
                    }
                    className="text-white bg-blue-500 flex flex-col justify-center items-center w-full h-20 mt-4 font-bold rounded-lg"
                  >
                    <div className="font-bold text-lg">CONNECT WALLET</div>
                    <div className="text-sm opacity-75">
                      to continue adding a listing
                    </div>
                  </button>
                )}

                {isListing && (
                  <div className="flex items-center">
                    <div>Listing in progress...</div>
                    <CircleSpinner color="#0857e0" />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default HomeHeader
