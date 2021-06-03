import classNames from 'classnames'
import Metamask from '../../assets/metamask.svg'
import { IdeaToken } from 'store/ideaMarketsStore'
import { useWalletStore } from 'store/walletStore'

export default function AddToMetamaskButton({ token }: { token: IdeaToken }) {
  const web3 = useWalletStore((state) => state.web3)
  const disabled = !web3 || !token

  async function onClick(e) {
    e.stopPropagation()

    try {
      const { ethereum } = window as any
      await ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: token.address,
            symbol: `IDT`,
            decimals: 18,
            image: 'https://app.ideamarket.io/logo.png',
          },
        },
      })
    } catch (ex) {
      // We don't handle that error for now
      // Might be a different wallet than Metmask
      // or user declined
      console.log(ex)
    }
  }

  return (
    <>
      <button
        className={classNames(
          'md:hidden px-1 h-12 text-base font-medium text-center border-2 rounded-lg md:w-44 tracking-tightest-2 font-sf-compact-medium',
          disabled
            ? 'text-brand-gray-2 border-brand-gray-2 cursor-default'
            : 'text-brand-gray-2 border-brand-gray-2 hover:text-white border-brand-blue hover:bg-brand-blue'
        )}
        onClick={onClick}
        disabled={disabled}
      >
        <div className="flex items-center text-sm">
          <Metamask className="w-6 h-6" />
          Add to Metamask
        </div>
      </button>

      <span
        className="hidden md:block text-brand-gray-2 underline"
        onClick={onClick}
      >
        Add to Metamask
      </span>
    </>
  )
}
