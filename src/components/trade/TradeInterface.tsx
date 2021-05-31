import { useEffect, useState } from 'react'
import classNames from 'classnames'
import Select from 'react-select'
import { IdeaToken, IdeaMarket } from 'store/ideaMarketsStore'
import { useTokenListStore } from 'store/tokenListStore'
import {
  useBalance,
  useOutputAmount,
  buyToken,
  sellToken,
  useTokenIconURL,
} from 'actions'
import {
  floatToWeb3BN,
  calculateMaxIdeaTokensBuyable,
  formatBigNumber,
  getUniswapDaiOutputSwap,
  useTransactionManager,
} from 'utils'
import { useContractStore } from 'store/contractStore'
import { NETWORK } from 'store/networks'
import BigNumber from 'bignumber.js'
import BN from 'bn.js'
import ApproveButton from './ApproveButton'
import AdvancedOptions from './AdvancedOptions'
import Tooltip from '../tooltip/Tooltip'
import A from 'components/A'
import { getMarketSpecificsByMarketName } from 'store/markets'
import { TradeInterfaceBox } from './components'
import CircleSpinner from 'components/animations/CircleSpinner'
import Settings from '../../assets/settings.svg'

type NewIdeaToken = {
  symbol: string
  logoURL: string
}

type TradeInterfaceProps = {
  ideaToken: IdeaToken
  market: IdeaMarket
  onTradeSuccessful: () => void
  onValuesChanged: (
    ideaTokenAmount: BN,
    tokenAddress: string,
    tokenSymbol: string,
    tokenAmount: BN,
    slippage: number,
    lock: boolean,
    isUnlockOnceChecked: boolean,
    isUnlockPermanentChecked: boolean,
    isValid: boolean
  ) => void
  resetOn: boolean
  centerTypeSelection: boolean
  showTypeSelection: boolean
  showTradeButton: boolean
  disabled: boolean
  bgcolor?: string
  unlockText?: string
  newIdeaToken?: NewIdeaToken | null
}

export default function TradeInterface({
  ideaToken,
  market,
  onTradeSuccessful,
  onValuesChanged,
  resetOn,
  showTradeButton,
  disabled,
  bgcolor,
  unlockText,
  newIdeaToken,
}: TradeInterfaceProps) {
  const [tradeType, setTradeType] = useState('buy')
  const [isLockChecked, setIsLockChecked] = useState(false)
  const [isUnlockOnceChecked, setIsUnlockOnceChecked] = useState(true)
  const [isUnlockPermanentChecked, setIsUnlockPermanentChecked] = useState(
    false
  )

  const tokenList = useTokenListStore((state) => state.tokens)
  const selectTokensValues = tokenList.map((token) => ({
    value: token.address,
    token: token,
  }))

  const [selectedToken, setSelectedToken] = useState(undefined)
  const [
    isIdeaTokenBalanceLoading,
    ideaTokenBalanceBN,
    ideaTokenBalance,
  ] = useBalance(ideaToken?.address, 18)

  const [isTokenBalanceLoading, tokenBalanceBN, tokenBalance] = useBalance(
    selectedToken?.address,
    selectedToken?.decimals
  )

  const [ideaTokenAmount, setIdeaTokenAmount] = useState('0')
  const [isTokenAmountLoading, tokenAmountBN, tokenAmount] = useOutputAmount(
    ideaToken,
    market,
    selectedToken?.address,
    ideaTokenAmount,
    selectedToken?.decimals,
    tradeType
  )

  const exchangeContractAddress = useContractStore(
    (state) => state.exchangeContract
  ).options.address
  const multiActionContractAddress = useContractStore(
    (state) => state.multiActionContract
  ).options.address

  const spender =
    tradeType === 'buy'
      ? selectedToken?.address === NETWORK.getExternalAddresses().dai &&
        !isLockChecked
        ? exchangeContractAddress
        : multiActionContractAddress
      : selectedToken.address !== NETWORK.getExternalAddresses().dai
      ? multiActionContractAddress
      : undefined

  const spendTokenAddress =
    tradeType === 'buy' ? selectedToken?.address : ideaToken.address

  const spendTokenSymbol = tradeType === 'buy' ? selectedToken?.symbol : 'IDT'

  const requiredAllowance =
    tradeType === 'buy' ? tokenAmountBN : floatToWeb3BN(ideaTokenAmount, 18)

  const exceedsBalance =
    tradeType === 'buy'
      ? isTokenBalanceLoading || !tokenAmountBN
        ? false
        : tokenBalanceBN.lt(tokenAmountBN)
      : isIdeaTokenBalanceLoading
      ? false
      : ideaTokenBalanceBN.lt(floatToWeb3BN(ideaTokenAmount, 18))

  const [isMissingAllowance, setIsMissingAllowance] = useState(false)
  const [approveButtonKey, setApproveButtonKey] = useState(0)
  const [isValid, setIsValid] = useState(false)
  const txManager = useTransactionManager()

  let slippage = 0.01
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
    setTradeType('buy')
    setApproveButtonKey(approveButtonKey + 1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetOn])

  useEffect(() => {
    let isValid =
      selectedToken !== undefined &&
      ideaTokenAmount !== '' &&
      tokenAmount !== '' &&
      tokenAmountBN !== undefined &&
      tokenAmountBN.gt(new BN('0')) &&
      floatToWeb3BN(ideaTokenAmount, 18).gt(new BN('0'))

    if (isValid) {
      if (tradeType === 'buy') {
        if (tokenAmountBN.gt(tokenBalanceBN)) {
          isValid = false
        }
      } else {
        if (floatToWeb3BN(ideaTokenAmount, 18).gt(ideaTokenBalanceBN)) {
          isValid = false
        }
      }
    }

    setIsValid(isValid)

    onValuesChanged(
      floatToWeb3BN(ideaTokenAmount, 18),
      selectedToken?.address,
      selectedToken?.symbol,
      tokenAmountBN,
      slippage,
      isLockChecked,
      isUnlockOnceChecked,
      isUnlockPermanentChecked,
      isValid
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    ideaTokenAmount,
    selectedToken,
    tokenAmountBN,
    isLockChecked,
    slippage,
    isUnlockOnceChecked,
    isUnlockPermanentChecked,
  ])

  async function maxButtonClicked() {
    if (tradeType === 'sell') {
      const balanceBN = new BigNumber(ideaTokenBalanceBN.toString())
      setIdeaTokenAmount(
        formatBigNumber(
          balanceBN.div(new BigNumber('10').pow(new BigNumber('18'))),
          18,
          BigNumber.ROUND_DOWN
        )
      )
    } else {
      let balanceAsDai
      if (selectedToken.symbol === 'Dai') {
        balanceAsDai = tokenBalanceBN
      } else {
        balanceAsDai = await getUniswapDaiOutputSwap(
          selectedToken.address,
          tokenBalanceBN
        )
      }
      const buyableBN = calculateMaxIdeaTokensBuyable(
        balanceAsDai,
        ideaToken?.rawSupply || new BN('0'),
        market
      )
      setIdeaTokenAmount(
        formatBigNumber(
          buyableBN.div(new BigNumber('10').pow(new BigNumber('18'))),
          18,
          BigNumber.ROUND_DOWN
        )
      )
    }
  }

  async function onTradeClicked() {
    const name = tradeType === 'buy' ? 'Buy' : 'Sell'
    const func = tradeType === 'buy' ? buyToken : sellToken
    const args =
      tradeType === 'buy'
        ? [
            ideaToken.address,
            selectedToken.address,
            floatToWeb3BN(ideaTokenAmount, 18),
            tokenAmountBN,
            slippage,
            isLockChecked ? 31556952 : 0,
          ]
        : [
            ideaToken.address,
            selectedToken.address,
            floatToWeb3BN(ideaTokenAmount, 18),
            tokenAmountBN,
            slippage,
          ]

    try {
      await txManager.executeTx(name, func, ...args)
    } catch (ex) {
      console.log(ex)
      return
    }

    setApproveButtonKey(approveButtonKey + 1)
    onTradeSuccessful()
  }

  const isTradeButtonDisabled =
    txManager.isPending ||
    !isValid ||
    exceedsBalance ||
    isMissingAllowance ||
    !parseFloat(ideaTokenAmount) ||
    parseFloat(ideaTokenAmount) <= 0.0

  const marketSpecifics = getMarketSpecificsByMarketName(market?.name)
  const { tokenIconURL } = useTokenIconURL({
    marketSpecifics,
    tokenName: ideaToken?.name,
  })

  const commonProps = {
    setIdeaTokenAmount,
    tradeType,
    exceedsBalance,
    tokenAmount,
    disabled,
    market,
    maxButtonClicked,
    setSelectedToken,
    selectTokensValues,
    setTradeType,
    txManager,
  }

  const selectedTokenProps = {
    ideaTokenAmount: isTokenAmountLoading ? '...' : tokenAmount,
    tokenBalance,
    isTokenBalanceLoading,
    selectedIdeaToken: null,
  }

  const selectedIdeaToken = {
    symbol: ideaToken?.name,
    logoURL: tokenIconURL,
  }

  const ideaTokenProps = {
    ideaTokenAmount,
    tokenBalance: ideaTokenBalance,
    isTokenBalanceLoading: isIdeaTokenBalanceLoading,
    selectedIdeaToken: newIdeaToken || selectedIdeaToken,
  }

  return (
    <div>
      <div
        className="p-4 rounded-xl bg-white mx-auto"
        style={{ maxWidth: 550 }}
      >
        <div className="flex justify-between">
          <div />
          <Tooltip
            className="w-4 h-4 cursor-pointer text-brand-gray-4 ml-2 mb-4"
            placement="down"
            IconComponent={Settings}
          >
            <div className="w-32 w-64 mb-2">
              <AdvancedOptions
                disabled={disabled}
                setIsUnlockOnceChecked={setIsUnlockOnceChecked}
                isUnlockOnceChecked={isUnlockOnceChecked}
                isUnlockPermanentChecked={isUnlockPermanentChecked}
                setIsUnlockPermanentChecked={setIsUnlockPermanentChecked}
                unlockText={unlockText || 'for trading'}
              />
            </div>

            <div className="flex-1 mb-3 text-brand-gray-2 text-base">
              <Select
                className="border-2 border-gray-200 rounded-md text-brand-gray-2 trade-select"
                isClearable={false}
                isSearchable={false}
                isDisabled={txManager.isPending || disabled}
                onChange={(option: SlippageValue) => {
                  slippage = option.value
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

        <TradeInterfaceBox
          {...commonProps}
          label="Spend"
          {...(tradeType === 'sell'
            ? { ...ideaTokenProps }
            : { ...selectedTokenProps })}
        />

        <TradeInterfaceBox
          {...commonProps}
          label="Receive"
          showBuySellSwitch={!newIdeaToken}
          {...(tradeType === 'buy'
            ? { ...ideaTokenProps }
            : { ...selectedTokenProps })}
        />

        <div className="flex justify-between my-2 text-xs">
          <div className="ml-5">
            <div
              className={classNames(
                'cursor-pointer flex items-center text-sm',
                tradeType === 'sell' && 'invisible'
              )}
            >
              <input
                type="checkbox"
                className="border-2 border-gray-200 rounded-sm cursor-pointer"
                id="lockCheckbox"
                disabled={txManager.isPending || disabled}
                checked={isLockChecked}
                onChange={(e) => {
                  setIsLockChecked(e.target.checked)
                }}
              />
              <label
                htmlFor="lockCheckbox"
                className={classNames(
                  'ml-2 cursor-pointer',
                  isLockChecked ? 'text-brand-blue' : 'text-gray-500'
                )}
              >
                Lock for 1 year
              </label>
              <Tooltip className="ml-2">
                <div className="w-32 md:w-64">
                  Lock tokens to show your long-term confidence in a listing.
                  You will be unable to sell or withdraw locked tokens for the
                  time period specified.
                  <br />
                  <br />
                  For more information, see{' '}
                  <A
                    href="https://docs.ideamarket.io/user-guide/hiw-buy-and-sell#locking-tokens"
                    target="_blank"
                    className="underline"
                  >
                    locking tokens
                  </A>
                  .
                </div>
              </Tooltip>
            </div>
          </div>
        </div>

        {showTradeButton && (
          <>
            <ApproveButton
              tokenAddress={spendTokenAddress}
              tokenSymbol={spendTokenSymbol}
              spenderAddress={spender}
              requiredAllowance={requiredAllowance}
              unlockPermanent={isUnlockPermanentChecked}
              txManager={txManager}
              setIsMissingAllowance={setIsMissingAllowance}
              disable={
                !isValid ||
                exceedsBalance ||
                !isMissingAllowance ||
                txManager.isPending
              }
              key={approveButtonKey}
            />
            <div className="mt-4 ">
              <button
                className={classNames(
                  'py-4 text-lg font-bold rounded-2xl w-full font-sf-compact-medium',
                  isTradeButtonDisabled
                    ? 'text-brand-gray-2 bg-brand-gray cursor-default border-brand-gray'
                    : 'border-brand-blue text-white bg-brand-blue font-medium  hover:bg-blue-800'
                )}
                disabled={isTradeButtonDisabled}
                onClick={onTradeClicked}
              >
                {tradeType === 'buy' ? 'Buy' : 'Sell'}
              </button>
            </div>
            <div className="text-center text-gray-500 text-xs mt-2">
              Confirm transaction in wallet to complete.
            </div>

            <div
              className={classNames(
                'grid grid-cols-3 my-5 text-sm text-brand-new-dark font-semibold',
                txManager.isPending ? '' : 'hidden'
              )}
            >
              <div className="font-bold justify-self-center">
                {txManager.name}
              </div>
              <div className="justify-self-center">
                <A
                  className={classNames(
                    'underline',
                    txManager.hash === '' ? 'hidden' : ''
                  )}
                  href={NETWORK.getEtherscanTxUrl(txManager.hash)}
                  target="_blank"
                >
                  {txManager.hash.slice(0, 8)}...{txManager.hash.slice(-6)}
                </A>
              </div>
              <div className="justify-self-center">
                <CircleSpinner color="#0857e0" bgcolor={bgcolor} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
