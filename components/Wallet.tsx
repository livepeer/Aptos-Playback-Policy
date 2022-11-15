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
        // Using as props for CreateGatedStream
        setWalletAddress((await data).address.accountAddress.hexString);
        setWalletAmount((await data).walletBalance);
      }
      
    } catch (error) {
      console.log(error);
    }
  }, [ isAptosDefined, setWalletAddress, setWalletAmount ] );
  
  return (
    <>
      <div className='rounded outline outline-offset-2 outline-1 outline-aptos-green p-4 m-4 text-xl bg-slate-800 hover:outline-slate-800 text-aptos-green hover:text-gray-100 cursor-pointer'>
        <button onClick={connectWallet}>
          <div>
            <p>{ address ? address : 'Connect Wallet' }</p>
          </div>
        </button>
      </div>
    </>
  );
}
