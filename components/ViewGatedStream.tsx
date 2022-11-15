import { useMemo, useState } from 'react'
import { Player, useStream } from '@livepeer/react';
import { useMutation } from '@tanstack/react-query';
import { SignMesagePayload, SignMessageResponse } from '../pages/api/signMessage';

interface CreatedStreamProps {
  playbackId: string;
  jwt: string;
}

export default function ViewGatedStream(
  props: CreatedStreamProps,
  { walletAddress }: { walletAddress: string } ) {
  
  
  const { mutate: signMessage, data: signMessageResponse } = useMutation( {
    mutationFn: async () => {
      if ( !walletAddress ) {
        throw new Error( 'No address' );
      }
  
      const body: SignMesagePayload = {
        address: true,
        application: true,
        chainId: true,
        message: 'Access allowed for stream',
        nonce: ''
      }

      const response = await fetch( '/api/signMessage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( body ),
      } );
  
      return response.json() as Promise<SignMessageResponse>;
    },
  
    });
  
  console.log(walletAddress);
  
  return (
    <>
      {/* {props.playbackId ? ( */}
        <div className='w-1/2'>
          <Player
            playbackId={props.playbackId}
            jwt={ props.jwt}
            muted
            autoPlay
            showPipButton
          />
        </div>
      {/* ) :  */}
      {/* null} */}
    </>
  );
}
