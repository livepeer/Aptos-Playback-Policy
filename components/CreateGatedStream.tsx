import { useCreateStream, useStream, Player } from '@livepeer/react';
import { useMemo, useState, useEffect } from 'react';

import { useMutation } from '@tanstack/react-query';
import { CreateSignedPlaybackBody, CreateSignedPlaybackResponse } from '../pages/api/createJWT';

export default function CreateGatedStream({ walletAddress }: { walletAddress: string }, {walletAmount}: {walletAmount: any}) {
  const [showInfo, setShowInfo] = useState<boolean>(false);
  const [showStream, setShowStream] = useState<boolean>(false);
  // Create stream with LivepeerJS hook
  const [streamName, setStreamName] = useState<string>('');
  const {
    mutate: createStream,
    data: createdStream,
    status,
  } = useCreateStream(
    streamName
      ? {
          name: streamName,
          playbackPolicy: { type: 'jwt' },
        }
      : null
  );

  // Getting created stream information
  const { data: stream } = useStream({
    streamId: createdStream?.id,
    refetchInterval: (stream) => (!stream?.isActive ? 5000 : false),
  });

  // Function to create JWT and get the token
  const { mutate: createJwt, data: createdJwt } = useMutation({
    mutationFn: async () => {
      if (!stream?.playbackId) {
        throw new Error('No playback Id');
      }

      // Create stream information for JWT payload
      const body: CreateSignedPlaybackBody = {
        playbackId: stream.playbackId,
        secret: walletAddress,
        walletAddress: walletAddress,
      };

      const response = await fetch('/api/createJWT', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      return response.json() as Promise<CreateSignedPlaybackResponse>;
    },
  });

  useEffect(() => {
    if (stream?.playbackId && walletAddress) {
      createJwt();
    }
  }, [stream?.playbackId, createJwt, walletAddress]);

  const isLoading = useMemo( () => status === 'loading', [ status ] );
  
  const viewStream = async () => {
    setShowInfo( false )
    setShowStream(true)
  }

   const viewStreamInfo = async () => {
     setShowInfo(true);
     setShowStream(false);
   };

  return (
    <>
      {!stream?.id ? (
        <div className='flex flex-col rounded outline outline-offset-2 outline-1 outline-aptos-green p-4 m-4 text-xl bg-slate-800'>
          <label htmlFor='input'>Stream Name</label>
          <input
            className='rounded my-3'
            type='text'
            required
            value={streamName}
            onChange={(e) => setStreamName(e.target.value)}
          />
          <button
            onClick={() => createStream?.()}
            disabled={isLoading || !createStream || Boolean(stream)}
            className='rounded outline outline-offset-2 outline-1 outline-aptos-green p-4 m-4 text-xl bg-slate-800 hover:text-aptos-green cursor-pointer'
          >
            Create Gated Stream
          </button>
        </div>
      ) : (
        <>
          <div>
            <button
              onClick={viewStream}
              className='rounded outline outline-offset-2 outline-1 outline-aptos-green p-4 m-4 text-xl bg-slate-800 hover:outline-slate-800 text-aptos-green hover:text-gray-100 cursor-pointer'
            >
              View Stream
            </button>
            <button
              onClick={(viewStreamInfo)}
              className='rounded outline outline-offset-2 outline-1 outline-aptos-green p-4 m-4 text-xl bg-slate-800 hover:outline-slate-800 text-aptos-green hover:text-gray-100 cursor-pointer'
            >
              Stream Info
            </button>
          </div>
          {/* Display Stream */}
          {showStream && walletAmount > 0 ? (
            <div className='w-1/4'>
              <Player
                title={stream?.name}
                playbackId={stream?.playbackId}
                showPipButton
                jwt={(createdJwt as CreateSignedPlaybackResponse)?.token}
              />
            </div>
          ) : null}

          {/* Display Stream Info */}
          <div className='flex-flex-col w-1/4'>
            {showInfo ? (
              <div className='rounded outline outline-offset-2 outline-2 outline-aptos-green p-4 m-4 text-xl bg-slate-800 overflow-scroll'>
                <p>
                  <span className='text-aptos-green font-bold'>Stream Name: </span>
                  {stream.name}
                </p>
                <p>
                  <span className='text-aptos-green font-bold'>Stream Id:</span> {stream.id}
                </p>
                <p>
                  <span className='text-aptos-green font-bold'>PlaybackId:</span>{' '}
                  {stream.playbackId}
                </p>
                <p>
                  <span className='text-aptos-green font-bold'>Playback Policy:</span>{' '}
                  {stream.playbackPolicy?.type}
                </p>
                <p>
                  <span className='text-aptos-green font-bold'>Ingest Url:</span>{' '}
                  {stream.rtmpIngestUrl}
                </p>
                <p>
                  <span className='text-aptos-green font-bold'>Playback Url:</span>{' '}
                  {stream.playbackUrl}
                </p>
                <p>
                  <span className='text-aptos-green font-bold'>JWT: </span>
                  {(createdJwt as CreateSignedPlaybackResponse)?.token}
                </p>
              </div>
            ) : (
              <></>
            )}
          </div>
        </>
      )}
    </>
  );
}
