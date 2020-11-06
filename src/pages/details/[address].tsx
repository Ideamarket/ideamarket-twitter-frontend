import { useRouter } from 'next/router'
import { useQuery } from 'react-query'
import { querySingleToken } from '../../store/ideaMarketsStore'
import { toChecksumedAddress, isAddress } from '../../utils'

export default function TokenDetails() {
  const router = useRouter()
  const address = isAddress(router.query.address as string)
    ? toChecksumedAddress(router.query.address as string)
    : undefined

  const { data: token, isLoading: isTokenLoading } = useQuery(
    [`token-${address}`, address],
    querySingleToken
  )

  return <>{token?.url}</>
}
