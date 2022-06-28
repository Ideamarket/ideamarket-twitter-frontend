import DOMPurify from 'dompurify'

/**
 * @param text A string of text
 * @returns the text passed in, replacing any URLs with anchor tags for those URLs. Returns it all as string, even the HTML parts
 */
export const urlify = (text: string) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g

  return text?.replace(urlRegex, function (url) {
    let hyperlink = url
    if (!hyperlink.match('^https?://')) {
      hyperlink = 'http://' + hyperlink
    }
    return DOMPurify.sanitize(
      `<a
        style="color: rgb(8 87 224);z-index:500;position:relative;"
        class="hyperlink"
        href="${url}"
        rel="noopener" noreferrer
        target="_blank"
      >${url}</a>`,
      { ADD_ATTR: ['target'] } // This makes it so sanitize does not remove target attribute
    )
  })
}

/**
 * We color-code the composite/IMO ratings. This method gets background color based on imoRating.
 * 0-49 (Red)
 * 50-74 (Yellow)
 * 75+ (Green)
 *
 * Red 0-19
 * Faint red 20-39
 * Yellow 40-59
 * Light green 60-79
 * Green 80-100
 */
export const getIMORatingColors = (imoRating: number) => {
  // return 'bg-green-100 text-green-600 opacity-60' // testing
  if (imoRating < 0) return 'bg-gray-100 text-gray-600'
  if (imoRating >= 80) return 'bg-green-100 text-green-600'
  if (imoRating >= 60 && imoRating <= 79)
    return 'bg-green-100 text-green-600 opacity-60'
  if (imoRating >= 40 && imoRating <= 59) return 'bg-yellow-100 text-yellow-600'
  if (imoRating >= 20 && imoRating <= 39)
    return 'bg-red-100 text-red-600 opacity-60'
  if (imoRating <= 19) return 'bg-red-100 text-red-600'
}
