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

PGHOST=''
PGUSER=
PGDATABASE=
PGPASSWORD=
PGPORT=5432
```