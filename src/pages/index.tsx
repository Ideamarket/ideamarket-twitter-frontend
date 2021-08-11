import React from 'react'
import { DefaultLayout, Home as HomeComponent } from 'components'

export default function Home() {
  return <HomeComponent />
}
Home.layoutProps = {
  Layout: DefaultLayout,
}
