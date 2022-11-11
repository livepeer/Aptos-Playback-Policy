import React, { useCallback, useState, useContext, useMemo, useRef } from 'react';
import { CoinClient, AptosClient, AptosAccount } from 'aptos';


declare global {
  interface Window {
    aptos: any;
  }
}


export default function Wallet({setWalletAddress}:{setWalletAddress:any})  {
  const [address, setAddress] = useState<string>();
  // const [walletAmount, setWalletAmount] = useState<Number>();

  //Checking if wallet is injected into the window object
  const isAptosDefined = useMemo(
    () => (typeof window !== 'undefined' ? Boolean(window?.aptos) : false),
    []
  );

  // Using coin client to get address balance
  const client = new AptosClient('https://fullnode.devnet.aptoslabs.com');
  const coinClient = new CoinClient( client );

  //Connecting the wallet
  const connectWallet = useCallback(async () => {
    try {
      if (isAptosDefined) {
        await window.aptos.connect();
        const account: { address: string } = await window.aptos.account();
        setAddress( account.address );
        setWalletAddress( account.address );
        console.log(account);
      }
    } catch (error) {
      console.log(error);
    }
  }, [isAptosDefined, setWalletAddress]);

  
  //Checking wallet balance
  async function getBalance( account: AptosAccount ) {
    
  }

  return (
    <>
      <div className='overflow-hidden w-40 bg-aptos-green rounded-3xl p-2 mt-4 text-center'>
        <button onClick={connectWallet}>
          <p>{address ? address : 'Connect Wallet'}</p>
        </button>
      </div>
      {/* <button onClick={getBalance}>Get amount</button> */ }
      
    
    </>
  );
}
