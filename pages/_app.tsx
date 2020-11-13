// This is the component common to all pages in the app

import '../styles/global.css'

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />
}
