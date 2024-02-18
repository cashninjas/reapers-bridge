import { TestNetWallet, Wallet, TokenMintRequest } from "mainnet-js";
import { bigIntToVmNumber, binToHex, hexToBin } from '@bitauth/libauth';
import { JsonRpcProvider, formatEther, ethers } from "ethers";
import abi from "./abi.json" assert { type: 'json' }
import 'dotenv/config'

const tokenId = process.env.TOKENID;
const network =  process.env.NETWORK;
const derivationPathAddress = process.env.DERIVATIONPATH;
const seedphrase = process.env.SEEDPHRASE;
const contractAddress = process.env.CONTRACTADDR;

let nftsBridged = 0;

// initialize SBCH network provider
let provider = new JsonRpcProvider('https://smartbch.greyh.at');
// initilize reapers contract
const reapersContract = new ethers.Contract(contractAddress, abi, provider);

// mainnet-js generates m/44'/0'/0'/0/0 by default so have to switch it
const walletClass = network == "mainnet" ? Wallet : TestNetWallet;
const wallet = await walletClass.fromSeed(seedphrase, derivationPathAddress);
const walletAddress = wallet.getDepositAddress();
const balance = await wallet.getBalance();
console.log(`wallet address: ${walletAddress}`);
console.log(`Bch amount in walletAddress is ${balance.bch}bch or ${balance.sat}sats`);

// listen to all reaper transfers
reapersContract.on("Transfer", (from, to, amount, event) => {
  console.log(`${ from } sent ${ formatEther(amount) } to ${ to}`);
  console.log(event)
});

async function bridgeNFTs(listNftNumbers, destinationAddress){
  try{
    // create bridging transaction
    const mintRequests = [];
    listNftNumbers.forEach(nftNumber => {
      const vmNumber = bigIntToVmNumber(BigInt(nftNumber));
      const nftCommitment = binToHex(vmNumber);
      const mintNftOutput = new TokenMintRequest({
        cashaddr: destinationAddress,
        commitment: nftCommitment,
        capability: NFTCapability.none,
        value: 1000,
      })
      mintRequests.push(mintNftOutput);
    })
    const { txId } = await wallet.tokenMint( tokenId, mintRequests );
    console.log(txId)
    nftsBridged += listNftNumbers.length;
  } catch (error) {
    console.log(error)
  }
}
