![Aptos](/public/Aptos.jpeg)
# Aptos Playback Policy Guide

## Set up

- [Create a Livepeer Studio account](https://livepeer.studio/register)
- [Create an API key that has CORS access](https://docs.livepeer.studio/quickstart)
- Create a wallet and get private key for address

## Adding dependencies

- Install [NextJS w/Typescript](https://nextjs.org/docs/getting-started)
    
    ```bash
    npx create-next-app@latest --typescript
    ```
    
- Install [Aptos SDK (Typescript](https://aptos.dev/sdks/ts-sdk/typescript-sdk/))
    
    ```bash
    npm i aptos
    ```
    
- Install [LivepeerJS SDK](https://livepeerjs.org/)
    
    ```bash
    npm i @livepeer/react
    ```
    

- Install [dotenv](https://www.npmjs.com/package/dotenv)
    
    ```bash
    npm i dotenv
    ```
    
- Install [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
    
    ```bash
    npm i jsonwebtoken
    ```
    
- Install [Petra Wallet](https://aptos.dev/guides/install-petra-wallet-extension)

# Directory Path

- Directories for this project

```markdown
components
	- CreateGatedStream.tsx
	- ViewGatedStream.tsx
	- Wallet.tsx
pages
	- api
			- createJWT.ts
			- walletInfo.ts
	- _app.tsx
	- index.tsx
.env
```

## Keys setup

- Create CORS-Allowed API key from Livepeer Studio
- Create Stream in Livepeer Studio dashboard
- Got to stream and create Signing Keys

### ENV file

- Make sure to create a .env file to store all sensitive keys needed for the project

> When deploying this project, make sure to also set up the env in the service being used(ex. Vercel)
> 

Ex.

```tsx
PUBLIC_KEY="LS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS0KTUZrd0V3WUhLb1pJemowQ0FRWUlLb1pJemowREFRY0RRZ0FFOUtjT1UyOGtPZXZxcit1eU1rZ0xJU1hheFlTQwpHWDVQTGNUL1hxcEVhNzVoMi81dlFhcHRrZzBEVkUvVTdZMy9kSjFRc0luVSsrckxJdmp5L3dUNlRnPT0KLS0tLS1FTkQgUFVCTElDIEtFWS0tLS0tCg=="
PRIVTE_KEY="LS0tLS1CRUdJTiBQUklWQVRFIEtFWS0tLS0tCk1JR0hBZ0VBTUJNR0J5cUdTTTQ5QWdFR0NDcUdTTTQ5QXdFSEJHMHdhd0lCQVFRZ2Y1bkluMUtaVTJZbWRDRGYKbU52YWFUdHV0ekZpbTdZWEV3WXVYVlJLL1JtaFJBTkNBQVQwcHc1VGJ5UTU2K3F2NjdJeVNBc2hKZHJGaElJWgpmazh0eFA5ZXFrUnJ2bUhiL205QnFtMlNEUU5VVDlUdGpmOTBuVkN3aWRUNzZzc2krUEwvQlBwTwotLS0tLUVORCBQUklWQVRFIEtFWS0tLS0tCg=="
NEXT_PUBLIC_LIVEPEER_API_KEY ="681dd957-9517-4d0b-9f87-945ee22e5d4e"
NODE_URL = process.env.APTOS_NODE_URL || "https://fullnode.devnet.aptoslabs.com";
FAUCET_URL = process.env.APTOS_FAUCET_URL || "https://faucet.devnet.aptoslabs.com";
APTOS_PRIVATE_KEY ="0xdaf537544dea4642c213f272605640cba3774f616c28c4e1689a"
```

# Configure Providers

### Providers

- In _app`.ts`
- Setting up providers

```tsx
import {useMemo, createContext} from 'react'
import type { AppProps } from 'next/app'
import { LivepeerConfig, createReactClient, studioProvider } from '@livepeer/react'
import { AptosClient } from 'aptos'

// Setting up Aptos client
export const AptosContext = createContext<AptosClient | null>( null );

// Setting up Livepeer Studio client
const client = createReactClient( {
  provider: studioProvider( {
    apiKey: process.env.NEXT_PUBLIC_LIVEPEER_API_KEY
  })
})

export default function App({ Component, pageProps }: AppProps) {

const aptosClient = useMemo (() => new AptosClient('https://fullnode.devnet.aptoslabs.com/v1'), []))

  return (
    <AptosContext.Provider value={aptosClient}>
      <LivepeerConfig client={ client }>
      < Component {...pageProps } />
      </LivepeerConfig>
    </AptosContext.Provider>
    )
}
```

# Create API for getting wallet information

## Api Directory

- In `walletInfo.ts`

```tsx
import { CoinClient, AptosClient, AptosAccount, AptosAccountObject, HexString } from 'aptos';
import { NextApiRequest, NextApiResponse } from 'next';

export type WalletInfo = {
  address: any;
  walletBalance: any;
}

const handler = async (req: NextApiRequest, res:NextApiResponse) => {
  const client = new AptosClient( 'https://fullnode.devnet.aptoslabs.com' );
  const aptosAccount = new AptosAccount()
  const coinClient = new CoinClient(client)

  try {
    const method = req.method;
    if ( method === 'POST' ) {
      const address = new AptosAccount(undefined, req.body.address)
      const balance: bigint = await coinClient.checkBalance(address as AptosAccount)
      const accountInfo = ({
        address,
        walletBalance: Number( balance ) / 10 ** 8
      } )
      console.log(balance);
       return res.status(200).json(accountInfo)
      }
      res.setHeader('Allow', ['POST']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: (error as Error)?.message ?? 'Error' }); 
  }
}

export default handler;
```

# Create API for generating JWT

## Api Directory

- In `createJWT.ts`
- Getting parameters from stream and generating a JWT

```tsx
import {signAccessJwt} from 'livepeer/crypto'
import { NextApiRequest, NextApiResponse } from 'next'

// Set type for payload information to create JWT
export type CreateSignedPlaybackBody = {
  playbackId: string;
  secret: string;
}

// Set type for revieving JWT
export type CreateSignedPlaybackResponse = {
  token: string;
}

// Set variable for access control signing keys
const accessControlPrivateKey = process.env.PRIVATE_KEY;
const accessControlPublicKey = process.env.PUBLIC_KEY;

const handler = async ( req: NextApiRequest, res: NextApiResponse ) => {
  try {
    const method = req.method;

    if ( method === 'POST' ) {
      if ( !accessControlPrivateKey || !accessControlPublicKey ) {
        return res.status( 500 ).json( { message: 'No private/public key configured.' } );
      }
      const { playbackId, secret }: CreateSignedPlaybackBody = req.body;
      if ( !playbackId || !secret ) {
        return res.status( 400 ).json( { message: 'Missing data in body.' } );
      }
      if ( secret !== req.body.walletAddress ) {
        return res.status(401).json({message: 'Incorrect secret.'})
      }
      const token = await signAccessJwt( {
        privateKey: accessControlPrivateKey,
        publicKey: accessControlPublicKey,
        issuer: 'Aptos',
        playbackId,
        expiration: '1hr',
      } )
      return res.status(200).json({token})
    }
    res.setHeader( 'Allow', [ 'POST' ] );
    return res.status( 405 ).end( `Method ${method} Not Allowed` );
  } catch (error) {
    console.error( error );
    res.status( 500 ).json( { message: ( error as Error )?.message ?? 'Error' } );
    
  }
}
export default handler;
```

# Fund Petra wallet

- Download the Petra wallet browser extension
- Fund the wallet

# Wallet Component

### Components Directory

- In `Wallet.tsx`
- Using the Petra wallet to sign to the stream page
- The wallet must be connected and have a specific amount of Aptos coins

```tsx
import React, { useState, useMemo, useCallback} from 'react';
import {  AptosAccountObject } from 'aptos';
import { WalletInfo } from '../pages/api/walletInfo';

declare global {
  interface Window {
    aptos: any;
  }
}

export default function Wallet({setWalletAddress}:{setWalletAddress:any}, {setWalletAmount}:{setWalletAmount: any})  {
  const [address, setAddress] = useState<any>();
  const [balance, setBalance] = useState<any>();
  
  //Checking if wallet is injected into the window object
  const isAptosDefined = useMemo(
    () => (typeof window !== 'undefined' ? Boolean(window?.aptos) : false),
    []
  );

  //Connecting the wallet
  const connectWallet = useCallback( async () => {
    try {
      if ( isAptosDefined ) {
        const account = (await window.aptos.account()) as AptosAccountObject;
        const accountAddress = account.address;
        const response = await fetch('/api/walletInfo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            address: accountAddress,
          }),
        });
        const data = ( await response.json() ) as Promise<WalletInfo>;
        setAddress( ( await data ).address.accountAddress.hexString );
        setBalance((await data).walletBalance);
        // Using as props for CreateGatedStream
        setWalletAddress((await data).address.accountAddress.hexString);
        setWalletAmount( ( await data ).walletBalance );
      }
    } catch (error) {
      console.log(error);
    }
  }, [ isAptosDefined, setWalletAddress, setWalletAmount] );
  
  return (
    <>
      <div className='rounded outline outline-offset-2 outline-1 outline-aptos-green p-4 m-4 text-xl bg-slate-800 hover:outline-slate-800 text-aptos-green hover:text-gray-100 cursor-pointer'>
        <button onClick={connectWallet}>
          <div>
            <p>{address ? address : 'Connect Wallet'}</p>
            <p>{balance ? <p>Balance: {balance}</p> : null}</p>
          </div>
        </button>
      </div>
    </>
  );
}
```

# Create Gated Stream

### Page

- In `CreateGatedStream.tsx`
- Create a new stream with playback policy and displays the stream and stream info if wallet is connected

```tsx
import { useCreateStream, useStream, Player } from '@livepeer/react';
import { useMemo, useState, useEffect } from 'react';

import { useMutation } from '@tanstack/react-query';
import { CreateSignedPlaybackBody, CreateSignedPlaybackResponse } from '../pages/api/createJWT';

export default function CreateGatedStream({ walletAddress }: { walletAddress: string }, {walletAmount}: {walletAmount: any}) {
  const [showInfo, setShowInfo] = useState<boolean>(false);
  const [ showStream, setShowStream ] = useState<boolean>( false );
  
  // Create stream with LivepeerJS hook
  const [streamName, setStreamName] = useState<string>('');
  const {
    mutate: createStream,
    data: createdStream,
    status,
  } = useCreateStream(
    streamName
      ? {
          name: streamName,
          playbackPolicy: { type: 'jwt' },
        }
      : null
  );

  // Getting created stream information
  const { data: stream } = useStream({
    streamId: createdStream?.id,
    refetchInterval: (stream) => (!stream?.isActive ? 5000 : false),
  });

  // Function to create JWT and get the token
  const { mutate: createJwt, data: createdJwt } = useMutation({
    mutationFn: async () => {
      if (!stream?.playbackId) {
        throw new Error('No playback Id');
      }

      // Create stream information for JWT payload
      const body: CreateSignedPlaybackBody = {
        playbackId: stream.playbackId,
        secret: walletAddress,
        
      };

      const response = await fetch('/api/createJWT', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      return response.json() as Promise<CreateSignedPlaybackResponse>;
    },
  });

  useEffect(() => {
    if (stream?.playbackId && walletAddress) {
      createJwt();
    }
  }, [stream?.playbackId, createJwt, walletAddress]);

  const isLoading = useMemo( () => status === 'loading', [ status ] );
  
  const viewStream = async () => {
    setShowStream(true)
    setShowInfo( false )
  }

   const viewStreamInfo = async () => {
     setShowInfo(true);
     setShowStream(false);
   };

  return (
    <>
      {!stream?.id ? (
        <div className='flex flex-col rounded outline outline-offset-2 outline-1 outline-aptos-green p-4 m-4 text-xl bg-slate-800'>
          <label htmlFor='input'>Stream Name</label>
          <input
            className='rounded my-3'
            type='text'
            required
            value={streamName}
            onChange={(e) => setStreamName(e.target.value)}
          />
          <button
            onClick={() => createStream?.()}
            disabled={isLoading || !createStream || Boolean(stream)}
            className='rounded outline outline-offset-2 outline-1 outline-aptos-green p-4 m-4 text-xl bg-slate-800 hover:text-aptos-green cursor-pointer'
          >
            Create Gated Stream
          </button>
        </div>
      ) : (
        <>
          <div>
            <button
              onClick={viewStream}
              className='rounded outline outline-offset-2 outline-1 outline-aptos-green p-4 m-4 text-xl bg-slate-800 hover:outline-slate-800 text-aptos-green hover:text-gray-100 cursor-pointer'
            >
              View Stream
            </button>
            <button
              onClick={(viewStreamInfo)}
              className='rounded outline outline-offset-2 outline-1 outline-aptos-green p-4 m-4 text-xl bg-slate-800 hover:outline-slate-800 text-aptos-green hover:text-gray-100 cursor-pointer'
            >
              Stream Info
            </button>
          </div>
            {/* Display Stream */ }
          {showStream  ? (
            <div className='w-1/4'>
              <Player
                title={stream?.name}
                playbackId={stream?.playbackId}
                showPipButton
                jwt={(createdJwt as CreateSignedPlaybackResponse)?.token}
              />
            </div>
          ) : null}

          {/* Display Stream Info */}
          <div className='flex-flex-col w-1/4'>
            {showInfo ? (
              <div className='rounded outline outline-offset-2 outline-2 outline-aptos-green p-4 m-4 text-xl bg-slate-800 overflow-scroll'>
                <p>
                  <span className='text-aptos-green font-bold'>Stream Name: </span>
                  {stream.name}
                </p>
                <p>
                  <span className='text-aptos-green font-bold'>Stream Id:</span> {stream.id}
                </p>
                <p>
                  <span className='text-aptos-green font-bold'>PlaybackId:</span>{' '}
                  {stream.playbackId}
                </p>
                <p>
                  <span className='text-aptos-green font-bold'>Playback Policy:</span>{' '}
                  {stream.playbackPolicy?.type}
                </p>
                <p>
                  <span className='text-aptos-green font-bold'>Ingest Url:</span>{' '}
                  {stream.rtmpIngestUrl}
                </p>
                <p>
                  <span className='text-aptos-green font-bold'>Playback Url:</span>{' '}
                  {stream.playbackUrl}
                </p>
                <p>
                  <span className='text-aptos-green font-bold'>JWT: </span>
                  {(createdJwt as CreateSignedPlaybackResponse)?.token}
                </p>
              </div>
            ) : (
              <></>
            )}
          </div>
        </>
      )}
    </>
  );
}
```

# Main Page

### Page Directory

- In `index.tsx`
- The main page of app

```tsx
import Head from 'next/head';
import Image from 'next/image';
import aptosImage from '../public/Aptos.jpeg'
import {useState} from 'react'
import styles from '../styles/Home.module.css';
import 'tailwindcss/tailwind.css';
import Wallet from '../components/Wallet';
import CreateGatedStream from '../components/CreateGatedStream';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export default function Home() {
  
  const queryClient = new QueryClient();
  const [walletAddress, setWalletAddress] = useState<string>();
  const [walletAmount, setWalletAmount] = useState<number>();

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name='description' content='Aptos Playback Policy' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className={styles.main}>
        <Image src={aptosImage} alt='Aptos Logo' width={1000} height={400} priority />
        <h1 className={styles.title}>
          Welcome to <span className='text-aptos-green'>Aptos</span> Playback Policy
        </h1>

        <Wallet
          setWalletAddress={ setWalletAddress }
          setWalletAmount={ setWalletAmount }
        />
        {walletAddress ? (
          <QueryClientProvider client={queryClient}>
            <CreateGatedStream
              walletAddress={ walletAddress }
              walletAmount={walletAmount}
            />
          </QueryClientProvider>
        ) : null}
      </main>
    </div>
  );
}
```