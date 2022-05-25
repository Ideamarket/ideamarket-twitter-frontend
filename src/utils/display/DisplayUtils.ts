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
        style="color: rgb(8 87 224);"
        href="${url}"
        rel="noopener" noreferrer
        target="_blank"
        onmouseover='this.style.textDecoration="underline"'
        onmouseout='this.style.textDecoration="none"'
      >${url}</a>`,
      { ADD_ATTR: ['target'] } // This makes it so sanitize does not remove target attribute
    )
  })
}

/**
 * We color-code the composite/IMO ratings. This method gets background color based on imoRating.
 * 0-34 (Red)
 * 35-64 (Orange)
 * 65-85 (Green)
 * 86-100 (Blue)
 */
export const getIMORatingColors = (imoRating: number) => {
  if (imoRating >= 86) return 'bg-blue-100 text-blue-600'
  if (imoRating >= 65 && imoRating <= 85) return 'bg-green-100 text-green-600'
  if (imoRating >= 35 && imoRating <= 64) return 'bg-orange-100 text-orange-600'
  if (imoRating <= 34) return 'bg-red-100 text-red-600'
}
