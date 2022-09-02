import router from 'next/router'
import { NETWORK } from 'store/networks'

export const getNavbarConfig = (user: any) => ({
  menu: [
    {
      name: 'About',
      subMenu: [
        {
          id: 1,
          name: 'Easy Setup',
          onClick: () => {
            window.open('https://docs.ideamarket.io/easy-setup', '_blank')
          },
        },
        {
          id: 2,
          name: 'Docs',
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
          name: 'Add $IMO to Metamask',
          onClick: async () => {
            try {
              const { ethereum } = window as any
              await ethereum.request({
                method: 'wallet_watchAsset',
                params: {
                  type: 'ERC20',
                  options: {
                    address: NETWORK.getExternalAddresses().imo,
                    symbol: `IMO`,
                    decimals: 18,
                    image: 'https://ideamarket.io/imo-logo.png',
                  },
                },
              })
            } catch (ex) {
              // We don't handle that error for now
              // Might be a different wallet than Metmask
              // or user declined
              console.log(ex)
            }
          },
        },
        {
          id: 3,
          name: 'Token Address',
          onClick: () => {
            window.open(
              'https://arbiscan.io/address/0xB41bd4C99dA73510d9e081C5FADBE7A27Ac1F814',
              '_blank'
            )
          },
        },
        {
          id: 4,
          name: 'Unstake from old version',
          onClick: () => router.push('/stake'),
        },
      ],
    },
  ],
})
