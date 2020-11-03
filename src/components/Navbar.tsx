import { WalletStatus } from 'components'

export default function Navbar({
  setIsWalletModalOpen,
}: {
  setIsWalletModalOpen: (b: boolean) => void
}) {
  return (
    <div
      className="fixed top-0 z-20 grid w-screen py-6 pl-10 pr-4 mx-auto lg:pl-32 bg-top-desktop auto-cols-max"
      style={{ gridTemplateColumns: 'auto 1fr auto' }}
    >
      <div className="flex flex-row items-center">
        <img className="w-8" src="/logo.png" alt="Logo" />
        <h2 className="text-3xl leading-none font-gilroy-bold">IdeaMarkets</h2>
      </div>
      <nav className="hidden md:block">
        <ul className="flex justify-center font-sf-compact-medium">
          <li className="mr-8 text-lg tracking-tighter cursor-pointer">
            Overview
          </li>
          <li className="mr-8 text-lg tracking-normal cursor-pointer text-brand-gray text-opacity-60">
            My Tokens
          </li>
          <li className="mr-8 text-lg tracking-normal cursor-pointer text-brand-gray text-opacity-60">
            My Wallet
          </li>
          <li className="text-lg tracking-normal cursor-pointer text-brand-gray text-opacity-60">
            Launch Token
          </li>
        </ul>
      </nav>
      <WalletStatus setIsWalletModalOpen={setIsWalletModalOpen} />
      <svg
        className="w-6 h-6 ml-auto md:hidden"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    </div>
  )
}
