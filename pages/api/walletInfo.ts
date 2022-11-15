
import { CoinClient, AptosClient, AptosAccount, AptosAccountObject, HexString } from 'aptos';
import { NextApiRequest, NextApiResponse } from 'next';


export type WalletInfo = {
  address: string | HexString;
  walletBalance: number;
}

const handler = async (req: NextApiRequest, res:NextApiResponse) => {
  const client = new AptosClient( 'https://fullnode.devnet.aptoslabs.com' );
  const aptosAccount = new AptosAccount()
  const coinClient = new CoinClient(client)

  try {
    const method = req.method;
    if ( method === 'GET' ) {
      const account = aptosAccount.address();
      const address = new AptosAccount(undefined, account)
      const balance: bigint = await coinClient.checkBalance(address as AptosAccount)
      const accountInfo = ({
        address,
        walletBalance: Number(balance) / 10**8
    } )
       return res.status(200).json(accountInfo)
      }
      res.setHeader('Allow', ['GET']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: (error as Error)?.message ?? 'Error' });
    
  }
  
  
}

export default handler;