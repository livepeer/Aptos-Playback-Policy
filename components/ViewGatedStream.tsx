import { Player } from '@livepeer/react';

interface CreatedStreamProps {
  playbackId: string;
  jwt: string;
  streamName: string;
}

export default function ViewGatedStream(props: CreatedStreamProps ) {

  return (
    <>
      <div>
        <Player
          title={props.streamName}
          playbackId={props.playbackId}
          showPipButton
          jwt={props.jwt}
        />
      </div>
    </>
  );
}
