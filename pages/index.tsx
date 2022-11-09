import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import 'tailwindcss/tailwind.css'

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

        <div className={styles.grid}>
          <a href='https://nextjs.org/docs' className={styles.card}>
            <h2>View Stream &rarr;</h2>
            <p>View a gated stream.</p>
          </a>
        </div>
      </main>
    </div>
  );
}
