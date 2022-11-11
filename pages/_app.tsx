import '../styles/globals.css';
import { useMemo, createContext } from 'react';
import type { AppProps } from 'next/app';
import { LivepeerConfig, createReactClient, studioProvider } from '@livepeer/react';
import { AptosClient } from 'aptos';

// Setting up Aptos client
export const AptosContext = createContext<AptosClient | null>(null);

// Setting up Livepeer Studio client
const client = createReactClient({
  provider: studioProvider({
    apiKey: process.env.NEXT_PUBLIC_LIVEPEER_API_KEY,
  }),
});

export default function App({ Component, pageProps }: AppProps) {
  const aptosClient = useMemo(
    () => new AptosClient('https://fullnode.devnet.aptoslabs.com/v1'),
    []
  );

  return (
    <LivepeerConfig client={client}>
      <AptosContext.Provider value={aptosClient}>
        <Component {...pageProps} />
      </AptosContext.Provider>
    </LivepeerConfig>
  );
}
