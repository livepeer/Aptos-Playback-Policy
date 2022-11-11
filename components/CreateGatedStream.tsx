import { useCreateStream, useStream, Player } from '@livepeer/react';
import { useMemo, useState, useEffect } from 'react';

import { useMutation } from '@tanstack/react-query';
import { CreateSignedPlaybackBody, CreateSignedPlaybackResponse } from '../pages/api/createJWT';


export default function CreateGatedStream() {
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
        secret: 'supersecretkey',
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
    if (stream?.playbackId) {
      createJwt();
    }
  }, [stream?.playbackId, createJwt]);

  const isLoading = useMemo(() => status === 'loading', [status]);

  return (
      <>
        {!stream?.id ? (
          <div className='overflow-hidden w-40 bg-aptos-green rounded-3xl p-2 mt-4 text-center'>
            <button
              onClick={() => createStream?.()}
              disabled={isLoading || !createStream || Boolean(stream)}
            >
              Create Gated Stream
            </button>
            <input type='text' value={streamName} onChange={(e) => setStreamName(e.target.value)} />
          </div>
        ) : (
          <Player
            title={stream?.name}
            playbackId={stream?.playbackId}
            jwt={(createdJwt as CreateSignedPlaybackResponse)?.token}
          />
        )}
      </>
  );
}
