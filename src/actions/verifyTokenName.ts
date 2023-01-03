import { getTwitterPostByURL } from 'modules/posts/services/TwitterPostService'

export default async function verifyTokenName(url: string) {
  if (!url || url === '')
    return {
      isValid: false,
      isAlreadyPosted: false,
      finalTokenValue: '',
    }

  const existingPost = await getTwitterPostByURL({ content: url })

  const isAlreadyPosted = Boolean(existingPost)

  return {
    isValid: true,
    isAlreadyPosted,
    existingPost,
    finalTokenValue: url,
  }
}
