import { useMemo, useState } from 'react'
import { Player, useStream} from '@livepeer/react';

interface CreatedStreamProps {
  playbackId: string;
  jwt: string;
}

export default function ViewGatedStream(props:CreatedStreamProps)  {
  return (
    <>
      {props.playbackId ? (
        <div className='w-1/2'>
          <Player
            playbackId={props.playbackId}
            jwt={ props.jwt}
            muted
            autoPlay
            showPipButton
          />
        </div>
      ) : 
      null}
    </>
  );
}
