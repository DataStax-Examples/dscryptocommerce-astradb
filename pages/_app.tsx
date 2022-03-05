import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import { DAppProvider, Config, Mumbai, Polygon, Localhost, Hardhat } from '@usedapp/core'
import '@fontsource/work-sans'
import '@fontsource/rubik'

const web3config: Config = {
  networks: [Mumbai, Polygon, Localhost, Hardhat]
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <DAppProvider config={web3config}>
        <Component {...pageProps} />
      </DAppProvider>
    </ChakraProvider>
  )
}

export default MyApp
