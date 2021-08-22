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
        return 'https://ideamarket.io/logo.png'
      }
      return `https://d3hjr60szea5ud.cloudfront.net/${rawMarketName}/${rawTokenName}.png`
    })
    .catch((ex) => {
      return 'https://ideamarket.io/logo.png'
    })
}
