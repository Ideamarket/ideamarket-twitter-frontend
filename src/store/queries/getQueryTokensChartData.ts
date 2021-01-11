import { gql } from 'graphql-request'

export default function getQueryTokensChartData(
  tokenAddresses: string[],
  ids: number[][]
): string {
  return gql`
    {
        ${tokenAddresses
          .map((address, index) => {
            const i = ids[index]
            return `
                a${address}:ideaTokenPricePoints(first:${
              i.length
            },orderBy:"timestamp", orderDirection:"asc", where:{token:"${address}", counter_in:[${i.join(
              ','
            )}]}) {
                    counter
                    timestamp
                    oldPrice
                    price
                }`
          })
          .join('\n')}
    }`
}
