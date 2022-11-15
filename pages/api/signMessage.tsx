import { NextApiRequest, NextApiResponse } from 'next';
import { AptosClient } from 'aptos';

// Set type for payload information to verify identity
export interface SignMesagePayload {
  address?: boolean;
  application?: boolean;
  chainId?: boolean;
  message?: string;
  nonce?: string;
}

// Set up response for signing verifying payload
export interface SignMessageResponse {
  address?: string;
  application?: string;
  chainId?: number;
  fullMessage: string;
  message: string;
  nonce?: string;
  prefix: string;
  signature: string | string[];
  bitmap?: Uint8Array;
}

// Set variable for access control signing keys
const accessControlPrivateKey = process.env.PRIVATE_KEY;
const accessControlPublicKey = process.env.PUBLIC_KEY;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const method = req.method;
    const client = new AptosClient('https://fullnode.devnet.aptoslabs.com');
    const chainId = client.getChainId();

    if (method === 'POST') {
      if (!accessControlPrivateKey || !accessControlPublicKey) {
        return res.status(500).json({ message: 'No private/public key configured.' });
      }

      const { address, application, message, nonce }: SignMesagePayload = req.body;

      const signResponse = {
        address: address,
        application: application,
        chainId: chainId,
        fullMessage: '',
        message: message,
        nonce: nonce,
        prefix: 'Aptos',
        signature: '',
      };
      return res.status(200).json(signResponse);
    }
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${method} Not Allowed`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: (error as Error)?.message ?? 'Error' });
  }
};
export default handler;
