import Head from 'next/head';
import Image from 'next/image';
import aptosImage from '../public/Aptos.jpeg';
import { useState } from 'react';
import styles from '../styles/Home.module.css';
import 'tailwindcss/tailwind.css';
import ViewGatedStream from '../components/ViewGatedStream';
import Wallet from '../components/Wallet';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function Home() {
  const [walletAddress, setWalletAddress] = useState();

  return (
    <div className={styles.container}>

      <main className={styles.main}>
        <Image src={aptosImage} alt='Aptos Logo' width={1000} height={400} priority />
        <h1 className={styles.title}>View stream</h1>
        <Wallet setWalletAddress={setWalletAddress} />
        {walletAddress ? (
          <QueryClientProvider client={queryClient}>
            <ViewGatedStream walletAddress={walletAddress} />
          </QueryClientProvider>
        ) : null}
      </main>
    </div>
  );
}
