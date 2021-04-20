import { useRouter } from 'next/router'
import React from 'react'

export default function TokenName() {
  const router = useRouter()
  const market = router.query['marketName']
  const tagName = router.query['tokenName']
  console.log(router.query)

  return (
    <div className="absolute">
      <img
        className="h-screen w-screen"
        src={`https://og-image.ideamarket.io/api/${market}/${tagName}.png`}
      ></img>
      <a
        href={`https://app.ideamarket.io/i/${market}/${tagName}`}
        target="_blank"
      >
        <button className="absolute top-85 left-45 -translate-x-2/4 -translate-y-2/4 bg-blue-600 text-white font-bold text-lg px-2 py-1 rounded-sm">
          Buy
        </button>
      </a>
    </div>
  )
}
