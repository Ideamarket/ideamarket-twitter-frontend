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
        alt="embed preview"
        src={`https://og-image.ideamarket.io/api/${market}/${tagName}.png`}
      ></img>
      <a
        href={`https://app.ideamarket.io/i/${market}/${tagName}`}
        target="_blank"
        rel="noreferrer"
      >
        <button className="absolute top-85 left-48 -translate-x-2/4 -translate-y-2/4 bg-green-500 text-gray-900 font-bold text-sm px-2 py-1 rounded-sm">
          Buy
        </button>
      </a>
    </div>
  )
}
