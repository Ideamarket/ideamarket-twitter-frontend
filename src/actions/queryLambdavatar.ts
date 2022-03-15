import axios from 'lib/axios'

export default async function queryLambdavatar({
  rawMarketName,
  rawTokenName,
}: {
  rawMarketName: string
  rawTokenName: string
}): Promise<string> {
  try {
    const response = await axios.get(`/avatar`, {
      params: {
        provider: rawMarketName,
        value: rawTokenName,
      },
    })

    if (!response?.data?.success) {
      return 'https://ideamarket.io/logo.png'
    }

    return response?.data?.data?.url
  } catch (error) {
    return 'https://ideamarket.io/logo.png'
  }
}
