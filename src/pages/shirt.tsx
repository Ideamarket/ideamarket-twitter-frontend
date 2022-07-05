import { GetServerSideProps } from 'next'

export default function Shirt() {
  return null
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Redirect to shirt page
  return {
    redirect: {
      destination: `https://ideamarket-io.myshopify.com/`,
      permanent: true,
    },
  }
}
