import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import aptosImage from '../public/Aptos.jpeg'
import {useState} from 'react'
import styles from '../styles/Home.module.css';
import 'tailwindcss/tailwind.css';


export default function Home() {
  

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

        <Link href='/gateStream'>
          <div className='rounded outline outline-offset-2 outline-1 outline-aptos-green p-4 m-4 text-xl bg-slate-800 hover:outline-slate-800 text-aptos-green hover:text-gray-100 cursor-pointer'>
            Click to Gate Stream
          </div>
        </Link>
        <Link href='/viewStream'>
          <div className='rounded outline outline-offset-2 outline-1 outline-aptos-green p-4 m-4 text-xl bg-slate-800 hover:outline-slate-800 text-aptos-green hover:text-gray-100 cursor-pointer'>
            Click to View Stream
          </div>
        </Link>
      </main>
    </div>
  );
}
