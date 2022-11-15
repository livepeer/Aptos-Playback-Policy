import React, { useState, useMemo, useCallback, useEffect} from 'react';
import { CoinClient, AptosClient, AptosAccount, AptosAccountObject } from 'aptos';
import { WalletInfo } from '../pages/api/walletInfo';

declare global {
  interface Window {
    aptos: any;
  }
}


export default function Wallet({setWalletAddress}:{setWalletAddress:any})  {
  const [address, setAddress] = useState<string>();
  const [account, setAccount] = useState<AptosAccount>();
  const [walletAmount, setWalletAmount] = useState<Number>();
  const [ walletBalance, setWalletBalance ] = useState<Number>();
  

  //Checking if wallet is injected into the window object
  const isAptosDefined = useMemo(
    () => (typeof window !== 'undefined' ? Boolean(window?.aptos) : false),
    []
  );
  

  //Connecting the wallet
  const connectWallet = useCallback( async () => {
    // Using coin client to get address balance
    const client = new AptosClient('https://fullnode.devnet.aptoslabs.com');
    const coinClient = new CoinClient( client );
    try {
      if ( isAptosDefined ) {
          const response = await fetch( '/api/walletInfo', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
          } )
         await response.json() as Promise<WalletInfo>;
        setAddress( address )
        setWalletBalance(walletBalance)
        
        // await window.aptos.connect();
        // const account = (await window.aptos.account()) as AptosAccountObject;
        // const accountAddress = account.address;
        // setAddress( accountAddress );
        // setWalletAddress( account.address );
        // setAccount(new AptosAccount(undefined, account.address));
        // console.log(account);
      }
      // const balance: bigint = await coinClient.checkBalance(account as AptosAccount);
      // setWalletAmount(Number(balance) / 10 ** 8);
      // setWalletBalance(Number(balance) / 10 ** 8);
      // console.log( walletAmount );
      
    } catch (error) {
      console.log(error);
    }
  }, [ isAptosDefined, address, walletBalance ] );
  
  return (
    <>
      <div className='rounded outline outline-offset-2 outline-1 outline-aptos-green p-4 m-4 text-xl bg-slate-800 hover:outline-slate-800 text-aptos-green hover:text-gray-100 cursor-pointer'>
        <button onClick={connectWallet}>
          <p>{address && walletBalance !== 0 ? address : 'Connect Wallet'}</p>
        </button>
      </div>
    </>
  );
}
