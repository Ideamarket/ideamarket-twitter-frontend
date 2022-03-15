import withPWA from 'next-pwa'
import runtimeCaching from "next-pwa/cache.js"

const moduleExports = withPWA({
  outputFileTracing: false,
  publicRuntimeConfig: {
    MIX_PANEL_KEY: process.env.MIX_PANEL_KEY,
  },
  pwa: {
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
    runtimeCaching,
    buildExcludes: [/middleware-manifest\.json$/]
  },
  images: {
    domains: [
      'd38ccjc81jdg6l.cloudfront.net',
      'app.ideamarket.io',
      'ideamarket.io',
      'raw.githubusercontent.com',
      'd37wda20o7ykez.cloudfront.net',
      'zapper.fi',
      'etherscan.io',
      'cryptologos.cc',
    ],
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'attn.to',
          },
        ],
        permanent: true,
        destination: 'https://app.ideamarket.io/:path*',
      },
      {
        source: '/',
        has: [
          {
            type: 'host',
            value: 'attn.to',
          },
        ],
        permanent: true,
        destination: 'https://app.ideamarket.io',
      },
      {
        source: '/m',
        permanent: true,
        destination: '/',
      },
      {
        source: '/discord',
        destination: 'https://discord.gg/TPTHvutjnc',
        permanent: true,
      },
    ]
  },
})

export default moduleExports
