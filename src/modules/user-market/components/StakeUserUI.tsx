import { useEffect, useState } from 'react'
import classNames from 'classnames'
import Select from 'react-select'
import { IdeaMarket, IdeaToken } from 'store/ideaMarketsStore'
import { useTokenListStore } from 'store/tokenListStore'
import { useBalance, useTokenIconURL } from 'actions'
import {
  bigNumberTenPow18,
  calculateIdeaTokenDaiValue,
  floatToWeb3BN,
  formatBigNumber,
  useTransactionManager,
  web3BNToFloatString,
} from 'utils'
import { useContractStore } from 'store/contractStore'
import { NETWORK } from 'store/networks'
import BigNumber from 'bignumber.js'
import BN from 'bn.js'
import Tooltip from 'components/tooltip/Tooltip'
import { getMarketSpecificsByMarketName } from 'store/markets'
import {
  CogIcon,
  ArrowSmUpIcon,
  ArrowSmDownIcon,
} from '@heroicons/react/outline'
import useTokenToDAI from 'actions/useTokenToDAI'
import { useWeb3React } from '@web3-react/core'
import { useENSAddress } from 'components/trade/hooks/useENSAddress'
import { TX_TYPES } from 'components/trade/TradeCompleteModal'
import TxPending from 'components/trade/TxPending'
import { isETHAddress } from 'utils/addresses'
import AdvancedOptions from 'components/trade/AdvancedOptions'
import ApproveButton from 'components/trade/ApproveButton'
import { IdeamarketUser } from '../services/UserMarketService'
import { convertAccountName } from 'lib/utils/stringUtil'
import { USER_MARKET } from '../utils/UserMarketUtils'
import unstakeUserToken from 'actions/web3/user-market/unstakeUserToken'
import listAndBuyToken from 'actions/web3/user-market/listAndBuyToken'
import buyToken from 'actions/web3/user-market/buyToken'
import useCalcIDTAmount from '../hooks/useCalcIDTAmount'
import useCalcERC20Amount from '../hooks/useCalcERC20Amount'
import { syncUserToken } from 'actions/web2/user-market/syncUserToken'
import StakeUserUIBox from './StakeUserUIBox'
import { A } from 'components'
import Image from 'next/image'

type StakeUserUIProps = {
  isOnChain: boolean // Is user token on chain or only in the database?
  web2UserToken: IdeamarketUser
  web3UserToken: IdeaToken
  market: IdeaMarket
  onTradeComplete: (
    isSuccess: boolean,
    listingId: string,
    idtValue: string,
    transactionType: TX_TYPES
  ) => void
  onValuesChanged: (
    ideaTokenAmount: BN,
    tokenAddress: string,
    tokenSymbol: string,
    calculatedTokenAmount: BN,
    maxSlippage: number,
    isUnlockOnceChecked: boolean,
    isUnlockPermanentChecked: boolean,
    isValid: boolean,
    recipientAddress: string,
    isENSAddressValid: boolean | string,
    hexAddress: boolean | string
  ) => void
  resetOn: boolean
  showTradeButton: boolean
  disabled: boolean
  unlockText?: string
  startingTradeType?: TX_TYPES
}

export default function StakeUserUI({
  isOnChain,
  web2UserToken,
  web3UserToken,
  market,
  onTradeComplete,
  onValuesChanged,
  resetOn,
  showTradeButton,
  disabled,
  unlockText,
  startingTradeType = TX_TYPES.STAKE_USER,
}: StakeUserUIProps) {
  const { account } = useWeb3React()
  const [tradeType, setTradeType] = useState(startingTradeType) // Used for smart contracts and which trade UI tab user is on
  const [isENSAddressValid, hexAddress] = useENSAddress(account)

  const [isUnlockOnceChecked, setIsUnlockOnceChecked] = useState(false)
  const [isUnlockPermanentChecked, setIsUnlockPermanentChecked] = useState(true)

  const tokenList = useTokenListStore((state) => state.tokens)
  const selectTokensValues = tokenList.map((token) => ({
    value: token.address,
    token: token,
  }))

  const [selectedToken, setSelectedToken] = useState(
    useTokenListStore.getState().tokens[0]
  )
  const [tradeToggle, setTradeToggle] = useState(false) // Need toggle to reload balances after trade
  const [ideaTokenBalance, ideaTokenBalanceBN, isIdeaTokenBalanceLoading] =
    useBalance(web3UserToken?.address, account, 18, tradeToggle)

  const [tokenBalance, tokenBalanceBN, isTokenBalanceLoading] = useBalance(
    selectedToken?.address,
    account,
    selectedToken?.decimals,
    tradeToggle
  )

  // ideaTokenAmount = Number typed in by user on ideaToken input
  const [ideaTokenAmount, setIdeaTokenAmount] = useState('0')
  const ideaTokenAmountBN = floatToWeb3BN(
    ideaTokenAmount,
    18,
    BigNumber.ROUND_DOWN
  )
  // Calculates the selectedToken amount after the ideaToken is typed in
  const [
    isCalculatedTokenAmountLoading,
    calculatedTokenAmountBN,
    calculatedTokenAmount,
  ] = useCalcERC20Amount(
    web3UserToken,
    market,
    selectedToken?.address,
    ideaTokenAmount,
    selectedToken?.decimals,
    tradeType
  )

  // selectedTokenAmount = Number typed in by user on selectedToken input
  const [selectedTokenAmount, setSelectedTokenAmount] = useState('0')
  const selectedTokenAmountBN = floatToWeb3BN(
    selectedTokenAmount,
    selectedToken.decimals,
    BigNumber.ROUND_DOWN
  )
  // Calculates the ideaToken amount after the selectedToken is typed in
  const [
    isCalculatedIdeaTokenAmountLoading,
    calculatedIdeaTokenAmountBN,
    calculatedIdeaTokenAmount,
  ] = useCalcIDTAmount(
    isOnChain,
    web3UserToken,
    market,
    selectedToken?.address,
    selectedTokenAmount,
    selectedToken?.decimals,
    tradeType,
    tokenBalanceBN
  )

  // Determines which token input was typed in last
  const isSelectedTokenActive = selectedTokenAmount !== '0'

  // These master variables store the value to be used for the ideaToken and selectedToken
  // If user typed a number, use that input. Otherwise, use the calculated value
  const masterIdeaTokenAmount = isSelectedTokenActive
    ? calculatedIdeaTokenAmount
    : ideaTokenAmount
  const masterSelectedTokenAmount = isSelectedTokenActive
    ? selectedTokenAmount
    : calculatedTokenAmount
  const masterIdeaTokenAmountBN = isSelectedTokenActive
    ? calculatedIdeaTokenAmountBN
    : ideaTokenAmountBN
  const masterSelectedTokenAmountBN = isSelectedTokenActive
    ? selectedTokenAmountBN
    : calculatedTokenAmountBN

  const ideaTokenValue = web3BNToFloatString(
    calculateIdeaTokenDaiValue(
      tradeType === TX_TYPES.STAKE_USER
        ? // If there is no ideaToken (when listing new IDT), then just use masterIdeaTokenAmountBN
          web3UserToken?.rawSupply?.add(masterIdeaTokenAmountBN) ||
            masterIdeaTokenAmountBN
        : web3UserToken?.rawSupply,
      market,
      masterIdeaTokenAmountBN
    ),
    bigNumberTenPow18,
    2
  )

  // Calculates the DAI/USD value for the selectedToken
  const [
    isSelectedTokenDAIValueLoading,
    selectedTokenDAIValueBN,
    selectedTokenDAIValue,
  ] = useTokenToDAI(
    selectedToken,
    masterSelectedTokenAmount,
    selectedToken?.decimals
  )

  function percentDecrease(a, b) {
    return 100 * ((a - b) / Math.abs(a))
  }

  const slippage =
    tradeType === TX_TYPES.STAKE_USER
      ? percentDecrease(
          parseFloat(selectedTokenDAIValue),
          parseFloat(ideaTokenValue)
        )
      : percentDecrease(
          parseFloat(ideaTokenValue),
          parseFloat(selectedTokenDAIValue)
        )

  const marketSpecifics = getMarketSpecificsByMarketName(market?.name)

  const exchangeContractAddress = useContractStore(
    (state) => state.exchangeContractUserMarket
  )?.options?.address
  const multiActionContractAddress = useContractStore(
    (state) => state.multiActionContractUserMarket
  )?.options?.address

  const displayUsernameOrWallet = convertAccountName(
    web2UserToken?.username || web2UserToken?.walletAddress
  )
  const usernameOrWallet =
    web2UserToken?.username || web2UserToken?.walletAddress

  const spender =
    tradeType === TX_TYPES.STAKE_USER
      ? selectedToken?.address === NETWORK.getExternalAddresses().imo &&
        isOnChain // To use exchangeContract, token needs to be onchain. Otherwise multiAction is used to do list and buy tx
        ? exchangeContractAddress
        : multiActionContractAddress
      : selectedToken.address !== NETWORK.getExternalAddresses().imo
      ? multiActionContractAddress
      : undefined // I don't get why this allows user to skip "unstake" allow button, but it does

  // What ERC20 is being moved around by our contract
  const spendTokenAddress =
    tradeType === TX_TYPES.STAKE_USER
      ? selectedToken?.address
      : web3UserToken?.address

  const spendTokenSymbol =
    tradeType === TX_TYPES.STAKE_USER
      ? selectedToken?.symbol
      : displayUsernameOrWallet

  // Amount of token that needs approval before tx
  const requiredAllowance =
    tradeType === TX_TYPES.STAKE_USER
      ? masterSelectedTokenAmount
      : masterIdeaTokenAmount

  const exceedsBalanceBuy =
    isTokenBalanceLoading || !masterSelectedTokenAmountBN
      ? false
      : tokenBalanceBN.lt(masterSelectedTokenAmountBN)

  const exceedsBalanceSell = isIdeaTokenBalanceLoading
    ? false
    : ideaTokenBalanceBN.lt(masterIdeaTokenAmountBN)

  const exceedsBalance =
    tradeType === TX_TYPES.STAKE_USER || tradeType === TX_TYPES.LOCK
      ? exceedsBalanceBuy
      : exceedsBalanceSell

  const [isMissingAllowance, setIsMissingAllowance] = useState(false) // isMissingAllowance says whether the user has enough allowance on the ERC20 token to perform the trade. If isMissingAllowance == true then the user needs to do an approve tx first
  const [approveButtonKey, setApproveButtonKey] = useState(0)
  const [isValid, setIsValid] = useState(false)
  const txManager = useTransactionManager()

  let maxSlippage = 0.01
  type SlippageValue = {
    value: number
    label: string
  }
  const slippageValues: SlippageValue[] = [
    { value: 0.01, label: '1% max. slippage' },
    { value: 0.02, label: '2% max. slippage' },
    { value: 0.03, label: '3% max. slippage' },
    { value: 0.04, label: '4% max. slippage' },
    { value: 0.05, label: '5% max. slippage' },
  ]

  useEffect(() => {
    setSelectedToken(useTokenListStore.getState().tokens[0])
    setIdeaTokenAmount('')
    setTradeType(startingTradeType)
    setApproveButtonKey(approveButtonKey + 1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetOn])

  useEffect(() => {
    let isValid =
      selectedToken !== undefined &&
      masterIdeaTokenAmountBN !== undefined &&
      masterSelectedTokenAmountBN !== undefined &&
      !isNaN(masterIdeaTokenAmount) &&
      !isNaN(masterSelectedTokenAmount) &&
      !/\s/g.test(masterSelectedTokenAmount) && // No whitespace allowed in inputs
      !/\s/g.test(masterIdeaTokenAmount) &&
      masterIdeaTokenAmountBN.gt(new BN('0')) &&
      masterSelectedTokenAmountBN.gt(new BN('0'))

    if (isValid) {
      // Make sure user has high enough balance. If not, disable buttons
      if (tradeType === TX_TYPES.STAKE_USER) {
        if (masterSelectedTokenAmountBN.gt(tokenBalanceBN)) {
          isValid = false
        }
      } else {
        if (masterIdeaTokenAmountBN.gt(ideaTokenBalanceBN)) {
          isValid = false
        }
      }
    }

    setIsValid(isValid)

    // Didn't use masterIdeaTokenAmountBN because type can be BN or BigNumber...this causes issues
    const ideaTokenAmountBNLocal = floatToWeb3BN(
      masterIdeaTokenAmount,
      18,
      BigNumber.ROUND_DOWN
    )
    const selectedTokenAmountBNLocal = floatToWeb3BN(
      masterSelectedTokenAmount,
      selectedToken.decimals,
      BigNumber.ROUND_DOWN
    )

    onValuesChanged(
      ideaTokenAmountBNLocal,
      selectedToken?.address,
      spendTokenSymbol,
      selectedTokenAmountBNLocal,
      maxSlippage,
      isUnlockOnceChecked,
      isUnlockPermanentChecked,
      isValid,
      account,
      isENSAddressValid,
      hexAddress
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    ideaTokenAmount,
    selectedTokenAmount,
    selectedToken,
    calculatedIdeaTokenAmountBN,
    calculatedTokenAmountBN,
    maxSlippage,
    isUnlockOnceChecked,
    isUnlockPermanentChecked,
    isCalculatedIdeaTokenAmountLoading,
    isCalculatedTokenAmountLoading,
    isSelectedTokenDAIValueLoading,
    account,
    isENSAddressValid,
    hexAddress,
    spendTokenSymbol,
  ])

  async function maxButtonClicked() {
    setSelectedTokenAmount('0')

    if (tradeType === TX_TYPES.UNSTAKE_USER || tradeType === TX_TYPES.LOCK) {
      const balanceBN = new BigNumber(ideaTokenBalanceBN.toString())
      setIdeaTokenAmount(
        formatBigNumber(
          balanceBN.div(new BigNumber('10').pow(new BigNumber('18'))),
          18,
          BigNumber.ROUND_DOWN
        )
      )
    } else {
      setSelectedTokenAmount(tokenBalance)
    }
  }

  const tradeFinishUp = () => {
    setIdeaTokenAmount('0')
    setApproveButtonKey(approveButtonKey + 1)
    setTradeToggle(!tradeToggle)

    onTradeComplete(
      true,
      web3UserToken?.listingId,
      web3UserToken?.name,
      tradeType
    )
  }

  async function onTradeClicked() {
    const name = tradeType === TX_TYPES.STAKE_USER ? 'Stake' : 'Unstake'

    // If on chain, buy using ideaTokenExchange contract (with IMO. Uses multiaction for non-IMO buy). If not on-chain, use multiaction for doing a list and buy in one tx
    const buyMethod = isOnChain ? buyToken : listAndBuyToken

    const func =
      tradeType === TX_TYPES.STAKE_USER ? buyMethod : unstakeUserToken
    // Didn't use masterIdeaTokenAmountBN because type can be BN or BigNumber...this causes issues
    const ideaTokenAmountBNLocal = floatToWeb3BN(
      masterIdeaTokenAmount,
      18,
      BigNumber.ROUND_DOWN
    )
    const selectedTokenAmountBNLocal = floatToWeb3BN(
      masterSelectedTokenAmount,
      selectedToken.decimals,
      BigNumber.ROUND_DOWN
    )

    const regularBuyArgs = [
      web3UserToken?.address,
      selectedToken.address,
      ideaTokenAmountBNLocal,
      selectedTokenAmountBNLocal,
      maxSlippage,
      0,
      account,
    ]

    const listAndBuyArgs = [
      web2UserToken?.walletAddress, // Name of IDT will be the wallet address
      USER_MARKET,
      NETWORK.getExternalAddresses().imo, // Token to buy with
      ideaTokenAmountBNLocal, // Amount of IDT user will receive
      selectedTokenAmountBNLocal, // Amount of IMO to stake
      maxSlippage,
      0,
      account,
    ]

    const buyArgs = isOnChain ? regularBuyArgs : listAndBuyArgs

    const args =
      tradeType === TX_TYPES.STAKE_USER
        ? buyArgs
        : [
            web3UserToken?.address,
            selectedToken.address,
            ideaTokenAmountBNLocal,
            selectedTokenAmountBNLocal,
            maxSlippage,
            account,
          ]

    try {
      await txManager.executeTxWithCallbacks(
        name,
        func,
        {
          onReceipt: async (receipt: any) => {
            // walletAddress stored in name field for onchain token
            await syncUserToken(
              isOnChain ? web3UserToken?.name : web2UserToken?.walletAddress
            )
          },
        },
        ...args
      )
    } catch (ex) {
      console.log(ex)
      onTradeComplete(
        false,
        web3UserToken?.listingId,
        web3UserToken?.name,
        TX_TYPES.NONE
      )
      return
    }

    tradeFinishUp()
  }

  // Is user's address a valid hex-address?
  const isValidAddress = !isENSAddressValid ? isETHAddress(account) : true

  const isApproveButtonDisabled =
    txManager.isPending ||
    !isValid ||
    exceedsBalance ||
    !isMissingAllowance ||
    !isValidAddress

  const isTradeButtonDisabled =
    txManager.isPending ||
    !isValid ||
    exceedsBalance ||
    isMissingAllowance ||
    !isValidAddress

  const { tokenIconURL } = useTokenIconURL({
    marketSpecifics,
    tokenName: web3UserToken?.name,
  })

  const commonProps = {
    setIdeaTokenAmount,
    setSelectedTokenAmount,
    tradeType,
    exceedsBalance,
    disabled,
    market,
    maxButtonClicked,
    selectedToken,
    setSelectedToken,
    selectTokensValues,
    setTradeType,
    txManager,
    slippage,
    isInputAmountGTSupply: masterIdeaTokenAmount < 0,
  }

  const selectedTokenProps = {
    inputTokenAmount: isCalculatedTokenAmountLoading
      ? '...'
      : masterSelectedTokenAmount,
    isIdeaToken: false, // Selected token is never an ideaToken. It is ETH/DAI/etc (if this changes, can call this isSelectedToken instead)
    tokenBalance,
    isTokenBalanceLoading,
    selectedIdeaToken: null,
    tokenValue: web3BNToFloatString(
      selectedTokenDAIValueBN || new BN('0'),
      bigNumberTenPow18,
      2
    ),
  }

  const selectedIdeaToken = {
    symbol: displayUsernameOrWallet,
    logoURL:
      tradeType === TX_TYPES.STAKE_USER
        ? tokenIconURL
        : web2UserToken?.profilePhoto || '/DefaultProfilePicture.png',
  }

  const ideaTokenProps = {
    inputTokenAmount: masterIdeaTokenAmount,
    isIdeaToken: true,
    tokenBalance: ideaTokenBalance,
    isTokenBalanceLoading: isIdeaTokenBalanceLoading,
    selectedIdeaToken: selectedIdeaToken,
    tokenValue: ideaTokenValue,
  }

  return (
    <div>
      <div className="w-full md:w-136 mx-auto bg-white dark:bg-gray-700 rounded-xl">
        <div className="px-6 py-4 bg-black/[.05] text-base font-medium leading-5 truncate">
          {/* Display user image, username/wallet */}
          <div className="flex items-center pb-2 whitespace-nowrap">
            <div className="relative rounded-full w-6 h-6">
              <Image
                className="rounded-full"
                src={
                  web2UserToken?.profilePhoto || '/DefaultProfilePicture.png'
                }
                alt=""
                layout="fill"
                objectFit="cover"
              />
            </div>
            <A
              className="ml-2 font-bold hover:text-blue-600"
              href={`/u/${usernameOrWallet}`}
            >
              {displayUsernameOrWallet}
            </A>
            {web2UserToken?.twitterUsername && (
              <A
                className="flex items-center space-x-1 ml-1 hover:text-blue-500 z-50"
                href={`https://twitter.com/${web2UserToken?.twitterUsername}`}
              >
                <div className="relative w-4 h-4">
                  <Image
                    src={'/twitter-solid-blue.svg'}
                    alt="twitter-solid-blue-icon"
                    layout="fill"
                  />
                </div>
                <span className="text-sm">
                  @{web2UserToken?.twitterUsername}
                </span>
              </A>
            )}
          </div>

          <div className="italic">{web2UserToken?.bio}</div>
        </div>

        <div className="flex space-x-2 p-4 pb-3 overflow-x-scroll md:overflow-auto">
          <button
            className={classNames(
              'h-10 flex justify-center items-center pl-3 pr-4 py-2 border rounded-md text-sm font-semibold',
              {
                'text-brand-blue dark:text-white bg-gray-100 dark:bg-very-dark-blue':
                  TX_TYPES.STAKE_USER === tradeType,
              },
              {
                'text-brand-black dark:text-gray-50': !(
                  TX_TYPES.STAKE_USER === tradeType
                ),
              }
            )}
            onClick={() => {
              setIdeaTokenAmount('0')
              setSelectedTokenAmount('0')
              setTradeType(TX_TYPES.STAKE_USER)
            }}
          >
            <ArrowSmUpIcon className="w-4 h-4 mr-1" />
            <span>Stake</span>
          </button>
          <button
            className={classNames(
              'h-10 flex justify-center items-center pl-3 pr-4 py-2 border rounded-md text-sm font-semibold',
              {
                'text-brand-blue dark:text-white bg-gray-100 dark:bg-very-dark-blue':
                  TX_TYPES.UNSTAKE_USER === tradeType,
              },
              {
                'text-brand-black dark:text-gray-50': !(
                  TX_TYPES.UNSTAKE_USER === tradeType
                ),
              }
            )}
            onClick={() => {
              setIdeaTokenAmount('0')
              setSelectedTokenAmount('0')
              setTradeType(TX_TYPES.UNSTAKE_USER)
            }}
          >
            <ArrowSmDownIcon className="w-4 h-4 mr-1" />
            <span>Unstake</span>
          </button>
        </div>

        <div className="p-4">
          <div className="flex justify-between items-center px-2 pb-1">
            <div>
              You have:{' '}
              {(tradeType === TX_TYPES.STAKE_USER && isTokenBalanceLoading) ||
              (tradeType === TX_TYPES.UNSTAKE_USER && isIdeaTokenBalanceLoading)
                ? '...'
                : parseFloat(
                    tradeType === TX_TYPES.STAKE_USER
                      ? tokenBalance
                      : ideaTokenBalance
                  )}
              {!txManager.isPending && (
                <span
                  className="cursor-pointer text-brand-blue dark:text-blue-400"
                  onClick={maxButtonClicked}
                >
                  {' '}
                  (Max)
                </span>
              )}
            </div>

            <div className="flex justify-between">
              <Tooltip
                className="w-4 h-4 cursor-pointer text-brand-gray-2 dark:text-white"
                IconComponent={CogIcon}
              >
                <div className="w-64">
                  <AdvancedOptions
                    disabled={txManager.isPending || disabled}
                    setIsUnlockOnceChecked={setIsUnlockOnceChecked}
                    isUnlockOnceChecked={isUnlockOnceChecked}
                    isUnlockPermanentChecked={isUnlockPermanentChecked}
                    setIsUnlockPermanentChecked={setIsUnlockPermanentChecked}
                    unlockText={unlockText || 'for trading'}
                  />
                </div>

                <div className="flex-1 mb-3 text-base text-brand-gray-2">
                  <Select
                    className="border-2 border-gray-200 rounded-md text-brand-gray-2 trade-select"
                    isClearable={false}
                    isSearchable={false}
                    isDisabled={txManager.isPending || disabled}
                    onChange={(option: SlippageValue) => {
                      maxSlippage = option.value
                    }}
                    options={slippageValues}
                    defaultValue={slippageValues[0]}
                    theme={(theme) => ({
                      ...theme,
                      borderRadius: 2,
                      colors: {
                        ...theme.colors,
                        primary25: '#d8d8d8', // brand-gray
                        primary: '#0857e0', // brand-blue
                      },
                    })}
                  />
                </div>
              </Tooltip>
            </div>
          </div>

          <StakeUserUIBox
            {...commonProps}
            label={tradeType === TX_TYPES.STAKE_USER ? 'Stake' : 'Unstake'}
            {...(tradeType === TX_TYPES.UNSTAKE_USER
              ? { ...ideaTokenProps }
              : { ...selectedTokenProps })}
          />

          {tradeType === TX_TYPES.STAKE_USER &&
          selectedToken?.address !== NETWORK.getExternalAddresses().imo ? (
            <div className="my-4">
              {selectedTokenAmount} {selectedToken?.symbol} converts to{' '}
              {parseFloat(calculatedIdeaTokenAmount).toFixed(2)} IMO
            </div>
          ) : (
            <div className="my-4"></div>
          )}

          {showTradeButton && (
            <div className="">
              <ApproveButton
                tokenAddress={spendTokenAddress}
                tokenName={spendTokenSymbol}
                spenderAddress={spender}
                requiredAllowance={floatToWeb3BN(
                  requiredAllowance,
                  18,
                  BigNumber.ROUND_UP
                )}
                unlockPermanent={isUnlockPermanentChecked}
                txManager={txManager}
                setIsMissingAllowance={setIsMissingAllowance}
                disable={isApproveButtonDisabled}
                key={approveButtonKey}
                txType={tradeType === TX_TYPES.STAKE_USER ? 'stake' : 'unstake'}
              />
              <div className="mt-4 ">
                <button
                  className={classNames(
                    'py-4 text-lg font-bold rounded-2xl w-full font-sf-compact-medium',
                    isTradeButtonDisabled
                      ? 'text-brand-gray-2 dark:text-gray-300 bg-brand-gray dark:bg-gray-500 cursor-default border-brand-gray'
                      : 'border-brand-blue text-white bg-brand-blue font-medium  hover:bg-blue-800'
                  )}
                  disabled={isTradeButtonDisabled}
                  onClick={onTradeClicked}
                >
                  {tradeType === TX_TYPES.STAKE_USER ? 'Stake' : 'Unstake'}
                </button>
              </div>

              <div className="mt-2 text-xs text-center text-gray-500">
                Confirm transaction in wallet to complete.
              </div>

              <TxPending txManager={txManager} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
