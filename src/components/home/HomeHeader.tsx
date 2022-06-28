import React from 'react'
import A from 'components/A'
import { ExternalLinkIcon } from '@heroicons/react/outline'

const HomeHeader = () => {
  return (
    <div className="pb-48">
      <div className="px-6 pt-10 text-center text-white font-inter dark:text-gray-200">
        <div>
          {/* <div className="flex flex-wrap justify-center mt-4">
            <div
              className="flex justify-center flex-grow-0 flex-shrink-0 mt-4"
              data-aos="zoom-y-out"
            >
              <A href="https://www.nasdaq.com/articles/ideamarket-is-a-literal-marketplace-for-ideas-and-online-reputation-2021-02-19">
                <div className="relative h-8 opacity-50 w-36">
                  <Image
                    src="/nasdaq.svg"
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
                <div className="relative w-36 h-8 opacity-50">
                  <Image
                    src="/vice.svg"
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
              <A href="https://docs.ideamarket.io/contracts/audit">
                <div className="relative h-8 opacity-50 w-36">
                  <Image
                    src="/quantstamp1.svg"
                    alt="Quantstamp"
                    layout="fill"
                    objectFit="contain"
                    priority={true}
                    className="rounded-full"
                  />
                </div>
              </A>
            </div>
          </div> */}

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
