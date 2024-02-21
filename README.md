# Reapers Bridge

One-way bridge for NFTs (ERC721) from SmartBCH (EVM) to CashTokens

## Outline

To bridge the NFTs the user first sends them to a burn address.
Then, the user provides a cashtokens payout address with a proof of burn to the server.
The server the re-mint the NFT as CashToken to the provided address

## Details

A subscription monitors all NFT burns of the reapers contract, and writes them to a postgres database.
A simple API server exposes the burn & bridging info through several endpoints.
when a user provides a cashtokens payout address with a proof of burn to the server, the server validates the proof, re-issues the NFT to the provided address and mark the NFTs as bridged in the database.
The matching front-end code can be found in the repo for the reapers website.

## Advantages

### batch briding

Many NFTs can be batch burned together using the Mantra bundle transfer, the NFTs will also be re-issued together to the payout address in one transaction.

### auditable

Because of the public API endpoints anyone can see all the burning and bridging that has taken place. For each bridged NFT there is a `signatureProof` which is the signature from the origin address signing the cashtokens receiving address. This proves the bridging destination is the one provided by the user.

### reflective supply

By re-issuing the NFTs as they are burned, there never exists more than the maximum supply of NFTs in circulation. Fetching the supply on CashTokens will get you the amount of NFTs that have been bridged.

## API Endpoints

- /
- /all
- /recent
- /signbridging
- /address/:originAddress

The home endpoint simply provides the number of `nftsBridged`, the `all` endpoint provides data of all burned & bridged NFTs, /recent only of the latest 20 items.
/signbridging is the POST endpoint for users to provide their cashtokens payout address together with proof authorizing the bridging to that address.
Lastly, /address/:originAddress provides all the minting and burning info with a specific `originAddress`

## Installation

```bash
git git@github.com:mr-zwets/reapers-bridge.git
npm install
```

## Usage

example .env

```bash
SEEDPHRASE=""
DERIVATIONPATH="m/44'/145'/0'/0/0"
NETWORK=""
TOKENID=""
CONTRACTADDR=""
SERVER_URL=""

PGHOST=''
PGUSER=
PGDATABASE=
PGPASSWORD=
PGPORT=5432
```