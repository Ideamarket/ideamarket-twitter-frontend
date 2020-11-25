import { Sidebar } from 'components'
import { SidebarItemType } from 'components/sidebar'
import { useState } from 'react'
import ChevronDoubleRight from '../assets/chevron-double-right.svg'

export default function Help() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const items: SidebarItemType[] = [
    {
      title: 'HOW IT WORKS',
      value: 'how-it-works',
      subItems: [
        {
          title: 'Overview',
          value: 'how-it-works-overview',
        },
        {
          title: 'Buy and sell',
          value: 'how-it-works-buy-and-sell',
        },
        {
          title: 'Add new listings',
          value: 'how-it-works-add-new-listings',
        },
        {
          title: 'Price history and details',
          value: 'how-it-works-details',
        },
        {
          title: 'Market-curated endowments',
          value: 'how-it-works-endowments',
        },
        {
          title: 'Market types',
          value: 'how-it-works-market-types',
        },
      ],
    },
    {
      title: 'FAQ',
      value: 'faq',
      subItems: [],
    },
    {
      title: 'PHILOSOPHY',
      value: 'philosophy',
      subItems: [],
    },
  ]

  return (
    <>
      <div className="fixed m-1 rounded bg-top-mobile md:hidden">
        <button
          onClick={() => setSidebarOpen(true)}
          className="inline-flex items-center justify-center w-10 h-10 text-gray-500 transition duration-150 ease-in-out rounded-md hover:text-gray-900 focus:outline-none focus:bg-gray-200"
          aria-label="Open sidebar"
        >
          <ChevronDoubleRight className="w-6 h-6 text-white" />
        </button>
      </div>
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        items={items}
      />

      <div className="px-6 prose-lg md:px-12 lg:px-16 xl:px-24 md:ml-64">
        <div id="how-it-works">
          <h2>1. HOW IT WORKS</h2>
          <p>
            Ideamarket uses markets to permanently change the incentives of
            content curation. In the process, Ideamarket establishes a new
            passive income stream for creators, without the conflicts of
            interest attendant to ads, subscriptions, donations, and other
            common business models.
          </p>
        </div>
        <div id="how-it-works-overview">
          <h3>Overview</h3>
          <p>
            Ideamarket lists Twitter accounts on an exchange. To increase an
            account’s rank, buy upvotes. Upvotes bought later cost more.
            <br />
            <br />
            Token price and supply are managed by a bonding curve. The first
            1,000 tokens for each listing cost $0.10 each. Price increases by
            $0.01 for each 100 tokens minted thereafter.
            <br />
            <br />
            Like reddit, with a profit motive (“buy low, sell high”).
          </p>
          <div className="flex justify-center">
            <img
              src="/how-it-works-listings.png"
              style={{ maxWidth: '800px' }}
              className="rounded"
            />
          </div>
          <p>
            Money spent on upvotes is held in a decentralized lending protocol (
            <a
              href="https://compound.finance"
              target="_blank"
              className="underline"
            >
              compound.finance
            </a>
            ). Compound lends these deposits to borrowers, who pay interest
            (usually 1-10% annually).
          </p>
          <div className="flex justify-center">
            <img
              src="/how-it-works-deposits.png"
              style={{ maxWidth: '800px' }}
              className="rounded"
            />
          </div>
          <p>
            All interest generated by upvote deposits is paid to the owner of
            the upvoted account.
          </p>
          <div className="flex justify-center">
            <img
              src="/how-it-works-income.png"
              style={{ maxWidth: '800px' }}
              className="rounded"
            />
          </div>
          <p>
            <strong>
              Ideamarket is a new passive income stream for creators — no new
              work needed.
            </strong>
          </p>
        </div>
        <div id="how-it-works-buy-and-sell">
          <h3>Buy and sell</h3>
          <p>Buy and sell tokens at any time.</p>
        </div>
        <div id="how-it-works-add-new-listings">
          <h3>Add new listings</h3>
          <p>
            Anyone can add new listings.
            <br />
            If you add an account owned by someone who doesn’t know about
            Ideamarket, interest will accrue to his wallet anyway, and he can
            claim it anytime.
          </p>
        </div>
        <div id="how-it-works-details">
          <h3>View price history and details</h3>
          <p>Click each listing to open its listing page.</p>
          <div className="flex justify-center">
            <img
              src="/how-it-works-details.png"
              style={{ maxWidth: '800px' }}
              className="rounded border border-gray-200 p-1"
            />
          </div>
        </div>
        <div id="how-it-works-endowments">
          <h3>Market-curated endowments</h3>
          <p>
            Ideamarket listings are “market-curated endowments” in the sense
            that:
          </p>
          <ul style={{ listStyle: 'square inside' }}>
            <li>
              The principal is determined by <strong>market confidence</strong>
            </li>
            <li>
              The principal <strong>generates income</strong>, like an
              endowment, for the listing owner via{' '}
              <a
                href="https://compound.finance"
                target="_blank"
                className="underline"
              >
                compound.finance
              </a>
            </li>
          </ul>
          <div className="flex justify-center">
            <img
              src="/how-it-works-endowments.png"
              style={{ maxWidth: '800px' }}
              className="rounded"
            />
          </div>
        </div>
        <div id="how-it-works-market-types">
          <h3>Market types</h3>
          <p>
            <strong>Twitter</strong>
            <br />
            <br />
            Before Ideamarket:
          </p>
          <ul style={{ listStyle: 'square inside' }}>
            <li>
              If you have a large audience, you can only make money by selling
              products or shilling affiliate links
            </li>
            <li>
              If you discover a great account before it gets popular, nobody
              cares, and you can’t make any money
            </li>
          </ul>
          <p>After Ideamarket:</p>
          <ul style={{ listStyle: 'square inside' }}>
            <li>
              If your audience finds your content worthwhile, they will buy your
              token. Therefore, if you have a large audience, list your account
              on Ideamarket to create a passive income stream instantly, with no
              extra effort — just keep doing what you do.{' '}
            </li>
            <li>
              If you discover a great account before it gets popular, list it on
              Ideamarket and make money as others come to agree with your
              judgment
            </li>
          </ul>
        </div>
        <div id="faq">
          <h2>2. FAQ</h2>
        </div>
        <div id="faq-prediction-market">
          <h3>Is Ideamarket a prediction market?</h3>
          <p>
            Ideamarket is not a prediction market.
            <br />
            <br />
            On a prediction market:
          </p>
          <ul style={{ listStyle: 'square inside' }}>
            <li>Winners and losers are decided by specific events</li>
            <li>The market closes at a certain moment</li>
            <li>An oracle reports what’s “true”</li>
          </ul>
          <p>Ideamarket is like a commodity market:</p>
          <ul style={{ listStyle: 'square inside' }}>
            <li>Winners and losers are decided by market cycles</li>
            <li>The market never closes — it’s perpetual</li>
            <li>
              There’s no oracle or “source of truth." Instead, the market
              aggregates its participants’ subjective judgments from moment to
              moment
            </li>
          </ul>
        </div>
        <div id="faq-prediction-manipulation">
          <h3>Can’t [a rich person] manipulate the market?</h3>
          <p>
            Ideamarket is superior to typical markets in that{' '}
            <strong>listings can only be manipulated upwards</strong>.<br />
            This is because rank is determined by each token’s circulating
            supply. A short-seller would need to borrow tokens in order to
            short-sell them, and borrowing them would require minting them —
            increasing the circulating supply.
            <strong>
              Thus, short-selling is technically impossible on Ideamarket
            </strong>
            .<br />
            Like any existing market, there’s nothing explicitly preventing a
            rich person from inflating a listing’s capitalization. But no amount
            of money can artificially reduce the ranking of a listing they don’t
            like.
          </p>
        </div>
        <div id="faq-prediction-get-listed">
          <h3>What do I need to get listed?</h3>
          <p>Listing new accounts is completely trustless.</p>
        </div>
        <div id="faq-prediction-owning-vs-listing">
          <h3>Is a ‘listing owner’ the same as a ‘listing submitter’?</h3>
          <p>
            No. You can add @naval’s twitter account as a listing to the Twitter
            market, but only Naval can claim ownership of the interest that
            accrues to his account. He can do this by clicking “Verify” at the
            bottom of his token’s Listing Page.
          </p>
        </div>
        <div id="faq-prediction-claim-interest">
          <h3>How do I claim the interest I’ve earned as a listing owner?</h3>
          <p>
            Different listing types require different verification processes.
          </p>
          <ul style={{ listStyle: 'square inside' }}>
            <li>
              For Twitter accounts, we’ll ask you to tweet a code to confirm
              account ownership
            </li>
            <li>
              For websites, we will invite you to add a TXT record to your DNS
              settings to verify you own the domain named by the token. When
              this is done, you will be granted permanent ownership of the
              wallet to which your interest accrues
            </li>
            <li>Etc.</li>
          </ul>
        </div>
        <div id="faq-prediction-special-rights">
          <h3>Do listings/votes provide any special rights?</h3>
          <p>
            The only purpose of listings and votes is curation. Buying votes
            does not entitle the buyer to any part of the listing owner’s
            profits, nor any other privileges. Ideamarket operates completely
            independent of listed accounts and assets, and there should never be
            any expectation otherwise.
          </p>
        </div>
        <div id="faq-prediction-interest-rate">
          <h3>What determines the interest rate?</h3>
          <p>
            The interest rate on deposits depends on the current interest rate
            provided by{' '}
            <a
              href="https://compound.finance"
              target="_blank"
              className="underline"
            >
              compound.finance
            </a>
            . Check it out at{' '}
            <a href="https://loanscan.io" target="_blank" className="underline">
              loanscan.io
            </a>{' '}
            under “Earn Yield” —&gt; DAI/Compound.
          </p>
        </div>
        <div id="philosophy">
          <h2>3. PHILOSOPHY</h2>
          <p>
            Ideamarket’s founding goal is to curate information sources without
            a centralized third party to offer a stamp of legitimacy (a
            mainstream media organization, for example). If Ideamarket becomes
            the new “arbiter of credibility,” replacing corporate anointment
            with public skin-in-the-game, it becomes more profitable to earn
            trust than to fake it. Genuinely trusted voices attain a high rank
            "for free" as their audience buys upvotes out of sincere belief and
            self-interest, while fake voices must pay out of pocket. Over time,
            market cycles shake out both the deceivers and the deceived.
          </p>
          <div className="flex justify-center">
            <img
              src="/how-it-works-philosophy.png"
              style={{ maxWidth: '800px' }}
              className="rounded"
            />
          </div>
          <p>
            Read more about our philosophy at{' '}
            <a
              href="https://ideamarket.io/#philosophy"
              target="_blank"
              className="underline"
            >
              ideamarket.io
            </a>
          </p>
        </div>
      </div>
    </>
  )
}
