import {signAccessJwt} from 'livepeer/crypto'
import { NextApiRequest, NextApiResponse } from 'next'


// Set type for payload information to create JWT
export type CreateSignedPlaybackBody = {
  playbackId: string;
  secret: string;
}

// Set type for revieving JWT
export type CreateSignedPlaybackResponse = {
  token: string;
}

// Set variable for access control signing keys
const accessControlPrivateKey = process.env.PRIVATE_KEY;
const accessControlPublicKey = process.env.PUBLIC_KEY;

const handler = async ( req: NextApiRequest, res: NextApiResponse ) => {
  try {
    const method = req.method;

    if ( method === 'POST' ) {
      if ( !accessControlPrivateKey || !accessControlPublicKey ) {
        return res.status( 500 ).json( { message: 'No private/public key configured.' } );
      }
      const { playbackId, secret }: CreateSignedPlaybackBody = req.body;
      if ( !playbackId || !secret ) {
        return res.status( 400 ).json( { message: 'Missing data in body.' } );
      }
      if ( secret !== req.body.walletAddress ) {
        return res.status(401).json({message: 'Incorrect secret.'})
      }
      const token = await signAccessJwt( {
        privateKey: accessControlPrivateKey,
        publicKey: accessControlPublicKey,
        issuer: 'Aptos',
        playbackId,
        expiration: '1hr',
      } )
      return res.status(200).json({token})
    }
    res.setHeader( 'Allow', [ 'POST' ] );
    return res.status( 405 ).end( `Method ${method} Not Allowed` );
  } catch (error) {
    console.error( error );
    res.status( 500 ).json( { message: ( error as Error )?.message ?? 'Error' } );
    
  }
}
export default handler;