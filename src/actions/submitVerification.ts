import axios from 'axios'

export default async function submitVerification(
  uuid: string
): Promise<{ wantFee: boolean; weiFee?: string; to?: string; tx?: string }> {
  const payload = {
    uuid: uuid,
  }

  try {
    const response = await axios.post(
      'https://verification.backend.ideamarket.io:8080/verificationSubmitted',
      payload
    )

    const data = response.data.data
    if (data.wantFee) {
      return {
        wantFee: true,
        weiFee: data.wei,
        to: data.to,
      }
    }

    return {
      wantFee: false,
      tx: data.tx,
    }
  } catch (ex) {
    if (ex.response?.data?.message) {
      throw ex.response.data.message
    } else {
      throw 'Error while contacting verification service.'
    }
  }
}
