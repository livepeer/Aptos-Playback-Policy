import Head from 'next/head';
import Image from 'next/image';
import {useState} from 'react'
import styles from '../styles/Home.module.css';
import 'tailwindcss/tailwind.css';
import CreateGatedStream from '../components/CreateGatedStream';
import Wallet from '../components/Wallet'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


const queryClient = new QueryClient();

export default function Home() {
  const [ walletAddress, setWalletAddress ] = useState();
  console.log(walletAddress);
  

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name='description' content='Aptos Playback Policy' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className={styles.main}>
        <Image src='/../public/Aptos.jpeg' alt='Aptos Logo' width={1600} height={400} />
        <h1 className={styles.title}>
          Welcome to <span className='text-aptos-green'>Aptos</span> Playback Policy
        </h1>
        <Wallet setWalletAddress={setWalletAddress} />
        {walletAddress ? (
          <QueryClientProvider client={queryClient}>
            <CreateGatedStream walletAddress={ walletAddress } />
          </QueryClientProvider>
        ) : null} 
      </main>
    </div>
  );
}
