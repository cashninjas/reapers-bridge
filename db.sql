CREATE TABLE bridge(
  id SERIAL PRIMARY KEY,
  timeBurned varchar(40),
  txIdSmartBCH varchar(80),
  sbchOriginAddress varchar(80),
  nftNumber integer,
  timeBridged varchar(40),
  txIdBCH varchar(80),
  destinationAddress varchar(80)
);