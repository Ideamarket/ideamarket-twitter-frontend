module.exports = {
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
        destination: `https://${
          process.env.VERCEL_ENV === 'preview'
            ? process.env.VERCEL_URL
            : 'app.ideamarket.io'
        }/:path*`,
      },
    ]
  },
}
