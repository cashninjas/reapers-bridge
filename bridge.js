import { TestNetWallet, Wallet, TokenSendRequest } from "mainnet-js";
import { bigIntToVmNumber, binToHex } from '@bitauth/libauth';
import 'dotenv/config'

const tokenId = process.env.TOKENID;
const network =  process.env.NETWORK;
const derivationPathAddress = process.env.DERIVATIONPATH;
const seedphrase = process.env.SEEDPHRASE;

// mainnet-js generates m/44'/0'/0'/0/0 by default so have to switch it
const walletClass = network == "mainnet" ? Wallet : TestNetWallet;
const wallet = await walletClass.fromSeed(seedphrase, derivationPathAddress);
const walletAddress = wallet.getDepositAddress();
const balance = await wallet.getBalance();
console.log(`wallet address: ${walletAddress}`);
console.log(`Bch amount in walletAddress is ${balance.bch}bch or ${balance.sat}sats`);

if(false){
  if(balance.sat < 1000) throw new Error("Not enough BCH to make the transaction!");

  const destinationAddress = "";
  const nftNumber = 0;
  const vmNumber = bigIntToVmNumber(BigInt(nftNumber));
  const nftCommitment = binToHex(vmNumber);

  const { txId } = await wallet.send([
    new TokenSendRequest({
      cashaddr: destinationAddress,
      tokenId: tokenId,
      commitment: nftCommitment,
      capability: "none"
    })
  ]);
  console.log(txId)
}
