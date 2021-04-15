import { useEffect, useState } from 'react'
import { IMarketSpecifics } from '.'

export default function useTokenIconURL({
  marketSpecifics,
  tokenName,
}: {
  marketSpecifics: IMarketSpecifics
  tokenName: string
}) {
  const [tokenIconURL, setTokenIconURL] = useState('')

  useEffect(() => {
    let isCancelled = false
    if (tokenName && marketSpecifics) {
      marketSpecifics.getTokenIconURL(tokenName).then((url) => {
        if (!isCancelled) {
          setTokenIconURL(url)
        }
      })
    }
    return () => {
      isCancelled = true
    }
  }, [marketSpecifics, tokenName])

  return tokenIconURL
}
