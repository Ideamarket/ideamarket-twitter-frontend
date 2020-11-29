import axios from 'axios'

import { IdeaToken } from 'store/ideaMarketsStore'
import { NETWORK } from 'utils'

export default async function requestVerification(
  token: IdeaToken,
  ownerAddress: string
): Promise<string> {
  const payload = {
    tokenAddress: token.address,
    ownerAddress: ownerAddress,
    chain: NETWORK,
  }

  try {
    const response = await axios.post(
      'https://verification.backend.ideamarket.io:8080/verificationRequest',
      payload
    )
    console.log(response)
  } catch (ex) {
    if (ex.response?.data?.message) {
      throw ex.response.data.message
    } else {
      throw 'Error while contacting verification service.'
    }
  }

  return ''
}
