import { PrismaClient } from '@prisma/client'
import { BridgedInfoObj, BurnInfo } from './interfaces/interfaces.js';

const prisma = new PrismaClient()

export async function writeBurnInfoToDb(burnInfoObj:BurnInfo){
  try {
    await prisma.bridge.create({
      data: {
        timeburned: burnInfoObj.timeBurned,
        txidsmartbch: burnInfoObj.txIdSmartBCH,
        sbchoriginaddress: burnInfoObj.sbchOriginAddress,
        nftnumber: burnInfoObj.nftNumber,
      }
    })
  } catch (e) {
    console.log(e);
  }
}

export async function getAllBridgeInfo(){
  try {
    const result = await prisma.bridge.findMany({
      orderBy: {
        id: 'desc',
      }
    })
    return result;
  } catch (e) {
    console.log(e);
  }
}

export async function getRecentBridgeInfo(){
  try {
    const result = await prisma.bridge.findMany({
      orderBy: {
        id: 'desc',
      },
      take: 20
    })
    return result;
  } catch (e) {
    console.log(e);
  }
}

export async function bridgeInfoEthAddress(ethAddress:string){
  try {
    const result = await prisma.bridge.findMany({
      where: {
        sbchoriginaddress: ethAddress
      }
    })
    return result;
  } catch (e) {
    console.log(e);
  }
}

export async function checkAmountBridgedDb() {
  try {
    const result = await prisma.bridge.findMany({
      where: {
        NOT: {
          txidbch: null
        }
      }
    })
    return result.length;
  } catch (e) {
    console.log(e);
  }
}

export async function addBridgeInfoToNFT(nftNumber:number, bridgedInfoObj:BridgedInfoObj) {
  try {
    await prisma.bridge.update({
      where: {
        nftnumber: nftNumber,
      },
      data: {
        timebridged: bridgedInfoObj.timeBridged,
        signatureproof: bridgedInfoObj.signatureProof,
        txidbch: bridgedInfoObj.txIdBCH,
        destinationaddress: bridgedInfoObj.timeBridged,
      },
    })
  } catch (e) {
    console.log(e);
  }
}