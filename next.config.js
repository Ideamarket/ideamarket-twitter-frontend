const withPWA = require('next-pwa')
const { withSentryConfig } = require('@sentry/nextjs')

const SentryWebpackPluginOptions = {
  silent: true, // Suppresses all logs
}

const moduleExports = withPWA({
  pwa: {
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
  },
  images: {
    domains: [
      'd3hjr60szea5ud.cloudfront.net',
      'app.ideamarket.io',
      'ideamarket.io',
      'raw.githubusercontent.com',
    ],
  },
  async redirects() {
    return [
      /*{
        source: '/',
        destination: '/backSoon',
        permanent: false,
      },
      {
        source: '/account',
        destination: '/backSoon',
        permanent: false,
      },
      {
        source: '/i/:path*',
        destination: '/backSoon',
        permanent: false,
      },
      {
        source: '/m/:path*',
        destination: '/backSoon',
        permanent: false,
      },*/
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

// Make sure adding Sentry options is the last code to run before exporting, to
// ensure that your source maps include changes from all other Webpack plugins
module.exports = withSentryConfig(moduleExports, SentryWebpackPluginOptions)
