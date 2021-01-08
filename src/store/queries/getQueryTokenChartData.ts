import { gql } from 'graphql-request'

export default function getQueryTokenChartData(
  address: string,
  fromTs: number
): string {
  return gql`
    {
      ideaToken(id:${'"' + address + '"'}) {
        latestPricePoint {
          timestamp
          oldPrice
          price
        }
        pricePoints(where:{timestamp_gt:${fromTs}} orderBy:timestamp) {
            timestamp
            oldPrice
            price
        }    
      }
    }`
}
