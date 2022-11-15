import Head from 'next/head';
import Image from 'next/image';
import aptosImage from '../public/Aptos.jpeg';
import { useState } from 'react';
import styles from '../styles/Home.module.css';
import 'tailwindcss/tailwind.css';
import CreateGatedStream from '../components/CreateGatedStream';
import Wallet from '../components/Wallet';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function Home() {
  const [walletAddress, setWalletAddress] = useState();

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
          Create a gated stream
        </h1>
        <Wallet setWalletAddress={setWalletAddress} />
        {walletAddress ? (
          <QueryClientProvider client={queryClient}>
            <CreateGatedStream walletAddress={walletAddress} />
          </QueryClientProvider>
        ) : null}
      </main>
    </div>
  );
}