import Link from 'next/link'
import BrandDiscord from '../assets/brand-discord.svg'
import BrandTwitter from '../assets/brand-twitter.svg'
import BrandGithub from '../assets/brand-github.svg'
import BrandDefiPulse from '../assets/brand-defipulse.svg'

export default function Footer() {
  return (
    <div className="mt-5 md:flex md:justify-between">
      <div className="flex justify-center space-x-5 font-sf-pro-text">
        <Link href="https://docs.ideamarket.io">
          <a className="text-sm leading-none tracking-tightest-2 text-brand-gray-2">
            Need Help?
          </a>
        </Link>
        <Link href="https://docs.ideamarket.io">
          <a className="text-sm leading-none tracking-tightest-2 text-brand-gray-2">
            Contact
          </a>
        </Link>
        <Link href="https://docs.ideamarket.io/legal/terms-of-service">
          <a className="text-sm leading-none tracking-tightest-2 text-brand-gray-2">
            Legal &amp; Privacy
          </a>
        </Link>
      </div>
      <div className="flex items-center justify-center mt-5 space-x-2 md:mt-0 md:justify-end">
        <a href="https://twitter.com/ideamarkets_" target="_blank">
          <BrandTwitter className="w-7 h-7" />
        </a>
        <a href="https://discord.com/invite/zaXZXGE4Ke" target="_blank">
          <BrandDiscord className="w-7 h-7" />
        </a>
        <a href="https://github.com/Ideamarket" target="_blank">
          <BrandGithub className="w-7 h-7" />
        </a>
        <a href="https://defipulse.com/defi-list" target="_blank">
          <BrandDefiPulse stroke="#303030" className="w-7 h-7" />
        </a>
        <p className="pl-2 text-sm leading-none text-center tracking-tightest-2 text-brand-gray-2">
          &copy;2020 IdeaMarkets
        </p>
      </div>
    </div>
  )
}
