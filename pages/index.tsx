import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import 'tailwindcss/tailwind.css'
import Wallet from '../components/Wallet'
import Stream from '../components/Stream'
import { useStream } from '@livepeer/react'
import CreateGatedStream from '../components/CreateGatedStream'


export default function Home() {

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name='description' content='Aptos Playback Policy' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className={styles.main}>
          <Image src='/../public/Aptos.jpeg' alt='Aptos Logo' width={1600} height={400}/>
        <h1 className={styles.title}>
          Welcome to <span className='text-aptos-green'>Aptos</span> Playback Policy
        </h1>
        <Wallet />
        <CreateGatedStream />
      </main>
    </div>
  );
}
