import React from 'react'
import A from 'components/A'
import { ExternalLinkIcon } from '@heroicons/react/outline'
import RateUI from 'modules/ratings/components/RateUI'
import { useQuery } from 'react-query'
import { getPostByTokenID } from 'modules/posts/services/PostService'

const HomeHeader = () => {
  const { data: imPost } = useQuery(['single-post'], () =>
    getPostByTokenID({ tokenID: '2' })
  )

  return (
    <div className="pb-48">
      {/* Desktop and tablet */}
      <div className="hidden md:flex space-x-10 max-w-304 md:mx-auto md:px-4">
        <div className="w-[55%] pt-14 text-center text-white text-right font-inter dark:text-gray-200">
          <h2 className="text-3xl lg:text-6xl font-gilroy-bold">
            The world's opinions,{' '}
            <span className="inline-block text-brand-blue"> on chain.</span>
          </h2>

          <p className="mt-8 text-sm md:text-lg">
            <span className="inline-block mr-1">
              Express your opinion on-chain
            </span>
            <span className="inline-block mr-1">
              and give overlooked information the credibility it deserves.{' '}
            </span>
            <A
              href="https://docs.ideamarket.io"
              className="underline inline-block hover:text-brand-blue opacity-60 cursor-pointer"
            >
              <span>How it Works</span>
              <ExternalLinkIcon className="w-5 inline ml-1 mb-1" />
            </A>
          </p>
        </div>

        <div className="w-[45%] pt-14 justify-self-end">
          <RateUI imPost={imPost} isFullyFunctional={false} />
        </div>
      </div>

      {/* Mobile */}
      <div className="md:hidden px-6 pt-10 text-center text-white font-inter dark:text-gray-200">
        <div>
          <h2 className="mt-8 text-3xl md:text-6xl font-gilroy-bold">
            The world's opinions,
            <span className="text-brand-blue"> on chain.</span>
          </h2>

          <p className="mt-8 md:px-28 text-sm md:text-lg">
            <span className="inline-block mr-1">
              Express your opinion on-chain
            </span>
            <span className="inline-block mr-1">
              and give overlooked information the credibility it deserves.{' '}
            </span>
            <A
              href="https://docs.ideamarket.io"
              className="underline inline-block hover:text-brand-blue opacity-60 cursor-pointer"
            >
              <span>How it Works</span>
              <ExternalLinkIcon className="w-5 inline ml-1 mb-1" />
            </A>
          </p>
        </div>
      </div>
    </div>
  )
}

export default HomeHeader
