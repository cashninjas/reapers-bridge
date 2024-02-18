import pg from "pg";
import * as dotenv from "dotenv";
dotenv.config();

const { Pool } = pg;
const pool = new Pool();

export async function writeInfoToDb(infoObj){
  try {
    let allKeys = "";
    let allValues = "";
    for (const key in infoObj) {
      allKeys += key + ", ";
      const nextValue =
        typeof infoObj[key] == "string" ? `'${infoObj[key]}'` : infoObj[key];
      allValues += nextValue + ", ";
    }
    allKeys = allKeys.slice(0, -2);
    allValues = allValues.slice(0, -2);
    const result = await pool.query(
      `INSERT INTO bridge (${allKeys}) VALUES(${allValues}) RETURNING *;`
    );
    return result.rows[0];
  } catch (e) {
    console.log(e);
  }
}

export async function getAllBridgeInfo(){
  try {
    const result = await pool.query(`SELECT * FROM bridge;`);
    return result.rows;
  } catch (e) {
    console.log(e);
  }
}

export async function getRecentBridgeInfo(){
  try {
    const result = await pool.query(`SELECT * FROM bridge DESC LIMIT 20;`);
    return result.rows;
  } catch (e) {
    console.log(e);
  }
}

export async function checkAmountBridgedDb() {
  try {
    const result = await pool.query(`SELECT * FROM bridge WHERE txIdBCH IS NOT NULL;`);
    return result.rows.length;
  } catch (e) {
    console.log(e);
  }
}

export async function addBridgeInfoToNFT(nftNumber, infoObj) {
  try {
    const { timeBridged, txIdBCH, destinationAddress } = infoObj;
    const result = await pool.query(
      `UPDATE bridge SET timeBridged='${timeBridged}', txIdBCH='${txIdBCH}', destinationAddress='${destinationAddress}' WHERE nftNumber='${nftNumber}' RETURNING *;`
    );
  } catch (e) {
    console.log(e);
  }
}