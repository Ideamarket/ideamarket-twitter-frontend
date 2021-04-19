import { GetServerSideProps } from 'next'
import { querySingleTokenByID } from 'store/ideaMarketsStore'

export default function RedirectToTokenDetails() {
  return null
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { marketID, tokenID } = context.params
  
  const response = await querySingleTokenByID(
    `token-${marketID}-${tokenID}`,
    marketID.toString(),
    tokenID.toString()
  )

  const marketName = response.marketName.toLowerCase()
  const tokenName = response.name.substr(1).toLowerCase()

  return {
    redirect: {
      destination: `/i/${marketName}/${tokenName}`,
      permanent: false,
    },
  }
}
