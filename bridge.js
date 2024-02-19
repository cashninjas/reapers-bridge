import { TestNetWallet, Wallet, TokenMintRequest } from "mainnet-js";
import { bigIntToVmNumber, binToHex } from '@bitauth/libauth';
import { ethers } from "ethers";
import { writeInfoToDb, getAllBridgeInfo, getRecentBridgeInfo, checkAmountBridgedDb, addBridgeInfoToNFT } from "./database.js"
import abi from "./abi.json" assert { type: 'json' }
import express from "express";
import cors from "cors";
import 'dotenv/config'

const tokenId = process.env.TOKENID;
const network =  process.env.NETWORK;
const derivationPathAddress = process.env.DERIVATIONPATH;
const seedphrase = process.env.SEEDPHRASE;
const serverUrl = process.env.SERVER_URL;
const contractAddress = process.env.CONTRACTADDR;

let nftsBridged = 0;
const amountBridgedDb = await checkAmountBridgedDb();
if(amountBridgedDb){
  console.log(`Read amountBridgedDb on restart, setting nftsBridged to ${amountBridgedDb}`);
  nftsBridged = amountBridgedDb;
}

// set up express for endpoints
const app = express();
const port = 3000;
const url = process.env.NODE_ENV === "development"? "http://localhost:3000" : serverUrl;
app.use(cors());
app.use(express.json()); //req.body

// set up endpoints
app.get('/', (req, res) => {
  res.json({nftsBridged});
})

app.get("/all", async (req, res) => {
  const infoAllBridged = await getAllBridgeInfo();
  if (infoAllBridged) {
    res.json(infoAllBridged);
  } else {
    res.status(404).send();
  }
});

app.get("/recent", async (req, res) => {
  const infoRecentBridged = await getRecentBridgeInfo();
  if (infoRecentBridged) {
    res.json(infoRecentBridged);
  } else {
    res.status(404).send();
  }
});

// initialize SBCH network provider
let provider = new ethers.providers.JsonRpcProvider('https://smartbch.greyh.at');
// initilize reapers contract
const reapersContract = new ethers.Contract(contractAddress, abi, provider);

// mainnet-js generates m/44'/0'/0'/0/0 by default so have to switch it
const walletClass = network == "mainnet" ? Wallet : TestNetWallet;
const wallet = await walletClass.fromSeed(seedphrase, derivationPathAddress);
console.log(`wallet address: ${wallet.getDepositAddress()}`);
const balance = await wallet.getBalance();
console.log(`Bch amount in walletAddress is ${balance.bch}bch or ${balance.sat}sats`);

// listen to all reaper transfers
reapersContract.on("Transfer", (from, to, amount, event) => {
  const erc721numberHex = event.args[2]?._hex
  const nftNumber = parseInt(erc721numberHex, 16);
  console.log(`${ from } sent reaper #${nftNumber} to ${ to }`);
  console.log(event)

  const timeBurned = new Date().toISOString();
  const burnInfo = {
    timeBurned,
    txIdSmartBCH: event?.transactionHash,
    nftNumber,
    sbchOriginAddress: from
  }
  writeInfoToDb(burnInfo);
});

async function bridgeNFTs(listNftNumbers, destinationAddress){
  try{
    // create bridging transaction
    const mintRequests = [];
    listNftNumbers.forEach(nftNumber => {
      // vm numbers start counting from zero
      const vmNumber = bigIntToVmNumber(BigInt(nftNumber) - 1n);
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
    // create db entries
    const timeBridged = new Date().toISOString();

    listNftNumbers.forEach(nftNumber => {
      const bridgeInfo = {
        timeBridged,
        txIdBCH: txId,
        destinationAddress
      }
      addBridgeInfoToNFT(nftNumber, bridgeInfo);
    })
  } catch (error) {
    console.log(error)
  }
}

app.listen(port, () => {
  console.log(`Server listening at ${url}`);
});