export default async function queryLambdavatar({
  rawMarketName,
  rawTokenName,
}: {
  rawMarketName: string
  rawTokenName: string
}): Promise<string> {
  return fetch(
    `https://lambdavatar.backend.ideamarket.io/${rawMarketName}/${rawTokenName}`
  )
    .then((res) => {
      if (!res.ok) {
        return {
          url: 'https://app.ideamarket.io/logo.png',
        }
      }
      return res.json()
    })
    .then((result) => result.url)
}
