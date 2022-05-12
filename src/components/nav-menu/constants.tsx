import { ChevronRightIcon } from '@heroicons/react/outline'
import router from 'next/router'
import { AIRDROP_TYPES } from 'types/airdropTypes'

export const getNavbarConfig = (user: any) => ({
  menu: [
    {
      name: 'Start',
      subMenu: [
        {
          id: 1,
          name: 'User Tutorial',
          onClick: () => {
            window.open(
              'https://docs.ideamarket.io/user-guide/tutorial',
              '_blank'
            )
          },
        },
        {
          id: 2,
          name: 'Whitepaper',
          onClick: () => {
            window.open('https://docs.ideamarket.io/', '_blank')
          },
        },
        {
          id: 3,
          name: 'Buy Arb-ETH with credit/debit',
          onClick: () => {
            window.open('https://arbitrum.banxa.com', '_blank')
          },
        },
        // {
        //   name: 'Browser Extension',
        //   onClick: () => {
        //     window.open(
        //       'https://chrome.google.com/webstore/detail/ideamarket/hgpemhabnkecancnpcdilfojngkoahei',
        //       '_blank'
        //     )
        //   },
        // },
      ],
    },
    {
      name: 'Community',
      subMenu: [
        {
          id: 1,
          name: 'Discord',
          onClick: () =>
            window.open('https://discord.com/invite/zaXZXGE4Ke', '_blank'),
        },
        {
          id: 2,
          name: 'Twitter',
          onClick: () =>
            window.open('https://twitter.com/ideamarket_io', '_blank'),
        },
        {
          id: 3,
          name: 'Swag Shop',
          onClick: () => {
            window.open('https://ideamarket-io.myshopify.com', '_blank')
          },
        },
      ],
    },
    {
      name: '$IMO',
      subMenu: [
        {
          id: 1,
          name: <b>Buy IMO on SushiSwap</b>,
          onClick: () => {
            window.open(
              'https://app.sushi.com/swap?inputCurrency=ETH&outputCurrency=0xB41bd4C99dA73510d9e081C5FADBE7A27Ac1F814',
              '_blank'
            )
          },
        },
        {
          id: 2,
          name: 'Token Address',
          onClick: () => {
            window.open(
              'https://arbiscan.io/address/0xB41bd4C99dA73510d9e081C5FADBE7A27Ac1F814',
              '_blank'
            )
          },
        },
        {
          id: 3,
          onClick: () => null,
          name: (
            <div className="flex justify-between items-center w-full">
              <span>Claim</span>
              <ChevronRightIcon className="w-4" />
            </div>
          ),
          subSubMenu: [
            {
              name: 'Early User Airdrop Claim',
              onClick: () => router.push(`/claim/${AIRDROP_TYPES.USER}`),
            },
            {
              name: 'Community Airdrop Claim',
              onClick: () => router.push(`/claim/${AIRDROP_TYPES.COMMUNITY}`),
            },
            {
              name: 'Twitter Verification Airdrop Claim',
              onClick: () =>
                router.push(`/claim/${AIRDROP_TYPES.TWITTER_VERIFICATION}`),
            },
            {
              name: 'First Month Locking Claim',
              onClick: () => router.push(`/claim/${AIRDROP_TYPES.LOCKING}`),
            },
            {
              name: 'Second Month Locking Claim',
              onClick: () => router.push(`/claim/${AIRDROP_TYPES.LOCKING2}`),
            },
            {
              name: 'Third Month Locking Claim',
              onClick: () => router.push(`/claim/${AIRDROP_TYPES.LOCKING3}`),
            },
          ],
        },
        {
          id: 4,
          name: 'Stake',
          onClick: () => router.push('/stake'),
        },
      ],
    },
  ],
})
