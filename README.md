# Reapers Bridge

One-way bridge for NFTs (ERC721) from SmartBCH (EVM) to CashTokens

## Outline

A subscription monitors all NFT burns of the reapers contract, and writes them to a postgres database.
To bridge to CashTokens, a user provides a signature matching the address used for burning the NFTs.
The CashTokens wallet held on the server will then re-mint the NFTs to the provided CashTokens address and mark the NFTs as bridged in the database.
The matching front-end code can be found in the rrpo for the reapers website.

## API Endpoints

- /
- /all
- /recent
- /signbridging
- /address/:originAddress

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