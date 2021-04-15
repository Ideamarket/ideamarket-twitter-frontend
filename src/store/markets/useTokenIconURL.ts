import { IMarketSpecifics } from '.'
import { useEffect, useState } from 'react'

export default function useTokenIconURL({
  marketSpecifics,
  tokenName,
}: {
  marketSpecifics: IMarketSpecifics
  tokenName: string
}) {
  const [tokenIconURL, setTokenIconURL] = useState('')

  useEffect(() => {
    if (tokenName && marketSpecifics) {
      marketSpecifics.getTokenIconURL(tokenName).then((url) => {
        setTokenIconURL(url)
      })
    }
  }, [marketSpecifics, tokenName])

  return tokenIconURL
}
