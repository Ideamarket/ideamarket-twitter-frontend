import Link from 'next/link'

export default function Footer() {
  return (
    <div className="md:flex">
      <div className="flex justify-center mt-10 space-x-5 font-sf-pro-text">
        <Link href="/help#need-help">
          <a className="text-sm leading-none tracking-tightest-2 text-brand-gray-2">
            Need Help?
          </a>
        </Link>
        <Link href="/help#contact">
          <a className="text-sm leading-none tracking-tightest-2 text-brand-gray-2">
            Contact
          </a>
        </Link>
        <Link href="/help#legal-and-privacy">
          <a className="text-sm leading-none tracking-tightest-2 text-brand-gray-2">
            Legal &amp; Privacy
          </a>
        </Link>
      </div>
      <p className="mt-5 text-sm leading-none text-center md:ml-auto md:mt-10 tracking-tightest-2 text-brand-gray-2">
        &copy;2020 IdeaMarkets
      </p>
    </div>
  )
}
