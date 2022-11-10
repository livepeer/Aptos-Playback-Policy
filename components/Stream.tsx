import { useMemo, useState } from 'react'
import { Player, useStream} from '@livepeer/react';

interface WalletProps {
  address?: string;
}

export default function Stream(props:WalletProps)  {
  return (
    <>
      {props.address ? (
        <div className='w-1/2'>
          <Player
            playbackId={'4a2b91c30gj1hoot'}
            // jwt={ }
            muted
            autoPlay
            showPipButton
          />
        </div>
      ) : // <p>
      //   Please install{' '}
      //   <a href='https://aptos.dev/guides/install-petra-wallet-extension/' className='text-aptos-green text-lg'>Petra Wallet</a>
      // </p>
      null}
    </>
  );
}
