import axios from 'axios'

type Props = {
  walletAddress: string
  ratedPostID: number
  rating: number
}

/**
 * Sync user relations for this wallet and postID with this new rating
 */
export const syncUserRelationsForWallet = async ({
  walletAddress,
  ratedPostID,
  rating,
}: Props) => {
  const body = {
    walletAddress,
    ratedPostID,
    rating,
  }

  const isMainnet = process.env.NEXT_PUBLIC_NETWORK === 'avm'

  const devClient = axios.create({
    baseURL: 'https://server-dev.ideamarket.io',
  })
  const qaClient = axios.create({
    baseURL: 'https://server-qa.ideamarket.io',
  })
  const uatClient = axios.create({
    baseURL: 'https://server-uat.ideamarket.io',
  })
  const prodClient = axios.create({
    baseURL: 'https://server-prod.ideamarket.io',
  })

  try {
    let response = null
    if (isMainnet) {
      response = await prodClient.patch(`/user-token/relation/sync`, body)
      await uatClient.patch(`/user-token/relation/sync`, body)
    } else {
      response = await devClient.patch(`/user-token/relation/sync`, body)
      await qaClient.patch(`/user-token/relation/sync`, body)
    }

    return response?.data?.data
  } catch (error) {
    console.error(
      `Could not trigger user relation sync for ${walletAddress}`,
      error
    )
    return null
  }
}
