import axios from 'axios'

/**
 * After post is minted, need to update post metadata in DB
 */
export const updatePostMetadata = async ({
  tokenID,
  minterAddress,
  content,
  categories,
}) => {
  const categoriesString =
    categories && categories.length > 0 ? categories.join(',') : null
  const body = {
    tokenID,
    minterAddress,
    content,
    categories: categoriesString,
  }

  // NFT metadata posted on uat needs to go to production to show on Stratos
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
      response = await prodClient.patch(`/post-metadata/update`, body)
      await uatClient.patch(`/post-metadata/update`, body)
    } else {
      response = await devClient.patch(`/post-metadata/update`, body)
      await qaClient.patch(`/post-metadata/update`, body)
    }

    return response?.data
  } catch (error) {
    console.error(`Could not update NFT post metadata for ${tokenID}`, error)
    return null
  }
}
