import axios from 'axios'

import { IdeaToken } from 'store/ideaMarketsStore'
import { NETWORK } from 'utils'

export default async function submitVerification(
  token: IdeaToken,
  ownerAddress: string,
  uuid: string
): Promise<string> {
  const payload = {
    tokenAddress: token.address,
    ownerAddress: ownerAddress,
    uuid: uuid,
    chain: NETWORK,
  }

  try {
    const response = await axios.post(
      'https://verification.backend.ideamarket.io:8080/verificationSubmitted',
      payload
    )
    return response.data.data.tx
  } catch (ex) {
    if (ex.response?.data?.message) {
      throw ex.response.data.message
    } else {
      throw 'Error while contacting verification service.'
    }
  }
}
