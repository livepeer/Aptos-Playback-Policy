import '../styles/globals.css'
import {useMemo, createContext} from 'react'
import type { AppProps } from 'next/app'
import { LivepeerConfig, createReactClient, studioProvider } from '@livepeer/react'
import { AptosClient } from 'aptos'

// Setting up Aptos client
export const AptosContext = createContext<AptosClient | null>( null );
const aptosClient = useMemo (() => new AptosClient('https://fullnode.devnet.aptoslabs.com/v1'), []))

// Setting up Livepeer Studio client
const client = createReactClient( {
  provider: studioProvider( {
    apiKey: process.env.NEXT_PUBLIC_LIVEPEER_API_KEY
  })
})


export default function App({ Component, pageProps }: AppProps) {
  return (
    <AptosContext.Provider value={aptosClient}>
      <LivepeerConfig client={ client }>
      < Component {...pageProps } />
      </LivepeerConfig>
    </AptosContext.Provider>
    )
}
