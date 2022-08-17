import client from 'lib/axios'

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
  try {
    const response = await client.patch(`/post-metadata/update`, body)
    return response?.data
  } catch (error) {
    console.error(`Could not update NFT post metadata for ${tokenID}`, error)
    return null
  }
}
