if (!self.define) {
  let e,
    i = {}
  const n = (n, s) => (
    (n = new URL(n + '.js', s).href),
    i[n] ||
      new Promise((i) => {
        if ('document' in self) {
          const e = document.createElement('script')
          ;(e.src = n), (e.onload = i), document.head.appendChild(e)
        } else (e = n), importScripts(n), i()
      }).then(() => {
        let e = i[n]
        if (!e) throw new Error(`Module ${n} didn’t register its module`)
        return e
      })
  )
  self.define = (s, a) => {
    const c =
      e ||
      ('document' in self ? document.currentScript.src : '') ||
      location.href
    if (i[c]) return
    let r = {}
    const t = (e) => n(e, c),
      o = { module: { uri: c }, exports: r, require: t }
    i[c] = Promise.all(s.map((e) => o[e] || t(e))).then((e) => (a(...e), r))
  }
}
define(['./workbox-1846d813'], function (e) {
  'use strict'
  importScripts(),
    self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        { url: '/1Emoji.png', revision: 'a2d3d07b9353558bd27422826fa564c4' },
        { url: '/2Emoji.png', revision: 'ea198413b331158c88f5c23a585b78aa' },
        { url: '/3Emoji.png', revision: '0774ff14f0171254c8b9b09d3bd2d0c8' },
        { url: '/4Emoji.png', revision: '9c65b94d3a8cf69730b8b5b605bbccce' },
        { url: '/5Emoji.png', revision: 'cd255861692d59607f9ddc2238bc02ce' },
        { url: '/6Emoji.png', revision: 'ca09eecd9c0837c309269e98809e5e34' },
        { url: '/7Emoji.png', revision: 'ba047bb3d67fd7d813a4efb7b124da4d' },
        { url: '/8Emoji.png', revision: '803f4ed808333e38f31db1b273cbd83d' },
        { url: '/9Emoji.png', revision: '982367a5fc2ba5f80ea250f9fa93b843' },
        {
          url: '/MaintenanceBg.svg',
          revision: '3584869500d0f6324afea91700e046e2',
        },
        {
          url: '/MaintenancePanelBg.svg',
          revision: '3722eb78f3adaca41e32640ff2fa5a7b',
        },
        {
          url: '/Quantstamp.svg',
          revision: 'c33eb5a599bccbabe1bc15c8604a5a89',
        },
        {
          url: '/SortingSliderBg.png',
          revision: 'da37830eba10567d6f48180802de291e',
        },
        { url: '/TOS.pdf', revision: '9cc50a67eec3ebe93dce3b42dd6afbb0' },
        {
          url: '/_next/static/chunks/204-8832df74b5c76c0f.js',
          revision: 'ziWxNz680GGBVi6WjLhan',
        },
        {
          url: '/_next/static/chunks/29107295-1494f237b9e407ad.js',
          revision: 'ziWxNz680GGBVi6WjLhan',
        },
        {
          url: '/_next/static/chunks/421-39246c2b8907b29a.js',
          revision: 'ziWxNz680GGBVi6WjLhan',
        },
        {
          url: '/_next/static/chunks/524-d38c2bf00282666a.js',
          revision: 'ziWxNz680GGBVi6WjLhan',
        },
        {
          url: '/_next/static/chunks/55a21ef8.fe0eae85a93a72e6.js',
          revision: 'ziWxNz680GGBVi6WjLhan',
        },
        {
          url: '/_next/static/chunks/563.fbd5f4f9151f8110.js',
          revision: 'ziWxNz680GGBVi6WjLhan',
        },
        {
          url: '/_next/static/chunks/602.97c4cbfe825eedd5.js',
          revision: 'ziWxNz680GGBVi6WjLhan',
        },
        {
          url: '/_next/static/chunks/629-577fd70b0c71874f.js',
          revision: 'ziWxNz680GGBVi6WjLhan',
        },
        {
          url: '/_next/static/chunks/647.0a405c594934f31e.js',
          revision: 'ziWxNz680GGBVi6WjLhan',
        },
        {
          url: '/_next/static/chunks/651.c1e427124570bea0.js',
          revision: 'ziWxNz680GGBVi6WjLhan',
        },
        {
          url: '/_next/static/chunks/769.02055c97e7f46833.js',
          revision: 'ziWxNz680GGBVi6WjLhan',
        },
        {
          url: '/_next/static/chunks/78e521c3-bc8bee333c1c34e3.js',
          revision: 'ziWxNz680GGBVi6WjLhan',
        },
        {
          url: '/_next/static/chunks/952.f00023a61ef9089b.js',
          revision: 'ziWxNz680GGBVi6WjLhan',
        },
        {
          url: '/_next/static/chunks/983.562e79a21ebb1c1f.js',
          revision: 'ziWxNz680GGBVi6WjLhan',
        },
        {
          url: '/_next/static/chunks/d7eeaac4-348e9190db38e925.js',
          revision: 'ziWxNz680GGBVi6WjLhan',
        },
        {
          url: '/_next/static/chunks/framework-bf01da2450ef78f3.js',
          revision: 'ziWxNz680GGBVi6WjLhan',
        },
        {
          url: '/_next/static/chunks/main-c7353bceb10c52b6.js',
          revision: 'ziWxNz680GGBVi6WjLhan',
        },
        {
          url: '/_next/static/chunks/pages/_error-f1d3777a8ae6f594.js',
          revision: 'ziWxNz680GGBVi6WjLhan',
        },
        {
          url: '/_next/static/chunks/pages/account-fa13f7253942f76d.js',
          revision: 'ziWxNz680GGBVi6WjLhan',
        },
        {
          url: '/_next/static/chunks/pages/backSoon-7cab0019ae409afa.js',
          revision: 'ziWxNz680GGBVi6WjLhan',
        },
        {
          url: '/_next/static/chunks/pages/bridge-82b13c7784518909.js',
          revision: 'ziWxNz680GGBVi6WjLhan',
        },
        {
          url: '/_next/static/chunks/pages/claim/%5BairdropType%5D-495311b9fe72603d.js',
          revision: 'ziWxNz680GGBVi6WjLhan',
        },
        {
          url: '/_next/static/chunks/pages/claim/%5BairdropType%5D/dashboard-0a2bba334714e141.js',
          revision: 'ziWxNz680GGBVi6WjLhan',
        },
        {
          url: '/_next/static/chunks/pages/embed-def22cdbcbead13a.js',
          revision: 'ziWxNz680GGBVi6WjLhan',
        },
        {
          url: '/_next/static/chunks/pages/i/%5BtokenId%5D-5b38b1c271dd1e65.js',
          revision: 'ziWxNz680GGBVi6WjLhan',
        },
        {
          url: '/_next/static/chunks/pages/i/%5BtokenId%5D/%5BtokenName%5D-6f8f3c79606cf2b8.js',
          revision: 'ziWxNz680GGBVi6WjLhan',
        },
        {
          url: '/_next/static/chunks/pages/iframe/%5BmarketName%5D/%5BtokenName%5D-5e7348afb94aa8a3.js',
          revision: 'ziWxNz680GGBVi6WjLhan',
        },
        {
          url: '/_next/static/chunks/pages/index-406710c5ebb5bc47.js',
          revision: 'ziWxNz680GGBVi6WjLhan',
        },
        {
          url: '/_next/static/chunks/pages/m/%5Bmarkets%5D-4d95192d7f8a6ce0.js',
          revision: 'ziWxNz680GGBVi6WjLhan',
        },
        {
          url: '/_next/static/chunks/pages/r/L/%5BmarketID%5D/%5BtokenID%5D-0ecd9d5f5523c81b.js',
          revision: 'ziWxNz680GGBVi6WjLhan',
        },
        {
          url: '/_next/static/chunks/pages/stake-0f01c260f3968549.js',
          revision: 'ziWxNz680GGBVi6WjLhan',
        },
        {
          url: '/_next/static/chunks/pages/u/%5Busername%5D-0c15bdf96de0ff7d.js',
          revision: 'ziWxNz680GGBVi6WjLhan',
        },
        {
          url: '/_next/static/chunks/polyfills-5cd94c89d3acac5f.js',
          revision: 'ziWxNz680GGBVi6WjLhan',
        },
        {
          url: '/_next/static/chunks/webpack-3a86671dfad4970e.js',
          revision: 'ziWxNz680GGBVi6WjLhan',
        },
        {
          url: '/_next/static/css/9c81227c80a3db76.css',
          revision: 'ziWxNz680GGBVi6WjLhan',
        },
        {
          url: '/_next/static/css/f63802154ef558ff.css',
          revision: 'ziWxNz680GGBVi6WjLhan',
        },
        {
          url: '/_next/static/media/Gilroy-Bold.469a185d.woff',
          revision: 'ziWxNz680GGBVi6WjLhan',
        },
        {
          url: '/_next/static/media/Inter-Regular.9bdeb83a.woff',
          revision: 'ziWxNz680GGBVi6WjLhan',
        },
        {
          url: '/_next/static/media/sf-compact-display-medium-5864711817c30.302dd65a.woff',
          revision: 'ziWxNz680GGBVi6WjLhan',
        },
        {
          url: '/_next/static/ziWxNz680GGBVi6WjLhan/_buildManifest.js',
          revision: 'ziWxNz680GGBVi6WjLhan',
        },
        {
          url: '/_next/static/ziWxNz680GGBVi6WjLhan/_middlewareManifest.js',
          revision: 'ziWxNz680GGBVi6WjLhan',
        },
        {
          url: '/_next/static/ziWxNz680GGBVi6WjLhan/_ssgManifest.js',
          revision: 'ziWxNz680GGBVi6WjLhan',
        },
        {
          url: '/arrow-dark.svg',
          revision: '10d2f90c61cb3c43a2aa2473c6d7563a',
        },
        { url: '/arrow@3x.png', revision: '771d31fd9e0ffb58cf92c902f25885aa' },
        { url: '/avatar.png', revision: '7f95801efc1c9a3734d2277b61fb2fb9' },
        {
          url: '/checkmark-green.svg',
          revision: 'd87246b58a5a135de16057b5a4ffd658',
        },
        {
          url: '/claim-imo-bg.png',
          revision: '9b69474d558215fde94405f573593d82',
        },
        {
          url: '/claim-success-1.png',
          revision: '9f654bae71b7cc116dcc94f111f69169',
        },
        {
          url: '/claim-success-2.png',
          revision: '7ede9fc10c10262bc2319e0971371190',
        },
        {
          url: '/claim-success-3.png',
          revision: '2740c17842a1d1ffb83b0fa9eaa6fd5c',
        },
        {
          url: '/coindesk-white.png',
          revision: '07e17d8574f063a4e0a77d1f6922c2d1',
        },
        { url: '/coindesk.png', revision: 'b3d807fa49498e12554ec5fbc6e2217b' },
        { url: '/ethereum.png', revision: '115a0ca75d2e28a8a73bf7d32d948e5d' },
        { url: '/favicon.ico', revision: '21b739d43fcb9bbb83d8541fe4fe88fa' },
        { url: '/gray.svg', revision: 'b51631709fd37feb8cf1eb69ceeeba04' },
        {
          url: '/how-it-works-deposits.png',
          revision: '2dfd5874f96441c903ad5cea1530e67c',
        },
        {
          url: '/how-it-works-details.png',
          revision: '5bf562b550a619da436ea6c4387e4888',
        },
        {
          url: '/how-it-works-endowments.png',
          revision: '2f812f8d5604453d0e5e906453630eb7',
        },
        {
          url: '/how-it-works-income.png',
          revision: '6ab3433b966791dbf7b9590734a0754c',
        },
        {
          url: '/how-it-works-listings.png',
          revision: 'd362b93514c2e97c035c6947f213b27f',
        },
        {
          url: '/how-it-works-philosophy.png',
          revision: 'b112fded8aa6ddb5bd424152a3eeb912',
        },
        {
          url: '/icons/icon-192x192-iphone.png',
          revision: '4b4219b71d957feea3cb84c75a4fcd50',
        },
        {
          url: '/icons/icon-192x192.png',
          revision: '43772cdd08d6f48f6edb366b959e1af6',
        },
        {
          url: '/icons/icon-256x256-iphone.png',
          revision: 'e0bcb475be379ff35cc6a54865ed6afa',
        },
        {
          url: '/icons/icon-256x256.png',
          revision: '003f1a4fc09c66a84dde83856694cc7f',
        },
        {
          url: '/icons/icon-384x384.png',
          revision: '095a8484e6e7c4f650e1f63892cf1b96',
        },
        {
          url: '/icons/icon-512x512.png',
          revision: '1558f144fdde4b3a28feb4e37c035967',
        },
        {
          url: '/icons/maskable_icon.png',
          revision: '1558f144fdde4b3a28feb4e37c035967',
        },
        {
          url: '/ideamarket.svg',
          revision: 'fbbd7a95d7762530e70dfb91b448f28d',
        },
        { url: '/imo-logo.png', revision: 'a0a7d4b9184cd7a5025844e9f5ff1890' },
        {
          url: '/logo-32x32.png',
          revision: 'c180b4b8e61ec0bdc61148a94e6b0b15',
        },
        { url: '/logo.png', revision: 'c180b4b8e61ec0bdc61148a94e6b0b15' },
        { url: '/manifest.json', revision: '28886cb3a27ee477b7bef98ff22d9a10' },
        { url: '/nasdaq.png', revision: 'f51aac30ba28c016477adf2ef1656c40' },
        { url: '/og-image.jpeg', revision: '77f37fc7b90a97d1389f6c0fdb41d782' },
        { url: '/og-image.jpg', revision: '83b15db3f405aa52e1da256ebe8596d4' },
        {
          url: '/profile-upload-img.png',
          revision: '8aa698036efd0afaa7411665b708a9dd',
        },
        { url: '/qs.png', revision: 'db92dc175f168e6d76fd1ac7f1cbc560' },
        {
          url: '/topbg-mobile.svg',
          revision: 'bcfe34aaa5de9433ac6caa586a57ef3b',
        },
        { url: '/topbg-new.png', revision: 'f6af375e67823d5b26bb840b34832248' },
        { url: '/topbg.svg', revision: '71fe1e2b57dc8bb8a3e790d9bdb03279' },
        {
          url: '/twitter-large-card.jpg',
          revision: 'f898d0050af2ab5fc3b7cbc3788f45a1',
        },
        { url: '/txFail.png', revision: '8a49b60cd9de3c7c156eb05f603dac37' },
        { url: '/txSuccess.png', revision: 'b10e77af024721a88bdbcc63578031c1' },
        { url: '/vercel.svg', revision: '23efa697ebaee8515eb63559faea2a14' },
        { url: '/vice.png', revision: '0c40f7e8dc3d0e450eb7778d024e6cd2' },
        {
          url: '/ximo-eth-logo.png',
          revision: '5194c3740aadcd44f78eeb5dd049afd1',
        },
        { url: '/ximo-logo.png', revision: 'f560309c81048f382933b76a29e29c27' },
      ],
      { ignoreURLParametersMatching: [] }
    ),
    e.cleanupOutdatedCaches(),
    e.registerRoute(
      '/',
      new e.NetworkFirst({
        cacheName: 'start-url',
        plugins: [
          {
            cacheWillUpdate: async ({
              request: e,
              response: i,
              event: n,
              state: s,
            }) =>
              i && 'opaqueredirect' === i.type
                ? new Response(i.body, {
                    status: 200,
                    statusText: 'OK',
                    headers: i.headers,
                  })
                : i,
          },
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
      new e.CacheFirst({
        cacheName: 'google-fonts-webfonts',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 31536e3 }),
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
      new e.StaleWhileRevalidate({
        cacheName: 'google-fonts-stylesheets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-font-assets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-image-assets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      /\/_next\/image\?url=.+$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'next-image',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:mp3|wav|ogg)$/i,
      new e.CacheFirst({
        cacheName: 'static-audio-assets',
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:mp4)$/i,
      new e.CacheFirst({
        cacheName: 'static-video-assets',
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:js)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-js-assets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:css|less)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-style-assets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      /\/_next\/data\/.+\/.+\.json$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'next-data',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:json|xml|csv)$/i,
      new e.NetworkFirst({
        cacheName: 'static-data-assets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      ({ url: e }) => {
        if (!(self.origin === e.origin)) return !1
        const i = e.pathname
        return !i.startsWith('/api/auth/') && !!i.startsWith('/api/')
      },
      new e.NetworkFirst({
        cacheName: 'apis',
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 16, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      ({ url: e }) => {
        if (!(self.origin === e.origin)) return !1
        return !e.pathname.startsWith('/api/')
      },
      new e.NetworkFirst({
        cacheName: 'others',
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      ({ url: e }) => !(self.origin === e.origin),
      new e.NetworkFirst({
        cacheName: 'cross-origin',
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 3600 }),
        ],
      }),
      'GET'
    )
})
