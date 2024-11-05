export interface BurnInfo {
  timeBurned: string
  txIdSmartBCH: string
  sbchOriginAddress: string
  nftNumber: number
}

export interface BridgedInfoObj {
  timeBridged: string
  txIdBCH: string
  destinationAddress: string
  signatureProof: string
}
