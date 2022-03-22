import { useEffect, useState } from 'react'
import { useMutation } from 'react-query'
import WikiDesktopContent from './WikiDesktopContent'
import WikiMobileContent from './WikiMobileContent'

const WikiContent = ({ wikiTitle }: any) => {
  const [wikiSnapshot, setWikiSnapshot] = useState(null)

  const { mutateAsync: fetchWikiSnapshot } = useMutation<{
    message: string
    data: any
  }>(() =>
    fetch(`/api/markets/wikipedia/snapshot?title=${wikiTitle}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(async (res) => {
      if (!res.ok) {
        const response = await res.json()
        throw new Error(response.message)
      }
      return res.json()
    })
  )

  useEffect(() => {
    fetchWikiSnapshot().then(({ data }) => setWikiSnapshot(data))
  }, [fetchWikiSnapshot, wikiTitle])

  const wikiProps = {
    wikiTitle,
    wikiSnapshot,
  }

  return (
    <div style={{ height: '400px' }}>
      <WikiMobileContent {...wikiProps} />
      <WikiDesktopContent {...wikiProps} />
    </div>
  )
}

export default WikiContent
